import {
  HeroSection,
  StatsSection,
  FeaturesSection,
  HowItWorksSection,
  PublicationsSection,
  TestimonialsSection,
  EditorialPreviewSection,
  TrustBadgesSection,
  NewsletterSection,
} from "@/components/home"
import { JsonLd } from "@/components/shared/json-ld"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PublicationsSection />
      <TestimonialsSection />
      <EditorialPreviewSection />
      <TrustBadgesSection />
      <NewsletterSection />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Paperas",
          url: process.env.NEXT_PUBLIC_APP_URL || "https://paperas.dev",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || "https://paperas.dev"}/search/advanced?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Periodical",
          name: "Paperas",
          alternateName: "Research Verse Journal And Publication House Of India",
          url: process.env.NEXT_PUBLIC_APP_URL || "https://paperas.dev",
          description: "A peer-reviewed academic journal dedicated to publishing quality research across various disciplines.",
          publisher: {
            "@type": "Organization",
            name: "Research Verse Journal And Publication House Of India",
          },
          isInStock: true,
          isOpenAccess: true,
        }}
      />
    </div>
  )
}
