import type { ReactNode } from 'react'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { cn } from '@/lib/cn'
import { fmtNum } from '@/lib/i18n/number'
import { SectionMarks } from './SectionMarks'
import { SectionNumber } from './SectionNumber'

type Props = {
  number: number
  /** id of the h2, for the section's aria-labelledby */
  id: string
  title: ReactNode
  /** one line under the title */
  intro?: ReactNode
  /** "see all" link at the end of the row */
  link?: { href: string; label: string }
  /** 'dark' on deep/mid bands */
  tone?: 'light' | 'dark'
  className?: string
}

/**
 * Numbered section heading (redesign): the green square ٠١ and ■■■ above a big bold title, with an
 * optional intro line and a "see all" ArrowLink on the row's inline-end.
 */
export function SectionHead({ number, id, title, intro, link, tone = 'light', className }: Props) {
  return (
    <div className={cn('mb-10 lg:mb-14', className)}>
      <div className="flex items-center gap-4">
        <SectionNumber size="lg">{fmtNum(number, { minimumIntegerDigits: 2 })}</SectionNumber>
        <SectionMarks size="lg" />
      </div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
        <div className="max-w-[44rem]">
          <h2 id={id} className={cn('text-[clamp(2rem,1.25rem+2.9vw,3.75rem)] leading-[1.2] font-bold text-balance', tone === 'dark' ? 'text-white' : 'text-heading')}>
            {title}
          </h2>
          {intro && <p className={cn('mt-3 text-body', tone === 'dark' ? 'text-on-dark' : 'text-muted')}>{intro}</p>}
        </div>
        {link && (
          <ArrowLink href={link.href} tone={tone} className="text-[1.0625rem]">
            {link.label}
          </ArrowLink>
        )}
      </div>
    </div>
  )
}
