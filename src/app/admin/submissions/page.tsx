import { auth } from '@/lib/auth/auth';
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { PaperStatus } from "@prisma/client";

const PAGE_SIZE = 20;

const VALID_STATUSES = new Set(Object.values(PaperStatus));

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const page = Math.max(1, Number(params.page) || 1);
  const statusParam = params.status || undefined;
  const status = statusParam && VALID_STATUSES.has(statusParam as PaperStatus)
    ? (statusParam as PaperStatus)
    : undefined;
  const query = params.q?.trim() || undefined;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { abstract: { contains: query, mode: "insensitive" } },
      { keywords: { contains: query, mode: "insensitive" } },
      { paperId: { contains: query, mode: "insensitive" } },
      { author: { name: { contains: query, mode: "insensitive" } } },
    ];
  }

  const [papers, total] = await Promise.all([
    db.paper.findMany({
      where,
      include: { author: true, category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.paper.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">All Submissions</h2>

      <form className="flex gap-2 items-center">
        <input
          name="q"
          defaultValue={query || ""}
          placeholder="Search title, author, keywords..."
          className="flex h-9 w-full max-w-sm rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
        />
        <select
          name="status"
          defaultValue={status || ""}
          className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
        >
          <option value="">All statuses</option>
          {Object.values(PaperStatus).map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
        <Button type="submit" size="sm" variant="outline">Filter</Button>
        {(query || status) && (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/submissions">Clear</Link>
          </Button>
        )}
      </form>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} papers
        </p>
        <div className="flex gap-2">
          {page > 1 && (
            <a href={`/admin/submissions?page=${page - 1}${status ? `&status=${status}` : ""}${query ? `&q=${query}` : ""}`}>
              <Button variant="outline" size="sm">Previous</Button>
            </a>
          )}
          {page < totalPages && (
            <a href={`/admin/submissions?page=${page + 1}${status ? `&status=${status}` : ""}${query ? `&q=${query}` : ""}`}>
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
              <StatusBadge status={paper.status} />
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
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/submissions/${paper.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
