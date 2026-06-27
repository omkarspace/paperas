import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, Users, Award } from "lucide-react";

const milestones = [
  { year: "2020", event: "Research Verse founded" },
  { year: "2021", event: "First issue published" },
  { year: "2023", event: "Indexed in Scopus" },
  { year: "2025", event: "Impact Factor achieved" },
];

const team = [
  { name: "Dr. Rajesh Kumar", role: "Editor-in-Chief", affiliation: "IIT Delhi" },
  { name: "Dr. Priya Sharma", role: "Managing Editor", affiliation: "University of Mumbai" },
  { name: "Dr. Amit Verma", role: "Section Editor", affiliation: "IISc Bangalore" },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-20">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 text-center">
            <h1 className="font-serif text-4xl font-bold text-primary-foreground">About Research Verse</h1>
            <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
              Advancing scholarly communication through rigorous peer review and open access publishing.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="font-serif text-3xl font-semibold text-primary mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Research Verse is committed to advancing research in India and beyond. We provide a platform for
                  high-quality, peer-reviewed publications across all academic disciplines. Our goal is to make
                  scholarly research accessible, transparent, and impactful.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Target className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="font-serif font-semibold">Rigorous Review</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <BookOpen className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="font-serif font-semibold">Open Access</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Users className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="font-serif font-semibold">Expert Editors</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Award className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="font-serif font-semibold">Global Indexing</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Editorial Board */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="font-serif text-3xl font-semibold text-primary mb-8 text-center">Editorial Board</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {team.map((member) => (
                <Card key={member.name}>
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">{member.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-secondary font-medium">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.affiliation}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <h2 className="font-serif text-3xl font-semibold text-primary mb-8 text-center">Milestones</h2>
            <div className="space-y-4 max-w-2xl mx-auto">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-4 items-center">
                  <div className="font-mono text-sm font-bold text-secondary w-16">{m.year}</div>
                  <div className="h-px flex-1 bg-border" />
                  <div className="text-muted-foreground">{m.event}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
