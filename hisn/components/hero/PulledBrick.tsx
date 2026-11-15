'use client'
import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'
import { ArrowLink } from '@/components/ui/ArrowLink'
import { Icon } from '@/components/ui/Icon'
import { gsap } from '@/lib/motion/gsap'
import type { Rect } from './wall-layout'

export type PulledLabels = { title: string; events: string; departments: string; close: string }
export type PulledState = { code: string; name: string; from: Rect | null; target: Rect; rtl: boolean; reduced: boolean }

type Props = {
  state: PulledState | null
  labels: PulledLabels
  /** the hero's width, to place the card from its inline-start edge */
  stageWidth: () => number
  onClosed: () => void
}

/**
 * The chosen major's brick (redesign §5.1): it leaves its place in the wall, comes toward the
 * viewer and flips to its back: «لتخصصك مكان في حصن» with links to events and departments.
 * Focus moves to its title when it lands; Escape or the close button puts it back.
 */
export function PulledBrick({ state, labels, stageWidth, onClosed }: Props) {
  const id = useId()
  const wrap = useRef<HTMLDivElement>(null)
  const flip = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  // inline-start positioning: x is measured from the stage's start edge
  const startX = (s: PulledState, r: Rect) => (s.rtl ? r.x + r.w - stageWidth() : r.x)

  useEffect(() => {
    const el = wrap.current
    const card = flip.current
    if (!state || !el || !card) return
    const { from, target, reduced, rtl } = state
    const end = { x: startX(state, target), y: target.y, width: target.w, height: target.h }
    tl.current?.kill()
    if (reduced || !from) {
      gsap.set(el, { ...end, autoAlpha: 1 })
      gsap.set(card, { rotateY: rtl ? -180 : 180 })
      title.current?.focus({ preventScroll: true })
      return
    }
    const start = { x: startX(state, from), y: from.y, width: from.w, height: from.h }
    const lifted = { x: start.x + (rtl ? 6 : -6), y: from.y - 8, width: from.w * 1.08, height: from.h * 1.08 }
    gsap.set(el, { ...start, autoAlpha: 1 })
    gsap.set(card, { rotateY: 0, z: 0 })
    tl.current = gsap
      .timeline({ onComplete: () => title.current?.focus({ preventScroll: true }) })
      .to(el, { ...lifted, duration: 0.24, ease: 'settle' })
      .to(el, { ...end, duration: 0.8, ease: 'settle' })
      .to(card, { rotateY: rtl ? -180 : 180, duration: 0.8, ease: 'settle' }, '<0.12')
    // the timeline is rebuilt for every new pick
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const close = () => {
    const el = wrap.current
    if (!el) return onClosed()
    const done = () => {
      gsap.set(el, { autoAlpha: 0 })
      onClosed()
    }
    if (tl.current && !state?.reduced && state?.from) {
      tl.current.eventCallback('onReverseComplete', done)
      tl.current.timeScale(1.4).reverse()
    } else done()
  }

  return (
    <div
      ref={wrap}
      className="invisible absolute start-0 top-0 z-30 opacity-0 [perspective:1400px]"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          close()
        }
      }}
    >
      <div ref={flip} className="relative size-full [transform-style:preserve-3d]">
        {/* front: the brick itself, mint like the headline's */}
        <div aria-hidden="true" className="absolute inset-0 grid place-items-center overflow-hidden bg-mint px-2 text-[0.8125rem] font-bold text-deep shadow-[inset_0_2px_0_rgb(255_255_255/0.45),inset_0_-3px_0_#43977B] [backface-visibility:hidden]">
          <span className="truncate">{state?.name}</span>
        </div>
        {/* back: the message */}
        <div
          role="group"
          aria-labelledby={`${id}-title`}
          className="absolute inset-0 flex flex-col border-t-4 border-mint bg-deep-700 p-5 text-white shadow-[0_30px_60px_-20px_rgb(0_8_10/0.9),inset_0_1px_0_rgb(255_255_255/0.08)] [backface-visibility:hidden] [transform:rotateY(180deg)] lg:p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="inline-flex items-center bg-mint px-2.5 py-1 text-label text-deep">{state?.name}</p>
            <button type="button" onClick={close} aria-label={labels.close} className="-me-2 -mt-2 grid size-11 shrink-0 place-items-center text-teal-100 hover:text-white">
              <Icon icon={X} size={20} />
            </button>
          </div>
          <h2 ref={title} id={`${id}-title`} tabIndex={-1} className="mt-3 text-[1.625rem] leading-[1.3] font-bold text-white outline-none">
            {labels.title}
          </h2>
          <div className="mt-auto flex flex-col items-start">
            <ArrowLink href="/events" tone="dark">{labels.events}</ArrowLink>
            <ArrowLink href="#departments" tone="dark" onClick={close}>{labels.departments}</ArrowLink>
          </div>
        </div>
      </div>
    </div>
  )
}
