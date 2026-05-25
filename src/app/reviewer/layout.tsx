import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ReviewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !["REVIEWER", "EDITOR", "ADMIN"].includes(session.user.role)) {
    redirect("/");
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Reviewer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <nav className="space-y-2">
          <Link href="/reviewer" className="block px-4 py-2 rounded-md hover:bg-muted">
            Overview
          </Link>
          <Link href="/reviewer/reviews" className="block px-4 py-2 rounded-md hover:bg-muted">
            Assigned Reviews
          </Link>
        </nav>
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
}