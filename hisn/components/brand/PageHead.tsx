import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { BattlementBand } from './BattlementBand'
import { SectionMarks } from './SectionMarks'

type Props = {
  kicker?: ReactNode
  /** large figure above the title (e.g. ٤٠٤), set in the 72 px figure style */
  figure?: ReactNode
  title: ReactNode
  /** 'display' for the home hero, 'h1' for inner pages */
  size?: 'display' | 'h1'
  children?: ReactNode
  /** lay the battlement band in on load (home hero only) */
  animateBand?: boolean
  className?: string
}

/**
 * The top of every page: it continues the header's gradient plate (same canvas, offset by the
 * header height) and ends in the battlement band, so the light content reads as the top of the wall.
 */
export function PageHead({ kicker, figure, title, size = 'h1', children, animateBand = false, className }: Props) {
  return (
    <section className={cn('bg-brand on-dark relative text-white [background-position:0_calc(var(--header-h)*-1)]', className)}>
      <div className="wrap pt-8 pb-[calc(var(--sq)+3.5rem)] lg:pt-14 lg:pb-[calc(var(--sq)+5rem)]">
        {kicker && (
          <p className="mb-5 flex items-center gap-3 text-label text-on-dark">
            <SectionMarks />
            {kicker}
          </p>
        )}
        {figure && <p aria-hidden="true" className="mb-2 text-figure text-white">{figure}</p>}
        <h1 className={cn('max-w-[11.5em] text-balance', size === 'display' ? 'text-display' : 'text-h1')}>{title}</h1>
        {children}
      </div>
      <BattlementBand tone="page" edge="bottom" animate={animateBand} />
    </section>
  )
}
