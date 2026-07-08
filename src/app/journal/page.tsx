import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Journal Archives",
  description: "Browse all journal issues and volumes of Paperas academic journal.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL}/journal` },
};

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const issues = await db.journalIssue.findMany({
    where: { isPublished: true },
    orderBy: [{ volume: "desc" }, { issue: "desc" }],
  });

  const papers = await db.paper.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publicationDate: "desc" },
    include: { author: true, category: true },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-20 animate-gradient-shift">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute top-10 left-[15%] w-24 h-24 rounded-full border border-secondary/20 bg-secondary/5 animate-float-slow" />
          <div className="absolute bottom-10 right-[20%] w-20 h-20 rotate-45 border border-secondary/15 bg-secondary/5 animate-float-medium" />
          <div className="absolute top-20 right-[10%] w-16 h-16 rounded-full bg-secondary/10 blur-sm animate-float-fast" />
          <div className="container relative mx-auto max-w-7xl px-4 md:px-6 text-center">
            <h1 className="font-serif text-4xl font-bold text-primary-foreground">Journal Archives</h1>
            <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
              Browse all published issues and volumes
            </p>
          </div>
        </section>

        <section className="container py-12 max-w-7xl">
          {issues.length > 0 ? (
            <div className="mb-12">
              <h2 className="font-serif font-semibold text-xl mb-6">Issues</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {issues.map((issue) => (
                  <Link key={issue.id} href={`/journal/${issue.volume}/${issue.issue}`}>
                    <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <CardHeader>
                        <CardTitle className="group-hover:text-secondary transition-colors">Volume {issue.volume}, Issue {issue.issue}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-mono text-sm text-muted-foreground">
                          Published: {new Date(issue.publicationDate).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <h2 className="font-serif font-semibold text-xl mb-6">All Publications</h2>
            {papers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {papers.map((paper) => (
                  <Card key={paper.id} className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        {paper.category && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded transition-colors group-hover:bg-primary/15">
                            {paper.category.name}
                          </span>
                        )}
                      </div>
                      <CardTitle className="line-clamp-2 text-lg">
                        <Link href={`/research/${paper.paperId}`} className="group-hover:text-secondary transition-colors">{paper.title}</Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {paper.abstract}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{paper.author?.name}</span>
                        <span className="font-mono text-muted-foreground">{paper.paperId}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No publications available yet.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
