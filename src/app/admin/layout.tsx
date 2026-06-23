import { auth } from '@/lib/auth/auth';
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const navItems = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/submissions", label: "Submissions" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/issues", label: "Issues" },
    { href: "/admin/editorial-board", label: "Editorial Board" },
  ];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 rounded-md hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
}
