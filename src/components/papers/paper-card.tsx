import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Paper } from '@/types'

interface PaperCardProps {
  paper: Paper
}

export function PaperCard({ paper }: PaperCardProps) {
  return (
    <Card className='hover:shadow-lg transition-shadow'>
      <CardHeader>
        <div className='flex items-center gap-2 mb-2'>
          {paper.category && (
            <Badge variant='secondary' className='text-xs'>
              {paper.category.name}
            </Badge>
          )}
          <StatusBadge status={paper.status} />
        </div>
        <CardTitle className='line-clamp-2 text-lg'>
          <Link href={'/research/' + paper.paperId}>
            {paper.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground line-clamp-3 mb-4'>
          {paper.abstract}
        </p>
        <div className='flex items-center justify-between text-sm'>
          <span className='text-muted-foreground'>
            {paper.author?.name || 'Unknown Author'}
          </span>
          {paper.publicationDate && (
            <span className='text-muted-foreground'>
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
    DRAFT: { label: 'Draft', className: 'bg-gray-100 text-gray-800' },
    SUBMITTED: { label: 'Submitted', className: 'bg-blue-100 text-blue-800' },
    UNDER_REVIEW: { label: 'Under Review', className: 'bg-yellow-100 text-yellow-800' },
    REVISION_REQUESTED: { label: 'Revision Requested', className: 'bg-orange-100 text-orange-800' },
    ACCEPTED: { label: 'Accepted', className: 'bg-green-100 text-green-800' },
    PUBLISHED: { label: 'Published', className: 'bg-green-100 text-green-800' },
    REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
  }

  const variant = variants[status] || { label: status, className: 'bg-gray-100 text-gray-800' }

  return (
    <Badge className={'text-xs ' + variant.className}>
      {variant.label}
    </Badge>
  )
}

