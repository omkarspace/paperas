"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface ReviewerOption {
  id: string;
  name: string | null;
  email: string;
  institution: string | null;
}

interface AssignReviewerSectionProps {
  paperId: string;
}

export function AssignReviewerSection({ paperId }: AssignReviewerSectionProps) {
  const router = useRouter();
  const [reviewers, setReviewers] = useState<ReviewerOption[]>([]);
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/users?role=REVIEWER&limit=100")
      .then((res) => res.json())
      .then((data) => setReviewers(data.users || []))
      .catch(() => {});
  }, []);

  async function handleAssign() {
    if (!selectedReviewer) return;
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/reviews/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paperId, reviewerId: selectedReviewer }),
    });

    if (res.ok) {
      setMessage("Reviewer assigned successfully.");
      setSelectedReviewer("");
      router.refresh();
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to assign reviewer.");
    }

    setLoading(false);
  }

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <h3 className="font-semibold">Assign Reviewer</h3>
      <div className="flex gap-2">
        <select
          className="flex h-9 w-full max-w-sm rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          value={selectedReviewer}
          onChange={(e) => setSelectedReviewer(e.target.value)}
        >
          <option value="">Select a reviewer...</option>
          {reviewers.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name || r.email}{r.institution ? ` (${r.institution})` : ""}
            </option>
          ))}
        </select>
        <Button
          size="sm"
          onClick={handleAssign}
          disabled={!selectedReviewer || loading}
        >
          {loading ? "Assigning..." : "Assign"}
        </Button>
      </div>
      {message && (
        <p
          className={`text-sm ${
            message.includes("successfully")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
