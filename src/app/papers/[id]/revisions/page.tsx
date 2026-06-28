"use client";

import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RevisionsPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [comments, setComments] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(selectedFile: File) {
    if (selectedFile.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }
    if (selectedFile.size > 50 * 1024 * 1024) {
      alert("File size must be less than 50MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("paperId", params.id as string);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setPdfUrl(data.url);
      setFile(selectedFile);
    } catch (error) {
      console.error(error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmitRevision() {
    setLoading(true);
    try {
      const res = await fetch(`/api/papers/${params.id}/revision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfUrl, comments }),
      });
      if (!res.ok) throw new Error("Failed to submit revision");
      router.push("/dashboard/submissions");
    } catch (error) {
      console.error(error);
      alert("Failed to submit revision");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Upload Revision</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload Revised Paper</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            {file ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setPdfUrl(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground mb-4">
                  Drag and drop your revised PDF here or click to browse
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (selected) handleFileUpload(selected);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? "Uploading..." : "Select File"}
                </Button>
              </>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Comments (optional)</label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              rows={3}
              placeholder="Describe changes made in this revision..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Maximum file size: 50MB. PDF format only.
          </p>

          <Button
            onClick={handleSubmitRevision}
            disabled={loading || !file}
            className="w-full"
          >
            {loading ? "Submitting..." : "Submit Revision"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
