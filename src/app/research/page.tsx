import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaperCard } from "@/components/papers/paper-card";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Search } from "lucide-react";

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
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-20 animate-gradient-shift">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute top-10 right-[15%] w-28 h-28 rotate-12 border border-secondary/20 bg-secondary/5 animate-float-medium" />
          <div className="absolute bottom-10 left-[10%] w-24 h-24 rounded-full border border-secondary/15 bg-secondary/5 animate-float-slow" />
          <div className="container relative mx-auto max-w-7xl px-4 md:px-6 text-center">
            <h1 className="font-serif text-4xl font-bold text-primary-foreground">Research Archive</h1>
            <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
              Discover peer-reviewed publications across all disciplines
            </p>
          </div>
        </section>

        <section className="container py-12 max-w-5xl">
          <form className="mb-10">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="q"
                  defaultValue={q}
                  placeholder="Search by title or abstract..."
                  className="pl-10 border rounded-md transition-shadow duration-300 focus:shadow-md"
                />
              </div>
              <Button type="submit" variant="secondary" className="rounded-md transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
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
                    className="rounded-md transition-all duration-300 hover:shadow-md"
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
                        className="rounded-md transition-all duration-300 hover:shadow-md"
                      >
                        <a href={`?q=${q || ""}&page=${pageNum}`}>{pageNum}</a>
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-md transition-all duration-300 hover:shadow-md"
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
