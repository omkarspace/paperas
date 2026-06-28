import { MetadataRoute } from "next"
import { db } from "@/lib/db"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://paperas.dev"

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/research`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/journal`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/about/aim-scope`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/about/editorial-board`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/about/author-guidelines`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/about/publication-ethics`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/author-guidelines`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/search/advanced`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
  ]

  try {
    const papers = await db.paper.findMany({
      where: { status: "PUBLISHED" },
      select: { paperId: true, updatedAt: true },
    })

    const paperPages = papers.map((paper) => ({
      url: `${baseUrl}/research/${paper.paperId}`,
      lastModified: paper.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))

    const journalIssues = await db.journalIssue.findMany({
      select: { volume: true, issue: true, updatedAt: true },
      orderBy: [{ volume: "desc" }, { issue: "desc" }],
    })

    const uniqueVolumes = new Map<number, Date>()
    journalIssues.forEach((ji) => {
      if (!uniqueVolumes.has(ji.volume) || ji.updatedAt > uniqueVolumes.get(ji.volume)!) {
        uniqueVolumes.set(ji.volume, ji.updatedAt)
      }
    })

    const volumePages = Array.from(uniqueVolumes.entries()).map(([volume, updatedAt]) => ({
      url: `${baseUrl}/journal/${volume}`,
      lastModified: updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))

    const issuePages = journalIssues.map((ji) => ({
      url: `${baseUrl}/journal/${ji.volume}/${ji.issue}`,
      lastModified: ji.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))

    return [...staticPages, ...paperPages, ...volumePages, ...issuePages]
  } catch {
    return staticPages
  }
}
