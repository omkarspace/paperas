import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ReviewCardProps {
  review: {
    id: string;
    paper: { title: string; paperId: string };
    recommendation?: string;
    createdAt: Date;
  };
}

const recommendationColors: Record<string, string> = {
  ACCEPT: "bg-green-100 text-green-800",
  MINOR_REVISION: "bg-yellow-100 text-yellow-800",
  MAJOR_REVISION: "bg-orange-100 text-orange-800",
  REJECT: "bg-red-100 text-red-800",
};

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Link href={`/reviewer/${review.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{review.paper.title}</CardTitle>
            {review.recommendation && (
              <Badge className={recommendationColors[review.recommendation]}>
                {review.recommendation.replace(/_/g, " ")}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Paper ID: {review.paper.paperId} | Assigned:{" "}
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
