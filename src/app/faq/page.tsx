import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export const metadata: Metadata = {
  title: "FAQ - Research Verse",
  description: "Frequently asked questions about submitting papers, peer review, open access, and publishing with Research Verse.",
};

const faqs = [
  {
    category: "Submission",
    items: [
      {
        q: "How do I submit a paper?",
        a: "Register an account, navigate to your dashboard, and click 'New Submission'. Follow the submission wizard to upload your manuscript, add metadata, and submit.",
      },
      {
        q: "What file formats are accepted?",
        a: "We accept PDF files only. Maximum file size is 50 MB. Ensure your PDF includes all figures, tables, and references.",
      },
      {
        q: "Is there a submission fee?",
        a: "Research Verse charges an Article Processing Charge (APC) only upon acceptance. There is no fee for initial submission.",
      },
      {
        q: "Can I submit a paper that has been presented at a conference?",
        a: "Yes, substantially extended versions of conference papers are welcome. The submission must include at least 50% new content and clearly cite the original conference paper.",
      },
    ],
  },
  {
    category: "Peer Review",
    items: [
      {
        q: "How long does the review process take?",
        a: "Our average time from submission to first decision is 4–6 weeks. We aim for 2–3 reviewer reports per submission.",
      },
      {
        q: "Is the review process double-blind?",
        a: "Yes. Both reviewer and author identities are anonymized. Please remove all author identifiers from your manuscript before submission.",
      },
      {
        q: "Can I suggest reviewers?",
        a: "Yes, you may suggest up to 3 qualified reviewers during submission. The editorial board makes the final decision on reviewer selection.",
      },
      {
        q: "What if I disagree with a reviewer's comment?",
        a: "You may submit a rebuttal letter addressing each comment. The editorial board will review your response and decide accordingly.",
      },
    ],
  },
  {
    category: "Open Access",
    items: [
      {
        q: "What does 'open access' mean?",
        a: "All articles published in Research Verse are freely available online immediately upon publication. Readers can download, read, and share without subscription barriers.",
      },
      {
        q: "What license do articles use?",
        a: "Articles are published under a Creative Commons Attribution 4.0 International (CC BY 4.0) license.",
      },
      {
        q: "Can I reuse figures from published articles?",
        a: "Yes, under the CC BY 4.0 license, you may reuse and adapt content with proper attribution to the original authors.",
      },
    ],
  },
  {
    category: "Post-Publication",
    items: [
      {
        q: "When will my article be indexed?",
        a: "After publication, articles are submitted to Google Scholar, CrossRef, and other indexing services typically within 2–4 weeks.",
      },
      {
        q: "Can I make corrections after publication?",
        a: "Minor corrections can be made via a corrigendum. Significant changes require a new version or retraction following COPE guidelines.",
      },
      {
        q: "How can I track views and downloads of my article?",
        a: "Log into your author dashboard to view real-time metrics on paper views, downloads, and citations.",
      },
    ],
  },
];

export default function FAQPage() {
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
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
              Find answers to common questions about submitting, reviewing, and publishing with Research Verse.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto max-w-4xl px-4 md:px-6 space-y-12">
            {faqs.map((group) => (
              <div key={group.category}>
                <h2 className="font-serif text-2xl font-semibold text-primary mb-6">
                  {group.category}
                </h2>
                <div className="space-y-4">
                  {group.items.map((item) => (
                    <details
                      key={item.q}
                      className="group border rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <summary className="flex items-center justify-between cursor-pointer p-4 font-medium text-sm hover:text-primary transition-colors">
                        {item.q}
                        <span className="shrink-0 ml-2 text-muted-foreground transition-transform duration-300 group-open:rotate-180">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </span>
                      </summary>
                      <div className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
