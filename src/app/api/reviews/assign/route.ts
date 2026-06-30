import { NextResponse } from "next/server";
import { auth } from '@/lib/auth/auth';
import { db } from "@/lib/db";
import { notifyReviewerAssigned } from "@/lib/services/notifications";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";
import { z } from "zod";

const assignSchema = z.object({
  paperId: z.string().uuid(),
  reviewerId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 20, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const session = await auth();
    if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = assignSchema.parse(body);

    const reviewer = await db.user.findFirst({
      where: { id: data.reviewerId, role: { in: ["REVIEWER", "EDITOR"] } },
    });

    if (!reviewer) {
      return NextResponse.json({ error: "Invalid reviewer" }, { status: 400 });
    }

    const paper = await db.paper.findUnique({ where: { id: data.paperId } });
    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    let review;
    try {
      review = await db.review.create({
        data: {
          paperId: data.paperId,
          reviewerId: data.reviewerId,
          comments: "",
          recommendation: "ACCEPT",
        },
      });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
        return NextResponse.json(
          { error: "This reviewer is already assigned to this paper" },
          { status: 409 }
        );
      }
      throw err;
    }

    if (paper.status === "SUBMITTED") {
      await db.paper.update({
        where: { id: data.paperId },
        data: { status: "UNDER_REVIEW" },
      });
    }

    await notifyReviewerAssigned(data.reviewerId, data.paperId, paper.title).catch((err) => {
      console.error("Failed to send reviewer assignment notification:", err);
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Assign reviewer error:", error);
    return NextResponse.json({ error: "Failed to assign reviewer" }, { status: 500 });
  }
}
