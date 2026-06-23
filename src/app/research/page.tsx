import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaperCard } from "@/components/papers/paper-card";

export const metadata: Metadata = {
  title: "Research Archive",
  description: "Browse peer-reviewed research papers, scholarly articles, and academic publications across various disciplines.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL}/research` },
};

export const dynamic = "force-dynamic";

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const pageSize = 12;

  const where = {
    status: "PUBLISHED" as const,
    ...(q && {
      OR: [
        { title: { contains: q } },
        { abstract: { contains: q } },
      ],
    }),
  };

  const [papers, total] = await Promise.all([
    db.paper.findMany({
      where,
      orderBy: { publicationDate: "desc" },
      include: { author: true, category: true },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    db.paper.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="container py-12 max-w-5xl">
      <h1 className="font-serif font-bold text-3xl mb-8">Research Archive</h1>

      <form className="mb-10">
        <div className="flex items-center gap-3">
          <Input
            name="q"
            defaultValue={q}
            placeholder="Search by title or abstract..."
            className="max-w-sm border rounded-md"
          />
          <Button type="submit" variant="secondary" className="rounded-md">
            Search
          </Button>
        </div>
      </form>

      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-6">
        {total} {total === 1 ? "paper" : "papers"} found
      </p>

      {papers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-md"
                disabled={page <= 1}
              >
                <a href={`?q=${q || ""}&page=${page - 1}`}>Previous</a>
              </Button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? "default" : "outline"}
                    size="sm"
                    className="rounded-md"
                  >
                    <a href={`?q=${q || ""}&page=${pageNum}`}>{pageNum}</a>
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                className="rounded-md"
                disabled={page >= totalPages}
              >
                <a href={`?q=${q || ""}&page=${page + 1}`}>Next</a>
              </Button>
            </nav>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="font-serif text-lg text-muted-foreground">
            {q ? `No papers found for "${q}"` : "No papers available yet."}
          </p>
        </div>
      )}
    </div>
  );
}
