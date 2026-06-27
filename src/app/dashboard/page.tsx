import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recentActivity = [
  { title: "ML Approaches for Crop Prediction", status: "Under Review", date: "2026-06-15" },
  { title: "Sustainable Water Management", status: "Accepted", date: "2026-06-10" },
  { title: "Traditional Medicine Review", status: "Revision Required", date: "2026-06-05" },
  { title: "Blockchain Land Registry", status: "Published", date: "2026-05-28" },
];

const statusColors: Record<string, string> = {
  "Under Review": "bg-blue-100 text-blue-800",
  "Accepted": "bg-green-100 text-green-800",
  "Revision Required": "bg-yellow-100 text-yellow-800",
  "Published": "bg-purple-100 text-purple-800",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-primary">Dashboard</h1>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Papers" value={12} icon={FileText} variant="default" />
        <MetricCard title="Pending Review" value={3} icon={Clock} variant="secondary" />
        <MetricCard title="Published" value={7} icon={CheckCircle} variant="accent" />
        <MetricCard title="Revisions Needed" value={2} icon={AlertCircle} variant="default" />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.title} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <Badge className={statusColors[item.status] || ""} variant="secondary">
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}