'use client'
import { Fragment, useRef } from 'react'
import { gsap, registerMotion, ScrollTrigger, useGSAP } from '@/lib/motion/gsap'
import { prefersReducedMotion } from '@/lib/motion/useReducedMotion'

const BASE = 34 // px per second at rest
const MAX_BOOST = 1600 // px per second added at full scroll speed

/**
 * Two marquee rows that run in opposite directions (redesign §5.3). Speed follows scroll velocity:
 * scrolling down drives them on, scrolling up turns them round, and the rows lean into the
 * movement. The loop runs on gsap.ticker only while the band is on screen. Under reduced motion
 * the rows stand still, offset like courses of brick.
 */
export function MajorsMarquee({ rows }: { rows: [string[], string[]] }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const band = root.current
      if (!band || prefersReducedMotion()) return
      registerMotion()
      const tracks = gsap.utils.toArray<HTMLElement>('[data-track]', band)
      const leaners = gsap.utils.toArray<HTMLElement>('[data-row]', band)
      const rtl = getComputedStyle(band).direction === 'rtl'
      const forward = rtl ? -1 : 1
      const setX = tracks.map((el) => gsap.quickSetter(el, 'x', 'px') as (v: number) => void)
      const setTilt = leaners.map((el) => gsap.quickSetter(el, 'rotation', 'deg') as (v: number) => void)
      let widths = tracks.map((el) => el.scrollWidth / 2)
      const pos = [0, widths[1] * 0.41]
      let velocity = 0
      let heading = 1
      let speed = BASE
      let tilt = 0
      let running = false

      const tick = (_time: number, dtMs: number) => {
        const dt = Math.min(dtMs, 64) / 1000
        const target = (BASE + Math.min(Math.abs(velocity) * 0.32, MAX_BOOST)) * heading
        speed += (target - speed) * Math.min(1, dt * 5)
        velocity *= Math.pow(0.04, dt) // ScrollTrigger stops reporting when the scroll stops
        // a slight rotation, never a skew: Arabic has no oblique tradition and skewed words read as distorted
        const lean = gsap.utils.clamp(-1.2, 1.2, (-velocity / 1800) * forward)
        tilt += (lean - tilt) * Math.min(1, dt * 7)
        tracks.forEach((_, i) => {
          const w = widths[i] || 1
          pos[i] += speed * dt * forward * (i === 0 ? 1 : -1)
          setX[i](rtl ? gsap.utils.wrap(0, w, pos[i]) : gsap.utils.wrap(-w, 0, pos[i]))
          setTilt[i](i === 0 ? tilt : -tilt)
        })
      }
      const start = () => {
        if (running) return
        running = true
        gsap.ticker.add(tick)
      }
      const stop = () => {
        running = false
        gsap.ticker.remove(tick)
      }

      const st = ScrollTrigger.create({
        trigger: band,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          velocity = self.getVelocity()
          if (self.direction) heading = self.direction
        },
        onToggle: (self) => (self.isActive ? start() : stop()),
      })
      if (st.isActive) start()
      tick(0, 0)

      const ro = new ResizeObserver(() => {
        widths = tracks.map((el) => el.scrollWidth / 2)
      })
      tracks.forEach((el) => ro.observe(el))
      return () => {
        stop()
        ro.disconnect()
        st.kill()
      }
    },
    { scope: root },
  )

  return (
    <div ref={root} aria-hidden="true" className="flex flex-col gap-1 select-none lg:gap-2">
      {rows.map((names, r) => (
        <div key={r} data-row className={r === 0 ? 'marquee-solid' : 'marquee-outline'}>
          <div data-track className="flex w-max will-change-transform" style={r === 1 ? { translate: '6% 0' } : undefined}>
            {[0, 1].map((copy) => (
              <span key={copy} className="flex shrink-0 items-center">
                {names.map((name) => (
                  <Fragment key={name}>
                    <span className="text-marquee px-[0.32em] whitespace-nowrap">{name}</span>
                    <i className="marquee-sq shrink-0" />
                  </Fragment>
                ))}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
