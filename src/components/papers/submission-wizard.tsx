"use client"

import { useState } from "react"
import { FileUpload } from "./file-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Step = "upload" | "metadata" | "review"

export function SubmissionWizard() {
  const [step, setStep] = useState<Step>("upload")
  const [file, setFile] = useState<File | null>(null)

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
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input placeholder="Enter paper title" />
          </div>
          <div>
            <label className="text-sm font-medium">Abstract</label>
            <Textarea placeholder="Enter abstract" rows={6} />
          </div>
          <div>
            <label className="text-sm font-medium">Keywords</label>
            <Input placeholder="Enter keywords (comma separated)" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep("upload")}>Back</Button>
            <Button onClick={() => setStep("review")}>Next</Button>
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Review & Submit</h2>
          <p className="text-sm text-muted-foreground">Review your submission details before submitting.</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep("metadata")}>Back</Button>
            <Button>Submit Paper</Button>
          </div>
        </div>
      )}
    </div>
  )
}
