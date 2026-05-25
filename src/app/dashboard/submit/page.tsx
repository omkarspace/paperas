"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SubmitPaperPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    keywords: "",
    categoryId: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const keywords = formData.keywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    try {
      const res = await fetch("/api/papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          keywords,
        }),
      });

      if (!res.ok) throw new Error("Failed to create paper");

      const paper = await res.json();
      router.push(`/papers/${paper.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Submit Paper</h1>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded-full ${
              s <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Paper Details"}
            {step === 2 && "Abstract & Keywords"}
            {step === 3 && "Review & Submit"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Enter the title of your paper"}
            {step === 2 && "Provide abstract and keywords"}
            {step === 3 && "Review your submission"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter paper title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoryId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="medicine">Medicine</SelectItem>
                      <SelectItem value="social">Social Sciences</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" onClick={() => setStep(2)} className="w-full">
                  Next
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="abstract">Abstract (150-5000 characters)</Label>
                  <Textarea
                    id="abstract"
                    value={formData.abstract}
                    onChange={(e) =>
                      setFormData({ ...formData, abstract: e.target.value })
                    }
                    placeholder="Enter abstract..."
                    className="min-h-[200px]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (comma separated, 3-8)</Label>
                  <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) =>
                      setFormData({ ...formData, keywords: e.target.value })
                    }
                    placeholder="keyword1, keyword2, keyword3"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button type="button" onClick={() => setStep(3)} className="flex-1">
                    Next
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="bg-muted p-4 rounded-lg space-y-4">
                  <div>
                    <h3 className="font-medium">Title</h3>
                    <p className="text-muted-foreground">{formData.title}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Abstract</h3>
                    <p className="text-muted-foreground text-sm">{formData.abstract}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Keywords</h3>
                    <p className="text-muted-foreground">{formData.keywords}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Submitting..." : "Submit Paper"}
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}