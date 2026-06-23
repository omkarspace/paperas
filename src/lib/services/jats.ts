import { db } from "@/lib/db"

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
}

export async function generateJATS(paperId: string) {
  const paper = await db.paper.findUnique({
    where: { paperId },
    include: { author: true, category: true },
  })

  if (!paper) return null

  const pubDate = paper.publicationDate || paper.createdAt
  const year = pubDate.getFullYear()

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Publishing DTD v1.2 20190208//EN" "https://jats.nlm.nih.gov/publishing/1.2/JATS-journalpublishing1.dtd">
<article xmlns:xlink="http://www.w3.org/1999/xlink" article-type="research-article">
  <front>
    <journal-meta>
      <journal-id journal-id-type="publisher-id">paperas</journal-id>
      <journal-title-group>
        <journal-title>Paperas</journal-title>
      </journal-title-group>
      <issn>PAP-${year}-0001</issn>
    </journal-meta>
    <article-meta>
      <article-id pub-id-type="doi">${paper.doi || `10.xxxx/paperas-${paper.paperId.toLowerCase()}`}</article-id>
      <title-group>
        <article-title>${escapeXml(paper.title)}</article-title>
      </title-group>
      <contrib-group>
        <contrib contrib-type="author">
          <name>
            <surname>${escapeXml(paper.author?.name?.split(" ").pop() || "")}</surname>
            <given-names>${escapeXml(paper.author?.name?.split(" ").slice(0, -1).join(" ") || "")}</given-names>
          </name>
        </contrib>
      </contrib-group>
      <pub-date publication-format="electronic">
        <year>${year}</year>
      </pub-date>
      <abstract>
        <p>${escapeXml(paper.abstract)}</p>
      </abstract>
      <kwd-group>
        ${paper.keywords.split(",").map((k) => `<kwd>${escapeXml(k.trim())}</kwd>`).join("\n        ")}
      </kwd-group>
    </article-meta>
  </front>
  <body>
    <p>Full text available as PDF.</p>
  </body>
</article>`
}
