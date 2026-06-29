import { NextRequest } from "next/server"
import { generateIdentify, generateListMetadataFormats, generateListRecords, generateGetRecord } from "@/lib/services/oai-pmh"

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const verb = searchParams.get("verb")
  const metadataPrefix = searchParams.get("metadataPrefix") || "oai_dc"
  const identifier = searchParams.get("identifier")

  const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`

  if (verb === "ListRecords" && metadataPrefix === "oai_dc") {
    const xml = await generateListRecords(baseUrl)
    return new Response(xml, {
      headers: { "Content-Type": "application/xml" },
    })
  }

  if (verb === "Identify") {
    const xml = generateIdentify()
    return new Response(xml, {
      headers: { "Content-Type": "application/xml" },
    })
  }

  if (verb === "ListMetadataFormats") {
    const xml = generateListMetadataFormats()
    return new Response(xml, {
      headers: { "Content-Type": "application/xml" },
    })
  }

  if (verb === "GetRecord") {
    if (!identifier) {
      const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/">
  <responseDate>${new Date().toISOString()}</responseDate>
  <request verb="GetRecord">${escapeXml(baseUrl)}</request>
  <error code="badArgument">Missing required argument identifier</error>
</OAI-PMH>`
      return new Response(errorXml, {
        status: 400,
        headers: { "Content-Type": "application/xml" },
      })
    }

    const paperId = identifier.replace("oai:paperas:", "")
    const xml = await generateGetRecord(paperId, baseUrl)
    return new Response(xml, {
      headers: { "Content-Type": "application/xml" },
    })
  }

  const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/">
  <responseDate>${new Date().toISOString()}</responseDate>
  <request verb="${escapeXml(verb || "")}" metadataPrefix="${escapeXml(metadataPrefix)}">${escapeXml(baseUrl)}</request>
  <error code="badVerb">Illegal OAI verb</error>
</OAI-PMH>`

  return new Response(errorXml, {
    status: 400,
    headers: { "Content-Type": "application/xml" },
  })
}
