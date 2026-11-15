import Link from 'next/link'
import { SectionMarks } from '@/components/brand/SectionMarks'
import { ArrowGlyph } from '@/components/ui/ArrowGlyph'
import type { PublicEvent } from '@/lib/events/types'
import { formatRiyadh, formatRiyadhTimeRange } from '@/lib/time/riyadh'
import { t, type StringKey } from '@/lib/i18n/t'

/**
 * The next event as a raised brick set into the hero wall (redesign §5.1): the day as a big
 * figure, the month and time, the title (a stretched link), the department.
 */
export function NextEventBrick({ event }: { event: PublicEvent | null }) {
  return (
    <aside
      data-testid="next-event"
      aria-labelledby="next-event-label"
      className="group relative border-t-4 border-mint bg-teal-800 p-5 text-white shadow-[0_22px_40px_-16px_rgb(0_8_10/0.85),inset_0_1px_0_rgb(255_255_255/0.07)] lg:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="next-event-label" className="text-label text-mint-200">{t('home.next.label')}</h2>
        <SectionMarks />
      </div>
      {event ? (
        <>
          <div aria-hidden="true" className="mt-3 flex items-end gap-4">
            <span className="text-[4.25rem] leading-[1.05] font-bold text-white">{formatRiyadh(event.startsAt, 'day')}</span>
            <p className="mb-2 leading-[1.45]">
              <span className="block text-[1.1875rem] font-semibold">{formatRiyadh(event.startsAt, 'monthYear')}</span>
              <span className="text-small text-on-dark">
                {formatRiyadh(event.startsAt, 'weekday')} · {formatRiyadhTimeRange(event.startsAt, event.endsAt)}
              </span>
            </p>
          </div>
          <h3 className="mt-3 text-[1.1875rem] leading-[1.45] font-semibold text-white">
            <Link href={`/events/${event.id}`} className="text-white no-underline after:absolute after:inset-0">
              <span className="draw-line pb-0.5">{event.title}</span>
              <span className="sr-only">{`، ${formatRiyadh(event.startsAt, 'datetime')}`}</span>
            </Link>
          </h3>
          {event.departmentCode && <p className="mt-1 text-label text-mint-200">{t(`dept.${event.departmentCode}.title` as StringKey)}</p>}
          <p aria-hidden="true" className="mt-3 inline-flex min-h-8 items-center gap-2 font-semibold text-white">
            {t('event.card.details')}
            <ArrowGlyph />
          </p>
        </>
      ) : (
        <p className="mt-3 text-on-dark">{t('home.next.none')}</p>
      )}
    </aside>
  )
}
