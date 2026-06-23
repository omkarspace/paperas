# Phase 4: Advanced Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add JATS XML export, citation export, enhanced analytics dashboard, and SEO/sitemap.

**Architecture:** Server-side XML generation, Recharts for analytics visualization, dynamic sitemap route.

**Tech Stack:** Recharts, XML templating, JSON-LD

---

### Task 1: JATS XML Export

**Files:**
- Create: `src/lib/jats.ts`
- Create: `src/app/api/papers/[id]/jats/route.ts`

- [ ] **Step 1: Create JATS XML generator**

Create `src/lib/jats.ts`:

```typescript
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
```

- [ ] **Step 2: Create JATS download route**

Create `src/app/api/papers/[id]/jats/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server"
import { generateJATS } from "@/lib/jats"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const xml = await generateJATS(params.id)
  if (!xml) return NextResponse.json({ error: "Paper not found" }, { status: 404 })

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Content-Disposition": `attachment; filename="${params.id}.jats.xml"`,
    },
  })
}
```

- [ ] **Step 3: Add JATS download button to paper page**

In the paper detail component, add:

```tsx
<Link href={`/api/papers/${paper.paperId}/jats`}>
  <Button variant="outline" size="sm">Download JATS XML</Button>
</Link>
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/jats.ts src/app/api/papers/[id]/jats/route.ts
git commit -m "feat: add JATS XML export for archival format"
```

---

### Task 2: Citation Export

**Files:**
- Create: `src/lib/citations.ts`
- Modify: paper detail component (add citation dropdown)

- [ ] **Step 1: Create citation formatter**

Create `src/lib/citations.ts`:

```typescript
interface CitationPaper {
  title: string
  authors: { name: string }[]
  doi?: string | null
  publicationDate?: Date | null
  volume?: number | null
  issue?: number | null
  pages?: string
}

export function formatCitation(paper: CitationPaper, format: string): string {
  const year = paper.publicationDate?.getFullYear() || "n.d."
  const author = paper.authors[0]?.name || "Unknown"

  switch (format) {
    case "apa":
      return `${author} (${year}). ${paper.title}. Paperas, ${paper.volume || 1}(${paper.issue || 1}), ${paper.pages || "1-15"}.`

    case "mla":
      return `${author}. "${paper.title}." Paperas, vol. ${paper.volume || 1}, no. ${paper.issue || 1}, ${year}, pp. ${paper.pages || "1-15"}.`

    case "ieee":
      return `${author}, "${paper.title}," Paperas, vol. ${paper.volume || 1}, no. ${paper.issue || 1}, pp. ${paper.pages || "1-15"}, ${year}.`

    case "chicago":
      return `${author}. "${paper.title}." Paperas ${paper.volume || 1}, no. ${paper.issue || 1} (${year}): ${paper.pages || "1-15"}.`

    case "harvard":
      return `${author}, ${year}. ${paper.title}. Paperas, ${paper.volume || 1}(${paper.issue || 1}), pp. ${paper.pages || "1-15"}.`

    case "bibtex":
      return `@article{paperas_${year},
  author  = {${author}},
  title   = {${paper.title}},
  journal = {Paperas},
  year    = {${year}},
  volume  = {${paper.volume || 1}},
  number  = {${paper.issue || 1}},
  pages   = {${paper.pages || "1-15"}},
  doi     = {${paper.doi || ""}},
}`

    case "ris":
      return `TY  - JOUR
AU  - ${author}
TI  - ${paper.title}
JO  - Paperas
PY  - ${year}
VL  - ${paper.volume || 1}
IS  - ${paper.issue || 1}
SP  - ${paper.pages?.split("-")[0] || "1"}
EP  - ${paper.pages?.split("-")[1] || "15"}
DO  - ${paper.doi || ""}
ER  -`

    default:
      return `${author}. ${paper.title}. Paperas. ${year}.`
  }
}
```

- [ ] **Step 2: Create citation dropdown component**

In the paper detail component, add a citation button that shows a dropdown:

```tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CitationIcon } from "lucide-react"
import { formatCitation } from "@/lib/citations"

const formats = ["apa", "mla", "ieee", "chicago", "harvard", "bibtex", "ris"]

export function CitationDropdown({ paper }: { paper: any }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
        <CitationIcon className="h-4 w-4 mr-1" /> Cite
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-popover border rounded-lg shadow-lg z-50">
          <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
            {formats.map((fmt) => (
              <button
                key={fmt}
                className="w-full text-left px-3 py-2 text-sm rounded hover:bg-muted transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(formatCitation(paper, fmt))
                  setOpen(false)
                }}
              >
                <span className="font-medium uppercase mr-2">{fmt}</span>
                <span className="text-muted-foreground">
                  {formatCitation(paper, fmt).substring(0, 60)}...
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/citations.ts
git commit -m "feat: add citation export (BibTeX, RIS, APA, MLA, Chicago, IEEE)"
```

---

### Task 3: Enhanced Analytics Dashboard

**Files:**
- Modify: `package.json` (add recharts dependency)
- Create: `src/components/admin/analytics-charts.tsx`
- Modify: `src/app/admin/page.tsx` or analytics section

- [ ] **Step 1: Install recharts**

Run: `npm install recharts`

- [ ] **Step 2: Create analytics charts component**

Create `src/components/admin/analytics-charts.tsx`:

```tsx
"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface AnalyticsProps {
  dailyViews: { date: string; views: number }[]
  topPapers: { title: string; views: number }[]
  editorialStats: { label: string; value: number }[]
}

export function AnalyticsCharts({ dailyViews, topPapers, editorialStats }: AnalyticsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Daily Views</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dailyViews}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Top Papers</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topPapers} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="title" type="category" width={150} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="views" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6 lg:col-span-2">
        <h3 className="font-semibold mb-4">Editorial Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {editorialStats.map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
```

- [ ] **Step 3: Integrate into admin dashboard**

In the admin dashboard page, fetch analytics data and render charts:

```tsx
import { db } from "@/lib/db"
import { AnalyticsCharts } from "@/components/admin/analytics-charts"

export default async function AdminDashboard() {
  const totalPapers = await db.paper.count()
  const publishedPapers = await db.paper.count({ where: { status: "PUBLISHED" } })
  const totalAuthors = await db.user.count({ where: { role: "AUTHOR" } })
  const totalReviews = await db.review.count()

  // Sample data — replace with real analytics
  const dailyViews = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
    views: Math.floor(Math.random() * 100),
  }))

  const topPapers = (await db.paper.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { paperAnalytics: { views: "desc" } },
    take: 5,
    select: { title: true, paperAnalytics: { select: { views: true } } },
  })).map((p) => ({ title: p.title.substring(0, 30), views: p.paperAnalytics?.views || 0 }))

  return (
    <div className="space-y-6">
      <AnalyticsCharts
        dailyViews={dailyViews}
        topPapers={topPapers}
        editorialStats={[
          { label: "Total Papers", value: totalPapers },
          { label: "Published", value: publishedPapers },
          { label: "Authors", value: totalAuthors },
          { label: "Reviews", value: totalReviews },
        ]}
      />
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/analytics-charts.tsx package.json package-lock.json
git commit -m "feat: add enhanced analytics dashboard with charts"
```

---

### Task 4: SEO & Sitemap

**Files:**
- Create: `src/app/sitemap.ts`

- [ ] **Step 1: Create dynamic sitemap**

Create `src/app/sitemap.ts`:

```typescript
import { MetadataRoute } from "next"
import { db } from "@/lib/db"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://paperas.dev"

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/journal`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ]

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

  return [...staticPages, ...paperPages]
}
```

- [ ] **Step 2: Add JSON-LD structured data to paper pages**

In the paper detail layout, add:

```tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline: paper.title,
  author: [{ "@type": "Person", name: paper.author.name }],
  datePublished: paper.publicationDate?.toISOString(),
  description: paper.abstract,
  keywords: paper.keywords,
  identifier: paper.doi ? `https://doi.org/${paper.doi}` : undefined,
}

// In the page component:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat: add dynamic sitemap and JSON-LD structured data"
```
