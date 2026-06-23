import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Author Guidelines",
  description: "Step-by-step guide for preparing and submitting your research paper.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL}/author-guidelines` },
};

export default function AuthorGuidelinesPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Author Guidelines</h1>

      <div className="prose max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Submission Requirements</h2>
          <p className="text-muted-foreground mb-4">
            All submissions must meet the following requirements:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Original research not previously published</li>
            <li>Not under consideration for publication elsewhere</li>
            <li>Follows APA or MLA citation style</li>
            <li>Written in clear, grammatically correct English</li>
            <li>Includes all required sections (Abstract, Introduction, Methodology, Results, Conclusion)</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Manuscript Structure</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Title Page</h3>
              <p className="text-sm text-muted-foreground">
                Title, author names, affiliations, corresponding author details
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Abstract</h3>
              <p className="text-sm text-muted-foreground">
                150-250 words summarizing the research
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Keywords</h3>
              <p className="text-sm text-muted-foreground">
                3-8 keywords that describe the research
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Main Text</h3>
              <p className="text-sm text-muted-foreground">
                Introduction, Literature Review, Methodology, Results, Discussion, Conclusion
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">References</h3>
              <p className="text-sm text-muted-foreground">
                Complete list of all cited sources
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Formatting Guidelines</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Font: Times New Roman, 12pt</li>
            <li>Line spacing: 1.5</li>
            <li>Margins: 1 inch on all sides</li>
            <li>Page numbers: Bottom right</li>
            <li>Figures and tables: Clearly labeled</li>
            <li>PDF format for final submission</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">File Upload</h2>
          <p className="text-muted-foreground">
            Submit your manuscript as a PDF file (max 50MB). Ensure all
            figures and tables are embedded in the PDF.
          </p>
        </section>
      </div>
    </div>
  );
}
