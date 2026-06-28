import { NextResponse } from "next/server";
import { auth } from '@/lib/auth/auth';
import { db } from "@/lib/db";
import { generatePaperId } from "@/lib/utils/utils";
import { PaperStatus } from "@prisma/client";
import { z } from "zod";

const paperSchema = z.object({
  title: z.string().min(1).max(200),
  abstract: z.string().min(150).max(5000),
  keywords: z.string().min(3).max(200),
  categoryId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = paperSchema.parse(body);

    const paper = await db.paper.create({
      data: {
        paperId: generatePaperId(),
        title: data.title,
        abstract: data.abstract,
        keywords: data.keywords,
        categoryId: data.categoryId || null,
        authorId: session.user.id,
        status: "DRAFT",
        supplementaryUrls: "",
      },
    });

    return NextResponse.json(paper, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to create paper" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await auth();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = Number(searchParams.get("page")) || 1;
  const limit = 20;

  // Build visibility filter: non-draft papers are always visible,
  // draft papers are only visible to their author, admins, and editors
  const isAdminOrEditor = session?.user?.role === "ADMIN" || session?.user?.role === "EDITOR";
  const userId = session?.user?.id;

  let where: Record<string, unknown> = {};

  if (status) {
    // Explicit status filter (used by admin/submission pages with auth)
    where = { status: status as PaperStatus };
  } else if (isAdminOrEditor) {
    // Admin/Editor see everything
    where = {};
  } else if (userId) {
    // Logged-in user: see published papers + their own drafts/submitted
    where = {
      OR: [
        { status: { not: "DRAFT" } },
        { authorId: userId },
      ],
    };
  } else {
    // Anonymous: only published papers
    where = { status: "PUBLISHED" };
  }

  const [papers, total] = await Promise.all([
    db.paper.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { author: true, category: true },
    }),
    db.paper.count({ where }),
  ]);

  return NextResponse.json({ papers, total, page, totalPages: Math.ceil(total / limit) });
}
