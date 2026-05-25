import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const papers = await db.paper.findMany({
    where: {
      status: "PUBLISHED",
      ...(q && {
        OR: [
          { title: { contains: q } },
          { abstract: { contains: q } },
        ],
      }),
    },
    orderBy: { publicationDate: "desc" },
    include: { author: true, category: true },
  });

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Research Archive</h1>

      <form className="mb-8">
        <Input
          name="q"
          defaultValue={q}
          placeholder="Search papers by title, abstract, or keywords..."
          className="max-w-md"
        />
      </form>

      {papers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper) => (
            <Card key={paper.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {paper.category && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {paper.category.name}
                    </span>
                  )}
                </div>
                <CardTitle className="line-clamp-2 text-lg">
                  <Link href={`/research/${paper.paperId}`}>{paper.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {paper.abstract}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {paper.keywords.split(",").slice(0, 3).map((kw: string) => (
                    <span
                      key={kw.trim()}
                      className="text-xs bg-muted px-2 py-1 rounded"
                    >
                      {kw.trim()}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{paper.author?.name}</span>
                  <span className="text-muted-foreground">{paper.paperId}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          {q ? `No papers found for "${q}"` : "No papers available yet."}
        </p>
      )}
    </div>
  );
}