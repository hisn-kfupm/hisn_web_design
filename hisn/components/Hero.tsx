import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BattlementBand } from '@/components/brand/BattlementBand'
import { SectionMarks } from '@/components/brand/SectionMarks'
import { Icon } from '@/components/ui/Icon'
import { buttonClass } from '@/components/ui/button'
import { HERO_IMAGE } from '@/lib/config/content'
import type { PublicEvent } from '@/lib/events/types'
import { formatRiyadh, formatRiyadhTimeRange } from '@/lib/time/riyadh'
import { t, type StringKey } from '@/lib/i18n/t'

/**
 * Home hero (dev-1 D1-8, Direction A «لبنة»): the slogan on the official gradient plate, ending in
 * the battlement band (signature 2). At 1024 px and up the next event sits beside it as a brick.
 *
 * Typographic while HERO_IMAGE is null. dev-1 asks for a quote and attribution (keys hero.quote and
 * hero.attribution); the approved slogan takes their place so no quote is invented (discovery G-14). The gradient is
 * the guide's, not primary → accent (discovery §6 #2).
 */
export function Hero({ next }: { next: PublicEvent | null }) {
  const slogan = t('brand.slogan')
  const accent = t('hero.accentWord')
  const at = slogan.indexOf(accent)

  return (
    <section
      data-testid="hero"
      aria-labelledby="hero-title"
      className="bg-brand on-dark relative text-white [background-position:0_calc(var(--header-h)*-1)]"
    >
      {HERO_IMAGE && (
        // eslint-disable-next-line @next/next/no-img-element -- decorative backdrop under the gradient
        <img src={HERO_IMAGE.src} alt="" className="absolute inset-0 size-full object-cover opacity-20 mix-blend-luminosity" />
      )}
      <div className="wrap relative grid gap-10 pt-8 pb-[calc(var(--sq)+3.5rem)] lg:grid-cols-12 lg:gap-6 lg:pt-14 lg:pb-[calc(var(--sq)+5rem)]">
        <div className="lg:col-span-7 lg:self-center">
          <p className="mb-5 flex items-center gap-3 text-label text-on-dark">
            <SectionMarks />
            {t('brand.university')}
          </p>
          <h1 id="hero-title" className="max-w-[11.5em] text-display text-balance">
            {at < 0 ? (
              slogan
            ) : (
              <>
                {slogan.slice(0, at)}
                <span className="text-mint">{accent}</span>
                {slogan.slice(at + accent.length)}
              </>
            )}
          </h1>
          <p className="mt-5 max-w-[34rem] text-on-dark">{t('brand.about')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/events" className={buttonClass({ tone: 'dark', block: true, className: 'sm:w-auto' })}>
              {t('home.hero.calendar')}
            </Link>
            <Link href="#departments" className={buttonClass({ tone: 'dark', variant: 'secondary', block: true, className: 'sm:w-auto' })}>
              {t('home.hero.departments')}
            </Link>
          </div>
        </div>
        <NextEventBrick event={next} />
      </div>
      <BattlementBand tone="page" edge="bottom" animate />
    </section>
  )
}

/** the next event, as real data: date as a large figure, title, department and a link */
function NextEventBrick({ event }: { event: PublicEvent | null }) {
  return (
    <aside
      data-testid="next-event"
      aria-labelledby="next-event-label"
      className="relative border-t-2 border-mint bg-mid p-6 lg:col-span-4 lg:col-start-9 lg:self-end"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="next-event-label" className="text-label text-mint-200">{t('home.next.label')}</h2>
        <SectionMarks />
      </div>
      {event ? (
        <>
          <div aria-hidden="true" className="flex items-end gap-4">
            <span className="text-figure text-white">{formatRiyadh(event.startsAt, 'day')}</span>
            <p className="mb-1.5 leading-[1.4]">
              <span className="block text-h3">{formatRiyadh(event.startsAt, 'monthYear')}</span>
              <span className="text-small text-on-dark">
                {formatRiyadh(event.startsAt, 'weekday')} · {formatRiyadhTimeRange(event.startsAt, event.endsAt)}
              </span>
            </p>
          </div>
          <h3 className="mt-4 mb-1.5 text-h3 text-white">
            <Link href={`/events/${event.id}`} className="text-white no-underline after:absolute after:inset-0 hover:underline">
              {event.title}
              <span className="sr-only">{`، ${formatRiyadh(event.startsAt, 'datetime')}`}</span>
            </Link>
          </h3>
          {event.departmentCode && <p className="text-label text-mint-200">{t(`dept.${event.departmentCode}.title` as StringKey)}</p>}
          <p aria-hidden="true" className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-white">
            {t('event.card.details')}
            <Icon icon={ArrowRight} mirror size={18} />
          </p>
        </>
      ) : (
        <p className="text-on-dark">{t('home.next.none')}</p>
      )}
    </aside>
  )
}
