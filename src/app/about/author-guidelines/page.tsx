import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Author Guidelines",
  description: "Comprehensive guidelines for authors submitting research papers to Paperas journal.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL}/about/author-guidelines` },
};

export default function AuthorGuidelinesPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Author Guidelines</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Manuscript Preparation</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Manuscripts must be original and not under consideration elsewhere.</li>
          <li>Format: PDF or Word document (.doc/.docx)</li>
          <li>Length: 4,000–8,000 words including references</li>
          <li>Abstract: 150–250 words</li>
          <li>Keywords: 5–8 keywords</li>
          <li>Font: Times New Roman, 12pt, double-spaced</li>
          <li>Referencing: APA 7th edition style</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Submission Process</h2>
        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
          <li>Register an account on the journal platform.</li>
          <li>Log in and navigate to the dashboard.</li>
          <li>Click &quot;Submit New Paper&quot; and fill in the required details.</li>
          <li>Upload your manuscript and supplementary files.</li>
          <li>Submit for review. You will receive a confirmation email.</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Review Process</h2>
        <p className="text-muted-foreground mb-4">
          All submissions undergo a double-blind peer review process. Each manuscript
          is reviewed by at least two independent reviewers. The review process typically
          takes 4–8 weeks.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Publication Ethics</h2>
        <p className="text-muted-foreground">
          Authors must ensure their work adheres to ethical research standards,
          including proper citation, plagiarism avoidance, and disclosure of conflicts
          of interest. For detailed policies, see our Publication Ethics page.
        </p>
      </section>
    </div>
  );
}
