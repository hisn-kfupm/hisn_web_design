import { SectionHead } from '@/components/brand/SectionHead'
import { departments } from '@/lib/data/labels'
import { Icon } from '@/components/ui/Icon'
import { deptIcon } from '@/lib/data/dept-icons'
import { fmtNum } from '@/lib/i18n/number'
import { t, type StringKey } from '@/lib/i18n/t'
import { DeptIndex } from './DeptIndex'

/**
 * «الأقسام» (redesign §5.5): a numbered index of the six departments beside a sticky preview
 * panel on desktop; an accordion on phones. The icons are rendered here (server) and handed to
 * the client index as elements, so lucide's code stays on the server.
 */
export function Departments({ number }: { number: number }) {
  const items = departments.map((d, i) => {
    return {
      code: d.code,
      slug: d.slug,
      n: fmtNum(i + 1, { minimumIntegerDigits: 2 }),
      title: t(`dept.${d.code}.title` as StringKey),
      summary: t(`dept.${d.code}.summary` as StringKey),
      icon: <Icon icon={deptIcon(d.code)} size={48} className="block size-full" />,
    }
  })
  return (
    <section id="departments" data-testid="departments" aria-labelledby="departments-title" className="relative scroll-mt-6 bg-box pt-16 pb-20 lg:pt-24 lg:pb-28">
      <div className="wrap">
        <SectionHead number={number} id="departments-title" title={t('home.departments.title')} intro={t('home.departments.intro')} />
        <DeptIndex items={items} labels={{ toggle: t('home.departments.toggle', { name: '{name}' }), visit: t('home.departments.visit') }} />
      </div>
    </section>
  )
}
