"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: File) => void
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) onFileSelect(accepted[0])
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        {isDragActive ? (
          <Upload className="h-10 w-10 text-primary" />
        ) : (
          <FileText className="h-10 w-10 text-muted-foreground" />
        )}
        <p className="text-sm font-medium">
          {isDragActive ? "Drop your PDF here" : "Drag & drop your manuscript PDF"}
        </p>
        <p className="text-xs text-muted-foreground">or click to browse (max 50MB)</p>
      </div>
    </div>
  )
}
