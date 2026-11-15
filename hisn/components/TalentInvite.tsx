import Link from 'next/link'
import { BattlementBand } from '@/components/brand/BattlementBand'
import { SectionMarks } from '@/components/brand/SectionMarks'
import { buttonClass } from '@/components/ui/button'
import { fmtNum } from '@/lib/i18n/number'
import { t } from '@/lib/i18n/t'

const PATHS = [
  { title: 'home.talent.path1.title', body: 'home.talent.path1.body' },
  { title: 'home.talent.path2.title', body: 'home.talent.path2.body' },
] as const

/**
 * Talent invitation on the deep band: a short line, the two ways in (committee paths a and b:
 * attend an event, or join directly and attend one to stay) as numbered bricks, and the link.
 */
export function TalentInvite() {
  return (
    <section data-testid="talent" aria-labelledby="talent-title" className="on-dark relative mt-28 bg-deep text-on-dark">
      <BattlementBand tone="deep" edge="top" />
      <div className="wrap grid gap-10 py-14 lg:grid-cols-12 lg:gap-6 lg:py-20">
        <div className="lg:col-span-6">
          <p className="mb-4 flex items-center gap-3 text-label">
            <SectionMarks />
            {t('nav.talent')}
          </p>
          <h2 id="talent-title" className="text-h2 text-white">{t('home.talent.title')}</h2>
          <p className="mt-4 max-w-[34rem]">{t('home.talent.body')}</p>
          <Link href="/talent" className={buttonClass({ tone: 'dark', block: true, className: 'mt-8 sm:w-auto' })}>
            {t('home.talent.cta')}
          </Link>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:self-center">
          <h3 className="sr-only">{t('home.talent.paths')}</h3>
          <ol className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-1">
            {PATHS.map((path, i) => (
              <li key={path.title} className="flex gap-4 border-t-2 border-mint bg-mid p-5">
                <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center bg-mint text-[1.1875rem] leading-none font-bold text-deep">
                  {fmtNum(i + 1)}
                </span>
                <span>
                  <span className="block text-h3 text-white">{t(path.title)}</span>
                  <span className="mt-1 block text-small">{t(path.body)}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
