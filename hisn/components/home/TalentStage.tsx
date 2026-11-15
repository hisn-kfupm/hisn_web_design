'use client'
import { useRef, type ReactNode } from 'react'
import { gsap, registerMotion, useGSAP } from '@/lib/motion/gsap'
import { prefersReducedMotion } from '@/lib/motion/useReducedMotion'

type Pt = { x: number; y: number }

/** an orthogonal route through the points, like a mortar joint: down the course, then along it */
function route(points: Pt[]): { d: string; marks: number[] } {
  let d = `M${points[0].x},${points[0].y}`
  let length = 0
  const marks = [0]
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    d += ` V${b.y} H${b.x}`
    length += Math.abs(b.x - a.x) + Math.abs(b.y - a.y)
    marks.push(length)
  }
  return { d, marks: marks.map((m) => (length ? m / length : 0)) }
}

/** a polyline through the points; marks are the share of its length at the given point indexes */
function poly(points: Pt[], at: number[]): { d: string; marks: number[] } {
  let d = `M${points[0].x},${points[0].y}`
  let length = 0
  const lengths = [0]
  for (let i = 1; i < points.length; i++) {
    d += ` L${points[i].x},${points[i].y}`
    length += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)
    lengths.push(length)
  }
  return { d, marks: at.map((i) => (length ? lengths[i] / length : 0)) }
}

/**
 * Desktop: the bricks and the CTA sit in one course stepping down toward the inline-end, so the
 * line runs over their tops as a staircase, the silhouette of the logo's stepped tower: over brick
 * ١, down the joint to brick ٢, over it, down the next joint, and into the CTA's inline-start edge.
 */
function staircase(bricks: DOMRect[], cta: DOMRect, base: DOMRect, rtl: boolean): { d: string; marks: number[] } {
  const lift = 14
  const start = (r: DOMRect) => (rtl ? r.right : r.left) - base.left
  const end = (r: DOMRect) => (rtl ? r.left : r.right) - base.left
  const pts: Pt[] = []
  const at: number[] = []
  bricks.forEach((r, i) => {
    const y = r.top - base.top - lift
    const next = bricks[i + 1] ?? cta
    const joint = (end(r) + start(next)) / 2
    if (i === 0) pts.push({ x: start(r), y })
    else pts.push({ x: pts[pts.length - 1].x, y })
    at.push(pts.length - 1)
    pts.push({ x: joint, y })
  })
  const cy = cta.top + cta.height / 2 - base.top
  pts.push({ x: pts[pts.length - 1].x, y: cy }, { x: start(cta), y: cy })
  at.push(pts.length - 1)
  return poly(pts, at)
}

/**
 * Motion for the talent invitation (redesign §5.6):
 * - [data-word] spans in [data-words] go from 0.15 to full opacity, one by one, with scroll;
 * - a mint line draws through the [data-node]s of [data-paths] (brick ١ → brick ٢ → the CTA), and
 *   each [data-brick] lights up as the line reaches it.
 * The line is measured from the layout and redrawn on resize. Static and fully shown under
 * reduced motion or without JS.
 */
export function TalentStage({ className, children }: { className?: string; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const path = useRef<SVGPathElement>(null)

  useGSAP(
    () => {
      const box = root.current
      const paths = box?.querySelector<HTMLElement>('[data-paths]')
      if (!box || !paths || !svg.current || !path.current) return
      registerMotion()
      const reduce = prefersReducedMotion()
      const nodes = [...paths.querySelectorAll<HTMLElement>('[data-node]')]
      const bricks = [...paths.querySelectorAll<HTMLElement>('[data-brick]')]
      let marks: number[] = []

      const measure = () => {
        const base = box.getBoundingClientRect()
        const centre = (r: DOMRect): Pt => ({ x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top })
        const pts = nodes.map((n, i) => {
          const r = n.getBoundingClientRect()
          const c = centre(r)
          if (i < nodes.length - 1) return c
          // the CTA: the line arrives at its inline-start edge, halfway down
          const rtl = getComputedStyle(n).direction === 'rtl'
          return { x: (rtl ? r.right : r.left) - base.left, y: c.y }
        })
        const desktop = window.matchMedia('(min-width: 64rem)').matches
        const cta = nodes[nodes.length - 1]
        const r =
          desktop && cta && bricks.length
            ? staircase(bricks.map((b) => b.getBoundingClientRect()), cta.getBoundingClientRect(), base, getComputedStyle(box).direction === 'rtl')
            : route(pts)
        marks = r.marks
        svg.current!.setAttribute('viewBox', `0 0 ${base.width} ${base.height}`)
        path.current!.setAttribute('d', r.d)
      }
      measure()
      const ro = new ResizeObserver(() => measure())
      ro.observe(box)
      if (reduce) {
        bricks.forEach((b) => b.setAttribute('data-lit', ''))
        return () => ro.disconnect()
      }

      const words = gsap.utils.toArray<HTMLElement>('[data-word]', box)
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        { opacity: 1, ease: 'none', stagger: 0.5, scrollTrigger: { trigger: box.querySelector('[data-words]'), start: 'top 82%', end: 'bottom 42%', scrub: 0.4 } },
      )

      const draw = gsap.fromTo(
        path.current,
        { drawSVG: '0%' },
        {
          drawSVG: '100%',
          ease: 'none',
          scrollTrigger: { trigger: paths, start: 'top 78%', end: 'bottom 62%', scrub: 0.6, invalidateOnRefresh: true },
          onUpdate() {
            const p = this.progress()
            bricks.forEach((b, i) => b.toggleAttribute('data-lit', p >= (marks[i] ?? 0) - 0.001 && p > 0))
            nodes[nodes.length - 1]?.toggleAttribute('data-lit', p > 0.98)
          },
        },
      )
      return () => {
        ro.disconnect()
        draw.scrollTrigger?.kill()
      }
    },
    { scope: root },
  )

  return (
    <div ref={root} className={className}>
      {children}
      <svg ref={svg} aria-hidden="true" focusable="false" className="pointer-events-none absolute inset-0 size-full overflow-visible" preserveAspectRatio="none">
        <path ref={path} d="M0,0" fill="none" stroke="#5FD4AA" strokeWidth={3} strokeLinecap="square" strokeLinejoin="miter" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}
