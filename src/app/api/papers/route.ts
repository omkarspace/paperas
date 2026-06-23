import { NextResponse } from "next/server";
import { auth } from '@/lib/auth/auth';
import { db } from "@/lib/db";
import { generatePaperId } from "@/lib/utils/utils";
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
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = Number(searchParams.get("page")) || 1;
  const limit = 20;

  const where = status ? { status: status as any } : {};

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
