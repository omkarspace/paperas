"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ReviewFormPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<any>(null);
  const [paper, setPaper] = useState<any>(null);

  const [formData, setFormData] = useState({
    comments: "",
    recommendation: "",
    rating: "",
    originalityRating: "",
    qualityRating: "",
  });

  useEffect(() => {
    fetch(`/api/reviews/${params.reviewId}`)
      .then((res) => res.json())
      .then((data) => {
        setReview(data);
        if (data.paper) {
          setPaper(data.paper);
        }
      });
  }, [params.reviewId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperId: paper.id,
          comments: formData.comments,
          recommendation: formData.recommendation,
          rating: formData.rating ? parseInt(formData.rating) : null,
          originalityRating: formData.originalityRating ? parseInt(formData.originalityRating) : null,
          qualityRating: formData.qualityRating ? parseInt(formData.qualityRating) : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit review");

      router.push("/reviewer/reviews");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (!paper) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Submit Review</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{paper.title}</CardTitle>
          <CardDescription>{paper.paperId}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{paper.abstract}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="comments">Comments to Author</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) =>
                  setFormData({ ...formData, comments: e.target.value })
                }
                placeholder="Provide detailed feedback to the author..."
                className="min-h-[200px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Overall Rating</Label>
                <Select
                  value={formData.rating}
                  onValueChange={(value) =>
                    setFormData({ ...formData, rating: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <SelectItem key={r} value={r.toString()}>
                        {r} - {r === 1 ? "Poor" : r === 5 ? "Excellent" : "Average"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Originality Rating</Label>
                <Select
                  value={formData.originalityRating}
                  onValueChange={(value) =>
                    setFormData({ ...formData, originalityRating: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <SelectItem key={r} value={r.toString()}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quality Rating</Label>
                <Select
                  value={formData.qualityRating}
                  onValueChange={(value) =>
                    setFormData({ ...formData, qualityRating: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <SelectItem key={r} value={r.toString()}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Recommendation</Label>
              <Select
                value={formData.recommendation}
                onValueChange={(value) =>
                  setFormData({ ...formData, recommendation: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recommendation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACCEPT">Accept</SelectItem>
                  <SelectItem value="MINOR_REVISION">Minor Revision</SelectItem>
                  <SelectItem value="MAJOR_REVISION">Major Revision</SelectItem>
                  <SelectItem value="REJECT">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}