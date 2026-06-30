import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

type PaperItem = {
  id: string;
  paperId: string;
  title: string;
  abstract: string;
  author: { name: string | null } | null;
};

interface EditorialPreviewSectionProps {
  papers: PaperItem[];
}

export function EditorialPreviewSection({ papers }: EditorialPreviewSectionProps) {
  if (papers.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl font-semibold text-primary">
            Editor&apos;s Picks
          </h2>
          <Button variant="outline" asChild>
            <Link href="/journal">View All</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {papers.map((paper) => (
            <Card key={paper.id} className="border-l-4 border-l-secondary">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-secondary/40 mb-4" />
                <p className="font-serif italic text-muted-foreground mb-4 line-clamp-4">
                  &ldquo;{paper.abstract}&rdquo;
                </p>
                <div className="border-t border-border pt-4">
                  <h3 className="font-serif font-semibold text-primary">
                    <Link href={`/research/${paper.paperId}`} className="hover:text-secondary transition-colors">
                      {paper.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{paper.author?.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
