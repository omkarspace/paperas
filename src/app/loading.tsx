import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <BookOpen className="h-8 w-8 text-muted-foreground animate-pulse" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
