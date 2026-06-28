import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { PaperStatus } from "@prisma/client";
import { notifyDecisionMade } from "@/lib/services/notifications";

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
    const { status } = await request.json();

    const validStatuses: PaperStatus[] = [
      "UNDER_REVIEW",
      "REVISION_REQUESTED",
      "ACCEPTED",
      "REJECTED",
      "PUBLISHED",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const paper = await db.paper.update({
      where: { id },
      data: {
        status,
        ...(status === "PUBLISHED" && { publicationDate: new Date() }),
      },
    });

    // Notify the author when a decision is made
    const decisionStatuses = ["ACCEPTED", "REJECTED", "REVISION_REQUESTED"] as const;
    if (decisionStatuses.includes(status as typeof decisionStatuses[number])) {
      const fullPaper = await db.paper.findUnique({
        where: { id },
        select: { title: true, authorId: true },
      });
      if (fullPaper) {
        await notifyDecisionMade(
          fullPaper.authorId,
          fullPaper.title,
          status as "ACCEPTED" | "REJECTED" | "REVISION_REQUESTED"
        ).catch(() => {});
      }
    }

    return NextResponse.json(paper);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}