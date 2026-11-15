import { EventList } from '@/components/EventList'
import { MonthGrid } from '@/components/MonthGrid'
import type { PublicEvent } from '@/lib/events/types'
import { EmptyMonth } from './EmptyMonth'
import { NextEventBanner } from './NextEventBanner'

type Props = {
  month: string
  events: PublicEvent[]
  seatsLeft: Map<number, number | null>
  now: number
  /** the next upcoming event when none of this month's is still ahead (loadCalendar) */
  next: PublicEvent | null
}

/**
 * The calendar's light band: the month grid (md and up) and the day list (below md), or the empty
 * month's short wall; and the next-event banner when the month has nothing left ahead.
 */
export function CalendarView({ month, events, seatsLeft, now, next }: Props) {
  return (
    <section data-testid="calendar" className="bg-page pt-12 pb-20 lg:pt-16 lg:pb-28">
      <div className="wrap">
        {events.length === 0 ? (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-14">
            <EmptyMonth />
            {next && <NextEventBanner event={next} />}
          </div>
        ) : (
          <>
            {next && (
              <div className="mb-12 lg:mb-16 lg:ms-auto lg:max-w-[46rem]">
                <NextEventBanner event={next} />
              </div>
            )}
            <MonthGrid month={month} events={events} seatsLeft={seatsLeft} now={now} />
            <EventList month={month} events={events} seatsLeft={seatsLeft} now={now} />
          </>
        )}
      </div>
    </section>
  )
}
