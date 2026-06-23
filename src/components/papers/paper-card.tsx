import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Paper } from '@/types'

interface PaperCardProps {
  paper: Paper
}

export function PaperCard({ paper }: PaperCardProps) {
  const isPublished = paper.status === 'PUBLISHED'

  return (
    <Card className={'border rounded-md hover:shadow-md hover:-translate-y-0.5 transition-all duration-200' + (isPublished ? ' border-l-2 border-l-primary' : '')}>
      <CardHeader>
        <div className='flex items-center gap-2 mb-2'>
          {paper.category && (
            <Badge variant='secondary' className='rounded-full px-2.5 py-0.5 text-xs font-medium'>
              {paper.category.name}
            </Badge>
          )}
          <StatusBadge status={paper.status} />
        </div>
        <CardTitle className='line-clamp-2 font-serif font-semibold text-lg'>
          <Link href={'/research/' + paper.paperId}>
            {paper.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground line-clamp-3 mb-4'>
          {paper.abstract}
        </p>
        <div className='flex items-center justify-between font-mono text-xs text-muted-foreground'>
          <span>
            {paper.author?.name || 'Unknown Author'}
          </span>
          {paper.publicationDate && (
            <span>
              {new Date(paper.publicationDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<string, { label: string; className: string }> = {
    DRAFT: { label: 'Draft', className: 'bg-gray-100 text-gray-800 border-gray-200' },
    SUBMITTED: { label: 'Submitted', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    UNDER_REVIEW: { label: 'Under Review', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    REVISION_REQUESTED: { label: 'Revision Requested', className: 'bg-orange-100 text-orange-800 border-orange-200' },
    ACCEPTED: { label: 'Accepted', className: 'bg-green-100 text-green-800 border-green-200' },
    PUBLISHED: { label: 'Published', className: 'bg-green-100 text-green-800 border-green-200' },
    REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-800 border-red-200' },
  }

  const variant = variants[status] || { label: status, className: 'bg-gray-100 text-gray-800 border-gray-200' }

  return (
    <Badge className={'rounded-full px-2.5 py-0.5 text-xs font-medium border ' + variant.className}>
      {variant.label}
    </Badge>
  )
}

