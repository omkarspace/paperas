import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { notifyDecisionMade, notifyPaperPublished } from "@/lib/services/notifications";
import { canTransition, updatePaperStatusSchema } from "@/lib/validation/paper";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const paper = await db.paper.findUnique({ where: { id } });
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
      await notifyPaperPublished(id).catch(() => {});
    }

    return NextResponse.json(updatedPaper);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}