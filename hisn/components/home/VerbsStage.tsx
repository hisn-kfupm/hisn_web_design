'use client'
import { useRef, type ReactNode } from 'react'
import { SectionMarks } from '@/components/brand/SectionMarks'
import { gsap, registerMotion, useGSAP } from '@/lib/motion/gsap'

type Verb = { n: string; word: string; line: string }

/**
 * The three verbs (redesign §5.2). Each verb is a course of the wall: a numbered square, the word
 * set huge, its line of explanation, and a mortar line under it.
 * - Desktop: the band pins; scrolling sweeps a fill across each word in turn (outline → solid,
 *   through background-clip: text, with a mint front), the square turns green, the line rises out
 *   of its mask and the mortar draws from the inline-start.
 * - Phones: no pin; each verb fills as it passes the middle of the screen.
 * - Without JS and under reduced motion the words are filled and the lines shown (the CSS default).
 */
export function VerbsStage({ title, verbs, children }: { title: string; verbs: Verb[]; children?: ReactNode }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = root.current
      if (!section) return
      registerMotion()
      const rows = gsap.utils.toArray<HTMLElement>('[data-verb]', section)
      const mm = gsap.matchMedia()
      mm.add(
        { desktop: '(min-width: 64rem) and (min-height: 600px)', reduce: '(prefers-reduced-motion: reduce)' },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean }
          if (reduce) return
          const part = (row: HTMLElement) => ({
            word: row.querySelector<HTMLElement>('[data-word]')!,
            line: row.querySelector<HTMLElement>('[data-line]')!,
            mortar: row.querySelector<HTMLElement>('[data-mortar]')!,
            num: row.querySelector<HTMLElement>('[data-num]')!,
          })
          const mark = (num: HTMLElement) => (self: gsap.core.Tween) => num.toggleAttribute('data-on', self.progress() > 0.45)
          rows.forEach((row) => {
            const { word, line, mortar } = part(row)
            gsap.set(word, { '--fill': 0 })
            gsap.set(line, { yPercent: 115 })
            gsap.set(mortar, { scaleX: 0 })
          })

          if (desktop) {
            const tl = gsap.timeline({
              defaults: { ease: 'none' },
              scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${window.innerHeight * 2.4}`, pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true },
            })
            rows.forEach((row, i) => {
              const { word, line, mortar, num } = part(row)
              const at = i * 1.1
              tl.fromTo(word, { '--fill': 0 }, { '--fill': 1, duration: 1, onUpdate: function (this: gsap.core.Tween) { mark(num)(this) } }, at)
                .to(mortar, { scaleX: 1, duration: 1 }, at)
                .to(line, { yPercent: 0, duration: 0.55, ease: 'settle' }, at + 0.4)
            })
            tl.to({}, { duration: 0.35 })
          } else {
            rows.forEach((row) => {
              const { word, line, mortar, num } = part(row)
              gsap
                .timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: row, start: 'top 82%', end: 'bottom 48%', scrub: 0.5 } })
                .fromTo(word, { '--fill': 0 }, { '--fill': 1, duration: 1, onUpdate: function (this: gsap.core.Tween) { mark(num)(this) } }, 0)
                .to(mortar, { scaleX: 1, duration: 1 }, 0)
                .to(line, { yPercent: 0, duration: 0.5, ease: 'settle' }, 0.45)
            })
          }
          return () => rows.forEach((row) => part(row).num.removeAttribute('data-on'))
        },
      )
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      data-testid="verbs"
      data-band="dark"
      aria-labelledby="verbs-title"
      className="on-dark relative overflow-hidden bg-deep-700 text-white"
    >
      <div aria-hidden="true" className="grain-layer" />
      <div aria-hidden="true" className="verbs-glow pointer-events-none absolute inset-0" />
      {/* the hero ends in deep-700 under its crenellations; the band's top continues that tone, so
          the wall's edge flows into the band with no tonal seam */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[7.5rem] bg-linear-to-b from-deep-700 to-transparent" />
      {/* the verbs' outline: a ring around each joined word (see .verb-word::before) */}
      <svg aria-hidden="true" focusable="false" className="absolute size-0">
        <filter id="verb-hollow" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="dilate" radius="1.6" result="grown" />
          <feComposite in="grown" in2="SourceAlpha" operator="out" result="ring" />
          <feFlood floodColor="#AFEAD5" floodOpacity="0.42" />
          <feComposite in2="ring" operator="in" />
        </filter>
      </svg>
      <div className="wrap relative flex flex-col justify-center pt-20 pb-[calc(var(--sq)+4.5rem)] lg:min-h-svh lg:pt-[calc(var(--header-h)+1rem)] lg:pb-[calc(var(--sq)+2.5rem)]">
        <h2 id="verbs-title" className="flex items-center gap-3 text-label text-mint-200">
          <SectionMarks />
          {title}
        </h2>
        <ol className="m-0 mt-6 list-none p-0 lg:mt-4">
          {verbs.map((v) => (
            <li
              key={v.n}
              data-verb
              className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-1 pt-3 pb-5 sm:gap-x-6 lg:grid-cols-[auto_minmax(0,auto)_minmax(0,1fr)] lg:gap-x-10 lg:py-1"
            >
              <span data-num aria-hidden="true" className="verb-num grid size-11 place-items-center text-[1.25rem] leading-none font-bold sm:size-14 sm:text-[1.5rem]">
                {v.n}
              </span>
              <span data-word data-text={v.word} className="verb-word text-verb">{v.word}</span>
              <span className="col-span-2 block overflow-hidden lg:col-span-1 lg:self-center lg:justify-self-end">
                <span data-line className="block max-w-[26rem] text-[1.0625rem] leading-[1.7] text-on-dark lg:text-[1.1875rem]">
                  {v.line}
                </span>
              </span>
              <i data-mortar aria-hidden="true" className="verb-mortar absolute inset-x-0 bottom-0 h-px" />
            </li>
          ))}
        </ol>
      </div>
      {children}
    </section>
  )
}
