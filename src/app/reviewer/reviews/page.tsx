import { auth } from '@/lib/auth/auth';
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ReviewsListPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const reviews = await db.review.findMany({
    where: { reviewerId: session.user.id },
    include: { paper: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Assigned Reviews</h2>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{review.paper.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {review.paper.paperId} • Assigned:{" "}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={review.recommendation ? "default" : "secondary"}>
                  {review.recommendation || "Pending Review"}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {review.paper.abstract}
                </p>
                <Link href={`/reviewer/${review.id}`}>
                  <Button>
                    {review.recommendation ? "View Review" : "Submit Review"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No reviews assigned to you.</p>
        </div>
      )}
    </div>
  );
}
