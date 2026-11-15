'use client'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'
import { Observer } from 'gsap/Observer'
import { Draggable } from 'gsap/Draggable'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { useGSAP } from '@gsap/react'
import { EASE_PATHS } from './eases'

let registered = false

/**
 * Registers the GSAP plugins and the custom eases once (MotionProvider calls it; components that
 * animate on mount may call it too, it is idempotent). Browser only.
 */
export function registerMotion() {
  if (registered || typeof window === 'undefined') return
  registered = true
  gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase, SplitText, Flip, Observer, Draggable, DrawSVGPlugin, InertiaPlugin)
  for (const [name, path] of Object.entries(EASE_PATHS)) CustomEase.create(name, path)
  gsap.defaults({ ease: 'settle', duration: 0.6 })
  // phones: the address bar collapsing must not trigger a full refresh mid-scroll
  ScrollTrigger.config({ ignoreMobileResize: true })
}

export { gsap, ScrollTrigger, CustomEase, SplitText, Flip, Observer, Draggable, DrawSVGPlugin, InertiaPlugin, useGSAP }
