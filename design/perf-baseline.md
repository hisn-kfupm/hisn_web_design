# Performance baseline (before the revision)

Measured 16 Nov 2026 on a production build of `54088d9` (`next build` + `next start -p 3211`), with
`scratchpad/redesign/perf.mjs` (Playwright headless shell, CDP CPU throttling 4x, fresh context per run,
two runs per row, ranges shown). Desktop 1280x800 scrolls with a wheel of 120 px every 16 ms; phone
375x812 (touch, DPR 2) scrolls with `scrollBy(60)` every 16 ms. Re-run after the rebuild with:

    node perf.mjs http://localhost:3211/ out.json --ablate=base,rm,nolenis,nocanvas,nograin,nofx --runs=2 --chunks
    node perf.mjs http://localhost:3211/ out.json --gl=swiftshader --ablate=...   # weak-GPU mode, see below

**Two renderer modes.** The headless shell has no real GPU. In the default mode it composites in
software and only the main thread (JS, style, layout) is throttled, so it mostly measures script cost.
With `--gl=swiftshader` it composites through emulated GL, where every blended or filtered layer costs
real fill time: a stand-in for a weak GPU (a cheap laptop or an older phone). The jank the lead sees
shows up only in the second mode, and both modes agree on the main thread: **no long task over 100 ms
during any scroll, in any run**. The jank is paint/compositing, not JavaScript.

## Numbers

Load (default mode; swiftshader within ±80 ms except one cold run at 4.7 s LCP):

| page · width | LCP ms | CLS | TBT ms | JS gzip | requests | page height |
|---|---|---|---|---|---|---|
| / · 1280 | 436–444 | **0.739** | 149–181 | 252.9 KB | 31 | **8,662 px** (6,742 without the verbs pin spacer) |
| / · 375 | 164–168 | 0 | 140–146 | 252.9 KB | 30 | **7,120 px** |
| /events · 1280 | 488 | **0.739** | 19 | 254.2 KB | 31 | 2,723 px |
| /events · 375 | 128 | 0 | 20 | 254.2 KB | 30 | 4,408 px |

Targets (04 §3/§1): LCP < 2.5 s ✓, CLS < 0.05 ✗ on desktop, TBT < 200 ✓ (barely on /), JS ≤ 200 KB ✗,
homepage ≤ 4,500 / 6,500 px ✗ (1.9x on desktop, 1.1x on phones).

Homepage scroll, desktop 1280, frames over 20 ms / over 50 ms / p95 / max (ms):

| ablation | default mode | swiftshader (weak GPU) |
|---|---|---|
| base | 2.0–2.2% / 0.2% / 16.8 / 67 | **20–25% / 6–8% / 67–83 / 150–770** |
| rm (no Lenis, no GSAP motion, no pin) | 1.2% / 0% / 16.7 / 33 | 19–22% / 5–6% / 67 / 117 |
| nolenis (native wheel, GSAP kept) | 5.3–6.0% / 0–0.4% / 33 / 67 | 24% / 9–10% / 67 / 267 |
| nocanvas (hero wall off) | **0.2%** / 0% / 16.7 / 33 | 16–17% / **1.6–1.8%** / 33 / 100 |
| nograin (.grain-layer hidden) | 3.0–3.3% / 0.3% / 16.8 / 67 | **5.4–5.5%** / 3.9–4.1% / 33 / 200 |
| nofx (filters, stroke, clip-text, blend off) | 1.8% / 0.2% / 16.8 / 67 | **5.8–5.9%** / 3.7–4.1% / 33 / 100 |

Phone 375 scroll: 0–1.7% of frames over 20 ms in every run and mode, p95 16.8 ms, no long tasks, no jumps.
/events scroll: 0.6% (default) and 3.2% (swiftshader) over 20 ms at 1280; 0% at 375.
Target (≥ 95% of frames under 20 ms): met everywhere except desktop homepage in weak-GPU mode (75–80%).

Homepage JS by chunk (gzip on the wire, 11 files, 252.9 KB):

| KB | chunk | contents |
|---|---|---|
| 73.2 | `0crb-…` | GSAP core + ScrollTrigger + CustomEase, SplitText, Flip, Observer, Draggable, DrawSVG, Inertia (all registered globally in `lib/motion/gsap.ts`) |
| 70.5 | `2agj…` | react-dom |
| 45.8 | `0ksp…` | Next.js router/runtime |
| 16.6 | `28790-…` | homepage stages: hero wall engine, verbs, departments, marquee |
| 10.6 | `25vo…` | Lenis + MotionProvider + lucide icons |
| 9.8 | `36mq…` | shell: header, mobile menu, footer curtain, progress hairline |
| 7.9 / 6.4 / 5.6 / 4.2 / 2.3 | | app misc / talent + home events / seat meter / turbopack runtime / misc |

## Ranked causes

**Jank (desktop scroll):**

1. **`.grain-layer` with `mix-blend-mode: overlay`** on six large dark bands (≈ 4.3 Mpx at 1280: hero 1.0 M,
   pinned verbs band 1.06 M, fixed footer 1.2 M, talent, page heads). Each forces its own blended render
   surface. Hiding it cuts frames over 20 ms from 20–25% to 5.5% in weak-GPU mode. `nofx` (which also kills
   the blend) gives the same 5.8%, so the blend, not the SVG noise or the verbs' filter/stroke, is the cost.
   Under reduced motion the jank stays (19–22%), which proves it is paint, not the animation.
2. **The fixed footer curtain**: a 1,203 k px blended, fixed layer sits under the whole page at every
   frame (`html[data-curtain="on"]`, `position: fixed`, at both widths), so the grain cost is paid all the
   way down, not only on dark bands. It is also the **CLS 0.739** on every desktop page: when the curtain
   switches on after hydration the footer moves into the viewport (the shift is attributed to the footer's
   grain layer, and to `footer.curtain-footer` itself when the grain is hidden). Phones measured CLS 0 even
   though the curtain also switches on there; not explained, possibly it lands before the first paint.
3. **The hero canvas wall**: removing it takes frames over 50 ms from 6–8% to 1.7% (weak GPU) and from
   2% to 0.2% over 20 ms (default), and lowers TBT by ~50–90 ms on both widths (/ 1280: 150–180 → 95–110;
   375: 140 → 48). Its DPR cap is 2 (brief: 1.5), it runs on `gsap.ticker` with idle glow animations every
   4–8 s, and the hero parallax scrub moves it while scrolling.
4. **The pinned verbs band** (`pin: true`, `scrub: 0.7`, 2.4 screens): adds 1,920 px of scroll that shows
   nothing new, re-paints the huge outline-to-solid verbs every frame through an animated `--fill` with
   `background-clip: text`, text-stroke and an SVG filter, and produces layout-shift entries at the pin start
   (y ≈ 720–840) and end (y ≈ 2,750): scroll-time CLS 1.6–2.9 on desktop vs 0.075 with reduced motion.
   scrollY itself never jumped backwards or leapt (0 jumps in all runs).
5. **Lenis**: not a frame-time cost (native wheel is no better: 24% in weak GPU, slightly worse in default),
   but it delays the page: the same wheel input takes 10–15 s to reach the bottom with Lenis vs 8–13 s
   native, and it adds 10.6 KB. It is the "floaty, sometimes glitchy" feel, not the dropped frames.

**Weight:**

1. **GSAP with eight plugins registered up front: 73 KB gzip**, 29% of all JS, on every page including
   /events. Most of the plugins serve features the brief cuts (Draggable/Inertia for the drag strip,
   Flip/SplitText/DrawSVG for stage effects).
2. **Page length**: 8,662 px desktop / 7,120 px phone, of which 1,920 px is the pin spacer.
3. The hero wall engine (part of the 16.6 KB homepage chunk) and its ~50–90 ms of main-thread start-up.
4. Lenis + MotionProvider (10.6 KB) and the curtain/progress-hairline shell code.

## Other observations

- **LCP element** is the hero slogan (`p.text-mega`) on desktop, the hero sentence on phones; on /events it
  is reported as the page head's `.grain-layer` (a decorative layer counted as content).
- **Header**: hides once on the way down (1 toggle per run) and does not flicker; no issue found.
- **404s on every page**: RSC prefetches of routes not built yet (`/library`, `/talent`, `/sign-in`,
  `/privacy`, `/departments/department-1…6`). Harmless now, but they add requests and console errors until
  those pages exist (or the links stop prefetching).
- No page errors and no non-404 console errors in any run.
- Reduced motion on desktop drops 1,920 px (no pin) but keeps the grain and curtain, so it still janks in
  weak-GPU mode.

## Limits of this measurement

- Headless shell on an Apple-silicon Mac; neither mode is a real phone GPU. Weak-GPU numbers are
  pessimistic; default-mode numbers are optimistic. Use both and compare before/after, not absolute.
- The phone scroll is programmatic `scrollBy`, not a touch fling, so phone compositor stress is understated.
- Two runs per row; run-to-run spread is shown as ranges. The home page was measured on the committed
  checkpoint, before the photos land.
