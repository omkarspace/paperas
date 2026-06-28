"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileUpload } from "./file-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type Step = "upload" | "metadata" | "review"

export function SubmissionWizard() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("upload")
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [title, setTitle] = useState("")
  const [abstract, setAbstract] = useState("")
  const [keywords, setKeywords] = useState("")

  async function handleSubmit() {
    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, abstract, keywords }),
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

      router.push("/dashboard/submissions")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-center gap-2 text-sm">
        {(["upload", "metadata", "review"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
              step === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {i + 1}
            </div>
            <span className={step === s ? "font-medium" : "text-muted-foreground"}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            {i < 2 && <div className="w-8 h-px bg-border" />}
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep("upload")}>Back</Button>
            <Button onClick={() => setStep("review")} disabled={!title || !abstract || abstract.length < 150 || !keywords}>Next</Button>
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Review & Submit</h2>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Title:</span> {title}</div>
            <div><span className="font-medium">File:</span> {file?.name}</div>
            <div><span className="font-medium">Keywords:</span> {keywords}</div>
            <div><span className="font-medium">Abstract:</span></div>
            <p className="text-muted-foreground">{abstract}</p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep("metadata")}>Back</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Paper"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
