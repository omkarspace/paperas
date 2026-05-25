"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

interface Paper {
  id: string;
  paperId: string;
  title: string;
  abstract: string;
  keywords: string;
  status: string;
  publicationDate: Date | null;
  author: { name: string | null } | null;
  category: Category | null;
}

const statuses = [
  { value: "PUBLISHED", label: "Published" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
];

export function AdvancedSearchClient({
  initialParams,
  categories,
}: {
  initialParams: { title?: string; author?: string; categoryId?: string; status?: string; page?: string };
  categories: Category[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialParams.title || "");
  const [author, setAuthor] = useState(initialParams.author || "");
  const [categoryId, setCategoryId] = useState(initialParams.categoryId || "");
  const [status, setStatus] = useState(initialParams.status || "PUBLISHED");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(Number(initialParams.page) || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setPage(1);

    const params = new URLSearchParams();
    if (title) params.set("title", title);
    if (author) params.set("author", author);
    if (categoryId) params.set("categoryId", categoryId);
    params.set("status", status);
    params.set("page", "1");

    router.replace(`/search/advanced?${params.toString()}`, { scroll: false });

    try {
      const res = await fetch(`/api/search/advanced?${params.toString()}`);
      const data = await res.json();
      setPapers(data.papers);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setPapers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  async function loadPage(newPage: number) {
    setLoading(true);
    setPage(newPage);

    const params = new URLSearchParams();
    if (title) params.set("title", title);
    if (author) params.set("author", author);
    if (categoryId) params.set("categoryId", categoryId);
    params.set("status", status);
    params.set("page", String(newPage));

    router.replace(`/search/advanced?${params.toString()}`, { scroll: false });

    try {
      const res = await fetch(`/api/search/advanced?${params.toString()}`);
      const data = await res.json();
      setPapers(data.papers);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setPapers([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4 border rounded-lg">
        <div>
          <label className="text-sm font-medium mb-1 block">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Search by title"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Author</label>
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Search by author"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 lg:col-span-4 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>

      {total > 0 && (
        <p className="text-sm text-muted-foreground mb-4">
          Found {total} result{total !== 1 ? "s" : ""}
        </p>
      )}

      {papers.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {paper.category && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {paper.category.name}
                      </span>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">
                    <Link href={`/research/${paper.paperId}`}>{paper.title}</Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {paper.abstract}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{paper.author?.name || "Unknown"}</span>
                    <span className="text-muted-foreground">{paper.paperId}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={page <= 1 || loading}
                onClick={() => loadPage(page - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages || loading}
                onClick={() => loadPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center py-12 text-muted-foreground">
          Use the form above to search papers.
        </p>
      )}
    </div>
  );
}
