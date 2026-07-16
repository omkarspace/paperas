import { auth } from '@/lib/auth/auth';
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SubmissionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const papers = await db.paper.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif font-bold text-2xl">My Submissions</h2>
        <Link href="/papers/submit">
          <Button>New Submission</Button>
        </Link>
      </div>

      {papers.length > 0 ? (
        <div className="space-y-4">
          {papers.map((paper) => (
            <Card key={paper.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-serif font-medium text-lg">{paper.title}</CardTitle>
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    {paper.paperId} • {paper.category?.name || "Uncategorized"}
                  </p>
                </div>
                <StatusBadge status={paper.status} />
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground line-clamp-2 max-w-xl">
                  {paper.abstract}
                </p>
                <div className="flex gap-2">
                  {paper.status === "DRAFT" && (
                    <Link href={`/papers/${paper.id}/edit`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                  )}
                  {["SUBMITTED", "UNDER_REVIEW", "ACCEPTED"].includes(paper.status) && (
                    <Link href={`/papers/${paper.id}`}>
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FileText className="h-12 w-12" />}
          title="No submissions yet"
          description="Submit your first paper to get started with the publication process."
          action={
            <Link href="/papers/submit">
              <Button>Submit Your First Paper</Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
