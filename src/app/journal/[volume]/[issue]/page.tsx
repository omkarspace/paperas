import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ volume: string; issue: string }>;
}) {
  const { volume, issue } = await params;

  const volumeNum = parseInt(volume);
  const issueNum = parseInt(issue);

  const journalIssue = await db.journalIssue.findUnique({
    where: { volume_issue: { volume: volumeNum, issue: issueNum } },
  });

  if (!journalIssue) {
    notFound();
  }

  const papers = await db.paper.findMany({
    where: {
      volume: volumeNum,
      issue: issueNum,
      status: "PUBLISHED",
    },
    include: { author: true, category: true },
  });

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Volume {volume}, Issue {issue}
        </h1>
        <p className="text-muted-foreground">
          Published: {new Date(journalIssue.publicationDate).toLocaleDateString()}
        </p>
      </div>

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
        <div className="text-center py-12 text-muted-foreground">
          <p>No papers published in this issue yet.</p>
        </div>
      )}
    </div>
  );
}