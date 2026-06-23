import type { Metadata } from "next";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PaperViewTracker } from "@/components/papers/paper-view-tracker";
import { DownloadButton } from "@/components/papers/download-button";
import { CitationDialog } from "@/components/papers/citation-dialog";
import { JsonLd } from "@/components/shared/json-ld";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ paperId: string }>;
}): Promise<Metadata> {
  const { paperId } = await params;
  const paper = await db.paper.findUnique({
    where: { paperId },
    include: { author: true },
  });

  if (!paper) return { title: "Paper Not Found" };

  return {
    title: paper.title,
    description: paper.abstract?.slice(0, 160),
    keywords: paper.keywords?.split(",").map((k: string) => k.trim()),
    openGraph: {
      title: paper.title,
      description: paper.abstract?.slice(0, 160),
      type: "article",
      authors: paper.author?.name ? [paper.author.name] : [],
      publishedTime: paper.publicationDate?.toISOString(),
      modifiedTime: paper.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: paper.title,
      description: paper.abstract?.slice(0, 160),
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://paperas.dev"}/research/${paper.paperId}`,
    },
  };
}

export default async function PaperDetailPage({
  params,
}: {
  params: Promise<{ paperId: string }>;
}) {
  const { paperId } = await params;

  const paper = await db.paper.findUnique({
    where: { paperId },
    include: { author: true, category: true, reviews: true, coAuthors: true },
  });

  if (!paper) {
    notFound();
  }

  if (paper.status !== "PUBLISHED") {
    notFound();
  }

  return (
    <article itemScope itemType="https://schema.org/ScholarlyArticle" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {paper.category && (
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border">
              {paper.category.name}
            </span>
          )}
          <span className="font-mono text-xs text-muted-foreground">
            {paper.paperId}
          </span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl mb-4">
          {paper.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {paper.author?.name && (
            <span className="font-medium text-foreground">
              {paper.author.name}
            </span>
          )}
          {paper.author?.name && paper.author?.institution && (
            <span className="text-muted-foreground"> &middot; </span>
          )}
          {paper.author?.institution && (
            <span>{paper.author.institution}</span>
          )}
        </p>
        {paper.coAuthors.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            with{" "}
            {paper.coAuthors
              .sort((a, b) => a.order - b.order)
              .map((ca) => ca.name)
              .join(", ")}
          </p>
        )}
      </div>

      <div className="border-l-2 border-muted pl-6 my-8">
        <h2 className="font-serif text-lg font-semibold mb-3">Abstract</h2>
        <p className="text-lg leading-relaxed text-foreground/80">
          {paper.abstract}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="font-serif text-lg font-semibold mb-3">Keywords</h2>
        <div className="flex flex-wrap gap-2">
          {paper.keywords.split(",").map((kw: string) => (
            <span
              key={kw.trim()}
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border"
            >
              {kw.trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-sm">
        {paper.publicationDate && (
          <div>
            <span className="text-muted-foreground block">Published</span>
            <span className="font-medium text-foreground">
              {new Date(paper.publicationDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}
        {paper.volume && (
          <div>
            <span className="text-muted-foreground block">Volume</span>
            <span className="font-medium text-foreground">{paper.volume}</span>
          </div>
        )}
        {paper.issue && (
          <div>
            <span className="text-muted-foreground block">Issue</span>
            <span className="font-medium text-foreground">{paper.issue}</span>
          </div>
        )}
        {paper.doi && (
          <div>
            <span className="text-muted-foreground block">DOI</span>
            <span className="font-mono text-xs text-muted-foreground">
              {paper.doi}
            </span>
          </div>
        )}
      </div>

      {paper.pdfUrl && (
        <div className="border border-border rounded-md p-6 mb-8">
          <h2 className="font-serif text-lg font-semibold mb-4">
            Full Paper
          </h2>
          <div className="flex flex-wrap gap-3">
            <DownloadButton pdfUrl={paper.pdfUrl} paperId={paper.paperId} />
            <CitationDialog
              paper={{
                title: paper.title,
                authors: [
                  { name: paper.author?.name || "Unknown" },
                  ...paper.coAuthors
                    .sort((a, b) => a.order - b.order)
                    .map((ca) => ({ name: ca.name })),
                ],
                doi: paper.doi,
                publicationDate: paper.publicationDate?.toISOString() || null,
                volume: paper.volume,
                issue: paper.issue,
              }}
            />
          </div>
        </div>
      )}
      <PaperViewTracker paperId={paper.paperId} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ScholarlyArticle",
          headline: paper.title,
          abstract: paper.abstract,
          keywords: paper.keywords?.split(",").map((k: string) => k.trim()).join(", "),
          author: paper.author ? [{ "@type": "Person", name: paper.author.name }] : [],
          datePublished: paper.publicationDate?.toISOString(),
          dateModified: paper.updatedAt?.toISOString(),
          publisher: {
            "@type": "Organization",
            name: "Research Verse Journal And Publication House Of India",
          },
          isPartOf: {
            "@type": "Periodical",
            name: "Paperas",
          },
          url: `${process.env.NEXT_PUBLIC_APP_URL || "https://paperas.dev"}/research/${paper.paperId}`,
          identifier: paper.doi || paper.paperId,
          inLanguage: "en",
          license: "https://creativecommons.org/licenses/by/4.0/",
        }}
      />
    </article>
  );
}