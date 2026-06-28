import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const statusBadge: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  SUBMITTED: "bg-blue-100 text-blue-800",
  UNDER_REVIEW: "bg-amber-100 text-amber-800",
  REVISION_REQUESTED: "bg-orange-100 text-orange-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  PUBLISHED: "bg-purple-100 text-purple-800",
};

const statusLabel: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  REVISION_REQUESTED: "Revision Requested",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  PUBLISHED: "Published",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const papers = await db.paper.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: papers.length,
    pending: papers.filter((p) => ["SUBMITTED", "UNDER_REVIEW"].includes(p.status)).length,
    published: papers.filter((p) => p.status === "PUBLISHED").length,
    revision: papers.filter((p) => p.status === "REVISION_REQUESTED").length,
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-primary">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Papers" value={stats.total} icon={FileText} variant="default" />
        <MetricCard title="Pending Review" value={stats.pending} icon={Clock} variant="secondary" />
        <MetricCard title="Published" value={stats.published} icon={CheckCircle} variant="accent" />
        <MetricCard title="Revisions Needed" value={stats.revision} icon={AlertCircle} variant="default" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">My Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {papers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No submissions yet.{" "}
              <Link href="/papers/submit" className="text-primary hover:underline">
                Submit your first paper
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {papers.map((paper) => (
                <Link
                  key={paper.id}
                  href={`/research/${paper.id}`}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0 hover:bg-muted/50 -mx-2 px-2 py-1 rounded transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{paper.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {paper.paperId} &middot; {new Date(paper.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={statusBadge[paper.status] || ""} variant="secondary">
                    {statusLabel[paper.status] || paper.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
