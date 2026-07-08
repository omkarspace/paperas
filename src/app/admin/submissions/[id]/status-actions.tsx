"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface StatusActionsProps {
  paperId: string;
  currentStatus: string;
}

const DECISION_STATUSES = [
  { status: "ACCEPTED", label: "Accept", variant: "default" as const },
  { status: "REJECTED", label: "Reject", variant: "destructive" as const },
  { status: "REVISION_REQUESTED", label: "Request Revision", variant: "outline" as const },
];

export function SubmissionStatusActions({ paperId, currentStatus }: StatusActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function updateStatus(newStatus: string) {
    setLoading(newStatus);
    setError("");

    const res = await fetch(`/api/admin/submissions/${paperId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to update status");
      setLoading(null);
      return;
    }

    router.refresh();
  }

  const actionable =
    currentStatus === "SUBMITTED" ||
    currentStatus === "UNDER_REVIEW" ||
    currentStatus === "REVISION_REQUESTED";

  if (!actionable) return null;

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <h3 className="font-semibold">Editorial Decision</h3>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2 flex-wrap">
        {DECISION_STATUSES.map(({ status, label, variant }) => (
          <Button
            key={status}
            variant={variant}
            size="sm"
            onClick={() => updateStatus(status)}
            disabled={loading !== null}
          >
            {loading === status ? "Updating..." : label}
          </Button>
        ))}
      </div>
    </div>
  );
}
