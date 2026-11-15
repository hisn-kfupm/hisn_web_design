import Link from 'next/link'
import { RecordingCover } from '@/components/brand/RecordingCover'
import { SectionHead } from '@/components/brand/SectionHead'
import type { PublicEvent } from '@/lib/events/types'
import { formatRiyadh } from '@/lib/time/riyadh'
import { t, type StringKey } from '@/lib/i18n/t'
import { DragStrip } from './DragStrip'

/**
 * «أحدث التسجيلات» (redesign §5.7): a draggable strip of video cards with inertia on the light
 * band. Covers are generated (RecordingCover). Each card links to its place in the library
 * (/library#recording-<id>, where D1-12's cards carry that id and play in place).
 */
export function RecordingsStrip({ number, recordings }: { number: number; recordings: PublicEvent[] }) {
  return (
    <section data-testid="recordings" aria-labelledby="recordings-title" className="overflow-hidden bg-page pt-20 pb-20 lg:pt-28 lg:pb-28">
      <div className="wrap">
        <SectionHead number={number} id="recordings-title" title={t('home.recordings.title')} link={{ href: '/library', label: t('home.recordings.all') }} />
      </div>
      {recordings.length > 0 ? (
        <DragStrip labels={{ prev: t('home.recordings.prev'), next: t('home.recordings.next'), drag: t('home.recordings.drag') }}>
          {recordings.map((event) => (
            <li key={event.id} data-card className="rec-card w-[min(78vw,20rem)] shrink-0 sm:w-[21rem] lg:w-[24rem]">
              <article className="group relative">
                <div className="rec-tilt">
                  <RecordingCover id={event.id} departmentCode={event.departmentCode} />
                  <div className="border-t-4 border-teal bg-white px-5 pt-4 pb-5">
                    {event.departmentCode && <p className="text-label text-accent-strong">{t(`dept.${event.departmentCode}.title` as StringKey)}</p>}
                    <h3 className="mt-1.5 line-clamp-2 min-h-[3em] text-[1.125rem] leading-[1.5] font-bold">
                      <Link href={`/library#recording-${event.id}`} draggable={false} className="text-deep no-underline after:absolute after:inset-0">
                        <span className="draw-line pb-0.5">{event.title}</span>
                      </Link>
                    </h3>
                    <p className="mt-2 flex items-center justify-between gap-3 text-small text-muted">
                      <span>{formatRiyadh(event.startsAt, 'date')}</span>
                      <span className="font-semibold text-teal">{t('event.watchRecording')}</span>
                    </p>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </DragStrip>
      ) : (
        <p className="wrap text-muted">{t('home.recordings.none')}</p>
      )}
    </section>
  )
}
