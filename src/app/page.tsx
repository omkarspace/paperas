import { Navbar } from "@/components/shared/navbar";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { PublicationsSection } from "@/components/home/publications-section";
import { FeaturesSection } from "@/components/home/features-section";
import { EditorialPreviewSection } from "@/components/home/editorial-preview-section";
import { TrustBadgesSection } from "@/components/home/trust-badges-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { Footer } from "@/components/shared/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <PublicationsSection />
        <FeaturesSection />
        <EditorialPreviewSection />
        <TrustBadgesSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
