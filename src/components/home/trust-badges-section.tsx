import { Shield, Award, Globe, BookMarked } from "lucide-react";

const badges = [
  { icon: Shield, label: "ISSN", value: "RVJ-2026-XXXX" },
  { icon: Award, label: "Impact Factor", value: "2.4" },
  { icon: Globe, label: "Indexed In", value: "Scopus, DOAJ, CrossRef" },
  { icon: BookMarked, label: "H-Index", value: "18" },
];

export function TrustBadgesSection() {
  return (
    <section className="py-16 border-y border-border bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl font-semibold text-primary">
            Indexed & Recognized
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <div key={badge.label} className="flex flex-col items-center text-center p-4">
              <badge.icon className="h-8 w-8 text-secondary mb-3" />
              <p className="font-mono text-sm font-medium text-primary">{badge.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{badge.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
