"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils/utils";

const RECOMMENDATIONS = [
  { value: "ACCEPT", label: "Accept" },
  { value: "MINOR_REVISION", label: "Minor Revision" },
  { value: "MAJOR_REVISION", label: "Major Revision" },
  { value: "REJECT", label: "Reject" },
] as const;

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

interface ReviewFormProps {
  paperId: string;
  paperTitle: string;
  onSuccess?: () => void;
}

export function ReviewForm({ paperId, paperTitle, onSuccess }: ReviewFormProps) {
  const [comments, setComments] = useState("");
  const [recommendation, setRecommendation] = useState<string>("");
  const [rating, setRating] = useState(0);
  const [originalityRating, setOriginalityRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comments.trim()) {
      setError("Please provide review comments");
      return;
    }
    if (!recommendation) {
      setError("Please select a recommendation");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperId,
          comments: comments.trim(),
          recommendation,
          rating: rating || undefined,
          originalityRating: originalityRating || undefined,
          qualityRating: qualityRating || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Review</CardTitle>
        <CardDescription>Reviewing: {paperTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Recommendation *</label>
            <div className="flex flex-wrap gap-2">
              {RECOMMENDATIONS.map((rec) => (
                <button
                  key={rec.value}
                  type="button"
                  onClick={() => setRecommendation(rec.value)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                    recommendation === rec.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background hover:bg-accent"
                  )}
                >
                  {rec.label}
                </button>
              ))}
            </div>
          </div>

          <RatingField
            label="Overall Rating"
            value={rating}
            onChange={setRating}
          />
          <RatingField
            label="Originality"
            value={originalityRating}
            onChange={setOriginalityRating}
          />
          <RatingField
            label="Technical Quality"
            value={qualityRating}
            onChange={setQualityRating}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Review Comments *</label>
            <Textarea
              placeholder="Provide detailed review comments including strengths, weaknesses, and suggestions for improvement..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={8}
              required
            />
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function RatingField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label} {value > 0 && <span className="text-muted-foreground">({RATING_LABELS[value]})</span>}
      </label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={cn(
              "h-8 w-8 rounded-md border text-sm font-medium transition-colors",
              star <= value
                ? "border-primary bg-primary/10 text-primary"
                : "border-input bg-background hover:bg-accent"
            )}
          >
            {star}
          </button>
        ))}
      </div>
    </div>
  );
}
