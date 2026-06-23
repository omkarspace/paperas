import Link from "next/link";
import { BookOpen, FileText, Search, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { PaperCard } from "@/components/papers/paper-card";
import { CTASection } from "@/components/ui/hero-dithering-card";
import { JsonLd } from "@/components/shared/json-ld";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [papers, paperCount, issueCount] = await Promise.all([
    db.paper.findMany({
      where: { status: "PUBLISHED" },
      take: 6,
      orderBy: { publicationDate: "desc" },
      include: { author: true, category: true },
    }),
    db.paper.count({ where: { status: "PUBLISHED" } }),
    db.journalIssue.count({ where: { isPublished: true } }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <CTASection />

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FileText, label: "Published Papers", value: paperCount, sub: "Research articles" },
              { icon: BookOpen, label: "Active Issues", value: issueCount, sub: "Volumes published" },
              { icon: Users, label: "Reviewers", value: "45+", sub: "Expert reviewers" },
              { icon: Search, label: "Citations", value: "2000+", sub: "Total citations" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card"
              >
                <stat.icon className="h-5 w-5 text-primary mb-3" aria-hidden="true" />
                <div className="font-serif font-bold text-3xl md:text-4xl mb-1">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif font-semibold text-xl">Latest Publications</h2>
            <Link href="/journal">
              <Button variant="ghost" size="sm" className="rounded-full gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {papers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {papers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl border border-border bg-card">
              <BookOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground" aria-hidden="true" />
              <p className="text-muted-foreground text-sm">No publications yet. Be the first to submit!</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mx-auto text-center p-8 md:p-12 rounded-2xl border border-border bg-card">
            <h2 className="font-serif font-semibold text-xl mb-3">Stay Updated</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Subscribe to receive the latest updates on new publications and journal announcements.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Paperas",
          url: process.env.NEXT_PUBLIC_APP_URL || "https://paperas.dev",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || "https://paperas.dev"}/search/advanced?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Periodical",
          name: "Paperas",
          alternateName: "Research Verse Journal And Publication House Of India",
          url: process.env.NEXT_PUBLIC_APP_URL || "https://paperas.dev",
          description: "A peer-reviewed academic journal dedicated to publishing quality research across various disciplines.",
          publisher: {
            "@type": "Organization",
            name: "Research Verse Journal And Publication House Of India",
          },
          isInStock: true,
          isOpenAccess: true,
        }}
      />
    </div>
  );
}
