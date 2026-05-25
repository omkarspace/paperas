import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function VolumePage({
  params,
}: {
  params: Promise<{ volume: string }>;
}) {
  const { volume } = await params;
  const volumeNum = parseInt(volume);

  const issues = await db.journalIssue.findMany({
    where: { volume: volumeNum, isPublished: true },
    orderBy: { issue: "desc" },
  });

  if (issues.length === 0) {
    notFound();
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Volume {volumeNum}</h1>
        <p className="text-muted-foreground">
          Browse all issues in Volume {volumeNum}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues.map((issue) => (
          <Card key={issue.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Issue {issue.issue}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Published: {new Date(issue.publicationDate).toLocaleDateString()}
              </p>
              <Link href={`/journal/${volumeNum}/${issue.issue}`}>
                <Button variant="outline" size="sm">
                  View Issue
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
