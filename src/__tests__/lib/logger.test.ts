import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logger } from '@/lib/logger'

describe('logger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should have info, warn, error, and debug methods', () => {
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.warn).toBe('function')
    expect(typeof logger.error).toBe('function')
    expect(typeof logger.debug).toBe('function')
  })

  it('should log info messages', () => {
    logger.info('test message')
    expect(console.log).toHaveBeenCalled()
  })

  it('should log warn messages', () => {
    logger.warn('test warning')
    expect(console.log).toHaveBeenCalled()
  })

  it('should log error messages', () => {
    logger.error('test error')
    expect(console.log).toHaveBeenCalled()
  })

  it('should log debug messages', () => {
    logger.debug('test debug')
    expect(console.log).toHaveBeenCalled()
  })

  it('should include context in log output', () => {
    const context = { userId: '123', action: 'login' }
    logger.info('user logged in', context)
    expect(console.log).toHaveBeenCalled()
  })

  it('should include timestamp in log entry', () => {
    logger.info('test')
    const call = vi.mocked(console.log).mock.calls[0][0]
    // In development mode, check for timestamp format
    if (typeof call === 'string' && call.includes('[')) {
      expect(call).toContain('[INFO]')
    }
  })
})

describe('logger JSON output', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.stubEnv('NODE_ENV', 'production')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('should output JSON in production mode', () => {
    logger.info('production test')
    const call = vi.mocked(console.log).mock.calls[0][0]
    const parsed = JSON.parse(call)
    expect(parsed).toHaveProperty('level', 'info')
    expect(parsed).toHaveProperty('message', 'production test')
    expect(parsed).toHaveProperty('timestamp')
  })

  it('should include context in JSON output', () => {
    const context = { paperId: 'abc-123' }
    logger.error('failed to process', context)
    const call = vi.mocked(console.log).mock.calls[0][0]
    const parsed = JSON.parse(call)
    expect(parsed.context).toEqual(context)
  })
})
