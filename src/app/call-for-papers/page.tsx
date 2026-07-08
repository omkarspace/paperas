import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Calendar, FileText, Award, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Call for Papers - Research Verse",
  description: "Submit your research to Research Verse Journal. We welcome original research articles, review papers, and case studies across all disciplines.",
};

const tracks = [
  { icon: BookOpen, title: "Original Research", desc: "Full-length research articles with rigorous methodology and novel findings." },
  { icon: FileText, title: "Review Articles", desc: "Comprehensive reviews that synthesize recent developments in a field." },
  { icon: Award, title: "Case Studies", desc: "In-depth analyses of specific cases with broader implications." },
  { icon: Globe, title: "Short Communications", desc: "Brief reports of preliminary or significant findings (2,000–4,000 words)." },
];

const importantDates = [
  { event: "Submission Deadline", date: "October 31, 2026" },
  { event: "Review Completion", date: "December 15, 2026" },
  { event: "Final Decision", date: "January 15, 2027" },
  { event: "Publication", date: "February 2027" },
];

export default function CallForPapersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute top-10 right-[15%] w-32 h-32 rounded-full border border-secondary/20 bg-secondary/5 animate-float-slow" />
          <div className="absolute bottom-10 left-[10%] w-24 h-24 rotate-45 border border-secondary/15 bg-secondary/5 animate-float-medium" />
          <div className="container relative mx-auto max-w-7xl px-4 md:px-6 text-center">
            <h1 className="font-serif text-4xl font-bold text-primary-foreground">
              Call for Papers
            </h1>
            <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
              Research Verse invites scholars and researchers to submit their work for publication. We welcome contributions across all disciplines.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                <Link href="/auth/register">Submit Your Paper</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/about/author-guidelines">Author Guidelines</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="font-serif text-2xl font-semibold text-primary mb-8 text-center">
              Manuscript Types
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {tracks.map((track) => (
                <Card key={track.title} className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="pt-6 text-center">
                    <track.icon className="h-10 w-10 text-secondary mx-auto mb-3 transition-transform duration-300 group-hover:scale-110" />
                    <h3 className="font-semibold mb-2">{track.title}</h3>
                    <p className="text-sm text-muted-foreground">{track.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="font-serif text-2xl font-semibold text-primary mb-8 text-center">
              Important Dates
            </h2>
            <div className="max-w-lg mx-auto space-y-4">
              {importantDates.map((d) => (
                <div key={d.event} className="flex items-center gap-4">
                  <Calendar className="h-5 w-5 text-secondary shrink-0" />
                  <div className="flex-1">
                    <span className="font-medium text-sm">{d.event}</span>
                  </div>
                  <span className="text-sm text-muted-foreground font-mono">{d.date}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="font-serif text-2xl font-semibold text-primary mb-8 text-center">
              Submission Guidelines
            </h2>
            <div className="max-w-3xl mx-auto space-y-4 text-sm text-muted-foreground">
              <p>All submissions must follow our <Link href="/about/author-guidelines" className="text-primary hover:underline">author guidelines</Link>. Key requirements:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Manuscripts should be between 4,000 and 10,000 words (excluding references)</li>
                <li>Include a structured abstract of 200–300 words</li>
                <li>Provide 5–8 keywords</li>
                <li>All figures and tables must be included in the manuscript file</li>
                <li>References should follow APA 7th edition style</li>
                <li>Include a cover letter highlighting the significance of your work</li>
              </ul>
              <p className="mt-6">
                For queries, contact us at <span className="font-medium text-foreground">editor@paperas.in</span>.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 text-center">
            <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
              Ready to Submit?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join hundreds of researchers who have chosen Research Verse for their scholarly publishing needs.
            </p>
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
              <Link href="/auth/register">Create Your Account</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
