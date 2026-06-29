import { auth } from '@/lib/auth/auth';
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserRole } from "@prisma/client";

const PAGE_SIZE = 20;

const VALID_ROLES = new Set(Object.values(UserRole));

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; role?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const page = Math.max(1, Number(params.page) || 1);
  const roleParam = params.role || undefined;
  const role = roleParam && VALID_ROLES.has(roleParam as UserRole)
    ? (roleParam as UserRole)
    : undefined;

  const where = role ? { role } : {};

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { papers: true, reviews: true } } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const roleColors: Record<UserRole, string> = {
    GUEST: "bg-gray-50 text-gray-700 border-gray-200",
    AUTHOR: "bg-blue-50 text-blue-700 border-blue-200",
    REVIEWER: "bg-amber-50 text-amber-700 border-amber-200",
    EDITOR: "bg-purple-50 text-purple-700 border-purple-200",
    ADMIN: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">User Management</h2>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} users
        </p>
        <div className="flex gap-2">
          {page > 1 && (
            <a href={`/admin/users?page=${page - 1}${role ? `&role=${role}` : ""}`}>
              <Button variant="outline" size="sm">Previous</Button>
            </a>
          )}
          {page < totalPages && (
            <a href={`/admin/users?page=${page + 1}${role ? `&role=${role}` : ""}`}>
              <Button variant="outline" size="sm">Next</Button>
            </a>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">{user.name || "Unnamed User"}</CardTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Badge className={roleColors[user.role]}>{user.role}</Badge>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>{user._count.papers} papers</span>
                <span>{user._count.reviews} reviews</span>
                <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              {/* TODO: Implement role change with confirmation dialog and proper client-side action.
                  API expects PATCH /api/admin/users/[id] with JSON { role: UserRole }.
                  Currently no user detail page exists for "View". */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
