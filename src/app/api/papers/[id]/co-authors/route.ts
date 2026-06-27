import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const coAuthors = await db.coAuthor.findMany({
    where: { paperId: id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ coAuthors });
}

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

    const body = await request.json();
    const { name, email, affiliation, orcidId } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const count = await db.coAuthor.count({ where: { paperId: id } });

    const coAuthor = await db.coAuthor.create({
      data: {
        paperId: id,
        name,
        email,
        affiliation,
        orcidId,
        order: count + 1,
      },
    });

    return NextResponse.json({ coAuthor }, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to add co-author" }, { status: 500 });
  }
}

export async function DELETE(
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

    const { searchParams } = new URL(request.url);
    const coAuthorId = searchParams.get("coAuthorId");

    if (!coAuthorId) {
      return NextResponse.json({ error: "coAuthorId is required" }, { status: 400 });
    }

    await db.coAuthor.delete({ where: { id: coAuthorId } });

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to delete co-author" }, { status: 500 });
  }
}
