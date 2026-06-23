import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { Paper } from '@/types'

interface PaperCardProps {
  paper: Paper
}

export function PaperCard({ paper }: PaperCardProps) {
  const isPublished = paper.status === 'PUBLISHED'

  return (
    <Link href={'/research/' + paper.paperId}>
      <article className="group h-full p-5 rounded-2xl border border-border bg-card hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-2 mb-3">
          {paper.category && (
            <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs font-medium">
              {paper.category.name}
            </Badge>
          )}
          <StatusBadge status={paper.status} />
        </div>
        <h3 className="font-serif font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {paper.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {paper.abstract}
        </p>
        <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
          <span>{paper.author?.name || 'Unknown Author'}</span>
          {paper.publicationDate && (
            <span>{new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(paper.publicationDate))}</span>
          )}
        </div>
      </article>
    </Link>
  )
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<string, { label: string; className: string }> = {
    DRAFT: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
    SUBMITTED: { label: 'Submitted', className: 'bg-muted text-muted-foreground' },
    UNDER_REVIEW: { label: 'Under Review', className: 'bg-muted text-muted-foreground' },
    REVISION_REQUESTED: { label: 'Revision Requested', className: 'bg-muted text-muted-foreground' },
    ACCEPTED: { label: 'Accepted', className: 'bg-primary/10 text-primary' },
    PUBLISHED: { label: 'Published', className: 'bg-primary/10 text-primary' },
    REJECTED: { label: 'Rejected', className: 'bg-muted text-muted-foreground' },
  }

  const variant = variants[status] || { label: status, className: 'bg-muted text-muted-foreground' }

  return (
    <Badge className={'rounded-full px-2.5 py-0.5 text-xs font-medium ' + variant.className}>
      {variant.label}
    </Badge>
  )
}
