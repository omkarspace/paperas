"use client";

import { useState } from "react";
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
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-20 animate-gradient-shift">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute top-10 left-[20%] w-28 h-28 rounded-full border border-secondary/20 bg-secondary/5 animate-float-slow" />
          <div className="absolute bottom-10 right-[15%] w-24 h-24 rotate-12 border border-secondary/15 bg-secondary/5 animate-float-medium" />
          <div className="absolute top-20 right-[25%] w-16 h-16 rounded-full bg-secondary/10 blur-sm animate-float-fast" />
          <div className="container relative mx-auto max-w-7xl px-4 md:px-6">
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
                  <Card key={paper.id} className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          {paper.category && (
                            <Badge variant="outline" className="text-xs">
                              {paper.category.name}
                            </Badge>
                          )}
                          <h3 className="font-serif font-semibold">
                            <Link href={`/research/${paper.paperId}`} className="group-hover:text-secondary transition-colors">
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
