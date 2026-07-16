import { NextRequest } from "next/server"
import { generateIdentify, generateListMetadataFormats, generateListRecords, generateGetRecord, escapeXml } from "@/lib/services/oai-pmh"
import { rateLimit, getClientIp } from "@/lib/utils/rate-limit"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const { success } = await rateLimit(ip, 60, 60 * 1000)
    if (!success) {
      return new Response("Too many requests", { status: 429 })
    }

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
      const xml = generateIdentify(baseUrl)
      return new Response(xml, {
        headers: { "Content-Type": "application/xml" },
      })
    }

    if (verb === "ListMetadataFormats") {
      const xml = generateListMetadataFormats(baseUrl)
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
  } catch (error) {
    logger.error("OAI-PMH error", { error: error instanceof Error ? error.message : String(error) })
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/">
  <responseDate>${new Date().toISOString()}</responseDate>
  <error code="internalServerError">Internal server error</error>
</OAI-PMH>`
    return new Response(errorXml, {
      status: 500,
      headers: { "Content-Type": "application/xml" },
    })
  }
}
