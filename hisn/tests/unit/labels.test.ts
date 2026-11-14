import { describe, expect, it } from 'vitest'
import { departments, label, labelEn, majors } from '@/lib/data/labels'

describe('labels', () => {
  it('maps codes to Arabic and English', () => {
    expect(label('majors', 'OTHER')).toBe('أخرى')
    expect(label('levels', 'PHD')).toBe('دكتوراه')
    expect(labelEn('levels', 'BACHELOR')).toBe("Bachelor's")
  })
  it('throws on unknown codes', () => {
    expect(() => label('majors', 'NOPE')).toThrow('unknown code NOPE')
  })
  it('keeps OTHER last', () => {
    expect(majors[majors.length - 1].code).toBe('OTHER')
  })
  it('has unique department codes and clean slugs', () => {
    expect(new Set(departments.map((d) => d.code)).size).toBe(departments.length)
    for (const d of departments) expect(d.slug).toMatch(/^[a-z0-9-]+$/)
  })
})
