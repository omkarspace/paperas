import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { PaperStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (status && status !== "ALL") {
      where.status = status as PaperStatus;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { paperId: { contains: search } },
        { author: { name: { contains: search } } },
        { author: { email: { contains: search } } },
      ];
    }

    const [papers, total] = await Promise.all([
      db.paper.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { id: true, name: true, email: true, institution: true },
          },
          category: true,
          _count: { select: { reviews: true, coAuthors: true } },
        },
      }),
      db.paper.count({ where }),
    ]);

    return NextResponse.json({
      papers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin submissions list error:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}
