import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { PaperViewTracker } from "@/components/papers/paper-view-tracker";
import { DownloadButton } from "@/components/papers/download-button";

export const dynamic = "force-dynamic";

export default async function PaperDetailPage({
  params,
}: {
  params: Promise<{ paperId: string }>;
}) {
  const { paperId } = await params;

  const paper = await db.paper.findUnique({
    where: { paperId },
    include: { author: true, category: true, reviews: true },
  });

  if (!paper) {
    notFound();
  }

  if (paper.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <div className="container py-12 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {paper.category && (
            <Badge variant="secondary">{paper.category.name}</Badge>
          )}
          <span className="text-sm text-muted-foreground">{paper.paperId}</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">{paper.title}</h1>
        <p className="text-muted-foreground">
          {paper.author?.name} • {paper.author?.institution}
        </p>
        {paper.publicationDate && (
          <p className="text-sm text-muted-foreground mt-2">
            Published: {new Date(paper.publicationDate).toLocaleDateString()}
          </p>
        )}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Abstract</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed">{paper.abstract}</p>
        </CardContent>
      </Card>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Keywords</h2>
        <div className="flex flex-wrap gap-2">
          {paper.keywords.split(",").map((kw: string) => (
            <Badge key={kw.trim()} variant="outline">
              {kw.trim()}
            </Badge>
          ))}
        </div>
      </div>

      {paper.pdfUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Full Paper</CardTitle>
          </CardHeader>
          <CardContent>
            <DownloadButton pdfUrl={paper.pdfUrl} paperId={paper.paperId} />
          </CardContent>
        </Card>
      )}
      <PaperViewTracker paperId={paper.paperId} />
    </div>
  );
}