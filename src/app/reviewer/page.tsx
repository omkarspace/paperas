import { auth } from '@/lib/auth/auth';
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReviewerDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const reviews = await db.review.findMany({
    where: { reviewerId: session.user.id },
    include: { paper: true },
  });

  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => !r.recommendation).length,
    completed: reviews.filter((r) => r.recommendation).length,
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review) => (
                <div
                  key={review.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">{review.paper.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {review.paper.paperId}
                    </p>
                  </div>
                  <span
                    className={`text-sm ${
                      review.recommendation ? "text-green-500" : "text-yellow-500"
                    }`}
                  >
                    {review.recommendation || "Pending"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No reviews assigned yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
