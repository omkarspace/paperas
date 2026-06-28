import { db } from "@/lib/db";
import { Navbar } from "@/components/shared/navbar";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { PublicationsSection } from "@/components/home/publications-section";

export const dynamic = "force-dynamic";
import { FeaturesSection } from "@/components/home/features-section";
import { EditorialPreviewSection } from "@/components/home/editorial-preview-section";
import { TrustBadgesSection } from "@/components/home/trust-badges-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { Footer } from "@/components/shared/footer";

export default async function Home() {
  const [totalPapers, totalReviewers, totalCountries] = await Promise.all([
    db.paper.count({ where: { status: "PUBLISHED" } }),
    db.user.count({ where: { role: "REVIEWER" } }),
    db.user.findMany({
      where: { institution: { not: null } },
      select: { institution: true },
      distinct: ["institution"],
    }),
  ]);

  const stats = [
    { label: "Papers Published", value: Math.max(totalPapers, 1), suffix: "+" },
    { label: "Active Reviewers", value: Math.max(totalReviewers, 1), suffix: "+" },
    { label: "Institutions", value: Math.max(totalCountries.length, 1), suffix: "+" },
    { label: "Categories", value: 12, suffix: "" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection stats={stats} />
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
