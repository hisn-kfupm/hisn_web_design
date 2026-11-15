# 04 · Revision after the lead's review (15 Nov 2026)

The lead tried the redesign and said:

- «i dont see you using images — use some images even if just as dummy images»
- «the website feels heavy and scrolling sometimes glitches»
- «it is not very intuitive, feels a bit messy and long scrolling»

This document overrides `02-redesign.md` wherever they disagree. The living-wall identity stays (bricks, squares, crenellations, the «لبنة» drop, the mint accent), but it becomes the **frame** around clear content, real photography and fast pages, not the content itself.

## 1. Principles

1. **Clarity first.** Every screen answers one question and offers one obvious next step. A first-time visitor knows within five seconds what Hisn is, what is coming up and where to click.
2. **Photography carries the emotion; the wall carries the identity.** Text never sits on busy textures or brick labels.
3. **Native, smooth scrolling.** Motion responds to the visitor; it never takes over the scroll.
4. **Short pages.** Homepage ≤ about 5 desktop screens (≈ 4,500 px at 1280×800, footer included) and ≤ about 8 phone screens (≈ 6,500 px at 375). Inner pages lead with content; no tall empty bands.
5. **One pattern per job.** One card anatomy across the site (image → meta → title → action), one section-head style, one button family. Fewer ideas per screen, executed well.

## 2. Images

- **Stand-in photos**, freely licensed (Unsplash licence, CC0, or CC BY with credit), in `hisn/public/images/stand-in/`: at most 1800 px wide, JPEG quality about 75, at most about 350 KB each, with `CREDITS.md` beside them (file, author, source URL, licence). They are placeholders until the team has its own photos, and the credits file says so.
- **Subjects:** students at talks and workshops, engineering labs, electronics and circuit boards, manufacturing and 3D printing, aircraft maintenance and aerospace, satellites and space, data centres and cyber security, control rooms and systems, the KFUPM campus and Dhahran. **Never** weapons, soldiers, military vehicles, explosions or flags (the brand is national, technical, sober and modern, not military). Avoid logos and close-up faces.
- **`lib/data/images.ts`** maps every use to a file: hero set, the three verbs, one per department, event covers (by department, picked by event id when an event has no `image_url`), talent, library fallback, 404. Alt texts are ar.json keys (descriptive drafts with «مؤقت»).
- **`components/ui/Photo.tsx`**: a `next/image` wrapper with square corners, the brand grade (a deep-teal multiply layer at roughly 35–45% so mixed stock reads as one set, an optional mint glint within the 10% rule), a fixed set of ratios (16:9, 4:3, 1:1, 3:4), `sizes` always set, `priority` only on the page's LCP image, and a blur placeholder.
- **Motion on photos:** a reveal where a grid of at most 24 square cells clears in a stagger, once, on entering the viewport (transform/opacity only): the brick motif applied to photos. Hover: a slow 1.04 zoom inside the frame.

## 3. Performance budget

Judge on a production build (`next build` then `next start`), never the dev server, which is much heavier.

- **Remove Lenis entirely.** Native scrolling; `scroll-behavior: smooth` only for in-page anchors and only without reduced motion.
- **No pinned sections and no scrubbed timelines** over long sections. Scroll-linked motion is limited to cheap transforms on at most two elements (an optional hero parallax).
- **Reveals run once on entry**, transform and opacity only (IntersectionObserver, or ScrollTrigger with `once: true` and `batch`).
- **Hero canvas** (if kept): device-pixel ratio capped at 1.5; static layers drawn once into offscreen bitmaps; the animation loop runs only while something moves (the intro, or the pointer light for 1.5 s after movement), and stops offscreen or in a hidden tab. No endless idle loops.
- **No** full-viewport fixed overlays, no `mix-blend-mode` or `backdrop-filter` on large areas, no animated SVG filters, no `background-clip: text` animations, no text-stroke on huge type.
- **Footer in normal flow**: no curtain and no fixed reveal.
- **Targets** at 1280×800 and 375×812 with 4× CPU throttling on the production build: at least 95% of scroll frames under 20 ms and no long task over 100 ms while scrolling; LCP under 2.5 s; CLS under 0.05; TBT under 200 ms; report the homepage's gzipped JS (aim ≤ 200 KB).

## 4. Homepage: new order (desktop ≈ 4,500 px)

1. **Hero** (fits the first screen): the slogan with the «لبنة» drop; one sentence on what Hisn is; the primary action «الفعاليات القادمة» and, as the second path, the major search («ما تخصصك؟»). The wall becomes a **mosaic of brand-tone bricks and five to seven photo bricks** on the inline-end side (desktop) or under the copy (phone), laid in course by course once. Major names may sit on bricks, but never behind the copy. The next event is a compact card.
2. **What Hisn does**: three columns (تعرّف · تؤهّل · تصل), each with a photo, the verb in big type and one line. No pin (≈ 600 px).
3. **Upcoming events**: three cards with a cover photo, a date brick, title, department, format and seat meter, plus «كل الفعاليات» (≈ 700 px).
4. **Departments**: six photo tiles (3×2 on desktop, 2×3 on tablet, one column or a snap row on phones) with the icon, name and one line; each tile links to `/departments/<slug>`. Hover zooms the photo and slides up the summary (≈ 800 px).
5. **Recordings**: the four latest as video thumbnails (photo and a play square) linking into the library, plus «المكتبة» (≈ 550 px).
6. **Talent**: one split band: a photo on one side, the youthful line and one call to action on the other (≈ 450 px).
7. **Footer**: compact and in normal flow: the closing line (large, not giant), the links, the contact (≈ 450 px).

**Cut:** the majors marquee, the pinned verbs band, the department dissolve panel, the stepped talent course, the footer curtain, and the draggable strip on desktop (a plain row on desktop, a snap row on phones).

## 5. Inner pages

- **PageHead** gets shorter (about 360–420 px on desktop), gains an optional photo on the inline-end side, and shows breadcrumbs.
- **/events**: keep the month grid and the phone list; add thumbnails to the list and a featured next-event card with a photo at the top.
- **/events/[id]**: a cover photo in the head; the register block as designed (sticky beside the text on desktop, a bottom bar on phones), with lighter motion.
- **/departments/[slug]**: a head photo, the description, roles, events, recordings, and previous/next department.
- **/library**: a thumbnail grid, filter chips, play in place.
- **/talent, /privacy, /sign-in, 404**: as in the stage-2 brief, with a photo where it helps (talent, 404).

## 6. Intuitiveness checklist

- Header: the current tab is marked; the departments menu lists all six with icons; sign-in is visible.
- Every section heading says what the section is in plain words. Every card is one link, clickable as a whole, with visible hover and focus.
- Phones: targets at least 44 px; no content that can only be reached by dragging; a compact sticky header.
- Remove decoration that does not help understanding. Small section numbers may stay.
