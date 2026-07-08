"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FileUpload } from "./file-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"

type Step = "upload" | "metadata" | "coauthors" | "review"

interface CoAuthor {
  name: string
  email: string
  affiliation: string
}

interface Category {
  id: string
  name: string
}

export function SubmissionWizard() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [title, setTitle] = useState("")
  const [abstract, setAbstract] = useState("")
  const [keywords, setKeywords] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState<Category[]>([])

  const [coAuthors, setCoAuthors] = useState<CoAuthor[]>([])
  const [newAuthor, setNewAuthor] = useState<CoAuthor>({ name: "", email: "", affiliation: "" })

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => {})
  }, [])

  function addCoAuthor() {
    if (!newAuthor.name.trim()) return
    setCoAuthors([...coAuthors, { ...newAuthor, name: newAuthor.name.trim() }])
    setNewAuthor({ name: "", email: "", affiliation: "" })
  }

  function removeCoAuthor(index: number) {
    setCoAuthors(coAuthors.filter((_, i) => i !== index))
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          abstract,
          keywords,
          ...(categoryId ? { categoryId } : {}),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create paper")
      }

      const paper = await res.json()

      if (file) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("paperId", paper.id)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadRes.ok) {
          console.error("PDF upload failed, but paper was created")
        }
      }

      const coAuthorPromises = coAuthors.map((ca) =>
        fetch(`/api/papers/${paper.id}/co-authors`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ca),
        })
      )

      await Promise.allSettled(coAuthorPromises)

      router.push("/dashboard/submissions")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  const steps: Step[] = ["upload", "metadata", "coauthors", "review"]

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-center gap-2 text-sm">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
              step === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {i + 1}
            </div>
            <span className={step === s ? "font-medium" : "text-muted-foreground"}>
              {s === "coauthors" ? "Co-authors" : s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      {step === "upload" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upload Manuscript</h2>
          <FileUpload onFileSelect={setFile} />
          {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
          <Button onClick={() => setStep("metadata")} disabled={!file}>Next</Button>
        </div>
      )}

      {step === "metadata" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Paper Details</h2>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter paper title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="abstract">Abstract</Label>
            <Textarea
              id="abstract"
              placeholder="Enter abstract (min 150 characters)"
              rows={6}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              placeholder="Enter keywords (comma separated)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select a category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep("upload")}>Back</Button>
            <Button onClick={() => setStep("coauthors")} disabled={!title || !abstract || abstract.length < 150 || !keywords}>Next</Button>
          </div>
        </div>
      )}

      {step === "coauthors" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Co-authors</h2>
          <p className="text-sm text-muted-foreground">
            Add co-authors for this submission. You can skip this step if there are none.
          </p>

          {coAuthors.length > 0 && (
            <div className="space-y-2">
              {coAuthors.map((ca, i) => (
                <div key={i} className="flex items-center justify-between border rounded-md p-3 text-sm">
                  <div>
                    <span className="font-medium">{ca.name}</span>
                    {ca.email && <span className="text-muted-foreground ml-2">&lt;{ca.email}&gt;</span>}
                    {ca.affiliation && <span className="text-muted-foreground ml-2">- {ca.affiliation}</span>}
                  </div>
                  <button
                    onClick={() => removeCoAuthor(i)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border rounded-md p-4 space-y-3">
            <h3 className="text-sm font-medium">Add Co-author</h3>
            <div className="space-y-2">
              <Label htmlFor="ca-name">Name *</Label>
              <Input
                id="ca-name"
                placeholder="Full name"
                value={newAuthor.name}
                onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ca-email">Email</Label>
              <Input
                id="ca-email"
                type="email"
                placeholder="Email address"
                value={newAuthor.email}
                onChange={(e) => setNewAuthor({ ...newAuthor, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ca-affiliation">Affiliation</Label>
              <Input
                id="ca-affiliation"
                placeholder="Institution"
                value={newAuthor.affiliation}
                onChange={(e) => setNewAuthor({ ...newAuthor, affiliation: e.target.value })}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCoAuthor}
              disabled={!newAuthor.name.trim()}
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep("metadata")}>Back</Button>
            <Button onClick={() => setStep("review")}>Next</Button>
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Review & Submit</h2>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Title:</span> {title}</div>
            <div><span className="font-medium">File:</span> {file?.name}</div>
            {categoryId && (
              <div>
                <span className="font-medium">Category:</span>{" "}
                {categories.find((c) => c.id === categoryId)?.name || "Unknown"}
              </div>
            )}
            <div><span className="font-medium">Co-authors:</span> {coAuthors.length ? coAuthors.map((ca) => ca.name).join(", ") : "None"}</div>
            <div><span className="font-medium">Keywords:</span> {keywords}</div>
            <div><span className="font-medium">Abstract:</span></div>
            <p className="text-muted-foreground">{abstract}</p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep("coauthors")}>Back</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Paper"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
