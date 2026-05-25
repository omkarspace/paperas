"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RevisionsPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);

  async function handleUploadRevision() {
    setLoading(true);
    try {
      const res = await fetch(`/api/papers/${params.id}/revision`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to upload revision");
      router.push("/dashboard/submissions");
    } catch (error) {
      console.error(error);
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
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Drag and drop your revised PDF here or click to browse
            </p>
            <input type="file" accept=".pdf" className="hidden" id="revision-upload" />
            <Button type="button" variant="outline" onClick={() => document.getElementById('revision-upload')?.click()}>
              Select File
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Maximum file size: 50MB. PDF format only.
          </p>
          
          <Button onClick={handleUploadRevision} disabled={loading} className="w-full">
            {loading ? "Uploading..." : "Submit Revision"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}