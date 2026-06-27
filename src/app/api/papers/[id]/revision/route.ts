import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const paper = await db.paper.findUnique({ where: { id } });
    if (!paper || paper.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await db.paper.update({
      where: { id },
      data: {
        status: "SUBMITTED",
        submissionDate: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to submit revision" }, { status: 500 });
  }
}
