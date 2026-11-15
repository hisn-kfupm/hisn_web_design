'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { gsap, registerMotion, ScrollTrigger } from '@/lib/motion/gsap'
import { prefersReducedMotion } from '@/lib/motion/useReducedMotion'

/**
 * The footer curtain (redesign §4/§5.8): the page lifts to reveal the fixed footer under it.
 * Measures the footer and turns the curtain on (html[data-curtain="on"], --footer-h) only when the
 * footer fits the viewport; on phones where it is taller, the footer stays a normal static block.
 * While the curtain lifts, the closing line rises into place.
 */
export function FooterCurtain() {
  const pathname = usePathname()
  useEffect(() => {
    const footer = document.querySelector<HTMLElement>('.curtain-footer')
    if (!footer) return
    const root = document.documentElement
    registerMotion()

    // Mobile browsers fire resize whenever the address bar collapses or returns; a full
    // ScrollTrigger.refresh() then (which re-measures the verbs pin) jumps the page mid-scroll.
    // So: compare against the last width and footer height, test "fits" against a height captured
    // once (the large viewport, address bar hidden), batch to one frame, and refresh only when the
    // curtain switches or --footer-h actually changes.
    let stableH = Math.max(window.innerHeight, root.clientHeight)
    let last: { w: number; h: number; fits: boolean | null } = { w: -1, h: -1, fits: null }
    let frame = 0
    const measure = () => {
      frame = 0
      const w = root.clientWidth
      const h = footer.offsetHeight
      if (w === last.w && h === last.h) return
      // a new width (rotation, a resized window) is a new viewport: capture its height again
      if (w !== last.w && last.w !== -1) stableH = Math.max(window.innerHeight, root.clientHeight)
      const fits = h <= stableH - 40
      const changed = h !== last.h || fits !== last.fits
      last = { w, h, fits }
      if (!changed) return
      root.style.setProperty('--footer-h', `${h}px`)
      if (fits) root.dataset.curtain = 'on'
      else delete root.dataset.curtain
      ScrollTrigger.refresh()
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    const ro = new ResizeObserver(schedule)
    ro.observe(footer)
    window.addEventListener('resize', schedule)
    measure()

    let tween: gsap.core.Tween | null = null
    const line = footer.querySelector<HTMLElement>('[data-closing]')
    if (line && !prefersReducedMotion()) {
      tween = gsap.fromTo(
        line,
        { yPercent: 28, opacity: 0.35 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            start: () => ScrollTrigger.maxScroll(window) - footer.offsetHeight,
            end: () => ScrollTrigger.maxScroll(window),
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    }
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
      tween?.scrollTrigger?.kill()
      tween?.kill()
    }
  }, [pathname])
  return null
}
