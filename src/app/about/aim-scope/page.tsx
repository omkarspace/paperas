export default function AimScopePage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Aim & Scope</h1>

      <div className="prose max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Journal Aim</h2>
          <p className="text-muted-foreground">
            Paperas aims to provide a platform for the
            dissemination of original research findings across multiple
            disciplines. We are committed to fostering intellectual discourse
            and promoting evidence-based research that contributes to
            knowledge advancement and societal benefit.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Scope</h2>
          <p className="text-muted-foreground mb-4">
            We welcome submissions from various fields including but not
            limited to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Computer Science & Information Technology</li>
              <li>Engineering & Technology</li>
              <li>Medical & Health Sciences</li>
              <li>Business & Management</li>
            </ul>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Social Sciences & Humanities</li>
              <li>Natural Sciences</li>
              <li>Environmental Studies</li>
              <li>Education & Psychology</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Article Types</h2>
          <p className="text-muted-foreground mb-4">
            We accept the following types of articles:
          </p>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Research Articles</h3>
              <p className="text-sm text-muted-foreground">
                Full-length original research papers presenting new findings
                and comprehensive analysis.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Review Articles</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive reviews of existing literature and current
                knowledge in a specific field.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold">Short Communications</h3>
              <p className="text-sm text-muted-foreground">
                Brief reports on significant findings or preliminary results.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
