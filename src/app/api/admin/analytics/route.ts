import { NextResponse } from "next/server";
import { auth } from '@/lib/auth/auth';
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 20, 60 * 1000);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [papers, users, issues, analytics] = await Promise.all([
      db.paper.count(),
      db.user.count(),
      db.journalIssue.count(),
      db.paperAnalytics.aggregate({
        _sum: { views: true, downloads: true },
      }),
    ]);

    const papersByStatus = await db.paper.groupBy({
      by: ["status"],
      _count: true,
    });

    return NextResponse.json({
      papers,
      users,
      issues,
      totalViews: analytics._sum.views || 0,
      totalDownloads: analytics._sum.downloads || 0,
      papersByStatus,
    });
  } catch (error) {
    logger.error("Failed to fetch admin analytics", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
