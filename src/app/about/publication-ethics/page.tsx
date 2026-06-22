export default function PublicationEthicsPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Publication Ethics</h1>

      <div className="prose max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Ethical Policy</h2>
          <p className="text-muted-foreground">
            Paperas is committed to maintaining the highest
            standards of publication ethics. We follow the guidelines provided
            by the Committee on Publication Ethics (COPE) and expect all
            authors, reviewers, and editors to adhere to these standards.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Plagiarism Policy</h2>
          <p className="text-muted-foreground mb-4">
            All submissions are screened for plagiarism using advanced detection
            tools. Manuscripts found to contain excessive plagiarism will be
            rejected immediately.
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>All submitted work must be original</li>
            <li>Proper attribution to all sources is required</li>
            <li>Self-plagiarism is not permitted without citation</li>
            <li>Fabrication or falsification of data is strictly prohibited</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Author Responsibilities</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Maintain accurate records of research data</li>
            <li>Obtain necessary permissions for reproduced material</li>
            <li>Disclose all conflicts of interest</li>
            <li>Respond to reviewer comments promptly</li>
            <li>Withdraw manuscript if unable to meet requirements</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Reviewer Responsibilities</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Provide objective and constructive feedback</li>
            <li>Maintain confidentiality of manuscript content</li>
            <li>Declare any potential conflicts of interest</li>
            <li>Complete reviews within specified timeframe</li>
            <li>Recommend appropriate reviewers when requested</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Appeals and Complaints</h2>
          <p className="text-muted-foreground">
            Authors who wish to appeal a decision or file a complaint may do so
            by contacting the editorial office. All appeals will be reviewed
            by the Editor-in-Chief or designated committee member.
          </p>
        </section>
      </div>
    </div>
  );
}