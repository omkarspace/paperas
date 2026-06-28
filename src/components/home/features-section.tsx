import { BookOpen, ClipboardCheck, Unlock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    icon: BookOpen,
    title: "Scope & Aims",
    description: "Publishing rigorous research across science, technology, medicine, and social sciences. We welcome original research, reviews, and short communications.",
  },
  {
    icon: ClipboardCheck,
    title: "Peer Review Process",
    description: "Double-blind peer review by expert academics. Editorial decisions within 4-6 weeks. Transparent and constructive feedback guaranteed.",
  },
  {
    icon: Unlock,
    title: "Open Access",
    description: "All published articles are freely accessible worldwide. No subscription fees for readers. Author-friendly publication charges.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-semibold text-primary">
            Journal Highlights
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Paperas provides a platform for high-quality academic publishing
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <Card key={item.title} className="border-t-2 border-t-secondary">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl mt-4">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
