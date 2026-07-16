import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 30, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (role && role !== "ALL") {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { institution: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          institution: true,
          orcid: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: { papers: true, reviews: true },
          },
        },
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    logger.error("Admin users list error", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
