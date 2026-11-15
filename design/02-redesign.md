# Hisn redesign: «الجدار الحي» (The Living Wall)

**Status:** art direction for the full-site redesign ordered on 15 Nov 2026. It replaces the look of Direction A «لبنة» (`01-discovery.md` §7). The discovery facts (audiences, journeys, data rules) still hold.

**Why the redesign:** the frontend lead rejected the D1-08 homepage. In his words, it was "dead and too formal, as if made for a formal company, with no animation, kind of empty. The hero looks awful." He wants an award-winning site: unique, modern, with satisfying animation, not generic or AI-made, and good enough to amaze the team.

---

## 1. The idea

The approved slogan says «كل تخصص لبنة في حصن الوطن»: every major is a brick in the nation's fortress. This site makes that literal.

- **The wall:** the hero is a fortress wall built from bricks, and every brick is a major. The wall assembles in front of you, crowned with the crenellations from the logo and the guide's band of squares.
- **The student's brick:** a student looking for their place finds their own major's brick, lit in the wall.
- **Everything else follows:** sections are laid like courses of masonry, numbers sit in squares, and transitions are made of squares.

Three sources of energy, one system:

1. **Masonry:** bricks with weight that drop, settle and lock into place.
2. **Kinetic Arabic type:** huge words that fill, slide and reveal, like a festival poster with a Swiss grid's discipline.
3. **The square:** the brand's atom. Progress, wipes, particles and meters are all made of squares.

**Character** (brand guide p.3): وطني · تقني · رصين · حديث. It is never military: no weapons, soldiers, vehicles, camouflage, radar, crosshairs, targeting, HUD or war-room tropes. The light raking across the wall is warm and architectural (dusk over a stone wall), never a searchlight.

---

## 2. Brand rules, summarised from the guide

You do not need to open the PDF.

### Colours
| Name | Hex | Role |
|---|---|---|
| deep | `#022C33` | dark backgrounds, main text |
| mid | `#04424C` | the middle of the gradient |
| teal | `#03606D` | headings, the brand colour |
| green | `#0E8B6B` | emphasis, section numbers |
| mint | `#5FD4AA` | touches and glows only, ≤10% of a view |
| box | `#EDF4F2` | boxes, alternating rows |
| page | `#F7FAF9` | page background |

- **Scales:** each colour has a 50–900 scale in `app/globals.css` (e.g. `bg-deep-900`, `text-teal-700`). Tailwind's own palette is removed, so no other hue exists. Opacity modifiers are fine.
- **Official gradient:** linear 120°, teal 0% → mid 50% → deep 100%, with a mint radial glow at 22%. The utility is `bg-brand`. It is not the logo's mint → green gradient.
- **Contrast** (guide p.14):
  - White passes on deep (14.9), mid (11.1) and teal (7.2).
  - Deep on page is 14.2; teal on page is 6.9.
  - Green on page is 4.1: large text only. White on green is 4.26: large text only.
  - Mint on deep is 8.1 and on mid 6.1; on teal it is 4.0, large text only.
  - **Never** mint text on white, page or box (1.6–1.8).
- **Light and dark:** the guide's split for a single design is 60 light / 25 deep+mid / 10 teal+green / 5 mint. The website alternates dark and light bands for rhythm (roughly half and half). Mint stays an accent.

### Type
- **Font:** IBM Plex Sans Arabic only (its Latin matches IBM Plex Sans), loaded as `font-sans`, weights 400/500/600/700.
- **Weights:** 700 for titles, big numbers and approved lines; 600 for sub-headings, labels and department names; 500 for secondary lines; 400 for body.
- **Guide scale:** display 56/1.25, H1 40/1.35, H2 28/1.4, H3 20/1.5, body 16/1.7, small 14/1.65, label 13/1.4 (600), big numbers 72/1.1. Minimum 12 px.
- **This redesign goes far past 56 px for display type.** Display sizes are fluid up to about 9vw for the hero and 12vw for kinetic words. Keep line-height ≥ 1.15 (≥ 1.2 for multi-line Arabic) and leave room inside masks so diacritics and descenders are never clipped.
- **Never letter-space Arabic**, and never split Arabic into letters, which breaks the joining. Animate by line or word, or with masks and clip-paths. Kashida (ـ) is the native way to stretch a word.
- **Numerals:** Eastern Arabic in Arabic text (٠١٢٣٤٥٦٧٨٩). Latin only for technical codes and links. The digits aren't tabular, so changing numbers go in fixed-width boxes.
- **Mixed text:** Latin words inside Arabic go in `<Bdi lang="en">`.

### Logo and graphic elements
- **The logo:** use `components/brand/Logo.tsx` as is. Never redraw, recolour, rotate, skew, stretch, pixelate, morph, shadow, outline or animate its parts. Fading, moving and uniform scaling of the whole logo are fine.
  - Keep its clear space. Minimum mark height is 24 px; minimum horizontal lockup width is 96 px.
  - Don't place it on busy backgrounds.
  - Its parts are the crenellations (الشرفات), stepped tower, diamond window and gradient shield.
- **Official elements to build with:**
  - the band of squares (crenellations) along the bottom edge of covers
  - the mint → teal hairline across the top of pages
  - numbered green squares with ■■■ marks (three mint squares at falling opacity)
  - cards with a thick top border
  - boxes with a thick accent bar on the inline-start side
  - square corners everywhere (no radius except true circles)
- **No photos and no stock imagery.** Nothing is cleared. Visuals are typographic, generative or geometric.

### Voice (guide p.18)
- **Youthful voice for students:** short, direct sentences with enthusiasm and confidence, speaking to the student about their major, in plain فصحى. The guide's example is «تخصصك له مكان في القطاع الدفاعي. ابدأ من أول لقاء.»
- **Formal voice for organisations.**
- **We say:** «الصناعات الدفاعية تتّسع لكل تخصص»، «حاضنة مواهب تعمل على مدار العام»، «نربط الطلاب بجهات القطاع».
- **We never say:** معسكر، تجنيد، أسلحة، «مبادرة عسكرية»، «الأولى عالميًا»، or exaggerations without evidence.
- **Approved lines,** used verbatim:
  - **slogan:** «كل تخصص لبنة في حصن الوطن»
  - **core idea:** «الصناعات العسكرية جزء من الصناعات الدفاعية لا كلها»
  - **closing:** «أول خطوة في بناء صناعة دفاعية وطنية هي بناء من يفهمها»
  - **about:** the `brand.about` key

---

## 3. Team code rules (enforced by lint and tests)

- **No literal UI text in JSX:** every user-facing string is a key in `lib/i18n/ar.json`, read with `t('key')`.
  - The `hisn/no-literal-text` lint rule fails on Arabic JSX text and on `alt`, `title`, `placeholder` and `aria-label` values containing letters.
  - The file is flat with dotted keys. `{name}` placeholders must be supplied.
  - New draft copy ends with « «مؤقت» ». Approved lines don't.
  - Set `NEXT_PUBLIC_HIDE_DRAFT_MARKERS=1` to hide the markers for demos. They stay in the file, so `npm run check:content` still lists them.
- **Logical properties only:** `ms- me- ps- pe- start- end- text-start text-end inset-inline-*`, `margin-inline` and similar.
  - Lint fails on `ml- mr- pl- pr- left- right- rounded-l/r border-l/r float-left/right text-left/right`.
  - Stylelint fails on physical `left`, `right`, `margin-left` and the like.
  - In RTL, "forward" motion travels toward the left (`--dir: -1`).
- **Never name a variable `supabase`.**
- **Times:** stored in UTC, shown in Asia/Riyadh via `lib/time/riyadh.ts`.
- **Server components stay static:** no `Date.now()`, `Math.random()` or argless `new Date()` while rendering on the server.
  - The app runs Next 16 with Cache Components, so pages cache with `'use cache'` + `cacheLife()`, never `export const revalidate` or `dynamic`.
  - Runtime data such as `searchParams` must sit under `<Suspense>`.
  - Next's docs ship in `node_modules/next/dist/docs/`, and this version differs from older ones, so read them before using an API.
- **Tests first** for logic (Vitest, `tests/unit/`). Keep the existing contracts green:
  - `Header`'s `data-testid="auth-entry"` stays outside `data-testid="mobile-menu"`.
  - `data-testid="dept-menu"` holds one link per department.
  - `EventImage` keeps its fallbacks.
  - the queries API stays as it is
  - every `t()` key exists.
- **Stand-in data:** events come from `lib/events/queries.ts`, which reads `lib/events/stand-in.ts` until the database lands. Department names, majors and seat counts are stand-ins too, marked «مؤقت».

---

## 4. The system

### Motion principles
- **Weight:** physical things (bricks, cards, panels) have mass. They anticipate, fall, squash a little (scaleY 0.94) and settle with a small overshoot.
  - **Custom eases:** `brick-drop` is a fast fall with a short rebound; `settle` is `cubic-bezier(.2,.7,.2,1)`; `exit` is `cubic-bezier(.4,0,1,1)`.
  - Never the library default ease.
- **Rhythm:** staggers follow the reading direction, from inline-start (right) to inline-end (left), like a mason laying a course. Courses go bottom to top.
- **Meaning:** scroll-scrubbing is used only where scroll progress means something (filling a word, laying a course, progress). Everything else plays once on entry.
- **Variety:** each section has its own motion idea. The same fade-up is never repeated block after block.
- **Restraint:** one moving focus at a time. Idle motion is slow and rare.
- **Performance:**
  - Animate `transform`, `opacity` and occasionally `clip-path`.
  - Canvas loops run only while visible and while something moves.
  - DPR is clamped to 2, and pointer listeners are throttled to animation frames.
- **Reduced motion** (`prefers-reduced-motion: reduce`):
  - Everything renders in its final, composed state: the wall built, words filled, panels unstacked.
  - No smooth scrolling and no ripples.
  - CSS durations are already forced to 1 ms; JS motion checks `matchMedia` itself.
  - The page must still look designed, not broken.

### Tools
- **GSAP 3.15** (all plugins free: ScrollTrigger, SplitText with `type: 'words,lines'` and masks, Flip, Draggable, DrawSVG, CustomEase, Observer) plus `@gsap/react` (`useGSAP`).
- **Lenis** for smooth scroll, driven by `gsap.ticker` and wired to ScrollTrigger. It is disabled under reduced motion.
- **Canvas 2D** for the wall. Arabic shapes correctly in `fillText`; use the font family from `getComputedStyle(document.body).fontFamily` after `document.fonts.ready`.
- **CSS:** scroll-driven animations, `@property`, `linear()` easing.
- No other animation libraries.

### Page-level devices
- **The hairline is the progress bar.** The brand's mint → teal hairline across the top of every page grows with scroll progress (scaleX from the inline-start).
- **Header:**
  - transparent over dark heroes; a solid deep bar on light content
  - hides on scroll down and returns on scroll up
  - The logo always links home. The sign-in button stays outside the mobile menu.
  - **The mobile menu is a full-screen deep panel** where nav items drop in like bricks.
- **Footer curtain:** the page lifts to reveal a fixed, deep footer underneath. It carries the approved closing line set huge across the width, the logo, links and contact, with crenellations on its top edge.
- **Route transitions** (if the platform supports it cleanly; see Next's `view-transitions.md` guide): a wipe made of squares.
- **Micro-interactions:**
  - **buttons:** a fill wipes in from the inline-start on hover, with a 1 px press
  - **links:** the underline draws from the inline-start
  - **arrows:** nudge forward, toward the left
  - Focus is always visible: teal on light, mint on dark.
- **Grain:** a very subtle noise layer on dark bands for material.

---

## 5. The homepage

### 5.1 Hero: the living wall (the make-or-break part)
- **Plate:** full viewport (min `100svh`) on the official gradient, deep-dominant with the mint glow.
- **Headline:** the slogan, always real text, readable at first paint, in huge 700 type in three lines: «كل تخصص» / «[لبنة]» / «في حصن الوطن».
  - «لبنة» sits inside a mint brick (deep text on mint, square corners) that is also a brick of the wall.
  - Above the headline is a kicker, «جامعة الملك فهد للبترول والمعادن», with ■■■.
  - Below it, the approved about text in `on-dark`.
- **The wall:** a canvas rising from the bottom of the hero (about 55–60% of its height on desktop, 40–45% on phones).
  - **Bricks:** stretcher bricks in running bond (or bricks sized to fit their labels). Each one is a major from `data/majors.json`, set in small 600 type, nearly invisible until lit.
  - **Brick material:** dark tones (deep-600, mid, teal-800/900) with a thin top highlight and bottom shadow, and hairline mortar.
  - **The top course is crenellated:** merlons and gaps, like the logo's الشرفات.
- **Load choreography** (settles within about 1.8 s):
  1. The text is already there.
  2. The wall lays itself course by course from the bottom up: bricks drop about 20 px with weight, staggered start → end.
  3. The crenellations rise.
  4. The mint «لبنة» brick drops into the headline with weight (anticipation, fall, squash, rebound).
  5. On impact, a ring of light travels through the wall's mortar from under the headline, and a few tiny squares puff out like dust.
- **Pointer** ("a reason to touch"): a warm raking light follows the cursor across the wall.
  - Bricks near it catch light on their edges facing the cursor, lift 1–2 px, and their major names surface.
  - Mortar lines near the light glow faintly mint.
  - On touch, the light follows the finger, and a tap reveals the touched brick's major.
- **Find your brick:** a real search field, «ابحث عن تخصصك».
  - Typing lights matching bricks in the wall and dims the rest.
  - Choosing a major pulls its brick out of the wall toward the viewer. It flips to its back: «لتخصصك مكان في حصن» with links to upcoming events and to the departments.
  - It is keyboard accessible, with results announced through `aria-live`.
  - The wall itself is `aria-hidden`.
- **Next event:** a real event from `upcomingEvents({ limit: 1 })`, as a raised brick card embedded in the wall.
  - **Desktop:** at the inline-end side, bottom.
  - **Phones:** below the wall.
  - It shows the date as a big figure, the title, the department and a link.
- **Idle:** now and then one or two bricks glow softly and show their major, like the wall is alive. This is rare and slow.
- **Scroll out:** parallax. The headline leaves faster than the wall, and the crenellated top becomes the edge into the next band.
- **Reduced motion:** the wall is built and static, the brick sits in place, there's no light.
- **Phones:** same punch. The headline is about 48–56 px, the bricks are smaller, the search goes full width, and touch light works.

### 5.2 «ماذا نفعل»: the three verbs
- Three giant words, تعرّف · تؤهّل · تصل, the three verbs of the approved description.
- **Desktop:** the section pins. As you scroll, each verb fills from outline to solid (a fill sweeping across the word through `background-clip: text`; no letter splitting). Its line of explanation slides in under a mask.
- **Phones:** the verbs stack and fill as each passes the centre.
- The band is deep, and each verb carries a numbered square ٠١ ٠٢ ٠٣.

### 5.3 The band of majors
- Two counter-scrolling marquee rows of major names separated by small squares, about 6vw tall. One row is solid, the other outlined.
- Speed follows scroll velocity.
- It is decorative (`aria-hidden`), with one sentence for screen readers.

### 5.4 «الفعاليات القادمة»: the course of events
- Not cards: an editorial timetable on a light band. Each event is a full-width row with:
  - the day as a huge figure, and the month and weekday
  - the title and department
  - the format and place
  - a seat meter of 10 bricks filled in proportion to seats taken, with its text (`ar` plural forms)
  - an arrow
- **Hover:** teal fills the row from the inline-start, the text turns white and the arrow moves forward.
- **Entry:** rows are laid one by one (a clip reveal from the start), and their meters fill.
- A link to «كل الفعاليات» completes it.

### 5.5 «الأقسام»: index and live preview
- Six departments, light band.
- **Desktop:** a numbered index (٠١–٠٦, large type) on one side and a sticky preview panel on the other. The panel shows the department's icon drawn with an SVG stroke, its name, its summary and its link.
  - Hovering or focusing an index item swaps the panel through a dissolve made of squares.
- **Phones:** an accordion of the same items.

### 5.6 «قاعدة المواهب»: the invitation
- **Deep band.** The guide's youthful line, «تخصصك له مكان في القطاع الدفاعي. ابدأ من أول لقاء.», set huge. It reveals word by word with scroll: each word's opacity goes from 0.15 to 1, and Arabic words stay intact.
- **The two ways in** are two bricks numbered ١ and ٢:
  - attend an event, then you're invited
  - join directly, then attend one event to stay
- A line draws from brick to brick to the CTA «انضم لقاعدة المواهب», which is magnetic.

### 5.7 «أحدث التسجيلات»
- A draggable horizontal strip of video cards with inertia, on a light band.
- Covers are generated from bricks and the department icon, because no thumbnails are cleared.
- The strip shows the play affordance.

### 5.8 Footer
The curtain reveal from §4: the closing line huge, the logo, links (privacy, contact `<Bdi>`), and the newsletter slot for D1-6.

---

## 6. Inner pages

Same system; each page has a short dark head with a strip of the wall and its crenellations.

- **`/events`, the calendar** (dev-1 D1-10):
  - a month title in huge type, with previous and next square buttons that keep `?m=YYYY-MM`
  - **desktop:** a 7-column grid of square cells, Friday and Saturday tinted, events as small bricks in the cells, today marked
  - **phones:** a list grouped by day
  - Changing the month staggers the cells in.
  - Badges: «انتهت»، «أُلغيت»، «المقاعد شارفت على الاكتمال!».
  - If the month has no upcoming event, it shows a banner for the next one.
- **`/events/[id]`, the event page** (D1-11):
  - **title block:** the department label, H1 and a status badge
  - **key facts** in a `<dl>`: the day figure, the time range with «بتوقيت الرياض», format and place, presenter
  - a sticky action brick with `RegisterButton` in all 8 states, using the stub actions, with the seat meter and add-to-calendar
  - the description and related events
- **`/departments/[slug]`** (D1-9): the department icon large, name, summary, description, example roles, its upcoming events, its recordings, and the talent invitation.
- **`/library`** (D1-12): recordings newest first, a filter `?d=<CODE>`, and video cards that play in place (youtube-nocookie). Only one plays at a time.
- **`/talent`** (D1-17, public part): the invitation, the two ways in explained, what joining means, and the "opens soon" state while the form flag is off.
- **`/privacy`:** the final text comes from the spec (§7.10) and must not be invented. The page carries the structure, the contact address and a clear «مؤقت» note.
- **`/sign-in`:** auth is Abdullah's (D2-4). Until it lands, a branded holding page.
- **404 and error:** a wall with one brick missing; the figure ٤٠٤ is made of bricks; the full navigation.

---

## 7. Banned, because it reads as generic or AI-made
- a centred headline, subtitle and two buttons over a gradient blob
- three identical icon cards
- glassmorphism; purple, neon or any off-brand hue; emoji
- particle networks; meaningless floating shapes
- the same fade-up on every block
- rounded cards with soft drop shadows
- lorem ipsum, or invented statistics, partners, testimonials or awards
