import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { notifyDecisionMade, notifyPaperPublished } from "@/lib/services/notifications";
import { registerDOI } from "@/lib/services/crossref";
import { indexPaper } from "@/lib/services/typesense";
import { canTransition, updatePaperStatusSchema } from "@/lib/validation/paper";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";
import { logger } from "@/lib/logger";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 20, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const parsed = updatePaperStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const paper = await db.paper.findUnique({
      where: { id },
      include: { author: { select: { name: true } }, category: { select: { name: true } } },
    });
    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    const { status: newStatus } = parsed.data;
    if (!canTransition(paper.status, newStatus)) {
      return NextResponse.json(
        { error: `Cannot transition from ${paper.status} to ${newStatus}` },
        { status: 422 }
      );
    }

    const updateData: Record<string, unknown> = { status: newStatus };
    if (newStatus === "PUBLISHED") {
      updateData.publicationDate = new Date();
    }

    const updatedPaper = await db.paper.update({ where: { id }, data: updateData });

    // Notify the author when a decision is made
    const decisionStatuses = ["ACCEPTED", "REJECTED", "REVISION_REQUESTED"] as const;
    if (decisionStatuses.includes(newStatus as typeof decisionStatuses[number])) {
      await notifyDecisionMade(
        paper.authorId,
        paper.title,
        newStatus as "ACCEPTED" | "REJECTED" | "REVISION_REQUESTED"
      ).catch(() => {});
    }

    // Notify the author when paper is published
    if (newStatus === "PUBLISHED") {
      // Register DOI with Crossref
      const doiResult = await registerDOI({
        paperId: paper.paperId,
        title: paper.title,
        authorName: paper.author.name || "Unknown Author",
        publicationDate: new Date(),
      });
      if (doiResult) {
        await db.paper.update({
          where: { id },
          data: { doi: doiResult.doi },
        });
      }
      // Index in Typesense for full-text search
      await indexPaper({
        id,
        paperId: paper.paperId,
        title: paper.title,
        abstract: paper.abstract,
        keywords: paper.keywords,
        authorName: paper.author.name || undefined,
        categoryName: paper.category?.name || undefined,
      }).catch((err) => {
        logger.error("Failed to index published paper", { error: err instanceof Error ? err.message : String(err) });
      });

      await notifyPaperPublished(id).catch(() => {});
    }

    return NextResponse.json(updatedPaper);
  } catch (_error) {
    logger.error("Failed to update submission", { error: _error instanceof Error ? _error.message : String(_error) });
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}