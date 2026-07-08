import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClipboardList, Scale, Clock, Star, FileSearch, Shield, Eye, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "Reviewer Guidelines - Research Verse",
  description: "Guidelines for peer reviewers at Research Verse Journal. Learn about the review process, criteria, and best practices.",
};

const sections = [
  {
    icon: Scale,
    title: "Review Criteria",
    items: [
      "Originality and significance of the research",
      "Methodological rigor and reproducibility",
      "Clarity and quality of presentation",
      "Relevance to the journal's scope",
      "Ethical compliance and proper citations",
    ],
  },
  {
    icon: Clock,
    title: "Review Timeline",
    items: [
      "Respond to review invitations within 3–5 days",
      "Complete your review within 2–3 weeks",
      "Request an extension if more time is needed",
      "Notify the editorial office promptly if unable to review",
    ],
  },
  {
    icon: Star,
    title: "What to Evaluate",
    items: [
      "Is the research question clearly stated?",
      "Are the methods appropriate and well-described?",
      "Are the conclusions supported by the data?",
      "Are limitations acknowledged?",
      "Does the paper contribute new knowledge to the field?",
    ],
  },
  {
    icon: Shield,
    title: "Ethical Responsibilities",
    items: [
      "Maintain confidentiality of the manuscript",
      "Declare any conflicts of interest",
      "Do not use unpublished data for personal gain",
      "Notify the editor of any ethical concerns",
      "Provide constructive, unbiased feedback",
    ],
  },
];

const recommendations = [
  { label: "Accept", desc: "The paper is ready for publication with no or minor corrections." },
  { label: "Minor Revision", desc: "Small changes needed that do not require re-review of methodology." },
  { label: "Major Revision", desc: "Substantial changes needed; the revised version will be re-reviewed." },
  { label: "Reject", desc: "The paper has fundamental flaws or does not meet the journal's standards." },
];

export default async function ReviewerGuidelinesPage() {
  const session = await auth();
  const isReviewer = session?.user?.role === "REVIEWER" || session?.user?.role === "ADMIN";

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
              Reviewer Guidelines
            </h1>
            <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
              Peer review is the cornerstone of scholarly publishing. Learn how to conduct a thorough, fair, and constructive review.
            </p>
            {isReviewer && (
              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                  <Link href="/reviewer">Go to Reviewer Dashboard</Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2">
              {sections.map((section) => (
                <Card key={section.title} className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <section.icon className="h-6 w-6 text-secondary transition-transform duration-300 group-hover:scale-110" />
                      <CardTitle className="font-serif">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                          <span className="text-secondary mt-0.5">&bull;</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="font-serif text-2xl font-semibold text-primary mb-8 text-center">
              Recommendation Guide
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
              {recommendations.map((rec) => (
                <Card key={rec.label} className="text-center transition-all duration-300 hover:shadow-md">
                  <CardContent className="pt-6">
                    <Badge className="mb-3 text-xs">{rec.label}</Badge>
                    <p className="text-sm text-muted-foreground">{rec.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto max-w-3xl px-4 md:px-6">
            <h2 className="font-serif text-2xl font-semibold text-primary mb-8 text-center">
              Writing Your Review
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                  <FileSearch className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Start with a summary</h3>
                  <p className="text-sm text-muted-foreground">Briefly summarize the paper in your own words. This confirms you understood the work and helps editors see your perspective.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                  <Eye className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Be specific and constructive</h3>
                  <p className="text-sm text-muted-foreground">Reference page numbers and line numbers. Suggest improvements rather than just pointing out flaws. Explain why something is wrong.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                  <Lightbulb className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Separate major from minor issues</h3>
                  <p className="text-sm text-muted-foreground">Clearly distinguish between compulsory revisions (methodology flaws, data issues) and optional suggestions (style, presentation).</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                  <ClipboardList className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Confidential comments to editors</h3>
                  <p className="text-sm text-muted-foreground">Use the confidential section for concerns about ethical issues, plagiarism suspicion, or conflicts of interest that you prefer not to share with the author.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 text-center">
            <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
              Become a Reviewer
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              We welcome qualified researchers to join our reviewer panel. Register your interest and we will match you with submissions in your area of expertise.
            </p>
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
              <Link href="/auth/register">Register as Reviewer</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
