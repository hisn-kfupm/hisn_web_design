# Prototype: Direction A «لبنة»

A throwaway HTML prototype, built before anything goes into the app repo (discovery doc §9). It's one file, `index.html`, using plain CSS and JS with the brand-kit tokens. Open it in any browser; it needs internet for Google Fonts.

**Covers:**
- the hero, with Signature 2 (the battlement band)
- the event card in 6 variants
- the register button in all 8 states, plus signed out and pending
- the calendar: grid at 768 px and up, list below that, plus the empty state in December
- a live "checks" panel

**Not covered yet:**
- the majors wall (Signature 1)
- a full event page and the admin screens

**Toolbar:** replay the band · simulate reduced motion · hide the «مؤقت» markers.
**URL flags:** `?rm` (end state, no motion) · `?clean` (no markers) · `?debug` (reports elements that overflow the viewport).

**Screens** (`screens/`): `hero-375.png`, `hero-1280.png`, `full-375.png`, `full-1280.png`, and `band-in-progress-1280.png` (a frame captured mid lay-in). They were taken with Chromium headless shell at true 375 px and 1280 px widths, with `?rm`.

## What the checks found (Sat 14 Nov)

| # | Question from the discovery doc | Result | Effect |
|---|---|---|---|
| 1 | Do the Eastern Arabic digits support tabular figures (`tnum`)? | **No.** The font file (Google Fonts v15) has no `tnum` feature, and digit widths range from 263 to 630 units (١ narrowest, ٣ widest). | Day numbers, seat counts and times in columns sit in fixed-width boxes. Don't rely on `tabular-nums`. |
| 2 | Does Plex Arabic's Latin match IBM Plex Sans? | **Yes.** Width difference is 0.00–0.03% at 400, 600 and 700. | Don't load IBM Plex Sans for English words inside Arabic text. It saves a family. |
| 3 | Do all four weights load? What does 600 cost? | All four load, and 600 is visibly different from 700. Arabic subset ≈ **33.5 KB per weight** (woff2). | Add 600 for about 34 KB. Four weights ≈ 134 KB of Arabic. |
| 4 | Intl output with `ar-SA-u-ca-gregory-nu-arab` | «الأربعاء، ١٨ نوفمبر ٢٠٢٦» · «٦:٠٠ م» · range «٦:٠٠–٨:٠٠ م» · «٢٤٫٨٩٪» · no Hijri year · `riyadhDateKey` stays Latin | In D1-7 the test strings change: '6:00' → '٦:٠٠', '18' → '١٨', '2026' → '٢٠٢٦'. |
| 5 | Arabic plurals | `Intl.PluralRules('ar')` gives zero/one/two/few/many/other; the six seat strings read correctly | Add `tn()` (discovery G-8). |
| 6 | Contrast | All 17 color pairs used pass (see panel 6) | — |
| 7 | Horizontal overflow | None at 320, 360, 375, 768, 1024, 1280 or 1440 px | **At 320 px (the WCAG 1.4.10 reflow width) the header only fits if the sign-in button collapses to an icon below 360 px**, keeping its full accessible name. Carry this into D1-5. |
| 8 | Band timing | 28 squares at 1280 px; the stagger scales so the lay-in takes ≈0.9 s at any width. Resizing doesn't replay it. | — |

## Design decisions to review

- **The page's top edge is the battlement.** Page-colored squares rise from the bottom of the deep hero, so the light content reads as the top of the wall. The footer repeats this with deep squares.
- **Real data in the hero.** The next-event brick shows the actual next event (`upcomingEvents({limit:1})`), not decoration.
- **Seat meter.** 10 bricks, filled in proportion to seats taken, always next to the text count.
- **Closed, full and cancelled are status text, not disabled buttons.** That way they stay readable and focusable, and say why.
- **Calendar extras:** Friday and Saturday columns are tinted. A "full" badge is added to dev-1's three (ended, cancelled, almost full); this is a proposal.
- **Colors outside the guide** (discovery G-7, need brand-owner sign-off): danger #B42318 with tint #FCEEEC; warning #8A5A00 with tint #FBF3E1.
- **The wordmark is live text here,** because inline SVG can use the loaded font. The app needs an outlined lockup (discovery G-2).

## Still to check
- Screen readers on real devices (VoiceOver, TalkBack).
- Performance on a real mid-range Android.
- Signature 1, the majors wall; it lands in D1-18.
