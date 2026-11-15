import { parseMonthParam, showNextBanner } from './month'
import { eventsInMonth, upcomingEvents } from './queries'
import { getSeatsLeft } from './seats'
import type { PublicEvent } from './types'

export type CalendarData = {
  month: string
  events: PublicEvent[]
  /** seats left by event id; null while unknown (no capacity, or seats_left not there yet) */
  seatsLeft: Map<number, number | null>
  /** the next upcoming event, only when no event of the month is still ahead */
  next: PublicEvent | null
}

/** everything /events renders for ?m= (dev-1 D1-10); live seats, so call it at request time */
export async function loadCalendar(m: string | undefined, now: Date): Promise<CalendarData> {
  const month = parseMonthParam(m, now)
  const events = await eventsInMonth(month)
  const lefts = await Promise.all(events.map((e) => getSeatsLeft(e.id)))
  const next = showNextBanner(events, now.getTime()) ? ((await upcomingEvents({ limit: 1 }))[0] ?? null) : null
  return { month, events, seatsLeft: new Map(events.map((e, i) => [e.id, lefts[i]])), next }
}
