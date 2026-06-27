"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditPaperPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [paper, setPaper] = useState<Record<string, unknown> | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    keywords: "",
  });

  useEffect(() => {
    fetch(`/api/papers/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPaper(data);
        setFormData({
          title: data.title || "",
          abstract: data.abstract || "",
          keywords: data.keywords?.join(", ") || "",
        });
      });
  }, [params.id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const keywords = formData.keywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/papers/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          keywords,
        }),
      });

      if (!res.ok) throw new Error("Failed to update paper");

      router.push("/dashboard/submissions");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitForReview() {
    setLoading(true);
    try {
      const res = await fetch(`/api/papers/${params.id}/submit`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to submit");
      router.push("/dashboard/submissions");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (!paper) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Paper</h1>

      <Card>
        <CardHeader>
          <CardTitle>Paper Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="abstract">Abstract</Label>
              <Textarea
                id="abstract"
                value={formData.abstract}
                onChange={(e) =>
                  setFormData({ ...formData, abstract: e.target.value })
                }
                className="min-h-[200px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma separated)</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) =>
                  setFormData({ ...formData, keywords: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                Save Draft
              </Button>
              {paper.status === "DRAFT" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSubmitForReview}
                  disabled={loading}
                >
                  Submit for Review
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}