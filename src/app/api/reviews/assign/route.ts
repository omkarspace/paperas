import { NextResponse } from "next/server";
import { auth } from '@/lib/auth/auth';
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { paperId, reviewerId } = await request.json();

    if (!paperId || !reviewerId) {
      return NextResponse.json({ error: "Paper ID and Reviewer ID required" }, { status: 400 });
    }

    const reviewer = await db.user.findFirst({
      where: { id: reviewerId, role: { in: ["REVIEWER", "EDITOR"] } },
    });

    if (!reviewer) {
      return NextResponse.json({ error: "Invalid reviewer" }, { status: 400 });
    }

    const review = await db.review.create({
      data: {
        paperId,
        reviewerId,
        comments: "",
        recommendation: "ACCEPT",
      },
    });

    await db.paper.update({
      where: { id: paperId },
      data: { status: "UNDER_REVIEW" },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Assign reviewer error:", error);
    return NextResponse.json({ error: "Failed to assign reviewer" }, { status: 500 });
  }
}
