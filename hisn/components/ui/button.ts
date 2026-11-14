import { cn } from '@/lib/cn'

type Options = {
  variant?: 'primary' | 'secondary' | 'ghost'
  /** 'dark' for buttons on the deep plate */
  tone?: 'light' | 'dark'
  size?: 'md' | 'sm'
  block?: boolean
  className?: string
}

/**
 * Button classes for <button> and <Link>. Square corners; min 44–48 px targets.
 * Colours change instantly on hover; only transform animates (press = 1 px down).
 */
export function buttonClass({ variant = 'primary', tone = 'light', size = 'md', block = false, className }: Options = {}): string {
  const base =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap border-[1.5px] font-semibold no-underline transition-transform duration-75 ease-linear active:translate-y-px disabled:cursor-progress disabled:opacity-80'
  const sizes = { md: 'min-h-12 px-6 py-3 text-body', sm: 'min-h-11 px-4 py-2 text-[0.9375rem]' }
  const looks = {
    light: {
      primary: 'border-transparent bg-teal text-white hover:bg-teal-700',
      secondary: 'border-teal text-teal hover:bg-teal-100',
      ghost: 'min-h-11 border-transparent px-2 text-teal underline decoration-1 underline-offset-[0.35em] hover:text-teal-700',
    },
    dark: {
      primary: 'border-transparent bg-page text-deep hover:bg-mint',
      secondary: 'border-teal-100/70 text-white hover:bg-white/10',
      ghost: 'min-h-11 border-transparent px-2 text-white underline decoration-1 underline-offset-[0.35em]',
    },
  }
  return cn(base, variant !== 'ghost' && sizes[size], looks[tone][variant], block && 'w-full whitespace-normal', className)
}
