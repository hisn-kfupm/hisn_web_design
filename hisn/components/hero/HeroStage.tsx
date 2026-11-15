'use client'
import { useCallback, useRef, useState, type ReactNode } from 'react'
import { BattlementBand } from '@/components/brand/BattlementBand'
import { SectionMarks } from '@/components/brand/SectionMarks'
import { gsap, registerMotion, ScrollTrigger, useGSAP } from '@/lib/motion/gsap'
import { prefersReducedMotion } from '@/lib/motion/useReducedMotion'
import { MajorSearch, type SearchLabels, type SearchMajor } from './MajorSearch'
import { PulledBrick, type PulledLabels, type PulledState } from './PulledBrick'
import { WallEngine, type WallGeometry } from './wall-engine'
import type { Rect } from './wall-layout'

type Props = {
  /** the slogan in three lines; the middle one («لبنة») sits in the mint brick */
  lines: [string, string, string]
  kicker: string
  about: string
  majors: SearchMajor[]
  search: SearchLabels
  pulled: PulledLabels
  /** the next event card (server-rendered) */
  children: ReactNode
}

const DESKTOP = '(min-width: 64rem)'
const DEEP = '#022C33'

/** an element's box in the stage's coordinates */
function boxIn(el: Element | null, stage: DOMRect): Rect | null {
  if (!el) return null
  const r = el.getBoundingClientRect()
  if (!r.width && !r.height) return null
  return { x: r.left - stage.left, y: r.top - stage.top, w: r.width, h: r.height }
}

/**
 * «الجدار الحي», the living wall (redesign §5.1). The headline is real text, readable at first
 * paint; the canvas wall lays itself in course by course, the crenellations rise, the mint «لبنة»
 * brick drops into the headline, and on impact a ring of light runs through the mortar. A warm
 * raking light follows the pointer (or finger), «ابحث عن تخصصك» lights matching bricks and pulls
 * the chosen one out. Under reduced motion it renders composed and still.
 */
export function HeroStage({ lines, kicker, about, majors, search, pulled: pulledLabels, children }: Props) {
  const stage = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const engine = useRef<WallEngine | null>(null)
  const rest = useRef<(() => void) | null>(null)
  const [pulled, setPulled] = useState<PulledState | null>(null)

  useGSAP(
    () => {
      const hero = stage.current
      const cvs = canvas.current
      if (!hero || !cvs) return
      registerMotion()
      const reduced = prefersReducedMotion()
      const wall = new WallEngine(cvs, majors, reduced)
      engine.current = wall
      const q = (sel: string) => hero.querySelector<HTMLElement>(sel)
      const mint = q('[data-mint]')
      const word = q('[data-word]')
      const card = q('[data-wall-card]')
      const brick = card?.firstElementChild as HTMLElement | null
      const headLines = hero.querySelectorAll<HTMLElement>('[data-line]')
      let disposed = false
      const cleanups: (() => void)[] = [() => wall.destroy(), () => void (disposed = true)]

      const geometry = (): { geo: WallGeometry; course: number } => {
        const s = hero.getBoundingClientRect()
        const course = parseFloat(getComputedStyle(hero).getPropertyValue('--course')) || 36
        const desktop = window.matchMedia(DESKTOP).matches
        const zone = boxIn(q('[data-wall-zone]'), s)
        const tower = boxIn(q('[data-wall-tower]'), s)
        const shade = boxIn(q('[data-hero-copy]'), s)
        if (desktop || !zone) {
          return {
            course,
            geo: {
              top: s.height * 0.5,
              bottom: s.height,
              tower: tower ? { x0: tower.x, x1: tower.x + tower.w, top: tower.y } : null,
              card: boxIn(card, s),
              shade,
            },
          }
        }
        // phones: the wall runs from under the slogan to the bottom of the section, behind the
        // search and around the next-event card
        return { course, geo: { top: zone.y, bottom: s.height, tower: null, card: null, shade } }
      }

      if (!wall.ready) {
        // no canvas (tests, very old browsers): the composed DOM stands alone
        return () => cleanups.forEach((f) => f())
      }

      // —— the load choreography ——
      if (!reduced && mint && word) {
        hero.dataset.motion = ''
        gsap.set(mint, { yPercent: -720, scaleY: 1.12, scaleX: 0.96, transformOrigin: '50% 100%' })
        gsap.set(word, { color: '#fff' })
        if (brick) gsap.set(brick, { autoAlpha: 0 })
      }
      let started = false
      const start = () => {
        if (started || disposed || !stage.current) return
        started = true
        const { geo, course } = geometry()
        wall.resize(geo, course)
        if (reduced || !mint || !word) return
        performance.mark?.('hero:intro')
        const lay = wall.intro()
        const dropAt = Math.max(0.45, lay - 0.5)
        const tl = gsap.timeline()
        tl.to(mint, { yPercent: 0, duration: 0.34, ease: 'power3.in' }, dropAt)
          .addLabel('impact')
          .set(word, { color: DEEP }, 'impact')
          .to(mint, { scaleY: 0.9, scaleX: 1.05, duration: 0.07, ease: 'power1.out' }, 'impact')
          .to(mint, { scaleY: 1, scaleX: 1, duration: 0.55, ease: 'back.out(3)' }, 'impact+=0.07')
          .call(
            () => {
              performance.mark?.('hero:impact')
              const s = hero.getBoundingClientRect()
              const r = boxIn(mint, s)
              if (r) wall.impact(r.x + r.w / 2, r.y + r.h, r.w)
            },
            [],
            'impact',
          )
          .to([headLines[0], headLines[2]], { y: 5, duration: 0.07, ease: 'power1.out' }, 'impact')
          .to([headLines[0], headLines[2]], { y: 0, duration: 0.5, ease: 'back.out(3)' }, 'impact+=0.07')
        // the next-event card is laid with its course, as one big brick of the wall
        if (brick && card) {
          const s = hero.getBoundingClientRect()
          const r = boxIn(card, s)
          const at = r && window.matchMedia(DESKTOP).matches ? wall.layAt(r.y + r.h, r.x + r.w / 2) : lay * 0.8
          gsap.set(brick, { y: -26 })
          tl.to(brick, { autoAlpha: 1, duration: 0.12, ease: 'none' }, at).to(brick, { y: 0, duration: 0.5, ease: 'brickDrop' }, at)
        }
        cleanups.push(() => tl.kill())
      }
      wall.setFont(getComputedStyle(document.body).fontFamily)
      const fonts = document.fonts?.ready ?? Promise.resolve()
      const timer = setTimeout(start, 300)
      fonts.then(() => {
        clearTimeout(timer)
        start()
      })
      cleanups.push(() => clearTimeout(timer))

      // —— resize: lay the wall out again ——
      let frame = 0
      let lastW = hero.clientWidth
      const ro = new ResizeObserver(() => {
        if (!started || hero.clientWidth === lastW) return
        lastW = hero.clientWidth
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => {
          const { geo, course } = geometry()
          wall.resize(geo, course)
        })
      })
      ro.observe(hero)
      cleanups.push(() => ro.disconnect())

      // —— render only while visible ——
      const io = new IntersectionObserver(([entry]) => wall.setVisible(entry.isIntersecting))
      io.observe(hero)
      cleanups.push(() => io.disconnect())

      // —— pointer and touch: the raking light ——
      let pending: { x: number; y: number } | null = null
      let pointerFrame = 0
      const local = (e: PointerEvent) => {
        const s = hero.getBoundingClientRect()
        return { x: e.clientX - s.left, y: e.clientY - s.top - Number(gsap.getProperty(cvs, 'y') || 0) }
      }
      const flush = () => {
        pointerFrame = 0
        if (pending) wall.pointerMove(pending.x, pending.y)
      }
      const onMove = (e: PointerEvent) => {
        pending = local(e)
        if (!pointerFrame) pointerFrame = requestAnimationFrame(flush)
      }
      let down: { x: number; y: number; t: number } | null = null
      const onDown = (e: PointerEvent) => {
        const p = local(e)
        down = { ...p, t: performance.now() }
        if (e.pointerType !== 'mouse') wall.pointerMove(p.x, p.y)
      }
      const onUp = (e: PointerEvent) => {
        const p = local(e)
        const interactive = (e.target as Element).closest('a, button, input, [role="listbox"], [role="group"]')
        if (down && !interactive && Math.hypot(p.x - down.x, p.y - down.y) < 12 && performance.now() - down.t < 500) wall.tap(p.x, p.y)
        down = null
        if (e.pointerType !== 'mouse') setTimeout(() => wall.pointerLeave(), 900)
      }
      const onLeave = () => wall.pointerLeave()
      hero.addEventListener('pointermove', onMove, { passive: true })
      hero.addEventListener('pointerdown', onDown, { passive: true })
      hero.addEventListener('pointerup', onUp, { passive: true })
      hero.addEventListener('pointerleave', onLeave)
      hero.addEventListener('pointercancel', onLeave)
      cleanups.push(() => {
        hero.removeEventListener('pointermove', onMove)
        hero.removeEventListener('pointerdown', onDown)
        hero.removeEventListener('pointerup', onUp)
        hero.removeEventListener('pointerleave', onLeave)
        hero.removeEventListener('pointercancel', onLeave)
        cancelAnimationFrame(pointerFrame)
        cancelAnimationFrame(frame)
      })

      // —— scroll out: the headline leaves faster than the wall ——
      if (!reduced && copy.current) {
        const out = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to(copy.current, { y: () => -hero.offsetHeight * 0.24, ease: 'none', scrollTrigger: out })
        // only the copy moves: the wall and the card stay anchored to the section, so the wall's
        // base meets the next band's crenellated top edge with no cut, and the card (low in the
        // wall) is never clipped by the section's edge
        ScrollTrigger.refresh()
      }

      return () => cleanups.forEach((f) => f())
    },
    { scope: stage },
  )

  const onPick = useCallback((m: SearchMajor) => {
    const hero = stage.current
    const wall = engine.current
    if (!hero) return
    const s = hero.getBoundingClientRect()
    const desktop = window.matchMedia(DESKTOP).matches
    const zone = boxIn(hero.querySelector('[data-wall-zone]'), s)
    const tower = boxIn(hero.querySelector('[data-wall-tower]'), s)
    const course = parseFloat(getComputedStyle(hero).getPropertyValue('--course')) || 36
    const w = Math.min(desktop ? 360 : 340, s.width - 32)
    const h = desktop ? 248 : 236
    const copyBottom = copy.current ? copy.current.getBoundingClientRect().bottom - s.top : s.height
    const area =
      desktop && tower
        ? { x: tower.x, y: tower.y + course * 1.4, w: tower.w, h }
        : zone
          ? { x: 0, y: zone.y, w: s.width, h: copyBottom - zone.y }
          : { x: 0, y: s.height / 2, w: s.width, h }
    // phones: low in the wall, clear of the search field
    const target = { x: area.x + (area.w - w) / 2, y: desktop ? area.y : Math.max(area.y, area.y + area.h - h - 20), w, h }
    const offset = canvas.current ? Number(gsap.getProperty(canvas.current, 'y') || 0) : 0
    const from = wall?.pull(m.code, { x: target.x + w / 2, y: target.y + h / 2 - offset }) ?? null
    setPulled({
      code: m.code,
      name: m.ar,
      from: from ? { ...from, y: from.y + offset } : null,
      target,
      rtl: getComputedStyle(hero).direction !== 'ltr',
      reduced: prefersReducedMotion(),
    })
  }, [])

  // the brick goes back and the wall returns to rest; the query stays in the field, but the list
  // stays closed until the next keystroke (a second Escape clears the field)
  const onClosed = useCallback(() => {
    engine.current?.unpull()
    engine.current?.setMatches(null)
    setPulled(null)
    rest.current?.()
    input.current?.focus({ preventScroll: true })
  }, [])

  return (
    <section
      ref={stage}
      data-testid="hero"
      data-band="dark"
      aria-labelledby="hero-title"
      className="hero bg-brand on-dark relative isolate overflow-hidden text-white [touch-action:pan-y]"
    >
      <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />
      <div aria-hidden="true" className="grain-layer" />
      {/* the tower's footprint on desktop: the wall rises higher at the inline-end side */}
      {/* phones: the wall fills the lower half of the first screen, behind the search; it ends where the copy block ends */}
      <div data-wall-zone aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[min(46svh,22rem)] h-px lg:hidden" />
      <div data-wall-tower aria-hidden="true" className="pointer-events-none absolute end-0 top-[19%] bottom-0 hidden w-[31%] max-w-[30rem] lg:block" />

      <div ref={copy} className="wrap relative z-10 flex min-h-svh flex-col pt-[calc(var(--header-h)+1.75rem)] lg:pt-[calc(var(--header-h)+4.5vh)]">
        <div data-hero-copy className="relative flex w-fit max-w-full flex-col lg:block">
          <p className="mb-4 flex items-center gap-3 text-label text-on-dark lg:mb-5">
            <SectionMarks />
            {kicker}
          </p>
          <h1 id="hero-title" className="text-hero">
            <span data-line className="block">{lines[0]}</span>{' '}
            <span data-line className="block">
              <span data-hero-brick className="relative inline-block px-[0.2em] max-lg:py-[0.04em]">
                {/* below lg the brick spans the whole line box, so the lam's ascender stays inside the mint */}
                <span data-mint aria-hidden="true" className="hero-mint absolute inset-x-0 top-[0.02em] bottom-[0.02em] bg-mint lg:top-[0.14em] lg:bottom-[0.05em]" />
                <span data-word className="hero-word relative">{lines[1]}</span>
              </span>
            </span>{' '}
            <span data-line className="block">{lines[2]}</span>
          </h1>
          {/* phones: the about text moves under the search, so the wall shows in the first screen */}
          <p className="mt-5 max-w-[31rem] text-[1.0625rem] leading-[1.75] text-on-dark max-lg:order-1 lg:mt-6">{about}</p>
          <div className="mt-7 lg:mt-8">
            <MajorSearch
              majors={majors}
              labels={search}
              inputRef={input}
              restRef={rest}
              avoidId="hero-title"
              onQuery={(codes) => engine.current?.setMatches(codes)} onPick={onPick} />
          </div>
        </div>
      </div>
      {/* the wall's base darkens toward the next band, whose crenellated top edge rises into it */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[calc(var(--course)*3)] bg-linear-to-b from-transparent to-deep-700/55" />
      <BattlementBand tone="deep-700" edge="bottom" />
      {/* desktop: narrow and low, so the tower's top and its crenellations stay clear above it */}
      <div data-wall-card className="wrap relative z-10 pb-12 lg:absolute lg:end-[max(2rem,calc((100%-1200px)/2))] lg:bottom-[calc(var(--sq)+0.5rem)] lg:m-0 lg:w-[19rem] lg:pb-0">
        {children}
      </div>

      <PulledBrick state={pulled} labels={pulledLabels} stageWidth={() => stage.current?.clientWidth ?? 0} onClosed={onClosed} />
    </section>
  )
}
