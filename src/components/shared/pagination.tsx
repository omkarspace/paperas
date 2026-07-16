"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams = {},
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildUrl(page: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value);
    }
    params.set("page", String(page));
    return `${baseUrl}?${params.toString()}`;
  }

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className={cn("flex items-center justify-center gap-1", className)} aria-label="Pagination">
      <Button
        variant="outline"
        size="sm"
        asChild
        className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
      >
        <Link href={buildUrl(currentPage - 1)} aria-label="Previous page">
          Previous
        </Link>
      </Button>
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link href={buildUrl(page)} aria-label={`Page ${page}`} aria-current={page === currentPage ? "page" : undefined}>
              {page}
            </Link>
          </Button>
        )
      )}
      <Button
        variant="outline"
        size="sm"
        asChild
        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
      >
        <Link href={buildUrl(currentPage + 1)} aria-label="Next page">
          Next
        </Link>
      </Button>
    </nav>
  );
}
