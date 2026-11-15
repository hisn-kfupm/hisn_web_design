import { BattlementBand } from '@/components/brand/BattlementBand'
import { SectionMarks } from '@/components/brand/SectionMarks'
import { LinkButton } from '@/components/ui/Buttons'
import { Magnetic } from '@/components/ui/Magnetic'
import { fmtNum } from '@/lib/i18n/number'
import { t } from '@/lib/i18n/t'
import { TalentStage } from './TalentStage'

/* desktop: one full-width course that steps down toward the inline-end like the logo's stepped
   tower: brick ١, brick ٢ one step lower, the CTA one step lower again */
const STEPS = ['lg:col-start-1', 'lg:col-start-5 lg:mt-[var(--step)]']

const PATHS = [
  { title: 'home.talent.path1.title', body: 'home.talent.path1.body' },
  { title: 'home.talent.path2.title', body: 'home.talent.path2.body' },
] as const

/** the line split into words (Arabic words stay whole); the second sentence is the mint accent */
function words(line: string): { text: string; accent: boolean }[] {
  const cut = line.indexOf('.') + 1
  const split = (part: string, accent: boolean) => part.trim().split(/\s+/).filter(Boolean).map((text) => ({ text, accent }))
  return cut > 0 ? [...split(line.slice(0, cut), false), ...split(line.slice(cut), true)] : split(line, false)
}

/**
 * «قاعدة المواهب», the invitation (redesign §5.6), on the deep band. The guide's youthful line is
 * set huge and reveals word by word with scroll; the two ways in are bricks ١ and ٢, and a line
 * draws from brick to brick to the magnetic CTA (TalentStage). Department pages can reuse it.
 */
export function TalentBand({ className }: { className?: string }) {
  return (
    <section data-testid="talent" data-band="dark" aria-labelledby="talent-title" className={`on-dark relative mt-[var(--sq)] bg-deep text-on-dark ${className ?? ''}`}>
      <BattlementBand tone="deep" edge="top" />
      <div aria-hidden="true" className="grain-layer" />
      <div aria-hidden="true" className="talent-glow pointer-events-none absolute inset-0" />
      <TalentStage className="wrap relative pt-20 pb-24 lg:pt-24 lg:pb-20">
        <p className="mb-8 flex items-center gap-3 text-label text-mint-200 lg:mb-10">
          <SectionMarks />
          {t('nav.talent')}
        </p>
        <h2 id="talent-title" data-words className="max-w-[15em] text-[clamp(2.375rem,0.9rem+5.4vw,6.5rem)] leading-[1.28] font-bold text-white">
          {words(t('home.talent.line')).map((w, i) => (
            <span key={i} data-word className={w.accent ? 'text-mint' : undefined}>
              {w.text}{' '}
            </span>
          ))}
        </h2>
        <p className="mt-8 max-w-[36rem] text-[1.0625rem] leading-[1.75] lg:mt-10 lg:text-[1.1875rem]">{t('home.talent.body')}</p>

        <div data-paths className="relative mt-14 [--step:4.5rem] lg:mt-16">
          <h3 className="sr-only">{t('home.talent.paths')}</h3>
          <ol className="relative z-10 m-0 grid list-none items-start gap-6 p-0 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0">
            {PATHS.map((path, i) => (
              <li key={path.title} data-brick className={`talent-brick flex gap-5 p-6 lg:col-span-4 lg:row-start-1 lg:block lg:p-8 ${STEPS[i]}`}>
                <span data-node aria-hidden="true" className="talent-node grid size-14 shrink-0 place-items-center text-[1.625rem] leading-none font-bold">
                  {fmtNum(i + 1)}
                </span>
                <span className="block lg:mt-6">
                  <span className="block text-h2 text-white">{t(path.title)}</span>
                  <span className="mt-2 block text-body">{t(path.body)}</span>
                </span>
              </li>
            ))}
            <li className="ps-[4.75rem] pt-4 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:mt-[calc(var(--step)*2)] lg:ps-0 lg:pt-0">
              <Magnetic>
                <LinkButton href="/talent" tone="dark" size="lg" arrow data-node className="talent-cta min-h-16 px-8 text-[1.125rem]">
                  {t('home.talent.cta')}
                </LinkButton>
              </Magnetic>
            </li>
          </ol>
        </div>
      </TalentStage>
    </section>
  )
}
