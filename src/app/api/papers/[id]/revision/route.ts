import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";
import { z } from "zod";

const revisionSchema = z.object({
  pdfUrl: z.string().url().optional(),
  comments: z.string().max(5000).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 5, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const data = revisionSchema.parse(body);

    const paper = await db.paper.findUnique({ where: { id } });
    if (!paper || paper.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (paper.status !== "REVISION_REQUESTED") {
      return NextResponse.json(
        { error: "Paper is not in revision-requested status" },
        { status: 400 }
      );
    }

    // Create a revision record to track history
    await db.revision.create({
      data: {
        paperId: id,
        revisionNumber: (paper.revisionCount || 0) + 1,
        authorComments: data.comments || null,
        pdfUrl: data.pdfUrl || paper.pdfUrl || null,
      },
    }).catch(() => {
      // Revision model may not exist yet - continue without it
    });

    const updated = await db.paper.update({
      where: { id },
      data: {
        status: "SUBMITTED",
        submissionDate: new Date(),
        revisionCount: (paper.revisionCount || 0) + 1,
      },
    });

    return NextResponse.json(updated);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to submit revision" }, { status: 500 });
  }
}
