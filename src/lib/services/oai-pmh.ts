import { db } from "@/lib/db"

export function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
}

const OAI_NS = "http://www.openarchives.org/OAI/2.0/"
const DC_NS = "http://www.openarchives.org/OAI/2.0/oai_dc/"
const DC_ELEMENTS = "http://purl.org/dc/elements/1.1/"
const DC_SCHEMA = "http://www.openarchives.org/OAI/2.0/oai_dc.xsd"

export function generateIdentify(baseUrl: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="${OAI_NS}">
  <responseDate>${new Date().toISOString()}</responseDate>
  <request verb="Identify">${escapeXml(baseUrl)}</request>
  <Identify>
    <repositoryName>Paperas Journal</repositoryName>
    <baseURL>${escapeXml(baseUrl)}</baseURL>
    <protocolVersion>2.0</protocolVersion>
    <adminEmail>admin@paperas.in</adminEmail>
    <earliestDatestamp>2024-01-01T00:00:00Z</earliestDatestamp>
    <deletedRecord>no</deletedRecord>
    <granularity>YYYY-MM-DDThh:mm:ssZ</granularity>
  </Identify>
</OAI-PMH>`
}

export function generateListMetadataFormats(baseUrl: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="${OAI_NS}">
  <responseDate>${new Date().toISOString()}</responseDate>
  <request verb="ListMetadataFormats">${escapeXml(baseUrl)}</request>
  <ListMetadataFormats>
    <metadataFormat>
      <metadataPrefix>oai_dc</metadataPrefix>
      <schema>http://www.openarchives.org/OAI/2.0/oai_dc.xsd</schema>
      <metadataNamespace>${DC_NS}</metadataNamespace>
    </metadataFormat>
  </ListMetadataFormats>
</OAI-PMH>`
}

export async function generateGetRecord(paperId: string, baseUrl: string): Promise<string> {
  const paper = await db.paper.findFirst({
    where: { paperId },
    include: { author: true, category: true },
  })

  if (!paper) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="${OAI_NS}">
  <responseDate>${new Date().toISOString()}</responseDate>
  <request verb="GetRecord" identifier="oai:paperas:${escapeXml(paperId)}" metadataPrefix="oai_dc">${escapeXml(baseUrl)}</request>
  <error code="idDoesNotExist">No matching record for identifier oai:paperas:${escapeXml(paperId)}</error>
</OAI-PMH>`
  }

  const record = `
  <record>
    <header>
      <identifier>oai:paperas:${escapeXml(paper.paperId)}</identifier>
      <datestamp>${paper.publicationDate?.toISOString() || paper.createdAt.toISOString()}</datestamp>
      <setSpec>published</setSpec>
    </header>
    <metadata>
      <oai_dc:dc
        xmlns:oai_dc="${DC_NS}"
        xmlns:dc="${DC_ELEMENTS}"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="${DC_NS}
        ${DC_SCHEMA}">
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
  </record>`

  return `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="${OAI_NS}">
  <responseDate>${new Date().toISOString()}</responseDate>
  <request verb="GetRecord" identifier="oai:paperas:${escapeXml(paperId)}" metadataPrefix="oai_dc">${escapeXml(baseUrl)}</request>
  <GetRecord>
    ${record}
  </GetRecord>
</OAI-PMH>`
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
        xmlns:oai_dc="${DC_NS}"
        xmlns:dc="${DC_ELEMENTS}"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="${DC_NS}
        ${DC_SCHEMA}">
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
<OAI-PMH xmlns="${OAI_NS}"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="${OAI_NS}
         http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">
  <responseDate>${new Date().toISOString()}</responseDate>
  <request verb="ListRecords" metadataPrefix="oai_dc">${escapeXml(baseUrl)}</request>
  <ListRecords>
    ${records}
  </ListRecords>
</OAI-PMH>`
}
