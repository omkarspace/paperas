import { db } from "@/lib/db";
import { MetricCard } from "@/components/dashboard/metric-card";
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface MetricsGridProps {
  userId: string;
}

export async function MetricsGrid({ userId }: MetricsGridProps) {
  const papers = await db.paper.findMany({
    where: { authorId: userId },
    select: { status: true },
  });

  const stats = {
    total: papers.length,
    pending: papers.filter((p) => ["SUBMITTED", "UNDER_REVIEW"].includes(p.status)).length,
    published: papers.filter((p) => p.status === "PUBLISHED").length,
    revision: papers.filter((p) => p.status === "REVISION_REQUESTED").length,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard title="Total Papers" value={stats.total} icon={FileText} variant="default" />
      <MetricCard title="Pending Review" value={stats.pending} icon={Clock} variant="secondary" />
      <MetricCard title="Published" value={stats.published} icon={CheckCircle} variant="accent" />
      <MetricCard title="Revisions Needed" value={stats.revision} icon={AlertCircle} variant="default" />
    </div>
  );
}