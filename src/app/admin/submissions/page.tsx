import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const papers = await db.paper.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true, category: true },
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
      <h2 className="text-2xl font-semibold mb-6">All Submissions</h2>

      <div className="space-y-4">
        {papers.map((paper) => (
          <Card key={paper.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">{paper.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {paper.paperId} • {paper.author?.name}
                </p>
              </div>
              <Badge className={statusColors[paper.status]}>
                {paper.status.replace("_", " ")}
              </Badge>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground line-clamp-1 max-w-xl">
                {paper.abstract}
              </p>
              <div className="flex gap-2">
                {paper.status === "SUBMITTED" && (
                  <form action={`/api/admin/submissions/${paper.id}?action=review`} method="POST">
                    <Button type="submit" size="sm">Start Review</Button>
                  </form>
                )}
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}