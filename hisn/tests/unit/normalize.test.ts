import { describe, expect, it } from 'vitest'
import { normalizeEmail } from '@/lib/email/normalize'

describe('normalizeEmail', () => {
  it('trims and lowercases', () => {
    expect(normalizeEmail('  Ali@KFUPM.edu.SA ')).toBe('ali@kfupm.edu.sa')
  })
})
