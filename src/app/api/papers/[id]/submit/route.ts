import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { notifyPaperSubmitted } from "@/lib/services/notifications";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";

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

    const paper = await db.paper.findUnique({ where: { id } });
    if (!paper || paper.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (paper.status !== "DRAFT") {
      return NextResponse.json({ error: "Paper is not a draft" }, { status: 400 });
    }

    const updated = await db.paper.update({
      where: { id },
      data: {
        status: "SUBMITTED",
        submissionDate: new Date(),
      },
    });

    // Notify author + admins
    await notifyPaperSubmitted(id, session.user.id, paper.title).catch(() => {});

    return NextResponse.json(updated);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}