import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Submission {
  id: string;
  paperId: string;
  title: string;
  status: string;
  createdAt: Date;
}

interface SubmissionListProps {
  submissions: Submission[];
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200",
  UNDER_REVIEW: "bg-amber-50 text-amber-700 border-amber-200",
  REVISION_REQUESTED: "bg-orange-50 text-orange-700 border-orange-200",
  ACCEPTED: "bg-green-50 text-green-700 border-green-200",
  PUBLISHED: "bg-purple-50 text-purple-700 border-purple-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

export function SubmissionList({ submissions }: SubmissionListProps) {
  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No submissions yet
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Link key={submission.id} href={`/papers/${submission.id}/edit`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{submission.title}</CardTitle>
                <Badge className={statusColors[submission.status]}>
                  {submission.status.replace(/_/g, " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                ID: {submission.paperId} | Submitted:{" "}
                {new Date(submission.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
