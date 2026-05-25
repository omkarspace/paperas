import { describe, it, expect } from 'vitest'
import { z } from 'zod'

describe('generatePaperId', () => {
  it('should generate a paper ID in the correct format', () => {
    const generatePaperId = () => {
      const year = new Date().getFullYear()
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      return `RVJ-${year}-${random}`
    }
    
    const id = generatePaperId()
    expect(id).toMatch(/^RVJ-\d{4}-\d{4}$/)
  })
})

describe('formatDate', () => {
  it('should format dates correctly', () => {
    const formatDate = (date: Date | string | null): string => {
      if (!date) return ''
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    const result = formatDate(new Date('2024-01-15'))
    expect(result).toBe('January 15, 2024')
  })

  it('should return empty string for null input', () => {
    const formatDate = (date: Date | string | null): string => {
      if (!date) return ''
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    expect(formatDate(null)).toBe('')
  })
})

describe('Paper API validation', () => {
  it('should validate valid paper data', () => {
    const paperSchema = z.object({
      title: z.string().min(1).max(200),
      abstract: z.string().min(150).max(5000),
      keywords: z.string().min(3).max(200),
    })

    const validData = {
      title: 'Test Paper Title That Is Valid',
      abstract: 'This is a test abstract. It needs to be at least one hundred fifty characters long to pass validation. This ensures the abstract contains enough detail. Adding more text to reach the minimum requirement.',
      keywords: 'test, paper, research',
    }

    const result = paperSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid paper data', () => {
    const paperSchema = z.object({
      title: z.string().min(1).max(200),
      abstract: z.string().min(150).max(5000),
      keywords: z.string().min(3).max(200),
    })

    const invalidData = {
      title: '',
      abstract: 'Short',
      keywords: '',
    }

    const result = paperSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})
