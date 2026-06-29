"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-6 p-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Something went wrong
            </h1>
            <p className="text-muted-foreground max-w-md">
              An unexpected error occurred. Please try again.
            </p>
            <Button onClick={reset} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
