'use client'
import { useRef, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
import { Draggable, gsap, registerMotion, useGSAP } from '@/lib/motion/gsap'
import { prefersReducedMotion } from '@/lib/motion/useReducedMotion'

type Labels = { prev: string; next: string; drag: string }

/**
 * A horizontal strip of cards ([data-card] <li>s) (redesign §5.7).
 * - With a mouse: drag with inertia (Draggable + InertiaPlugin); the cards lean with the throw and
 *   settle when it stops. The square buttons step one card at a time; focusing a card brings it in.
 * - On touch screens, under reduced motion and without JS: a native horizontal scroller with snap.
 * A hairline under the strip shows how far along you are.
 */
export function DragStrip({ labels, children }: { labels: Labels; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLOListElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const step = useRef<(dir: 1 | -1) => void>(() => {})

  useGSAP(
    () => {
      const vp = viewport.current
      const tr = track.current
      const progress = bar.current
      if (!vp || !tr || !progress) return
      registerMotion()
      const rtl = getComputedStyle(vp).direction === 'rtl'
      const cards = gsap.utils.toArray<HTMLElement>('[data-card] .rec-tilt', tr)
      const span = () => Math.max(0, tr.scrollWidth - vp.clientWidth)
      const setScale = gsap.quickSetter(progress, 'scaleX') as (v: number) => void
      // the bar starts at the share already in view and grows to full at the end
      const setBar = (p: number) => {
        const seen = Math.min(1, vp.clientWidth / Math.max(1, tr.scrollWidth))
        setScale(seen + (1 - seen) * gsap.utils.clamp(0, 1, p))
      }

      // native scroller (touch, reduced motion): only the hairline follows
      const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      if (!fine || prefersReducedMotion()) {
        const onScroll = () => setBar(span() ? Math.abs(vp.scrollLeft) / span() : 0)
        onScroll()
        vp.addEventListener('scroll', onScroll, { passive: true })
        step.current = (dir) => {
          const card = tr.querySelector<HTMLElement>('[data-card]')
          const by = (card?.offsetWidth ?? 300) + 24
          vp.scrollBy({ left: dir * by * (rtl ? -1 : 1), behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
        }
        return () => vp.removeEventListener('scroll', onScroll)
      }

      root.current?.setAttribute('data-drag', '')
      const bounds = () => (rtl ? { minX: 0, maxX: span() } : { minX: -span(), maxX: 0 })
      const share = (x: number) => (span() ? Math.abs(x) / span() : 0)
      const lean = cards.map((c) => gsap.quickTo(c, 'rotation', { duration: 0.5, ease: 'settle' }))
      let lastX = 0
      let lastT = 0
      let v = 0
      const tilt = () => {
        const x = gsap.getProperty(tr, 'x') as number
        const now = performance.now()
        const dt = Math.max(1, now - lastT)
        v = v * 0.6 + (((x - lastX) / dt) * 1000) * 0.4
        lastX = x
        lastT = now
        // the cards lean with a small rotation (no skew, which distorts the Arabic titles)
        const deg = gsap.utils.clamp(-1.5, 1.5, -v / 1400)
        lean.forEach((q) => q(deg))
        setBar(share(x))
      }
      const rest = () => lean.forEach((q) => q(0))

      const [drag] = Draggable.create(tr, {
        type: 'x',
        inertia: true,
        bounds: bounds(),
        edgeResistance: 0.82,
        dragClickables: true,
        minimumMovement: 6,
        zIndexBoost: false,
        cursor: 'grab',
        activeCursor: 'grabbing',
        onPress: () => {
          lastX = gsap.getProperty(tr, 'x') as number
          lastT = performance.now()
          v = 0
        },
        onDrag: tilt,
        onThrowUpdate: tilt,
        onRelease: function () {
          if (!this.isThrowing) rest()
        },
        onThrowComplete: rest,
        snap: {
          x: (end: number) => {
            const card = tr.querySelector<HTMLElement>('[data-card]')
            const by = (card?.offsetWidth ?? 300) + 24
            const b = bounds()
            return gsap.utils.clamp(b.minX, b.maxX, Math.round(end / by) * by)
          },
        },
      })
      // a drag must not end in a click on the card's link
      const swallow = (e: MouseEvent) => {
        if (drag.isDragging || Math.abs(drag.x - drag.startX) > 6) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
      tr.addEventListener('click', swallow, true)

      const goTo = (x: number) => {
        const b = bounds()
        gsap.to(tr, { x: gsap.utils.clamp(b.minX, b.maxX, x), duration: 0.8, ease: 'settle', onUpdate: () => (drag.update(), setBar(share(gsap.getProperty(tr, 'x') as number))) })
      }
      step.current = (dir) => {
        const card = tr.querySelector<HTMLElement>('[data-card]')
        const by = (card?.offsetWidth ?? 300) + 24
        goTo((gsap.getProperty(tr, 'x') as number) + dir * by * (rtl ? 1 : -1))
      }
      // keyboard: keep the focused card inside the viewport
      const onFocus = (e: FocusEvent) => {
        vp.scrollLeft = 0
        const card = (e.target as HTMLElement).closest<HTMLElement>('[data-card]')
        if (!card) return
        const v = vp.getBoundingClientRect()
        const c = card.getBoundingClientRect()
        const x = gsap.getProperty(tr, 'x') as number
        if (c.left < v.left) goTo(x + (v.left - c.left) + 32)
        else if (c.right > v.right) goTo(x - (c.right - v.right) - 32)
      }
      tr.addEventListener('focusin', onFocus)
      const ro = new ResizeObserver(() => drag.applyBounds(bounds()))
      ro.observe(vp)
      return () => {
        ro.disconnect()
        tr.removeEventListener('click', swallow, true)
        tr.removeEventListener('focusin', onFocus)
        drag.kill()
        root.current?.removeAttribute('data-drag')
      }
    },
    { scope: root },
  )

  return (
    <div ref={root} className="drag-strip relative">
      <div ref={viewport} data-lenis-prevent className="drag-viewport overflow-x-auto overscroll-x-contain">
        <ol ref={track} className="drag-track m-0 flex w-max list-none gap-6 p-0 py-4 ps-[max(20px,calc((100vw-1200px)/2))] pe-[max(20px,calc((100vw-1200px)/2))] sm:ps-[max(32px,calc((100vw-1200px)/2))] sm:pe-[max(32px,calc((100vw-1200px)/2))]">
          {children}
        </ol>
      </div>
      <div className="wrap mt-6 flex items-center gap-5">
        <span className="relative h-0.5 flex-1 bg-line">
          <span ref={bar} className="absolute inset-0 origin-[var(--start)] bg-teal" style={{ transform: 'scaleX(0.25)' }} />
        </span>
        <span className="drag-hint hidden text-label text-muted lg:inline">{labels.drag}</span>
        <span className="flex gap-2">
          <button type="button" onClick={() => step.current(-1)} aria-label={labels.prev} className="btn btn-light-secondary size-12 p-0">
            <Icon icon={ArrowLeft} mirror size={20} />
          </button>
          <button type="button" onClick={() => step.current(1)} aria-label={labels.next} className="btn btn-light-secondary size-12 p-0">
            <Icon icon={ArrowRight} mirror size={20} />
          </button>
        </span>
      </div>
    </div>
  )
}
