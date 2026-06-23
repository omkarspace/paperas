"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatCitation } from "@/lib/services/citations"

interface CitationDialogProps {
  paper: {
    title: string
    authors: { name: string }[]
    doi?: string | null
    publicationDate?: string | null
    volume?: number | null
    issue?: number | null
  }
}

const formats = [
  { id: "apa", label: "APA" },
  { id: "mla", label: "MLA" },
  { id: "chicago", label: "Chicago" },
  { id: "harvard", label: "Harvard" },
  { id: "ieee", label: "IEEE" },
  { id: "bibtex", label: "BibTeX" },
  { id: "ris", label: "RIS" },
]

export function CitationDialog({ paper }: CitationDialogProps) {
  const [open, setOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function getCitation(format: string) {
    return formatCitation(
      {
        title: paper.title,
        authors: paper.authors || [{ name: "Unknown" }],
        doi: paper.doi,
        publicationDate: paper.publicationDate ? new Date(paper.publicationDate) : null,
        volume: paper.volume,
        issue: paper.issue,
      },
      format
    )
  }

  async function copyCitation(format: string) {
    const text = getCitation(format)
    await navigator.clipboard.writeText(text)
    setCopiedId(format)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(!open)}>
        Cite this paper
      </Button>

      {open && (
        <Card className="mt-4">
          <CardContent className="p-4 space-y-3">
            <p className="text-sm font-medium">Cite this paper</p>
            {formats.map((f) => (
              <div key={f.id} className="flex items-start gap-2">
                <pre className="flex-1 text-xs bg-muted p-2 rounded overflow-x-auto whitespace-pre-wrap">
                  {getCitation(f.id)}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyCitation(f.id)}
                  className="shrink-0"
                >
                  {copiedId === f.id ? "Copied!" : "Copy"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  )
}
