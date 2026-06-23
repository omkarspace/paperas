import { Upload, Search, Globe } from "lucide-react"

const steps = [
  {
    number: 1,
    icon: Upload,
    title: "Submit",
    description: "Upload your manuscript, fill in metadata, and select your discipline.",
  },
  {
    number: 2,
    icon: Search,
    title: "Review",
    description: "Our double-blind peer review process ensures rigorous evaluation by domain experts.",
  },
  {
    number: 3,
    icon: Globe,
    title: "Publish",
    description: "Your paper is indexed, cited, and accessible to researchers worldwide.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif font-semibold text-2xl text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mb-4">
                {step.number}
              </div>
              <step.icon className="h-8 w-8 text-primary mb-4" aria-hidden="true" />
              <h3 className="font-serif font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute border-dashed border-t border-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
