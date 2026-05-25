import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminIssuesPage() {
  const session = await auth();
  if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) redirect("/");

  const issues = await db.journalIssue.findMany({
    orderBy: [{ volume: "desc" }, { issue: "desc" }],
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Journal Issues</h2>
        <Button>Create Issue</Button>
      </div>

      {issues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {issues.map((issue) => (
            <Card key={issue.id}>
              <CardHeader>
                <CardTitle>Volume {issue.volume}, Issue {issue.issue}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Published: {new Date(issue.publicationDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Papers in this issue
                </p>
                <Badge variant={issue.isPublished ? "default" : "secondary"}>
                  {issue.isPublished ? "Published" : "Draft"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No issues created yet.</p>
          <Button className="mt-4">Create First Issue</Button>
        </div>
      )}
    </div>
  );
}