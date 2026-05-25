import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/dashboard/submit">
          <Button>Submit Paper</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="block px-4 py-2 rounded-md hover:bg-muted"
          >
            Overview
          </Link>
          <Link
            href="/dashboard/submissions"
            className="block px-4 py-2 rounded-md hover:bg-muted"
          >
            My Submissions
          </Link>
          <Link
            href="/dashboard/submit"
            className="block px-4 py-2 rounded-md hover:bg-muted"
          >
            Submit Paper
          </Link>
        </nav>
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
}