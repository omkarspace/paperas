import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const papers = await db.paper.findMany({
    where: { status: "PUBLISHED" },
    take: 6,
    orderBy: { publicationDate: "desc" },
    include: { author: true, category: true },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-muted/50 to-background">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Research Verse Journal
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A peer-reviewed academic journal dedicated to publishing quality
              research across various disciplines. advancing knowledge and
              fostering scholarly excellence.
            </p>
            <div className="flex gap-4">
              <Link href="/about/aim-scope">
                <Button size="lg">
                  Submit Paper
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/journal">
                <Button variant="outline" size="lg">
                  Browse Archives
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Published Papers</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">150+</div>
                <p className="text-xs text-muted-foreground">Research articles</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Volumes published</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Reviewers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45+</div>
                <p className="text-xs text-muted-foreground">Expert reviewers</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Citations</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2000+</div>
                <p className="text-xs text-muted-foreground">Total citations</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest Publications</h2>
            <Link href="/journal">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>

          {papers.length > 0 ? (
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
                      <Link href={`/research/${paper.paperId}`}>
                        {paper.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {paper.abstract}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {paper.author?.name}
                      </span>
                      {paper.publicationDate && (
                        <span className="text-muted-foreground">
                          {new Date(paper.publicationDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No publications yet. Be the first to submit!</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter to receive the latest updates on new
              publications and journal announcements.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}