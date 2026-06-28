import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";
import { z } from "zod";

const coAuthorSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().optional(),
  affiliation: z.string().max(500).optional(),
  orcidId: z.string().max(50).optional(),
});

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
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 20, 60 * 1000);
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

    const body = await request.json();
    const data = coAuthorSchema.parse(body);

    const count = await db.coAuthor.count({ where: { paperId: id } });

    const coAuthor = await db.coAuthor.create({
      data: {
        paperId: id,
        name: data.name,
        email: data.email,
        affiliation: data.affiliation,
        orcidId: data.orcidId,
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
