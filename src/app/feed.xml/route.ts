import { db } from "@/lib/db"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://paperas.dev"

export async function GET() {
  const papers = await db.paper.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publicationDate: "desc" },
    include: { author: true, category: true },
    take: 20,
  })

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Paperas - Peer-Reviewed Academic Journal</title>
    <description>Open access academic publishing platform for peer-reviewed journals and research papers</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${papers
      .map(
        (paper) => `<item>
      <title><![CDATA[${paper.title}]]></title>
      <description><![CDATA[${paper.abstract || ""}]]></description>
      <link>${baseUrl}/research/${paper.paperId}</link>
      <guid isPermaLink="true">${baseUrl}/research/${paper.paperId}</guid>
      <pubDate>${paper.publicationDate ? new Date(paper.publicationDate).toUTCString() : ""}</pubDate>
      ${paper.author?.name ? `<dc:creator>${paper.author.name}</dc:creator>` : ""}
      ${paper.category ? `<category>${paper.category.name}</category>` : ""}
      ${paper.doi ? `<dc:identifier>doi:${paper.doi}</dc:identifier>` : ""}
    </item>`
      )
      .join("\n    ")}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate",
    },
  })
}
