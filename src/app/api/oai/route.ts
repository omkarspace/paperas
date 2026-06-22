import { NextRequest } from "next/server"
import { generateListRecords } from "@/lib/oai-pmh"

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const verb = searchParams.get("verb")
  const metadataPrefix = searchParams.get("metadataPrefix") || "oai_dc"

  const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`

  if (verb === "ListRecords" && metadataPrefix === "oai_dc") {
    const xml = await generateListRecords(baseUrl)
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
