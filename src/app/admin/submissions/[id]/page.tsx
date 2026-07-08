import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SubmissionStatusActions } from "./status-actions";
import { AssignReviewerSection } from "./assign-reviewer";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-500",
  SUBMITTED: "bg-blue-500",
  UNDER_REVIEW: "bg-yellow-500",
  REVISION_REQUESTED: "bg-amber-500",
  ACCEPTED: "bg-green-500",
  PUBLISHED: "bg-primary",
  REJECTED: "bg-red-500",
};

export default async function AdminSubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const { id } = await params;

  const paper = await db.paper.findUnique({
    where: { id },
    include: {
      author: true,
      category: true,
      coAuthors: { orderBy: { order: "asc" } },
      reviews: { include: { reviewer: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!paper) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {paper.category && (
              <Badge variant="secondary" className="rounded-full">
                {paper.category.name}
              </Badge>
            )}
            <Badge className={statusColors[paper.status]}>
              {paper.status.replace("_", " ")}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground">
              {paper.paperId}
            </span>
          </div>
          <h1 className="text-2xl font-semibold">{paper.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            by{" "}
            <Link
              href={`/author/${paper.authorId}`}
              className="font-medium text-foreground hover:underline"
            >
              {paper.author?.name || "Unknown"}
            </Link>
            {paper.author?.institution && <> &middot; {paper.author.institution}</>}
          </p>
          {paper.coAuthors.length > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              with {paper.coAuthors.map((ca) => ca.name).join(", ")}
            </p>
          )}
        </div>
        {paper.pdfUrl && (
          <Button variant="outline" asChild>
            <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
              View PDF
            </a>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Abstract</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80">{paper.abstract}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground block">Submitted</span>
          <span className="font-medium">
            {paper.createdAt
              ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                  new Date(paper.createdAt)
                )
              : "-"}
          </span>
        </div>
        {paper.publicationDate && (
          <div>
            <span className="text-muted-foreground block">Published</span>
            <span className="font-medium">
              {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                new Date(paper.publicationDate)
              )}
            </span>
          </div>
        )}
        {paper.volume && (
          <div>
            <span className="text-muted-foreground block">Volume</span>
            <span className="font-medium">{paper.volume}</span>
          </div>
        )}
        {paper.issue && (
          <div>
            <span className="text-muted-foreground block">Issue</span>
            <span className="font-medium">{paper.issue}</span>
          </div>
        )}
      </div>

      {paper.keywords && (
        <div>
          <h3 className="font-semibold mb-2">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {paper.keywords.split(",").map((kw: string) => (
              <Badge key={kw.trim()} variant="outline" className="rounded-full">
                {kw.trim()}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <SubmissionStatusActions
        paperId={paper.id}
        currentStatus={paper.status}
      />

      <Card>
        <CardHeader>
          <CardTitle>Reviews ({paper.reviews.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paper.reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{review.reviewer.name}</span>
                <Badge variant="secondary">
                  {review.recommendation.replace("_", " ")}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {review.comments || "No comments provided."}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                }).format(new Date(review.createdAt))}
              </p>
            </div>
          ))}
          {paper.reviews.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No reviews submitted yet.
            </p>
          )}
        </CardContent>
      </Card>

      <AssignReviewerSection paperId={paper.id} />
    </div>
  );
}
