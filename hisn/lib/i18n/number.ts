import { RIYADH_LOCALE } from '@/lib/time/riyadh'

const formats = new Map<string, Intl.NumberFormat>()

/**
 * A number for display, in the same digits as dates and times (discovery G-8 `fmtNum`).
 * Latin until open question Q1 is settled; switching RIYADH_LOCALE to `nu-arab` changes both.
 */
export function fmtNum(n: number, options: Intl.NumberFormatOptions = {}): string {
  const key = JSON.stringify(options)
  let format = formats.get(key)
  if (!format) {
    format = new Intl.NumberFormat(RIYADH_LOCALE, options)
    formats.set(key, format)
  }
  return format.format(n)
}
