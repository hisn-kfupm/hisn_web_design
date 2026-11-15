import type { ReactNode } from 'react'

/**
 * Section number in a green square (guide, every section). White on green-500 is 4.26:1,
 * so the numeral stays at 19 px bold, which counts as large text.
 */
export function SectionNumber({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden="true" data-testid="section-number" className="grid size-9 shrink-0 place-items-center bg-green text-[1.1875rem] leading-none font-bold text-white">
      {children}
    </span>
  )
}
