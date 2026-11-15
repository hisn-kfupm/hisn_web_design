import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
import { deptIcon } from '@/lib/data/dept-icons'
import { t, type StringKey } from '@/lib/i18n/t'

/** A department as a brick: icon, name, one-line summary, and a chevron toward its page. */
export function DepartmentCard({ code, slug }: { code: string; slug: string }) {
  return (
    <Link
      href={`/departments/${slug}`}
      className="group relative flex h-full items-start gap-4 border border-line bg-white p-5 text-deep no-underline hover:border-teal"
    >
      <span className="grid size-12 shrink-0 place-items-center bg-box text-teal">
        <Icon icon={deptIcon(code)} size={24} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-h3 group-hover:underline">{t(`dept.${code}.title` as StringKey)}</span>
        <span className="mt-1 block text-small text-muted">{t(`dept.${code}.summary` as StringKey)}</span>
      </span>
      <Icon
        icon={ChevronRight}
        mirror
        className="mt-1 text-teal transition-transform duration-200 ease-brand group-hover:translate-x-[calc(var(--dir)*2px)]"
      />
    </Link>
  )
}
