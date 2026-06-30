import { db } from "@/lib/db";
import { MetricCard } from "@/components/dashboard/metric-card";
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface MetricsGridProps {
  userId: string;
}

export async function MetricsGrid({ userId }: MetricsGridProps) {
  const authorFilter = { authorId: userId };

  const [total, pending, published, revision] = await Promise.all([
    db.paper.count({ where: authorFilter }),
    db.paper.count({ where: { ...authorFilter, status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
    db.paper.count({ where: { ...authorFilter, status: "PUBLISHED" } }),
    db.paper.count({ where: { ...authorFilter, status: "REVISION_REQUESTED" } }),
  ]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard title="Total Papers" value={total} icon={FileText} variant="default" />
      <MetricCard title="Pending Review" value={pending} icon={Clock} variant="secondary" />
      <MetricCard title="Published" value={published} icon={CheckCircle} variant="accent" />
      <MetricCard title="Revisions Needed" value={revision} icon={AlertCircle} variant="default" />
    </div>
  );
}
