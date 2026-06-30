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
  const [totalPapers, totalReviewers, institutions, totalCategories, publishedPapers] =
    await Promise.all([
      db.paper.count({ where: { status: "PUBLISHED" } }),
      db.user.count({ where: { role: "REVIEWER" } }),
      db.user.findMany({
        where: { institution: { not: null } },
        select: { institution: true },
        distinct: ["institution"],
      }),
      db.category.count(),
      db.paper.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publicationDate: "desc" },
        take: 6,
        select: {
          id: true,
          paperId: true,
          title: true,
          abstract: true,
          doi: true,
          author: { select: { name: true } },
          category: { select: { name: true } },
        },
      }),
    ]);

  const stats = [
    { label: "Papers Published", value: Math.max(totalPapers, 1), suffix: "+" },
    { label: "Active Reviewers", value: Math.max(totalReviewers, 1), suffix: "+" },
    { label: "Institutions", value: Math.max(institutions.length, 1), suffix: "+" },
    { label: "Categories", value: Math.max(totalCategories, 1), suffix: "" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection stats={stats} />
        <PublicationsSection papers={publishedPapers} />
        <FeaturesSection />
        <EditorialPreviewSection papers={publishedPapers.slice(0, 2)} />
        <TrustBadgesSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
