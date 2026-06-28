import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { notifyReviewSubmitted } from "@/lib/services/notifications";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";
import { z } from "zod";

const reviewSchema = z.object({
  paperId: z.string(),
  comments: z.string().min(1),
  recommendation: z.enum(["ACCEPT", "MINOR_REVISION", "MAJOR_REVISION", "REJECT"]),
  rating: z.number().min(1).max(5).optional(),
  originalityRating: z.number().min(1).max(5).optional(),
  qualityRating: z.number().min(1).max(5).optional(),
});

export async function GET(_request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviews = await db.review.findMany({
    where: { reviewerId: session.user.id },
    include: { paper: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 10, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = reviewSchema.parse(body);

    // Verify the reviewer is actually assigned to this paper
    const existingReview = await db.review.findFirst({
      where: {
        paperId: data.paperId,
        reviewerId: session.user.id,
      },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: "You are not assigned to review this paper" },
        { status: 403 }
      );
    }

    // Check for duplicate submission (review already has comments = not a placeholder)
    if (existingReview.comments && existingReview.comments.trim() !== "") {
      return NextResponse.json(
        { error: "You have already submitted a review for this paper" },
        { status: 409 }
      );
    }

    const review = await db.review.update({
      where: { id: existingReview.id },
      data: {
        comments: data.comments,
        recommendation: data.recommendation,
        rating: data.rating,
        originalityRating: data.originalityRating,
        qualityRating: data.qualityRating,
      },
    });

    // Notify admins/editors that a review was submitted
    const paper = await db.paper.findUnique({ where: { id: data.paperId }, select: { title: true } });
    const reviewer = await db.user.findUnique({ where: { id: session.user.id }, select: { name: true } });
    if (paper && reviewer) {
      await notifyReviewSubmitted(data.paperId, paper.title, reviewer.name || "Reviewer").catch(() => {});
    }

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
