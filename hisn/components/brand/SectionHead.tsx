import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
import { fmtNum } from '@/lib/i18n/number'
import { SectionMarks } from './SectionMarks'
import { SectionNumber } from './SectionNumber'

type Props = {
  number: number
  /** id of the h2, for the section's aria-labelledby */
  id: string
  title: ReactNode
  /** "see all" link at the end of the row */
  link?: { href: string; label: string }
}

/** Numbered section heading (guide: number in a green square, title, ■■■), with a hairline under it. */
export function SectionHead({ number, id, title, link }: Props) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-x-3.5 gap-y-2 border-b border-line pb-4">
      <SectionNumber>{fmtNum(number, { minimumIntegerDigits: 2 })}</SectionNumber>
      <h2 id={id} className="text-h2 text-heading">{title}</h2>
      <SectionMarks />
      {link && (
        <Link href={link.href} className="ms-auto inline-flex min-h-11 items-center gap-1.5 font-semibold text-teal underline-offset-4 hover:underline">
          {link.label}
          <Icon icon={ChevronRight} mirror size={18} />
        </Link>
      )}
    </div>
  )
}
