import { NextResponse } from "next/server";
import { auth } from '@/lib/auth/auth';
import { db } from "@/lib/db";
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
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = reviewSchema.parse(body);

    const review = await db.review.create({
      data: {
        paperId: data.paperId,
        reviewerId: session.user.id,
        comments: data.comments,
        recommendation: data.recommendation,
        rating: data.rating,
        originalityRating: data.originalityRating,
        qualityRating: data.qualityRating,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
