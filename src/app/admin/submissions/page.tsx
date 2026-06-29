import { auth } from '@/lib/auth/auth';
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaperStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const page = Math.max(1, Number(params.page) || 1);
  const status = params.status || undefined;

  const where = status ? { status: status as PaperStatus } : {};

  const [papers, total] = await Promise.all([
    db.paper.findMany({
      where,
      include: { author: true, category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * 20,
      take: 20,
    }),
    db.paper.count({ where }),
  ]);

  const totalPages = Math.ceil(total / 20);

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-500",
    SUBMITTED: "bg-blue-500",
    UNDER_REVIEW: "bg-yellow-500",
    REVISION_REQUESTED: "bg-amber-500",
    ACCEPTED: "bg-green-500",
    PUBLISHED: "bg-primary",
    REJECTED: "bg-red-500",
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">All Submissions</h2>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total} papers
        </p>
        <div className="flex gap-2">
          {page > 1 && (
            <a href={`/admin/submissions?page=${page - 1}${status ? `&status=${status}` : ""}`}>
              <Button variant="outline" size="sm">Previous</Button>
            </a>
          )}
          {page < totalPages && (
            <a href={`/admin/submissions?page=${page + 1}${status ? `&status=${status}` : ""}`}>
              <Button variant="outline" size="sm">Next</Button>
            </a>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {papers.map((paper) => (
          <Card key={paper.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">{paper.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {paper.paperId} • {paper.author?.name}
                </p>
              </div>
              <Badge className={statusColors[paper.status]}>
                {paper.status.replace("_", " ")}
              </Badge>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground line-clamp-1 max-w-xl">
                {paper.abstract}
              </p>
              <div className="flex gap-2">
                {paper.status === "SUBMITTED" && (
                  <form action={`/api/admin/submissions/${paper.id}?action=review`} method="POST">
                    <Button type="submit" size="sm">Start Review</Button>
                  </form>
                )}
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
