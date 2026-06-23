import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function SubmissionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const papers = await db.paper.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-500",
    SUBMITTED: "bg-blue-500",
    UNDER_REVIEW: "bg-yellow-500",
    REVISION_REQUESTED: "bg-orange-500",
    ACCEPTED: "bg-green-500",
    PUBLISHED: "bg-primary",
    REJECTED: "bg-red-500",
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif font-bold text-2xl">My Submissions</h2>
        <Link href="/dashboard/submit">
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
                <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusColors[paper.status]}`}>{paper.status.replace("_", " ")}</Badge>
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
        <div className="text-center py-12 text-muted-foreground">
          <p>No submissions yet.</p>
          <Link href="/dashboard/submit">
            <Button className="mt-4">Submit Your First Paper</Button>
          </Link>
        </div>
      )}
    </div>
  );
}