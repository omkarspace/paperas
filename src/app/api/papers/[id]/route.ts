import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";
import { z } from "zod";

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  abstract: z.string().min(150).max(5000).optional(),
  keywords: z.string().min(3).max(200).optional(),
  categoryId: z.string().uuid().optional(),
  status: z.enum(["DRAFT", "SUBMITTED"]).optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;
  
  const paper = await db.paper.findUnique({
    where: { id },
    include: { author: true, category: true, reviews: { include: { reviewer: true } } },
  });

  if (!paper) {
    return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  }

  // Hide draft papers from non-owners, non-admins, non-editors
  if (paper.status === "DRAFT") {
    const isAdminOrEditor = session?.user?.role === "ADMIN" || session?.user?.role === "EDITOR";
    const isOwner = session?.user?.id === paper.authorId;
    if (!isAdminOrEditor && !isOwner) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }
  }

  return NextResponse.json(paper);
}

export async function PATCH(
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
    const body = await request.json();
    const data = patchSchema.parse(body);

    const paper = await db.paper.findUnique({ where: { id } });
    if (!paper || paper.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await db.paper.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.abstract !== undefined && { abstract: data.abstract }),
        ...(data.keywords !== undefined && { keywords: data.keywords }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
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

    if (paper.status !== "DRAFT") {
      return NextResponse.json({ error: "Can only delete drafts" }, { status: 400 });
    }

    await db.paper.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}