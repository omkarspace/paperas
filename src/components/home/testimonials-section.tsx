const testimonials = [
  {
    quote: "Paperas streamlined our entire publication workflow. The peer review process was thorough yet efficient.",
    author: "Dr. Priya Sharma",
    affiliation: "IIT Delhi",
  },
  {
    quote: "Finally, an Indian journal with global indexing and rigorous standards. Highly recommend.",
    author: "Prof. Rahul Verma",
    affiliation: "JNU",
  },
  {
    quote: "From submission to publication in under 6 weeks. The open access model is a game changer.",
    author: "Dr. Anita Desai",
    affiliation: "University of Mumbai",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif font-semibold text-2xl text-center mb-12">
          What Researchers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <p className="text-sm text-muted-foreground italic mb-4">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div>
                <p className="font-serif font-semibold text-sm">{testimonial.author}</p>
                <p className="text-xs text-muted-foreground">{testimonial.affiliation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
