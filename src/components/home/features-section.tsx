import { BookOpen, Shield, Globe, Zap } from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Open Access",
    description: "Every published paper is freely available to researchers, students, and the public worldwide.",
  },
  {
    icon: Shield,
    title: "Rigorous Review",
    description: "Double-blind peer review by domain experts ensures quality and integrity.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Indexed and discoverable across major academic databases and search engines.",
  },
  {
    icon: Zap,
    title: "Fast Turnaround",
    description: "Average 4-6 weeks from submission to first decision.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif font-semibold text-2xl text-center mb-12">
          Why Publish with Paperas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="bg-primary/10 rounded-full p-3 h-fit">
                <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
