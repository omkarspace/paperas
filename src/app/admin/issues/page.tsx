"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface JournalIssue {
  id: string;
  volume: number;
  issue: number;
  publicationDate: string;
  isPublished: boolean;
}

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<JournalIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [volume, setVolume] = useState("");
  const [issue, setIssue] = useState("");
  const [publicationDate, setPublicationDate] = useState("");

  useEffect(() => {
    fetch("/api/admin/issues")
      .then((res) => res.json())
      .then((data) => setIssues(data.issues))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volume, issue, publicationDate }),
      });
      if (res.ok) {
        const data = await res.json();
        setIssues((prev) => [data.issue, ...prev]);
        setShowForm(false);
        setVolume("");
        setIssue("");
        setPublicationDate("");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Journal Issues</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Create Issue"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Issue</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="volume">Volume</Label>
                  <Input id="volume" type="number" value={volume} onChange={(e) => setVolume(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue">Issue</Label>
                  <Input id="issue" type="number" value={issue} onChange={(e) => setIssue(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pubDate">Publication Date</Label>
                <Input id="pubDate" type="date" value={publicationDate} onChange={(e) => setPublicationDate(e.target.value)} />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? "Creating..." : "Create"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-center py-12 text-muted-foreground">Loading...</p>
      ) : issues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {issues.map((i) => (
            <Card key={i.id}>
              <CardHeader>
                <CardTitle>Volume {i.volume}, Issue {i.issue}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Published: {new Date(i.publicationDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Papers in this issue
                </p>
                <Badge variant={i.isPublished ? "default" : "secondary"}>
                  {i.isPublished ? "Published" : "Draft"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No issues created yet.</p>
          <Button className="mt-4" onClick={() => setShowForm(true)}>
            Create First Issue
          </Button>
        </div>
      )}
    </div>
  );
}
