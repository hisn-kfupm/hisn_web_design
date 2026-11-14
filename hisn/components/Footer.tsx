import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { BattlementBand } from '@/components/brand/BattlementBand'
import { Bdi } from '@/components/Bdi'
import { CONTACT_EMAIL } from '@/lib/config/contact'
import { t } from '@/lib/i18n/t'

/**
 * Site footer (dev-1 D1-5): the wall's dark base with a battlement top edge, the official
 * description, the approved closing line, privacy and contact. D1-6 adds <NewsletterForm/> in its slot.
 */
export function Footer() {
  return (
    <footer className="on-dark relative mt-24 bg-deep text-on-dark">
      <BattlementBand tone="deep" edge="top" />
      <div className="wrap grid gap-8 pt-14 pb-10 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <Logo tone="reversed" height={48} idPrefix="footer" title={t('brand.name')} />
          <p className="mt-5 mb-3 max-w-[26em] text-h3 font-bold text-white">{t('brand.closing')}</p>
          <p className="max-w-[36rem] text-small">{t('brand.about')}</p>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          {/* D1-6: <NewsletterForm /> (the alert list) goes here */}
          <nav aria-label={t('footer.nav')}>
            <ul className="m-0 list-none space-y-1 p-0 text-small">
              <li>
                <Link href="/privacy" className="inline-flex min-h-11 items-center text-mint underline-offset-4 hover:underline">{t('footer.privacy')}</Link>
              </li>
              <li className="flex min-h-11 flex-wrap items-center gap-x-2">
                <span>{t('footer.contact')}</span>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-mint underline underline-offset-4">
                  <Bdi lang="en">{CONTACT_EMAIL}</Bdi>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
