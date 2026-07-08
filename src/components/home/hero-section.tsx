"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const placeholders = [
  "Search papers, authors, DOIs...",
  "Try: machine learning in healthcare",
  "Try: renewable energy India",
  "Try: CRISPR gene editing",
];

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-20 md:py-32 animate-gradient-shift">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-[15%] w-32 h-32 rounded-full border border-secondary/20 bg-secondary/5 animate-float-slow" />
      <div className="absolute top-40 right-[10%] w-24 h-24 rotate-45 border border-secondary/15 bg-secondary/5 animate-float-medium" />
      <div className="absolute bottom-32 left-[25%] w-20 h-20 rounded-full bg-secondary/10 blur-sm animate-float-fast" />
      <div className="absolute bottom-20 right-[20%] w-16 h-16 rotate-12 border border-primary-foreground/10 bg-primary-foreground/5 animate-float-slow" style={{ animationDelay: "3s" }} />

      {/* Ambient glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float-medium" />

      <div className="container relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl animate-fade-in-up">
            Advancing Research{" "}
            <span className="text-secondary">in India</span>
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/80 md:text-xl animate-fade-in-up-delay-1">
            A peer-reviewed journal committed to open access, rigorous review, and scholarly excellence.
          </p>

          {/* Glass morphism search bar */}
          <form onSubmit={handleSearch} className="mt-10 flex w-full max-w-md mx-auto animate-fade-in-up-delay-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={placeholders[placeholderIndex]}
                className="h-12 pl-10 pr-4 rounded-r-none bg-white/95 backdrop-blur-sm text-foreground border-white/20 shadow-lg transition-all duration-300 focus:bg-white focus:shadow-xl"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 px-8 rounded-l-none bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              Search
            </Button>
          </form>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up-delay-3">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              asChild
            >
              <Link href="/auth/register">Submit Your Paper</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300 hover:-translate-y-0.5"
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
