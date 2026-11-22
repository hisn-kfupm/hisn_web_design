/*
  The calendar file attached to confirmation, "you have a seat" and change emails (spec §10.1).
  The UID is fixed per event, so the file sent after a change updates the entry already in the
  calendar instead of adding a second one. Times are UTC; calendars show them in local time.
*/

export function buildIcs(e: {
  id: number
  title: string
  startsAt: string
  endsAt: string
  location: string | null
  url: string
}): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hisn//Events//AR',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:event-${e.id}@hisn-sa.org`,
    `DTSTAMP:${utc(new Date())}`,
    `DTSTART:${utc(new Date(e.startsAt))}`,
    `DTEND:${utc(new Date(e.endsAt))}`,
    `SUMMARY:${text(e.title)}`,
    `LOCATION:${text(e.location ?? e.url)}`,
    `URL:${e.url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  // RFC 5545 ends every line, the last one included, with CRLF
  return lines.map(fold).join('\r\n') + '\r\n'
}

/** a Date in UTC basic format, e.g. 20261118T150000Z (throws on an invalid date) */
const utc = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')

/** a TEXT value with backslashes, commas, semicolons and newlines escaped (RFC 5545 §3.3.11) */
const text = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/[,;]/g, '\\$&').replace(/\r\n|\r|\n/g, '\\n')

const utf8 = new TextEncoder()

/** RFC 5545 §3.1: a line over 75 octets continues after CRLF + space, never inside a character */
function fold(line: string): string {
  const parts: string[] = []
  let part = ''
  let size = 0
  for (const ch of line) {
    const n = utf8.encode(ch).length
    if (size + n > (parts.length === 0 ? 75 : 74)) {
      parts.push(part)
      part = ''
      size = 0
    }
    part += ch
    size += n
  }
  parts.push(part)
  return parts.join('\r\n ')
}
