export default function AboutPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">About Us</h1>

      <div className="prose max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">About the Journal</h2>
          <p className="text-muted-foreground">
            Paperas is an open source
            peer-reviewed academic journal dedicated to publishing quality
            research across various disciplines. Established with the mission
            to advance knowledge and foster scholarly excellence, we provide
            a platform for researchers, academics, and practitioners to share
            their findings with the global scholarly community.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-muted-foreground">
            Our mission is to promote academic excellence by providing open
            access to high-quality research. We strive to maintain the highest
            standards of peer review and scholarly publishing while supporting
            researchers at all stages of their academic careers.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">ISSN Information</h2>
          <div className="bg-muted/50 p-6 rounded-lg">
            <p className="font-medium">Journal ISSN: RVJ-2026-0001</p>
            <p className="text-sm text-muted-foreground mt-2">
              The International Standard Serial Number (ISSN) is a unique
              eight-digit number that identifies serial publications. Our ISSN
              ensures global discoverability and citation tracking for all
              published articles.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Key Facts</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Peer-reviewed academic journal</li>
            <li>Open access publication model</li>
            <li>Cross-disciplinary coverage</li>
            <li>English language publication</li>
            <li>Bi-annual publication schedule</li>
          </ul>
        </section>
      </div>
    </div>
  );
}