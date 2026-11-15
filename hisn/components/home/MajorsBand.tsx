import { majors } from '@/lib/data/labels'
import { t } from '@/lib/i18n/t'
import { MajorsMarquee } from './MajorsMarquee'

/**
 * The band of majors (redesign §5.3): two counter-scrolling rows of major names, one solid and one
 * outlined, whose speed follows the scroll. Decorative: the rows are aria-hidden and one sentence
 * says the same thing to screen readers.
 */
export function MajorsBand() {
  const names = majors.filter((m) => m.code !== 'OTHER').map((m) => m.ar)
  // interleave so engineering, science and business mix in both rows
  const rows: [string[], string[]] = [names.filter((_, i) => i % 2 === 0), names.filter((_, i) => i % 2 === 1).reverse()]
  return (
    <div data-testid="majors-band" className="relative overflow-hidden bg-page py-10 lg:py-16">
      <p className="sr-only">{t('home.majors.sr')}</p>
      <MajorsMarquee rows={rows} />
    </div>
  )
}
