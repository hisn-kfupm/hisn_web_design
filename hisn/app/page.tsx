import { PageHead } from '@/components/brand/PageHead'
import { t } from '@/lib/i18n/t'

/* Placeholder until D1-8 builds the homepage; it already uses the hero plate and signature 2. */
export default function Home() {
  return (
    <PageHead size="display" animateBand kicker={t('home.placeholder.kicker')} title={t('brand.slogan')}>
      <p className="mt-5 max-w-[34rem] text-on-dark">{t('brand.about')}</p>
      <p className="mt-6 text-label text-mint-200">{t('home.placeholder.body')}</p>
    </PageHead>
  )
}
