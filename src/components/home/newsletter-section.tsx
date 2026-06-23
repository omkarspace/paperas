import { NewsletterForm } from "@/components/shared/newsletter-form"

export function NewsletterSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-xl mx-auto text-center p-8 md:p-12 rounded-2xl border border-border bg-card">
          <h2 className="font-serif font-semibold text-xl mb-3">Stay Updated</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Subscribe to receive the latest updates on new publications and journal announcements.
          </p>
          <NewsletterForm />
        </div>
      </div>
    </section>
  )
}
