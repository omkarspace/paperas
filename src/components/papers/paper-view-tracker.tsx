"use client";

import { useEffect } from "react";

export function PaperViewTracker({ paperId }: { paperId: string }) {
  useEffect(() => {
    fetch(`/api/analytics/${paperId}/view`, { method: "POST" }).catch(() => {});
  }, [paperId]);

  return null;
}
