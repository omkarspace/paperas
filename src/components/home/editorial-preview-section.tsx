import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const editorPicks = [
  {
    title: "Impact of Climate Change on Himalayan Glacial Ecosystems",
    authors: "Vikram Singh, Priya Joshi",
    commentary: "This groundbreaking study provides the first comprehensive assessment of glacial retreat patterns across the Western Himalayas, combining satellite imagery with ground-truth measurements over a decade.",
    doi: "10.1234/rvj.2026.0010",
  },
  {
    title: "Blockchain-Based Land Registry System for Rural India",
    authors: "Arjun Mehta, Fatima Khan",
    commentary: "An innovative application of distributed ledger technology to solve longstanding issues of land ownership disputes in Indian villages. The pilot study demonstrates 99.7% accuracy.",
    doi: "10.1234/rvj.2026.0011",
  },
];

export function EditorialPreviewSection() {
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
          {editorPicks.map((pick) => (
            <Card key={pick.doi} className="border-l-4 border-l-secondary">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-secondary/40 mb-4" />
                <p className="font-serif italic text-muted-foreground mb-4">
                  &ldquo;{pick.commentary}&rdquo;
                </p>
                <div className="border-t border-border pt-4">
                  <h3 className="font-serif font-semibold text-primary">
                    <Link href={`/research/${pick.doi}`} className="hover:text-secondary transition-colors">
                      {pick.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{pick.authors}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
