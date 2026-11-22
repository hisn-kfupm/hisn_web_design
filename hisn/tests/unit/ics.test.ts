import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildIcs } from '@/lib/email/ics'

const event = {
  id: 7,
  title: 'ورشة الأمن السيبراني',
  startsAt: '2026-11-18T15:00:00Z',
  endsAt: '2026-11-18T17:00:00Z',
  location: 'قاعة 1',
  url: 'https://hisn-sa.org/events/7',
}

afterEach(() => {
  vi.useRealTimers()
})

describe('buildIcs', () => {
  it('writes start and end in UTC basic format', () => {
    const ics = buildIcs(event)
    expect(ics).toContain('DTSTART:20261118T150000Z')
    expect(ics).toContain('DTEND:20261118T170000Z')
  })

  it('gives the same event the same UID every time', () => {
    expect(buildIcs(event)).toContain('UID:event-7@hisn-sa.org')
    expect(buildIcs({ ...event, title: 'عنوان معدّل' })).toContain('UID:event-7@hisn-sa.org')
  })

  it('stamps DTSTAMP with the current UTC time', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-11-20T08:30:05Z'))
    expect(buildIcs(event)).toContain('DTSTAMP:20261120T083005Z')
  })

  it('lists the properties in the documented order', () => {
    const names = buildIcs(event)
      .split('\r\n')
      .filter(Boolean)
      .map((line) => line.split(':')[0])
    expect(names).toEqual([
      'BEGIN', 'VERSION', 'PRODID', 'METHOD', 'BEGIN', 'UID', 'DTSTAMP', 'DTSTART', 'DTEND',
      'SUMMARY', 'LOCATION', 'URL', 'END', 'END',
    ])
  })

  it('ends lines with CRLF and leaves no bare LF or CR, even when a value has a newline', () => {
    const ics = buildIcs({ ...event, title: 'سطر\nثانٍ\r\nثالث' })
    expect(ics).toContain('\r\n')
    expect(ics.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/)
  })

  it('escapes commas in text values', () => {
    expect(buildIcs({ ...event, title: 'ورشة, الطائرات' })).toContain('SUMMARY:ورشة\\, الطائرات')
  })

  it('escapes backslashes, semicolons and newlines in text values', () => {
    expect(buildIcs({ ...event, title: 'a\\b;c\nd' })).toContain('SUMMARY:a\\\\b\\;c\\nd')
  })

  it('uses the event page as the location when there is none', () => {
    expect(buildIcs({ ...event, location: null, url: 'https://hisn-sa.org/events/7' })).toContain(
      'LOCATION:https://hisn-sa.org/events/7',
    )
  })

  it('folds lines over 75 octets without splitting a letter', () => {
    const title = 'ورشة الطائرات المسيّرة وأنظمة الدفاع الجوي في المملكة العربية السعودية'
    const ics = buildIcs({ ...event, title })
    for (const line of ics.split('\r\n')) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75)
    expect(ics).not.toContain('�')
    expect(ics.replace(/\r\n /g, '')).toContain(`SUMMARY:${title}\r\n`)
  })
})
