/**
 * Times are stored in UTC and shown in Riyadh time (Asia/Riyadh, UTC+3 all year).
 *
 * Digits: Latin, as dev-1 D1-7 specifies. The brand guide asks for Arabic-Indic digits (٠١٢٣);
 * that is open question Q1 in design/01-discovery.md. If it is accepted, change `nu-latn` to
 * `nu-arab` here and update the digit expectations in tests/unit/riyadh.test.ts.
 */
export const RIYADH_LOCALE = 'ar-SA-u-ca-gregory-nu-latn' // Gregorian calendar, Latin digits

const TIME_ZONE = 'Asia/Riyadh'

/** machine key, never shown: en-CA gives year, month and day as numbers */
const keyFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const STYLES = {
  date: { day: 'numeric', month: 'long', year: 'numeric' },
  time: { hour: 'numeric', minute: '2-digit' },
  datetime: { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' },
  // parts of the event card's date block and the hero's next-event brick
  day: { day: 'numeric' },
  month: { month: 'long' },
  weekday: { weekday: 'long' },
  monthYear: { month: 'long', year: 'numeric' },
} satisfies Record<string, Intl.DateTimeFormatOptions>

type Style = keyof typeof STYLES

const formats = new Map<Style, Intl.DateTimeFormat>()
const formatFor = (style: Style) => {
  let format = formats.get(style)
  if (!format) {
    format = new Intl.DateTimeFormat(RIYADH_LOCALE, { timeZone: TIME_ZONE, ...STYLES[style] })
    formats.set(style, format)
  }
  return format
}

/** 'YYYY-MM-DD' of the instant in Riyadh, e.g. for grouping events by day */
export function riyadhDateKey(utcIso: string): string {
  const parts = Object.fromEntries(keyFormat.formatToParts(new Date(utcIso)).map((p) => [p.type, p.value]))
  return `${parts.year}-${parts.month}-${parts.day}`
}

/** 'YYYY-MM' of the instant in Riyadh, e.g. for the calendar's month pages */
export function riyadhMonth(utcIso: string): string {
  return riyadhDateKey(utcIso).slice(0, 7)
}

/** for display: «18 نوفمبر 2026», «6:00 م», both, or one part («18», «نوفمبر», «الأربعاء», «نوفمبر 2026») */
export function formatRiyadh(utcIso: string, style: Style): string {
  return formatFor(style).format(new Date(utcIso))
}

/** start–end clock times in Riyadh: «6:00–8:00 م», or «9:00 ص – 8:00 م» when the periods differ */
export function formatRiyadhTimeRange(startIso: string, endIso: string): string {
  return formatFor('time').formatRange(new Date(startIso), new Date(endIso))
}
