import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { papers: true, reviews: true } } },
  });

  const roleColors: Record<string, string> = {
    AUTHOR: "bg-blue-500",
    REVIEWER: "bg-yellow-500",
    EDITOR: "bg-purple-500",
    ADMIN: "bg-red-500",
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">User Management</h2>

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
              <div className="flex gap-2">
                <form action={`/api/admin/users/${user.id}?action=promote`} method="POST">
                  <Button type="submit" variant="outline" size="sm">Promote</Button>
                </form>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}