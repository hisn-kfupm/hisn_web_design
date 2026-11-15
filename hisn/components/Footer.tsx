import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { SectionMarks } from '@/components/brand/SectionMarks'
import { Bdi } from '@/components/Bdi'
import { primaryNav } from '@/components/nav-items'
import { CONTACT_EMAIL } from '@/lib/config/contact'
import { t } from '@/lib/i18n/t'

/* enough merlons for a 2,700 px wide screen */
const MERLONS = 60

/**
 * Site footer (dev-1 D1-5, redesign §5.8): a fixed deep base that the page lifts off (FooterCurtain).
 * Crenellations on its top edge, the approved closing line set huge across the width, the logo,
 * links and contact. D1-6 adds <NewsletterForm/> in its slot.
 */
export function Footer() {
  const closing = t('brand.closing')
  const quoted = closing.startsWith('«') && closing.endsWith('»')
  return (
    <footer data-band="dark" className="curtain-footer on-dark relative overflow-hidden bg-deep-600 text-on-dark">
      {/* crenellations: deep merlons rising into the page colour */}
      <div aria-hidden="true" className="flex h-(--sq) gap-(--sq) overflow-hidden bg-page ps-[calc(var(--sq)/2)]">
        {Array.from({ length: MERLONS }, (_, i) => (
          <span key={i} className="size-(--sq) shrink-0 bg-deep-600" />
        ))}
      </div>
      <div aria-hidden="true" className="grain-layer" />
      <div className="wrap relative pt-14 pb-8 lg:pt-20">
        <p data-closing className="max-w-[17em] text-mega text-balance text-white">
          {quoted ? (
            <>
              <span className="text-mint">«</span>
              {closing.slice(1, -1)}
              <span className="text-mint">»</span>
            </>
          ) : (
            closing
          )}
        </p>
        <div className="mt-12 grid gap-10 border-t border-teal-100/15 pt-10 md:grid-cols-12 lg:mt-16">
          <div className="md:col-span-5">
            <Logo tone="reversed" height={52} idPrefix="footer" title={t('brand.name')} />
            <p className="mt-4 flex items-center gap-3 text-label">
              <SectionMarks />
              {t('brand.university')}
            </p>
          </div>
          <nav aria-label={t('footer.nav')} className="md:col-span-7">
            {/* D1-6: <NewsletterForm /> (the alert list) goes here, above the links */}
            <ul className="m-0 grid list-none gap-x-8 gap-y-1 p-0 sm:grid-cols-2">
              {primaryNav().map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-11 items-center font-semibold text-white no-underline">
                    <span className="draw-line pb-0.5">{item.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacy" className="inline-flex min-h-11 items-center font-semibold text-white no-underline">
                  <span className="draw-line pb-0.5">{t('footer.privacy')}</span>
                </Link>
              </li>
              <li className="flex min-h-11 flex-wrap items-center gap-x-2 sm:col-span-2">
                <span>{t('footer.contact')}</span>
                <a href={`mailto:${CONTACT_EMAIL.toLowerCase()}`} className="font-semibold text-mint no-underline">
                  <span className="draw-line pb-0.5">
                    <Bdi lang="en">{CONTACT_EMAIL.toLowerCase()}</Bdi>
                  </span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
