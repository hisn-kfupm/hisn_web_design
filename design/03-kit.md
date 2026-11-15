# Hisn redesign kit: what to reuse

**For:** the inner-page builders (D1-9 departments, D1-10 calendar, D1-11 event page, D1-12 library, D1-17 talent, 404, privacy, sign-in).
**Read first:** `02-redesign.md` (brand rules, motion principles, banned patterns). This file lists what already exists in `hisn/` and how to put a page together with it. Don't re-create any of these.

---

## 1. How to put an inner page together

Every page starts dark. The fixed header overlays the top of the page and is transparent over anything marked `data-band="dark"`, so a page without a dark head gets a header sitting over light content at scroll 0.

```tsx
// app/departments/[slug]/page.tsx (shape only)
<>
  <PageHead kicker={t('nav.departments')} title={name}>   {/* dark head + wall strip + crenellations */}
    <p className="max-w-[40rem] text-on-dark">{summary}</p>
  </PageHead>

  <section aria-labelledby="dept-events" className="bg-page py-16 lg:py-24">   {/* light band */}
    <div className="wrap">
      <SectionHead number={1} id="dept-events" title={t('…')} link={{ href: '/events', label: t('…') }} />
      …
    </div>
  </section>

  <section aria-labelledby="dept-recs" className="bg-box py-16 lg:py-24">…</section>  {/* second light band: use box */}

  <TalentBand />   {/* deep band with its own crenellated top edge */}
</>
```

Rules of thumb:

- **Bands alternate.** Use dark (`bg-deep`, `bg-deep-700`, carrying `data-band="dark"`, `on-dark`, and a `grain-layer`), then `bg-page`, then `bg-box`. Two light bands in a row are told apart by page vs box. The last band before the footer should be `bg-page`, because the footer's crenellations are cut out of the page colour.
- **Dark to light edge:** put `<BattlementBand tone="page" edge="bottom" />` inside the dark band (light squares rise into it). **Light to dark edge:** put `<BattlementBand tone="deep" edge="top" />` inside the dark band and give the band `mt-[var(--sq)]`.
- **Section heads:** `SectionHead` numbers ٠١, ٠٢… in page order. Tests count `data-testid="section-number"`, so only SectionHead and SectionNumber should render it.
- **Container:** `wrap` (1200 px max, 20/32 px gutters). Full-bleed strips pad with `ps-[max(20px,calc((100vw-1200px)/2))]`, as in DragStrip.
- **Square corners, mint ≤ 10 %**, mint text only on dark, Eastern Arabic digits (`fmtNum`, `formatRiyadh`), Latin inside `<Bdi lang="en">`.
- **Strings:** all copy lives in `lib/i18n/ar.json`. Client components get resolved strings as props, never `t()` in the browser. Use `pluralForms(base)` plus `pickPlural` for client plurals. New draft copy ends in « «مؤقت» ».
- **Caching:** use `'use cache'` + `cacheLife(...)`; runtime data goes under `<Suspense>`.

---

## 2. Brand and layout components (`components/brand/`)

| Import | Props | Use it for |
|---|---|---|
| `PageHead` from `@/components/brand/PageHead` | `kicker?`, `figure?` (big figure above the title, e.g. ٤٠٤), `title`, `size?: 'h1'\|'display'`, `children?`, `className?` | The dark head of every inner page: gradient, grain, header padding, `data-band="dark"`, and a WallStrip with crenellations at its foot. It renders the page's single h1. |
| `WallStrip` | `idPrefix?` (unique per page), `courses?` (default 3), `className?` | A static SVG strip of the wall in running bond under a crenellated course, in the hero's tones. PageHead already includes one. Use it alone only at the bottom of another `relative` dark band. |
| `BattlementBand` | `tone?: 'page'\|'deep'`, `edge?: 'bottom'\|'top'`, `animate?` | The guide's band of squares as a band edge (see §1). |
| `SectionHead` | `number`, `id` (the h2 id), `title`, `intro?`, `link?: {href,label}`, `tone?: 'light'\|'dark'`, `className?` | Every section title: the green ٠١ square, ■■■, a big h2, and an optional "see all" ArrowLink. |
| `SectionNumber` | `size?: 'md'\|'lg'`, children | The green numbered square on its own. |
| `SectionMarks` | `size?: 'md'\|'lg'` | ■■■ beside labels and kickers. |
| `RecordingCover` | `id`, `departmentCode`, `className?` | A generated video cover: a patch of wall seeded by the event id, the department icon in a deep opening, and a mint play square. Use it in the library (D1-12) and on department pages; there are no cleared thumbnails. Deterministic, so it is safe on the server. |
| `Logo` | `variant`, `tone`, `height`, `idPrefix`, `title` | The logo as is (never redraw or animate its parts). |

## 3. UI components (`components/ui/`)

| Import | Props | Use it for |
|---|---|---|
| `Button`, `LinkButton` from `@/components/ui/Buttons` | `variant: 'primary'\|'secondary'\|'ghost'`, `tone: 'light'\|'dark'`, `size: 'sm'\|'md'\|'lg'`, `block`, `arrow`, plus button or Link props | All buttons. The fill wipes in from the inline-start on hover, with a 1 px press. `buttonClass(opts)` from `@/components/ui/button` gives the same classes for raw elements. |
| `ArrowLink` | `href`, `tone`, `className`, Link props | Text links with an underline that draws in and an arrow that nudges forward. |
| `ArrowGlyph` | `size?` | The forward arrow alone; it nudges when its parent `a`, `button` or `.group` is hovered. |
| `Magnetic` (client) | `children` (one interactive element), `strength?` 0.32, `reach?` 70 px, `className?` | A primary CTA that leans toward a nearby mouse. It does nothing on touch screens and under reduced motion. Use one per view at most. |
| `SeatMeter` (server) | `capacity`, `taken`, `tone?`, `reveal?`, `className?` | Ten bricks plus «تبقّى …» in plural forms. Set `data-reveal` on `.seat-meter` to play the lay-in (LayCourses does this). |
| `Icon` | `icon` (lucide), `mirror?`, `size?`, `className?` | Every lucide icon. Mirror only directional ones. Use it instead of creating `const Glyph = deptIcon(…)` during render, which lint rejects. |
| `Tag` | `tone: 'danger'\|'warning'\|'muted'\|'ok'`, `icon`, children | Status badges: «انتهت», «أُلغيت», «المقاعد شارفت على الاكتمال!» (`event.badge.almostFull`). |
| `Bdi` (`@/components/Bdi`) | `lang?` | Latin inside Arabic text. |
| `EventCard`, `EventImage` (`@/components/`) | `event`, `variant: 'upcoming'\|'recording'` | The older card, kept because it is tested and suits dense lists (calendar day lists on phones, related events). The homepage no longer uses it. |

## 4. Section components (`components/home/`), reusable on inner pages

| Import | Props | Notes |
|---|---|---|
| `EventsTimetable` (server) | `number`, `events: PublicEvent[]`, `taken: Map<id, number>` | The editorial timetable: a huge day figure, title and department, format and place, a seat meter, and an arrow. Teal fills the row from the inline-start on hover or focus. Rows are laid in by LayCourses. Use it on department pages with `upcomingEvents({ limit, departmentCode })` and `seatsTaken(ids)`. Its h2 id is fixed (`upcoming-title`), so use it once per page. |
| `LayCourses` (client) | `className`, children (`<li data-course>`) | A generic `<ol>` that lays rows in with a clip from the inline-start, drops each `[data-day]` figure, and fills each `.seat-meter`. It works for any list of rows: calendar rows, library lists. |
| `TalentBand` (server) | `className?` | The whole invitation band: the guide's line revealed word by word, bricks ١ and ٢ stepping down like the tower, a drawn line, and the magnetic CTA to /talent. Use it as-is on department pages and as the opener of /talent. |
| `DragStrip` (client) | `labels: {prev,next,drag}`, children (`<li data-card>` holding `.rec-tilt`) | A horizontal strip. With a mouse it drags with inertia, snaps per card, and the cards lean with the throw. On touch, under reduced motion and without JS it falls back to native scrolling with snap. It has square prev/next buttons and a progress hairline. |
| `RecordingsStrip` (server) | `number`, `recordings` | DragStrip of recording cards. Each card links to `/library#recording-<id>`, so **D1-12: give each library card `id="recording-<id>"`.** |
| `DeptIndex` (client) / `Departments` (server) | `items`, `labels` / `number` | The numbered index with a sticky preview, a square dissolve and a drawn icon; an accordion on phones. Homepage only. |
| `Verbs`, `MajorsBand` | none | Homepage only. |

Hero internals (for the 404 wall and other wall pieces) are listed in the hero builder's notes: `components/hero/wall-layout.ts` (pure `layoutWall`) and `wall-engine.ts` (`WallEngine`).

## 5. Data helpers

- `upcomingEvents`, `latestRecordings`, `getPublicEvent` from `@/lib/events/queries`. Their API is frozen.
- `seatsTaken(ids): Promise<Map<id, taken>>` from `@/lib/events/seats` (stand-in counts in `stand-in.ts` → `standInSeatsTaken`). Seats are live, so read them dynamically on the event page.
- `isAlmostFull(capacity, left)` from `@/lib/events/almost-full`.
- `formatRiyadh(iso, 'day'|'month'|'weekday'|'date'|'datetime'|'monthYear'|'time')`, `formatRiyadhTimeRange`, `riyadhDateKey`.
- `departments`, `majors`, `label()` from `@/lib/data/labels`; `deptIcon(code)` from `@/lib/data/dept-icons`.
- `tp`, `pluralForms`, `pickPlural` from `@/lib/i18n/plural`; `fmtNum` from `@/lib/i18n/number`.

## 6. Motion conventions

- **Import GSAP only from `@/lib/motion/gsap`:** `gsap, ScrollTrigger, SplitText, Flip, Draggable, DrawSVGPlugin, InertiaPlugin, Observer, CustomEase, useGSAP, registerMotion`. Call `registerMotion()` at the top of each `useGSAP` callback (it is idempotent). Pass `{ scope: ref }` so cleanup is automatic.
- **Eases:** `'settle'` (default), `'brickDrop'` (falls, lands, rebounds), `'exit'`, `'rise'` (soft overshoot). The CSS twins are `ease-settle`, `ease-exit` and `--ease-drop`. Never use the library default.
- **Reduced motion:** check `prefersReducedMotion()` inside effects (`useReducedMotion()` for rendering) and return early. **The server-rendered HTML must already be the composed final state.** Set the "before" state from JS (`gsap.set` / `fromTo`) only when motion will run. For example, `.verb-word` is filled by default (`--fill: 1`) and JS empties it, and `.timetable[data-armed]` hides meters only once LayCourses has armed them.
- **Prefer `fromTo` for CSS custom properties.** A plain `to()` on a registered `@property` can record the wrong start value under React's double effects.
- **One motion idea per section.** Already used on the homepage: lay-in by clip (timetable), pinned outline-to-solid fill (verbs), velocity marquee (majors), square dissolve plus DrawSVG icon (departments), word-by-word opacity plus a drawn line (talent), inertia drag (recordings), and curtain (footer). On an inner page, reuse these through the components above rather than repeating the same fade-up.
- **Scrub only when progress means something** (filling, drawing, laying a course). Everything else plays once on entry (`ScrollTrigger.batch(..., { once: true })`).
- **Loops** (`gsap.ticker`) run only while on screen (`ScrollTrigger` `onToggle`). Pointer work runs at most once per animation frame. Animate transform, opacity and clip-path only.
- **Inner scrollers** get `data-lenis-prevent`. `useLenis()` gives the Lenis instance (`stop`, `start`, `scrollTo`) or null.
- **Canvas and jsdom:** `getContext` returns null in tests, and IntersectionObserver and ResizeObserver are no-ops, so every component must render readable DOM without them.
- **Header contract:** dark regions carry `data-band="dark"`. `html[data-menu="open"]` is set while the mobile menu is open, and `html[data-curtain="on"]` with `--footer-h` comes from FooterCurtain.

## 7. CSS utilities (in `app/globals.css`)

`text-hero`, `text-kinetic`, `text-mega`, `text-verb`, `text-marquee`; `bg-brand`, `band-dark`, `grain-layer`, `wrap`; `.draw-line` (add `data-current` to keep it drawn); `.drop-in` (children fall like bricks, stagger with `--i`); `.nudge`; `--start` and `--dir` for RTL-aware transform origins and forward motion; `--sq` (battlement square); `--course` (wall course height); `--header-h`.
