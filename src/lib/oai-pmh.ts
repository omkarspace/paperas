import { db } from "@/lib/db"

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
}

export async function generateListRecords(baseUrl: string) {
  const papers = await db.paper.findMany({
    where: { status: "PUBLISHED" },
    include: { author: true, category: true },
    orderBy: { publicationDate: "desc" },
  })

  const records = papers.map((paper) => `
  <record>
    <header>
      <identifier>oai:paperas:${escapeXml(paper.paperId)}</identifier>
      <datestamp>${paper.publicationDate?.toISOString() || paper.createdAt.toISOString()}</datestamp>
      <setSpec>published</setSpec>
    </header>
    <metadata>
      <oai_dc:dc
        xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"
        xmlns:dc="http://purl.org/dc/elements/1.1/"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/
        http://www.openarchives.org/OAI/2.0/oai_dc.xsd">
        <dc:title>${escapeXml(paper.title)}</dc:title>
        <dc:creator>${escapeXml(paper.author?.name || "Unknown")}</dc:creator>
        <dc:subject>${escapeXml(paper.keywords)}</dc:subject>
        <dc:description>${escapeXml(paper.abstract)}</dc:description>
        <dc:date>${paper.publicationDate?.toISOString().split("T")[0] || ""}</dc:date>
        <dc:type>text</dc:type>
        <dc:format>application/pdf</dc:format>
        <dc:identifier>${escapeXml(`${baseUrl}/research/${paper.paperId}`)}</dc:identifier>
        ${paper.doi ? `<dc:identifier>${escapeXml(`https://doi.org/${paper.doi}`)}</dc:identifier>` : ""}
        ${paper.category ? `<dc:subject>${escapeXml(paper.category.name)}</dc:subject>` : ""}
      </oai_dc:dc>
    </metadata>
  </record>`).join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/
         http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">
  <responseDate>${new Date().toISOString()}</responseDate>
  <request verb="ListRecords" metadataPrefix="oai_dc">${escapeXml(baseUrl)}</request>
  <ListRecords>
    ${records}
  </ListRecords>
</OAI-PMH>`
}
