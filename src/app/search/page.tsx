"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { SearchBar } from "@/components/search/search-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface SearchResult {
  id: string;
  paperId: string;
  title: string;
  abstract: string;
  keywords: string;
  author: { name: string; institution: string | null } | null;
  category: { name: string } | null;
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(q: string) {
    if (!q.trim()) return;
    setQuery(q);
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.papers || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-16">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <h1 className="font-serif text-3xl font-bold text-primary-foreground text-center mb-8">
              Search Papers
            </h1>
            <div className="max-w-2xl mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Searching...</div>
            ) : searched && results.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No results found for &ldquo;{query}&rdquo;
              </div>
            ) : searched ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{results.length} result(s) found</p>
                {results.map((paper) => (
                  <Card key={paper.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          {paper.category && (
                            <Badge variant="outline" className="text-xs">
                              {paper.category.name}
                            </Badge>
                          )}
                          <h3 className="font-serif font-semibold">
                            <Link href={`/research/${paper.paperId}`} className="hover:text-secondary transition-colors">
                              {paper.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {paper.author?.name}
                            {paper.author?.institution && ` — ${paper.author.institution}`}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {paper.abstract}
                          </p>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground whitespace-nowrap ml-4">
                          {paper.paperId}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Search for papers by title, author, keywords, or abstract.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
