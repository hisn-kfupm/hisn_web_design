'use client'
import Link from 'next/link'
import { useCallback, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { SectionMarks } from '@/components/brand/SectionMarks'
import { ArrowGlyph } from '@/components/ui/ArrowGlyph'
import { cn } from '@/lib/cn'
import { gsap, registerMotion, useGSAP } from '@/lib/motion/gsap'
import { prefersReducedMotion } from '@/lib/motion/useReducedMotion'

export type DeptItem = { code: string; slug: string; n: string; title: string; summary: string; icon: ReactNode }
type Labels = { toggle: string; visit: string }

const COLS = 8
const ROWS = 10
const CELLS = Array.from({ length: COLS * ROWS }, (_, i) => i)
const STROKES = 'path, circle, line, rect, polyline, polygon, ellipse'

/**
 * The departments index (redesign §5.5).
 * - Desktop: a numbered index; hovering or focusing an item swaps the sticky deep panel beside it
 *   through a dissolve made of squares, then draws the department's icon stroke by stroke.
 * - Phones: the same list is an accordion; the square button opens the summary under the name.
 * Each name is the one link to its department. The panel repeats what the index already says, so
 * it is aria-hidden and its link is out of the tab order; each link is described by its summary.
 */
export function DeptIndex({ items, labels }: { items: DeptItem[]; labels: Labels }) {
  const uid = useId()
  const root = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const target = useRef(0)
  const cover = useRef<gsap.core.Timeline | null>(null)
  const first = useRef(true)
  const [active, setActive] = useState(0)
  const [shown, setShown] = useState(0)
  const [open, setOpen] = useState(0)
  const [swap, setSwap] = useState(0)

  useGSAP(() => registerMotion(), { scope: root })

  const show = useCallback((i: number) => {
    if (i === target.current) return
    target.current = i
    setActive(i)
    const cells = panel.current?.querySelectorAll('[data-cell]')
    if (!cells || prefersReducedMotion()) {
      setShown(i)
      return
    }
    cover.current?.kill()
    cover.current = gsap
      .timeline()
      .to(cells, { scale: 1.04, duration: 0.2, ease: 'settle', stagger: { each: 0.0045, from: 'random', grid: [ROWS, COLS] } })
      .add(() => {
        setShown(target.current)
        setSwap((n) => n + 1)
      })
  }, [])

  // after the panel shows a new department: dissolve the squares away, draw the icon, lift the text
  useLayoutEffect(() => {
    const box = panel.current
    if (!box) return
    if (first.current) {
      first.current = false
      return
    }
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.to('[data-cell]', { scale: 0, duration: 0.32, ease: 'settle', stagger: { each: 0.004, from: 'random', grid: [ROWS, COLS] } })
      gsap.fromTo(box.querySelectorAll(`[data-icon] :is(${STROKES})`), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.1, ease: 'settle', stagger: 0.12, delay: 0.08 })
      gsap.fromTo(box.querySelectorAll('[data-lift]'), { yPercent: 105 }, { yPercent: 0, duration: 0.6, ease: 'settle', stagger: 0.06, delay: 0.1 })
      gsap.fromTo(box.querySelector('[data-ghost]'), { xPercent: -8, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.8, ease: 'settle' })
    }, box)
    return () => ctx.revert()
  }, [swap])

  const current = items[shown]

  return (
    <div ref={root} className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <ol className="dept-list m-0 list-none border-t-2 border-deep p-0 lg:col-span-7">
        {items.map((item, i) => {
          const detail = `${uid}-d${i}`
          const summary = `${uid}-s${i}`
          const isOpen = open === i
          return (
            <li key={item.code} className="dept-item border-b border-deep/15" data-active={active === i || undefined} data-open={isOpen || undefined}>
              <div className="flex items-center gap-4 py-4 sm:gap-6 lg:py-5">
                <span aria-hidden="true" className="dept-n grid size-11 shrink-0 place-items-center text-[1.125rem] leading-none font-bold sm:size-12 sm:text-[1.25rem]">
                  {item.n}
                </span>
                <h3 className="min-w-0 flex-1">
                  <Link
                    href={`/departments/${item.slug}`}
                    aria-describedby={summary}
                    onMouseEnter={() => show(i)}
                    onFocus={() => show(i)}
                    className="dept-name block py-1 text-[clamp(1.375rem,0.95rem+1.9vw,2.625rem)] leading-[1.3] font-bold text-deep no-underline"
                  >
                    {item.title}
                  </Link>
                </h3>
                <span aria-hidden="true" className="dept-go hidden text-teal lg:inline-flex">
                  <ArrowGlyph size={28} />
                </span>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={detail}
                  aria-label={labels.toggle.replace('{name}', item.title)}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="dept-toggle grid size-11 shrink-0 place-items-center border border-teal text-teal lg:hidden"
                >
                  <i aria-hidden="true" className="dept-plus relative block size-3.5" />
                </button>
              </div>
              <div id={detail} className="dept-detail grid lg:hidden" inert={!isOpen}>
                <div className="min-h-0 overflow-hidden">
                  <div className="flex items-start gap-4 pe-2 pb-6 ps-[3.75rem] sm:ps-[4.5rem]">
                    <span aria-hidden="true" className="size-10 shrink-0 text-green">{item.icon}</span>
                    <p id={summary} className="text-body text-muted">{item.summary}</p>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="hidden lg:col-span-5 lg:block">
        <div ref={panel} aria-hidden="true" className="dept-panel on-dark sticky top-[calc(var(--header-h)+2rem)] overflow-hidden bg-deep text-white">
          <div className="grain-layer" />
          <div className="dept-crenel" />
          <div className="relative flex min-h-[36rem] flex-col p-10 pt-16 xl:p-12 xl:pt-16">
            <div className="flex items-start justify-between">
              <span data-icon className="block size-36 text-mint xl:size-44">{current.icon}</span>
              <span data-ghost className="dept-ghost text-[7.5rem] leading-[0.9] font-bold">{current.n}</span>
            </div>
            <div className="mt-auto">
              <p className="mb-4 flex items-center gap-3 text-label text-mint-200">
                <SectionMarks />
                <span className="block overflow-hidden"><span data-lift className="block">{current.n}</span></span>
              </p>
              <p className="overflow-hidden pb-1 text-[clamp(2rem,1rem+1.6vw,2.75rem)] leading-[1.3] font-bold">
                <span data-lift className="block">{current.title}</span>
              </p>
              <p className="mt-3 overflow-hidden text-[1.0625rem] leading-[1.7] text-on-dark">
                <span data-lift className="block">{current.summary}</span>
              </p>
              <Link href={`/departments/${current.slug}`} tabIndex={-1} className="group mt-7 inline-flex min-h-11 items-center gap-2 font-semibold text-white no-underline">
                <span className="draw-line pb-0.5">{labels.visit}</span>
                <ArrowGlyph />
              </Link>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` } as CSSProperties}>
            {CELLS.map((c) => (
              <i key={c} data-cell style={{ transform: 'scale(0)' }} className={cn('block', c % 13 === 5 ? 'bg-mint' : (c + Math.floor(c / COLS)) % 3 === 0 ? 'bg-teal-700' : 'bg-mid')} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
