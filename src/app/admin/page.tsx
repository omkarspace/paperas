import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, BookOpen, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [papers, users, issues] = await Promise.all([
    db.paper.count(),
    db.user.count(),
    db.journalIssue.count(),
  ]);

  const papersByStatus = await db.paper.groupBy({
    by: ["status"],
    _count: true,
  });

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Papers</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-serif font-bold text-3xl">{papers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-serif font-bold text-3xl">{users}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Published Issues</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-serif font-bold text-3xl">{issues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-serif font-bold text-3xl">+12%</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="font-serif font-bold text-2xl">Papers by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {papersByStatus.map((item) => (
              <div key={item.status} className="flex justify-between">
                <span className="rounded-full px-2.5 py-0.5 text-xs font-medium border text-muted-foreground">{item.status}</span>
                <span className="font-medium">{item._count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}