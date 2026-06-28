import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function PublicationsSection() {
  const papers = await db.paper.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publicationDate: "desc" },
    take: 6,
    include: { author: true, category: true },
  });

  if (papers.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-semibold text-primary">
              Latest Publications
            </h2>
            <Button variant="outline" asChild>
              <Link href="/research">View All</Link>
            </Button>
          </div>
          <p className="text-center text-muted-foreground py-12">
            No publications yet. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl font-semibold text-primary">
            Latest Publications
          </h2>
          <Button variant="outline" asChild>
            <Link href="/research">View All</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {papers.map((paper) => (
            <Card key={paper.id} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {paper.category && (
                    <Badge variant="outline" className="text-xs border-secondary text-secondary">
                      {paper.category.name}
                    </Badge>
                  )}
                </div>
                <CardTitle className="font-serif text-lg leading-snug group-hover:text-secondary transition-colors">
                  <Link href={`/research/${paper.paperId}`}>{paper.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{paper.author?.name}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{paper.abstract}</p>
                <p className="mt-4 font-mono text-xs text-muted-foreground">
                  DOI: {paper.doi || paper.paperId}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
