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
  DRAFT: "bg-gray-100 text-gray-800",
  SUBMITTED: "bg-blue-100 text-blue-800",
  UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
  REVISION_REQUESTED: "bg-orange-100 text-orange-800",
  ACCEPTED: "bg-green-100 text-green-800",
  PUBLISHED: "bg-purple-100 text-purple-800",
  REJECTED: "bg-red-100 text-red-800",
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
