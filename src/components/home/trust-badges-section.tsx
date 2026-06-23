const badges = [
  "Google Scholar",
  "DOAJ",
  "CrossRef",
  "ISSN",
  "UGC Care List",
]

export function TrustBadgesSection() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
          Recognized By
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {badges.map((badge) => (
            <div
              key={badge}
              className="bg-muted/50 rounded-full px-6 py-3 text-sm font-medium text-muted-foreground"
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
