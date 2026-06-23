# Phase 2: Critical Integrations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add ORCID sign-in, DOI/Crossref registration, and OAI-PMH endpoint to Paperas.

**Architecture:** Auth.js provider for ORCID, Prisma model changes for doi/orcidId, API route for OAI-PMH XML endpoint.

**Tech Stack:** Auth.js, Prisma, Crossref REST API, XML

---

### Task 1: ORCID Sign-In

**Files:**
- Modify: `prisma/schema.prisma` (add orcidId field)
- Modify: `src/lib/auth.ts` (add ORCID provider)

- [ ] **Step 1: Add `orcidId` to User model**

In `prisma/schema.prisma`, add after the `googleId` line:
```
  orcidId       String?   @unique
```

- [ ] **Step 2: Generate Prisma client**

Run: `npx prisma generate`

- [ ] **Step 3: Add ORCID provider to auth config**

Read `src/lib/auth.ts`. Add ORCID to the providers array:

```typescript
import { AuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"

// Add to imports at the top:
import OrcidProvider from "next-auth/providers/orcid"

// Add to providers array:
OrcidProvider({
  clientId: process.env.ORCID_CLIENT_ID!,
  clientSecret: process.env.ORCID_CLIENT_SECRET!,
})
```

If the auth config file doesn't use array notation, add the provider in the appropriate place (Auth.js v5 uses `providers` array in the auth config).

- [ ] **Step 4: Add ORCID env vars to `.env.example`**

Add after `GOOGLE_CLIENT_SECRET`:
```
# ORCID (optional)
ORCID_CLIENT_ID=""
ORCID_CLIENT_SECRET=""
```

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma src/lib/auth.ts .env.example
git commit -m "feat: add ORCID sign-in provider"
```

---

### Task 2: DOI/Crossref Integration

**Files:**
- Modify: `prisma/schema.prisma` (add doi field)
- Create: `src/app/api/doi/route.ts` (DOI registration endpoint)
- Modify: `src/components/papers/paper-detail.tsx` (show DOI badge)
- Modify: `src/app/admin/settings/page.tsx` (DOI prefix config)

- [ ] **Step 1: Add `doi` field to Paper model**

In `prisma/schema.prisma`, add after `supplementaryUrls`:
```
  doi              String?
```

- [ ] **Step 2: Generate Prisma client**

Run: `npx prisma generate`

- [ ] **Step 3: Create DOI registration server action**

Create `src/lib/crossref.ts`:

```typescript
export async function registerDOI(paper: {
  title: string
  authors: { name: string; affiliations?: string[] }[]
  doi: string
  publicationDate: Date
}) {
  const url = process.env.CROSSREF_API_URL || "https://api.crossref.org"
  const depositorEmail = process.env.CROSSREF_EMAIL
  const depositorName = process.env.CROSSREF_DEPOSITOR_NAME || "Paperas"

  if (!depositorEmail) {
    console.warn("Crossref email not configured — DOI registration skipped")
    return null
  }

  const payload = {
    doi: paper.doi,
    type: "journal-article",
    title: paper.title,
    author: paper.authors.map((a) => ({
      name: a.name,
      affiliation: a.affiliations || [],
    })),
    published: {
      date_parts: [[paper.publicationDate.getFullYear(), paper.publicationDate.getMonth() + 1, paper.publicationDate.getDate()]],
    },
  }

  try {
    const response = await fetch(`${url}/deposits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    return response.ok
  } catch (error) {
    console.error("DOI registration failed:", error)
    return false
  }
}
```

- [ ] **Step 4: Generate DOI on publish**

In the publish server action, generate and register DOI:

```typescript
import { registerDOI } from "@/lib/crossref"

// When publishing a paper:
const doi = `10.${process.env.DOI_PREFIX || "xxxx"}/paperas-${paper.paperId.toLowerCase()}`

await db.paper.update({
  where: { id: paper.id },
  data: { status: "PUBLISHED", doi, publicationDate: new Date() },
})

await registerDOI({
  title: paper.title,
  authors: [{ name: author.name }],
  doi,
  publicationDate: new Date(),
})
```

- [ ] **Step 5: Show DOI badge on paper detail page**

In the paper detail component, add after the abstract section:

```tsx
{paper.doi && (
  <a
    href={`https://doi.org/${paper.doi}`}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
  >
    <span className="font-medium">DOI:</span> {paper.doi}
  </a>
)}
```

- [ ] **Step 6: Add DOI prefix to admin settings**

In `src/app/admin/settings/page.tsx`, add after ISSN field:

```tsx
<div className="space-y-2">
  <Label htmlFor="doiPrefix">DOI Prefix</Label>
  <Input id="doiPrefix" defaultValue={process.env.DOI_PREFIX || "xxxx"} placeholder="e.g., 1234" />
  <p className="text-xs text-muted-foreground">Your Crossref DOI prefix (without '10.')</p>
</div>
```

- [ ] **Step 7: Add Crossref env vars to `.env.example`**

```
# Crossref (optional)
CROSSREF_API_URL="https://api.crossref.org"
CROSSREF_EMAIL=""
CROSSREF_DEPOSITOR_NAME="Paperas"
DOI_PREFIX="xxxx"
```

- [ ] **Step 8: Commit**

```bash
git add prisma/schema.prisma src/lib/crossref.ts src/components/papers/ .env.example src/app/admin/settings/page.tsx
git commit -m "feat: add DOI/Crossref integration for automatic DOI registration"
```

---

### Task 3: OAI-PMH Endpoint

**Files:**
- Create: `src/lib/oai-pmh.ts`
- Create: `src/app/api/oai/route.ts`

- [ ] **Step 1: Create OAI-PMH XML generator**

Create `src/lib/oai-pmh.ts`:

```typescript
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
```

- [ ] **Step 2: Create OAI-PMH API route**

Create `src/app/api/oai/route.ts`:

```typescript
import { NextRequest } from "next/server"
import { generateListRecords } from "@/lib/oai-pmh"

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

  // Error: bad verb
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
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/oai-pmh.ts src/app/api/oai/route.ts
git commit -m "feat: add OAI-PMH endpoint for Google Scholar and DOAJ indexing"
```
