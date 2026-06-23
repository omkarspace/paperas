import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Journal Archives",
  description: "Browse all journal issues and volumes of Paperas academic journal.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL}/journal` },
};

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const issues = await db.journalIssue.findMany({
    where: { isPublished: true },
    orderBy: [{ volume: "desc" }, { issue: "desc" }],
  });

  const papers = await db.paper.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publicationDate: "desc" },
    include: { author: true, category: true },
  });

  return (
    <div className="container py-12">
      <h1 className="font-serif font-bold text-3xl mb-8">Journal Archives</h1>

      {issues.length > 0 ? (
        <div className="mb-12">
          <h2 className="font-serif font-semibold text-xl mb-6">Issues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {issues.map((issue) => (
              <Link key={issue.id} href={`/journal/${issue.volume}/${issue.issue}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Volume {issue.volume}, Issue {issue.issue}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-mono text-sm text-muted-foreground">
                      Published: {new Date(issue.publicationDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <h2 className="font-serif font-semibold text-xl mb-6">All Publications</h2>
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
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{paper.author?.name}</span>
                    <span className="text-muted-foreground">{paper.paperId}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No publications available yet.</p>
        )}
      </div>
    </div>
  );
}
