import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
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

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}