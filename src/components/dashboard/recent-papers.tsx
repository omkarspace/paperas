import { Suspense } from "react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const statusBadge: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  SUBMITTED: "bg-blue-100 text-blue-800",
  UNDER_REVIEW: "bg-amber-100 text-amber-800",
  REVISION_REQUESTED: "bg-orange-100 text-orange-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  PUBLISHED: "bg-purple-100 text-purple-800",
};

const statusLabel: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  REVISION_REQUESTED: "Revision Requested",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  PUBLISHED: "Published",
};

async function PaperList() {
  const session = await auth();
  if (!session) return null;

  const papers = await db.paper.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-lg">My Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        {papers.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No submissions yet.{" "}
            <Link href="/papers/submit" className="text-primary hover:underline">
              Submit your first paper
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {papers.map((paper) => (
              <Link
                key={paper.id}
                href={`/research/${paper.id}`}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0 hover:bg-muted/50 -mx-2 px-2 py-1 rounded transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{paper.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {paper.paperId} &middot; {new Date(paper.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={statusBadge[paper.status] || ""} variant="secondary">
                  {statusLabel[paper.status] || paper.status}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RecentPapers() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">My Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      }
    >
      <PaperList />
    </Suspense>
  );
}