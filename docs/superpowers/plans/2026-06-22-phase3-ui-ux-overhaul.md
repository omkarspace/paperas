# Phase 3: UI/UX Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Modern, mobile-friendly, accessible UI with dark mode, PWA, drag-and-drop submission, and page transitions.

**Architecture:** next-themes for dark mode, serwist for PWA, Framer Motion for animations, react-dropzone for file upload.

**Tech Stack:** next-themes, serwist, framer-motion, react-dropzone, pdf-parse

---

### Task 1: Dark Mode

**Files:**
- Modify: `package.json` (add next-themes dependency)
- Modify: `src/app/layout.tsx` (add ThemeProvider)
- Create: `src/components/shared/theme-toggle.tsx`
- Modify: `src/components/shared/navbar.tsx` (add toggle button)
- Modify: `tailwind.config.ts` (dark mode class strategy)

- [ ] **Step 1: Install next-themes**

Run: `npm install next-themes`

- [ ] **Step 2: Add ThemeProvider to layout**

In `src/app/layout.tsx`, wrap the body content with ThemeProvider:

```tsx
import { ThemeProvider } from "next-themes"

// Inside the body, wrap main content:
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <Navbar />
  <main className="flex-1">{children}</main>
  <Footer />
</ThemeProvider>
```

- [ ] **Step 3: Create theme toggle component**

Create `src/components/shared/theme-toggle.tsx`:

```tsx
"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="h-9 w-9" />

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}
```

- [ ] **Step 4: Add toggle to navbar**

In `src/components/shared/navbar.tsx`, add the ThemeToggle before the login/register buttons:

```tsx
import { ThemeToggle } from "@/components/shared/theme-toggle"

// In the desktop nav section, before login buttons:
<div className="hidden md:flex ml-auto items-center gap-2">
  <ThemeToggle />
  <Link href="/auth/login">
    <Button variant="ghost">Login</Button>
  </Link>
  <Link href="/auth/register">
    <Button>Register</Button>
  </Link>
</div>
```

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/components/shared/theme-toggle.tsx src/components/shared/navbar.tsx package.json package-lock.json
git commit -m "feat: add dark mode with theme toggle"
```

---

### Task 2: Mobile-First Responsive Pass

**Files:**
- Modify: `src/components/shared/navbar.tsx` (improve mobile nav)
- Modify: `src/app/page.tsx` (responsive grid)
- Modify: `src/app/journal/page.tsx` (responsive table)
- Modify: `src/app/research/[id]/page.tsx` (responsive layout)

- [ ] **Step 1: Improve mobile navigation**

In `src/components/shared/navbar.tsx`, ensure:
- Hamburger menu is touch-friendly (min 44px touch target) ✅ already has this
- Bottom navigation bar for mobile:
  - Add sticky bottom bar with Home, Search, Submit, Profile icons when screen < md
  - Use Lucide icons: Home, Search, FilePlus, User

- [ ] **Step 2: Mobile-responsive table in journal page**

If `src/app/journal/page.tsx` contains a table, wrap it in a horizontal scroll container:

```tsx
<div className="overflow-x-auto">
  <table className="w-full min-w-[600px]">...</table>
</div>
```

- [ ] **Step 3: Ensure all pages have proper responsive spacing**

Verify all pages use responsive padding: `px-4 md:px-6 lg:px-8` or `container` class.
The container class should already handle this via Tailwind config.

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/navbar.tsx src/app/page.tsx
git commit -m "feat: improve mobile responsiveness across pages"
```

---

### Task 3: PWA Setup

**Files:**
- Create: `public/manifest.json`
- Create: `public/sw.js`
- Modify: `src/app/layout.tsx` (add manifest link and meta tags)

- [ ] **Step 1: Create `public/manifest.json`**

```json
{
  "name": "Paperas",
  "short_name": "Paperas",
  "description": "Open source academic publishing platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Step 2: Create `public/sw.js`**

```javascript
self.addEventListener("install", () => self.skipWaiting())
self.addEventListener("activate", () => self.clients.claim())
```

- [ ] **Step 3: Add manifest link to layout head**

In `src/app/layout.tsx`, add to metadata:

```tsx
export const metadata: Metadata = {
  // ...existing...
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "Paperas" },
}
```

- [ ] **Step 4: Commit**

```bash
git add public/manifest.json public/sw.js src/app/layout.tsx
git commit -m "feat: add PWA manifest and service worker"
```

---

### Task 4: Drag-and-Drop Submission Wizard

**Files:**
- Modify: `package.json` (add react-dropzone dependency)
- Create: `src/components/papers/submission-wizard.tsx`
- Create: `src/components/papers/file-upload.tsx`
- Modify: `src/app/papers/submit/page.tsx` (use wizard)

- [ ] **Step 1: Install react-dropzone**

Run: `npm install react-dropzone`

- [ ] **Step 2: Create file upload component**

Create `src/components/papers/file-upload.tsx`:

```tsx
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
```

- [ ] **Step 3: Create submission wizard**

Create `src/components/papers/submission-wizard.tsx`:

```tsx
"use client"

import { useState } from "react"
import { FileUpload } from "./file-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitPaper } from "@/app/actions/papers"

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
```

- [ ] **Step 4: Create submission page**

Create `src/app/papers/submit/page.tsx`:

```tsx
import { SubmissionWizard } from "@/components/papers/submission-wizard"

export default function SubmitPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Submit Paper</h1>
      <SubmissionWizard />
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/papers/ src/app/papers/submit/page.tsx package.json package-lock.json
git commit -m "feat: add drag-and-drop submission wizard"
```

---

### Task 5: Page Transitions with Framer Motion

**Files:**
- Modify: `package.json` (add framer-motion dependency)
- Create: `src/components/shared/page-transition.tsx`
- Modify: `src/app/layout.tsx` (wrap with Transition)

- [ ] **Step 1: Install framer-motion**

Run: `npm install framer-motion`

- [ ] **Step 2: Create page transition wrapper**

Create `src/components/shared/page-transition.tsx`:

```tsx
"use client"

import { motion } from "framer-motion"

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 3: Wrap main content in layout**

In `src/app/layout.tsx`, wrap the main element:

```tsx
import { PageTransition } from "@/components/shared/page-transition"

<main className="flex-1">
  <PageTransition>{children}</PageTransition>
</main>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/page-transition.tsx src/app/layout.tsx package.json package-lock.json
git commit -m "feat: add page transition animations"
```
