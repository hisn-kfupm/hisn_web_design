import { SectionHead } from '@/components/brand/SectionHead'
import type { PublicEvent } from '@/lib/events/types'
import { t } from '@/lib/i18n/t'
import { EventPhotoCard } from './EventPhotoCard'

/**
 * «الفعاليات القادمة» (revision 04 §4.3): three photo cards and «كل الفعاليات». A row of three on
 * desktop; on phones and tablets a native snap row (swipe or scroll, no drag script).
 */
export function UpcomingEvents({ number, events, taken }: { number: number; events: PublicEvent[]; taken: Map<number, number> }) {
  return (
    <section data-testid="upcoming" aria-labelledby="upcoming-title" className="bg-box py-14 lg:py-20">
      <div className="wrap">
        <SectionHead number={number} id="upcoming-title" title={t('home.events.title')} link={{ href: '/events', label: t('home.events.all') }} />
        {events.length > 0 ? (
          <ul className="snap-row m-0 list-none p-0 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0">
            {events.map((event) => (
              <li key={event.id} data-card className="snap-item">
                <EventPhotoCard event={event} taken={taken.get(event.id) ?? null} sizes="(min-width: 1024px) 380px, (min-width: 640px) 360px, 82vw" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">{t('home.events.none')}</p>
        )}
      </div>
    </section>
  )
}
