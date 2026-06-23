import { NextResponse } from "next/server";
import { auth } from '@/lib/auth/auth';
import { db } from "@/lib/db";

export async function GET(request: Request) {
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
}
