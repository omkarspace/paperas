# UI Components Documentation

## Overview

Complete component structure for the Paperas platform using Shadcn UI.

**Theme**: Shadcn default (DO NOT MODIFY)

---

## 1. Directory Structure

```
src/
├── components/
│   ├── ui/                    # Shadcn components
│   ├── shared/                 # Shared components
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── loading-spinner.tsx
│   │   └── empty-state.tsx
│   ├── papers/                # Paper components
│   │   ├── paper-card.tsx
│   │   ├── paper-list.tsx
│   │   ├── paper-detail.tsx
│   │   ├── paper-upload.tsx
│   │   └── status-badge.tsx
│   ├── search/               # Search components
│   │   ├── search-bar.tsx
│   │   ├── filter-panel.tsx
│   │   └── result-card.tsx
│   ├── auth/                 # Auth components
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── dashboard/            # Dashboard components
│   │   ├── stats-card.tsx
│   │   ├── submission-table.tsx
│   │   └── analytics-chart.tsx
│   ├── reviewer/             # Reviewer components
│   │   ├── review-card.tsx
│   │   ├── review-form.tsx
│   │   └── recommendation-select.tsx
│   └── admin/                # Admin components
│       ├── user-table.tsx
│       ├── issue-manager.tsx
│       ├── submission-manager.tsx
│       └── settings-form.tsx
├── app/
│   ├── (public)/             # Public pages
│   ├── (auth)/               # Auth pages
│   ├── (dashboard)/          # Dashboard pages
│   └── (admin)/              # Admin pages
```

---

## 2. Shadcn Installation

### Core Components

```bash
npx shadcn@latest init
```

### Required Components

```bash
# Layout
npx shadcn@latest add button card navigation-menu sheet avatar dropdown-menu

# Forms
npx shadcn@latest add input textarea form label select

# Feedback
npx shadcn@latest add toast alert dialog badge

# Data
npx shadcn@latest add table tabs

# Utilities
npx shadcn@latest add separator scroll-area skeleton
```

### Optional Components (if needed)

```bash
npx shadcn@latest add slider switch progress checkbox radio-group
npx shadcn@latest add popover tooltip calendar
```

---

## 3. Shared Components

### Navbar

```tsx
// components/shared/navbar.tsx
import Link from 'next/link'

export function Navbar() {
  return (
    <NavigationMenu>
      <Link href="/">Home</Link>
      <Link href="/journal">Journal</Link>
      <Link href="/research">Research</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </NavigationMenu>
  )
}
```

### Footer

```tsx
// components/shared/footer.tsx
export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container">
        <p>© 2026 Paperas</p>
        <p>ISSN: XXXX-XXXX</p>
      </div>
    </footer>
  )
}
```

### LoadingSpinner

```tsx
// components/shared/loading-spinner.tsx
export function LoadingSpinner({ size = 'default' }) {
  return <Loader2 className="animate-spin" />
}
```

### EmptyState

```tsx
// components/shared/empty-state.tsx
export function EmptyState({ message, action }: Props) {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">{message}</p>
      {action}
    </div>
  )
}
```

---

## 4. Paper Components

### PaperCard

```tsx
// components/papers/paper-card.tsx
interface PaperCardProps {
  paper: {
    paperId: string
    title: string
    abstract: string
    keywords: string[]
    author: { name: string }
    category: { name: string }
    publicationDate: Date
  }
}

export function PaperCard({ paper }: PaperCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{paper.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3">{paper.abstract}</p>
        <div className="flex gap-2 mt-4">
          {paper.keywords.slice(0, 3).map(k => (
            <Badge key={k} variant="secondary">{k}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/research/${paper.paperId}`}>Read More</Link>
      </CardFooter>
    </Card>
  )
}
```

### PaperList

```tsx
// components/papers/paper-list.tsx
export function PaperList({ papers }: { papers: Paper[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {papers.map(paper => (
        <PaperCard key={paper.id} paper={paper} />
      ))}
    </div>
  )
}
```

### StatusBadge

```tsx
// components/papers/status-badge.tsx
const statusColors = {
  DRAFT: 'secondary',
  SUBMITTED: 'outline',
  UNDER_REVIEW: 'outline',
  REVISION_REQUESTED: 'warning',
  ACCEPTED: 'success',
  PUBLISHED: 'default',
  REJECTED: 'destructive',
}

export function StatusBadge({ status }: { status: PaperStatus }) {
  return <Badge variant={statusColors[status]}>{status}</Badge>
}
```

---

## 5. Search Components

### SearchBar

```tsx
// components/search/search-bar.tsx
'use client'
export function SearchBar() {
  return (
    <form action="/research" method="GET">
      <Input name="q" placeholder="Search papers..." />
      <Button type="submit">Search</Button>
    </form>
  )
}
```

### FilterPanel

```tsx
// components/search/filter-panel.tsx
'use client'
export function FilterPanel() {
  return (
    <div className="space-y-4">
      <Select name="category">
        <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="tech">Technology</SelectItem>
          <SelectItem value="science">Science</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
```

---

## 6. Dashboard Components

### StatsCard

```tsx
// components/dashboard/stats-card.tsx
interface StatsCardProps {
  title: string
  value: number | string
  description?: string
  icon: LucideIcon
}

export function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Icon className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}
```

### SubmissionTable

```tsx
// components/dashboard/submission-table.tsx
export function SubmissionTable({ submissions }: { submissions: Paper[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Paper ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map(submission => (
          <TableRow key={submission.id}>
            <TableCell>{submission.paperId}</TableCell>
            <TableCell>{submission.title}</TableCell>
            <TableCell><StatusBadge status={submission.status} /></TableCell>
            <TableCell>{formatDate(submission.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

---

## 7. Review Components

### ReviewForm

```tsx
// components/reviewer/review-form.tsx
'use client'
export function ReviewForm() {
  return (
    <Form>
      <FormField name="comments" render={({ field }) => (
        <FormItem>
          <FormLabel>Comments</FormLabel>
          <FormControl><Textarea {...field} /></FormControl>
        </FormItem>
      )} />
      <FormField name="recommendation" render={({ field }) => (
        <FormItem>
          <FormLabel>Recommendation</FormLabel>
          <Select onValueChange={field.onChange}>
            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ACCEPT">Accept</SelectItem>
              <SelectItem value="MINOR_REVISION">Minor Revision</SelectItem>
              <SelectItem value="MAJOR_REVISION">Major Revision</SelectItem>
              <SelectItem value="REJECT">Reject</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>
      )} />
      <Button type="submit">Submit Review</Button>
    </Form>
  )
}
```

---

## 8. Admin Components

### UserTable

```tsx
// components/admin/user-table.tsx
export function UserTable({ users }: { users: User[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

### IssueManager

```tsx
// components/admin/issue-manager.tsx
export function IssueManager({ issues }: { issues: JournalIssue[] }) {
  return (
    <div className="space-y-4">
      {issues.map(issue => (
        <Card key={issue.id}>
          <CardHeader>
            <CardTitle>Volume {issue.volume}, Issue {issue.issue}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Publication Date: {formatDate(issue.publicationDate)}</p>
            <p>Papers: {issue.papers?.length || 0}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

---

## 9. PDF Viewer

Use react-pdf:

```bash
npm install react-pdf
```

```tsx
// components/papers/pdf-viewer.tsx
'use client'
import { Document, Page } from 'react-pdf'

export function PDFViewer({ url }: { url: string }) {
  return (
    <Document file={url}>
      <Page pageNumber={1} />
    </Document>
  )
}
```

---

## 10. Icons

Using Lucide React:

```bash
npm install lucide-react
```

Common icons: Book, FileText, Search, User, Upload, Download, Eye, Loader2

---

## 11. Page Layouts

### Public Page Layout

```tsx
// app/(public)/layout.tsx
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="container py-8">{children}</main>
      <Footer />
    </>
  )
}
```

---

## 12. Color Variables

**DO NOT MODIFY** - Use Shadcn default CSS variables:

```css
--background
--foreground
--card
--card-foreground
--primary
--primary-foreground
--secondary
--secondary-foreground
--muted
--muted-foreground
--destructive
--destructive-foreground
--border
--input
--ring
```