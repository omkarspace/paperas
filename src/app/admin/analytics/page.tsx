import { auth } from '@/lib/auth/auth';
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users } from "lucide-react";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const [totalPapers, totalUsers, issues, publishedPapers, totalReviews, topPapers] =
    await Promise.all([
      db.paper.count(),
      db.user.count(),
      db.journalIssue.count(),
      db.paper.count({ where: { status: "PUBLISHED" } }),
      db.review.count(),
      db.paper.findMany({
        where: { paperAnalytics: { views: { gt: 0 } } },
        orderBy: { paperAnalytics: { views: "desc" } },
        take: 5,
        select: { title: true, paperAnalytics: { select: { views: true } } },
      }),
    ]);

  const totalAuthors = await db.user.count({
    where: { role: "AUTHOR" },
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Papers</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPapers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedPapers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Issues</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issues}</div>
          </CardContent>
        </Card>
      </div>

      <AnalyticsCharts
        dailyViews={[]}
        topPapers={topPapers.map((p) => ({
          title: p.title.length > 30 ? p.title.slice(0, 30) + "..." : p.title,
          views: p.paperAnalytics?.views ?? 0,
        }))}
        editorialStats={[
          { label: "Total Papers", value: totalPapers },
          { label: "Published", value: publishedPapers },
          { label: "Authors", value: totalAuthors },
          { label: "Reviews", value: totalReviews },
        ]}
      />
    </div>
  );
}
