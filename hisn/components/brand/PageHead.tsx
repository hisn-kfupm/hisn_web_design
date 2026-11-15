import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { SectionMarks } from './SectionMarks'
import { WallStrip } from './WallStrip'

type Props = {
  kicker?: ReactNode
  /** large figure above the title (e.g. ٤٠٤) */
  figure?: ReactNode
  title: ReactNode
  /** 'display' for big heads, 'title' for long display titles (an event), 'h1' for inner pages */
  size?: 'display' | 'title' | 'h1'
  children?: ReactNode
  className?: string
}

/**
 * The dark head of every inner page (redesign §6): the official gradient under the fixed header,
 * grain, and a strip of the wall with its crenellations along the bottom. data-band="dark" keeps
 * the header transparent over it.
 */
export function PageHead({ kicker, figure, title, size = 'h1', children, className }: Props) {
  return (
    <section data-band="dark" className={cn('bg-brand on-dark relative overflow-hidden text-white', className)}>
      <div aria-hidden="true" className="grain-layer" />
      <div className="wrap relative pt-[calc(var(--header-h)+2.5rem)] pb-40 lg:pt-[calc(var(--header-h)+4rem)] lg:pb-44">
        {kicker && (
          <p className="mb-5 flex items-center gap-3 text-label text-on-dark">
            <SectionMarks />
            {kicker}
          </p>
        )}
        {figure && <p aria-hidden="true" className="mb-1 text-[clamp(4.5rem,3rem+6vw,9rem)] leading-[1.1] font-bold text-mint">{figure}</p>}
        <h1 className={cn('max-w-[16em] text-balance', { display: 'text-mega', title: 'text-[clamp(2.125rem,1.1rem+3.7vw,4.5rem)] leading-[1.24] font-bold', h1: 'text-[clamp(2rem,1.3rem+2.6vw,3.5rem)] leading-[1.25] font-bold' }[size])}>{title}</h1>
        {children}
      </div>
      <WallStrip idPrefix="head-wall" />
    </section>
  )
}
