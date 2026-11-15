import { HeroStage } from './HeroStage'
import { NextEventBrick } from './NextEventBrick'
import { majors } from '@/lib/data/labels'
import type { PublicEvent } from '@/lib/events/types'
import { pluralForms } from '@/lib/i18n/plural'
import { t } from '@/lib/i18n/t'

/**
 * Home hero «الجدار الحي» (redesign §5.1). A server component: it resolves every string and the
 * majors here and hands serialisable props to the client stage, so ar.json never ships to the
 * browser. The next event is server-rendered and passed in as the stage's child.
 */
export function Hero({ next }: { next: PublicEvent | null }) {
  const slogan = t('brand.slogan')
  const accent = t('hero.accentWord')
  const at = slogan.indexOf(accent)
  const lines: [string, string, string] =
    at < 0 ? [slogan, '', ''] : [slogan.slice(0, at).trim(), accent, slogan.slice(at + accent.length).trim()]

  return (
    <HeroStage
      lines={lines}
      kicker={t('brand.university')}
      about={t('brand.about')}
      majors={majors.filter((m) => m.code !== 'OTHER').map(({ code, ar, en }) => ({ code, ar, en }))}
      search={{
        label: t('hero.search.label'),
        placeholder: t('hero.search.placeholder'),
        placeholderShort: t('hero.search.placeholderShort'),
        clear: t('hero.search.clear'),
        results: t('hero.search.results'),
        counts: pluralForms('hero.search.count'),
        found: t('hero.pulled.found', { name: '{name}' }),
      }}
      pulled={{
        title: t('hero.pulled.title'),
        events: t('hero.pulled.events'),
        departments: t('hero.pulled.departments'),
        close: t('hero.pulled.close'),
      }}
    >
      <NextEventBrick event={next} />
    </HeroStage>
  )
}
