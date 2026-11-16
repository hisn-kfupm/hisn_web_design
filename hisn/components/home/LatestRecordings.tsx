import Link from 'next/link'
import { Play } from 'lucide-react'
import { SectionHead } from '@/components/brand/SectionHead'
import { Photo } from '@/components/ui/Photo'
import { eventCover } from '@/lib/data/images'
import type { PublicEvent } from '@/lib/events/types'
import { formatRiyadh } from '@/lib/time/riyadh'
import { t, type StringKey } from '@/lib/i18n/t'

/**
 * «أحدث التسجيلات» (revision 04 §4.5): the four latest recordings as video thumbnails (a photo and
 * a mint play square), each one link to its place in the library (/library#recording-<id>, where
 * the library's cards carry that id), plus «المكتبة». Two columns on phones, four on desktop.
 */
export function LatestRecordings({ number, recordings }: { number: number; recordings: PublicEvent[] }) {
  return (
    <section data-testid="recordings" aria-labelledby="recordings-title" className="bg-page py-14 lg:py-20">
      <div className="wrap">
        <SectionHead number={number} id="recordings-title" title={t('home.recordings.title')} link={{ href: '/library', label: t('home.recordings.all') }} />
        {recordings.length > 0 ? (
          <ul className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-7 p-0 lg:grid-cols-4 lg:gap-x-6">
            {recordings.map((event) => (
              <li key={event.id}>
                <article className="group relative">
                  <div className="relative">
                    <Photo image={eventCover(event)} alt="" ratio="16/9" sizes="(min-width: 1024px) 285px, 45vw" />
                    <span aria-hidden="true" className="rec-play absolute start-0 bottom-0 z-10 grid size-11 place-items-center bg-mint text-deep lg:size-12">
                      <Play focusable="false" strokeWidth={2} className="size-5 fill-current" />
                    </span>
                  </div>
                  {event.departmentCode && <p className="mt-3 text-label text-accent-strong">{t(`dept.${event.departmentCode}.title` as StringKey)}</p>}
                  <h3 className="mt-1 line-clamp-2 text-[1rem] leading-[1.55] font-bold lg:text-[1.0625rem]">
                    <Link href={`/library#recording-${event.id}`} className="text-deep no-underline after:absolute after:inset-0 after:z-20">
                      <span className="draw-line pb-0.5">{event.title}</span>
                    </Link>
                  </h3>
                  <p className="mt-1 text-small text-muted">{formatRiyadh(event.startsAt, 'date')}</p>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">{t('home.recordings.none')}</p>
        )}
      </div>
    </section>
  )
}
