import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Section number in a green square (guide, every section). White on green-500 is 4.26:1, so the
 * numeral stays bold and ≥ 19 px (large text). `lg` is the redesign's section-head size.
 */
export function SectionNumber({ children, size = 'md', className }: { children: ReactNode; size?: 'md' | 'lg'; className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-testid="section-number"
      className={cn(
        'grid shrink-0 place-items-center bg-green leading-none font-bold text-white',
        size === 'lg' ? 'size-12 text-[1.5rem] lg:size-14 lg:text-[1.75rem]' : 'size-9 text-[1.1875rem]',
        className,
      )}
    >
      {children}
    </span>
  )
}
