import { cn } from '@/lib/cn'

/** ■■■ marks beside section titles (guide pp. 4, 11, 15, 18). Decorative. */
export function SectionMarks({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn('inline-flex shrink-0 gap-1', className)}>
      <i className="size-2 bg-mint" />
      <i className="size-2 bg-mint opacity-60" />
      <i className="size-2 bg-mint opacity-30" />
    </span>
  )
}
