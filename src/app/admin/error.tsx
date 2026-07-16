"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-6xl font-bold text-destructive">!</h1>
      <h2 className="mt-4 text-2xl font-semibold">Something went wrong</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        {error.message || "An unexpected error occurred in the admin panel."}
      </p>
      <div className="mt-6 flex gap-3">
        <Button variant="outline" onClick={reset}>
          Try Again
        </Button>
        <Button asChild>
          <Link href="/admin">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
