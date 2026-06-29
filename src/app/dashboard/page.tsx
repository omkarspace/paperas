import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { RecentPapers } from "@/components/dashboard/recent-papers";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-primary">Dashboard</h1>

      <MetricsGrid userId={session.user.id} />

      <RecentPapers />
    </div>
  );
}