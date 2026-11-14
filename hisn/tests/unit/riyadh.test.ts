import { describe, expect, it } from 'vitest'
import { formatRiyadh, riyadhDateKey, riyadhMonth } from '@/lib/time/riyadh'

describe('riyadhDateKey', () => {
  it('keeps the date while it is still the same day in Riyadh (UTC+3)', () => {
    expect(riyadhDateKey('2026-11-30T20:30:00Z')).toBe('2026-11-30')
  })

  it('moves to the next day once Riyadh passes midnight', () => {
    expect(riyadhDateKey('2026-11-30T21:30:00Z')).toBe('2026-12-01')
    expect(riyadhDateKey('2026-11-30T21:00:00Z')).toBe('2026-12-01')
    expect(riyadhDateKey('2026-11-30T20:59:59Z')).toBe('2026-11-30')
  })

  it('zero-pads month and day', () => {
    expect(riyadhDateKey('2027-01-04T09:00:00Z')).toBe('2027-01-04')
  })
})

describe('riyadhMonth', () => {
  it('uses the Riyadh date, so the month can roll over', () => {
    expect(riyadhMonth('2026-11-30T21:30:00Z')).toBe('2026-12')
    expect(riyadhMonth('2026-11-30T20:30:00Z')).toBe('2026-11')
  })
})

describe('formatRiyadh', () => {
  it('shows the time in Riyadh, not UTC', () => {
    const time = formatRiyadh('2026-11-18T15:00:00Z', 'time')
    expect(time).toContain('6:00')
    expect(time).not.toContain('15:00')
  })

  it('uses the Gregorian calendar, not the Hijri default of ar-SA', () => {
    const date = formatRiyadh('2026-11-18T15:00:00Z', 'date')
    expect(date).toContain('18')
    expect(date).toContain('2026')
    expect(date).not.toContain('1448')
  })

  it('names the month in Arabic', () => {
    expect(formatRiyadh('2026-11-18T15:00:00Z', 'date')).toContain('نوفمبر')
  })

  it('combines date and time for datetime', () => {
    const both = formatRiyadh('2026-11-18T15:00:00Z', 'datetime')
    expect(both).toContain('18')
    expect(both).toContain('2026')
    expect(both).toContain('6:00')
  })

  it('uses the Riyadh date near midnight', () => {
    expect(formatRiyadh('2026-11-30T21:30:00Z', 'date')).toContain('ديسمبر')
  })
})
