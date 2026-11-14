import { cn } from '@/lib/cn'

type Props = {
  /** 'page': light squares rising into a dark plate (the top of the wall) · 'deep': dark squares rising into the page */
  tone?: 'page' | 'deep'
  /** which edge of the parent the band sits on; the parent must be `relative` */
  edge?: 'bottom' | 'top'
  /** signature 2: lay the squares in on load (CSS only; static under reduced motion) */
  animate?: boolean
}

/* enough squares for a 2,700 px wide screen at 24 px squares + 24 px gaps */
const SQUARES = 56

/**
 * The guide's band of squares (cover and closing pages, pp. 1 and 20), used as a battlement.
 * Squares are `var(--sq)` (16 px, 24 px from 768 px) with equal gaps. Decorative.
 */
export function BattlementBand({ tone = 'page', edge = 'bottom', animate = false }: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-x-0 flex h-(--sq) gap-(--sq) overflow-hidden',
        edge === 'bottom' ? 'bottom-0 ps-[calc(var(--sq)/2)]' : 'top-[calc(var(--sq)*-1)] ps-[calc(var(--sq)*1.5)]',
      )}
    >
      {Array.from({ length: SQUARES }, (_, i) => (
        <span
          key={i}
          style={animate ? { animationDelay: `${200 + i * 25}ms` } : undefined}
          className={cn('size-(--sq) shrink-0 origin-bottom', tone === 'page' ? 'bg-page' : 'bg-deep', animate && 'animate-rise')}
        />
      ))}
    </div>
  )
}
