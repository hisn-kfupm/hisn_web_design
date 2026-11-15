'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, registerMotion, ScrollTrigger } from '@/lib/motion/gsap'
import { useReducedMotion } from '@/lib/motion/useReducedMotion'

const LenisContext = createContext<Lenis | null>(null)

/** the page's Lenis instance, or null (reduced motion, server, tests) */
export function useLenis(): Lenis | null {
  return useContext(LenisContext)
}

/**
 * Mounted once in app/layout.tsx. Registers GSAP plugins and eases, and runs Lenis smooth scroll
 * on gsap.ticker, wired to ScrollTrigger. Under reduced motion there is no smooth scroll.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    registerMotion()
    if (reduced) return
    const instance = new Lenis({ autoRaf: false, anchors: { offset: -96 }, lerp: 0.11, wheelMultiplier: 0.95 })
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the instance only exists in the browser
    setLenis(instance)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [reduced])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
