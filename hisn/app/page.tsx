import { cacheLife } from 'next/cache'
import { DepartmentCard } from '@/components/DepartmentCard'
import { EventCard } from '@/components/EventCard'
import { Hero } from '@/components/Hero'
import { TalentInvite } from '@/components/TalentInvite'
import { SectionHead } from '@/components/brand/SectionHead'
import { departments } from '@/lib/data/labels'
import { latestRecordings, upcomingEvents } from '@/lib/events/queries'
import { t } from '@/lib/i18n/t'

/*
  Homepage (dev-1 D1-8; discovery §7 Direction A, homepage bands). The majors wall (signature 1)
  lands in D1-18 and the Hisnathon brick behind its flag; the alert-list form is in the footer (D1-6).

  Cached for an hour. dev-1 says `export const revalidate = 3600`, but this app runs with Cache
  Components, which rejects that export; 'use cache' + cacheLife('hours') is the replacement
  (revalidate 1 h). Admin saves can still call revalidatePath('/').
*/
export default async function Home() {
  'use cache'
  cacheLife('hours')

  const [upcoming, recordings] = await Promise.all([upcomingEvents({ limit: 3 }), latestRecordings({ limit: 3 })])

  return (
    <>
      <Hero next={upcoming[0] ?? null} />

      <section data-testid="upcoming" aria-labelledby="upcoming-title" className="wrap pt-16 lg:pt-20">
        <SectionHead number={1} id="upcoming-title" title={t('home.events.title')} link={{ href: '/events', label: t('home.events.all') }} />
        {upcoming.length > 0 ? (
          <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {upcoming.map((event) => (
              <li key={event.id}>
                <EventCard event={event} variant="upcoming" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">{t('home.events.none')}</p>
        )}
      </section>

      <section id="departments" data-testid="departments" aria-labelledby="departments-title" className="wrap scroll-mt-6 pt-20">
        <SectionHead number={2} id="departments-title" title={t('home.departments.title')} />
        <p className="-mt-4 mb-8 max-w-[40rem] text-small text-muted">{t('home.departments.intro')}</p>
        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {departments.map((d) => (
            <li key={d.code}>
              <DepartmentCard code={d.code} slug={d.slug} />
            </li>
          ))}
        </ul>
      </section>

      <TalentInvite />

      <section data-testid="recordings" aria-labelledby="recordings-title" className="wrap pt-20">
        <SectionHead number={3} id="recordings-title" title={t('home.recordings.title')} link={{ href: '/library', label: t('home.recordings.all') }} />
        {recordings.length > 0 ? (
          <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {recordings.map((event) => (
              <li key={event.id}>
                <EventCard event={event} variant="recording" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">{t('home.recordings.none')}</p>
        )}
      </section>
    </>
  )
}
