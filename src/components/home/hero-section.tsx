"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <section className="relative overflow-hidden bg-primary py-20 md:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
            Advancing Research{" "}
            <span className="text-secondary">in India</span>
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/80 md:text-xl">
            A peer-reviewed journal committed to open access, rigorous review, and scholarly excellence.
          </p>

          <form onSubmit={handleSearch} className="mt-10 flex w-full max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search papers, authors, DOIs..."
                className="h-12 pl-10 pr-4 rounded-r-none bg-background text-foreground border-r-0"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 px-8 rounded-l-none bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Search
            </Button>
          </form>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              asChild
            >
              <Link href="/auth/register">Submit Your Paper</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/journal">Browse Journal</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
