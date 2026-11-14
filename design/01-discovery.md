# Hisn (حصن) website: discovery and design direction

**Status:** proposal for review · **Date:** Sat 14 Nov 2026 · **Author:** frontend (Abdulrahman), with Claude
**Decision needed:** pick Direction A or B (§7), and answer the questions in §10.

**Source tags used throughout**

| Tag | Source |
|---|---|
| `[G p.N]` | Brand guide PDF, page N (read as images) |
| `[K path]` | Brand kit ZIP, file path inside `دليل الهوية البصرية/` |
| `[D D1-N]` | `dev-1.md`, task D1-N |
| `[C]` | Committee content request (screenshot, 14 Nov) |
| `[L]` | Live site https://hisn-sa.org, checked 14 Nov at 375 px and 1280 px |
| **Assumption** | Not confirmed by any source; needs a yes or a correction |

> Any Arabic copy I drafted in this document carries «مؤقت». The three approved lines `[G p.3]` and strings quoted from dev-1.md are not drafts.

**15-minute path:** read §0, the conflict resolutions in §5, the comparison table in §7 and the questions in §10. Everything else is reference for building.

## 0. In one page

- **Recommendation: Direction A «لبنة» (The Brick).**
  - The slogan «كل تخصص لبنة في حصن الوطن» becomes the structure of the site: one brick per major, a running-bond "majors wall", and the guide's band of squares along the hero.
  - Two signature moments, both CSS-only: (1) choosing a major sets its work areas in as bricks, then the job titles; (2) the hero's battlement band lays itself in.
  - About 2 days of design work inside the existing D1 tasks.
- **Brand fixes against current plans:**
  - Use the guide's 120° teal→mid→deep gradient with a mint glow, not teal→mint.
  - Arabic-Indic digits (a *fixed* rule in the guide).
  - Add the 600 weight.
  - Take token values from the brand kit, keeping dev-1's token names, with no dark mode at launch.
- **Things nobody had spotted:**
  - The kit's lockup SVGs render the wordmark as live text, so it falls back to a system font on the web. They must be outlined first.
  - `t()` can't do Arabic plurals.
  - The «مؤقت» check would miss new data files.
  - The teaser's rotating H1 fails WCAG 2.2.2.
- **Committee requests vs dev-1:**
  - The talent base needs **attendance marking + beneficiary status + 3 emails**. The submit gate itself doesn't change.
  - Specializations and Hisnathon fit as static pages, with no database.
  - Both new pages ship only if final content arrives by **Fri 27 Nov, 12:00**.
- **Missing:** the spec and plan files. The teaser's stylesheet was found on the live site.
- **Needed from you:** a direction (A or B) and answers to Q1–Q5. Defaults apply from Mon 16 Nov, 12:00.

---

## 1. Understanding

**What Hisn is** (official wording, use it verbatim in the footer and meta description) `[G p.3]`:
> «حصن» مبادرة طلابية في جامعة الملك فهد للبترول والمعادن، تعمل على مدار العام حاضنةً لمواهب الصناعات الدفاعية: تعرّف الطلاب بالقطاع، وتؤهلهم لأدواره، وتصلهم بجهاته.

The three verbs (تعرّف، تؤهل، تصل: introduce, prepare, connect) are the site's job. The slogan «كل تخصص لبنة في حصن الوطن» is its main promise: this sector has a place for **every** major, not only engineering.

### Audiences

| Audience | What they need from the site | Tone `[G p.18]` | Main pages |
|---|---|---|---|
| Students of every major | "Is there a place for my major?", then events, registration, the talent base | Youthful: short, confident, speaks to their major, plain فصحى | Home, Specializations, Events, Event, Talent, Account |
| Sector organizations | Credibility, what Hisn does, the quality of the talent base | Formal: facts before adjectives, no hype | Home, Departments, Hisnathon |
| The university (KFUPM) | Proof of a serious, well-run initiative that stays on brand | Formal | Home, Privacy, Footer |
| Hisn admins | Create events, manage capacity, confirm attendance, add recordings | Plain and functional | Admin |

### Top goals
1. A student of any major finds their place in under a minute (Specializations → roles → events).
2. Registering takes few steps and works in every state (full, waitlist, closed, cancelled, ended).
3. Everyone in the talent base is a real beneficiary: they joined through attendance or committed to attend `[C]`.
4. The site reads as national, technical, sober and modern, with no military imagery `[G p.3]`.
5. Admins run an event end to end without help: create, publish, announce, confirm attendance, add the recording.

---

## 2. Sources

| Source | Read? | Notes |
|---|---|---|
| Brand guide PDF, 20 pages | ✅ every page as an image | The PDF's text layer is broken (Arabic ligatures mangled in the Skia export), so the page images were the source of truth. PDF metadata title says "Hesn Logo Redesign Concepts" (old title, different spelling). |
| Brand kit ZIP | ✅ extracted to `brand-kit/` | Read `README.md`, `04-web/tokens/tokens.css`, `tokens.json`, `02-colors/colors.json`, `03-typography/fonts.md`, and all 23 SVGs. |
| `dev-1.md` | ✅ | D1-1 to D1-17, interfaces, dates |
| Committee screenshot | ✅ | Matches your summary. Two nuances: the talent-base rule and the specializations page are each phrased «إذا فيه إمكانية … كان بها» ("if it can be done, great"), so they are wishes, not hard requirements. The hackathon heading is «الهاكاثون» and the brand name is «حصناثون». |
| Live site | ✅ 375 px and 1280 px | Also read `css/tokens.css`, `css/style.css`, `js/script.js`, `content/teaser-phrases.json` |
| Teaser `css/style.css` | ✅ **found on the live site** | The teaser is the live site. Its colors live in `css/tokens.css`; `style.css` holds layout only. This resolves the D1-1 "copy hex values from the teaser" reference. |
| Spec `docs/superpowers/specs/2026-11-10-hisn-phase2-design.md` | ❌ missing | Not in the workspace |
| Plan `docs/superpowers/plans/2026-11-12-hisn-phase2.md` | ❌ missing | Not in the workspace |

**Couldn't verify without the spec and plan:**
- Exact homepage sections and copy (§6.2), header details (§6.3), department page content (§6.4), calendar (§7.3) and event page (§7.4) rules beyond what dev-1.md quotes.
- Talent fields (§7.7), privacy text (§7.10), and the plan's full "Global Constraints".
- Who receives D2-14 "announcements" (the `signups` list? registrants?) and whether they are automatic or admin-triggered. This decides how much of the committee's alert list already exists.
- The sign-in method (magic link, OTP or password) and profile fields, which shape the sign-in page and the profile overlay.
- Whether the teaser's signups went into the same `signups` table.

---

## 3. Brand constraints (verified)

✅ = your brief matches the guide · ✏️ = corrected · ➕ = missing from the brief

### Character, logo, language

| Rule | Status | Source |
|---|---|---|
| Character: وطني · تقني · رصين · حديث. «وليس عسكريًا: لا أسلحة، ولا جنود، ولا مركبات، ولا تمويه». Fixed rule: no military images or symbols in any material. | ✅ | G p.3 |
| Logo: never change its shape, proportions or colors. Don't stretch, rotate, recolor, add shadows or effects, or place it on a busy background. | ✅ | G p.3, p.9 |
| Never show "Defense Initiative" with the logo, in any version | ✅ | G p.3, p.9 |
| The mark "is not redrawn" («ولا يُعاد رسمه»). So don't extract the tower or the diamond window as standalone decorations until the elements batch defines them (see "Raw material" below). | ✏️ | G p.4 |
| Minimum sizes on screen: mark 24 px tall ✅, horizontal lockup 96 px wide ✅, ➕ vertical lockup 72 px wide, ➕ full lockup (with "Hisn") 140 px wide | ✅➕ | G p.7 |
| Clear space: drawn as "x" on all sides, **but never given a number**. Measured on the page, the hatched zone is ≈0.36× the mark's height, and the zone plus the inner margin is ≈0.5×. **Assumption (default):** clear space = ½ the mark's height on every side, until the brand owner confirms. | ✏️ | G p.7 |
| On photos: the white version over a #022C33 layer of at least 55% | ✅ | G p.8 |
| ➕ Which version on which background: light → primary (gradient mark + deep wordmark); dark → reversed (gradient mark + white wordmark); official gradient → reversed or white | ➕ | G p.8 |
| Arabic first, English second (a fixed rule) | ✅ | G p.3 |
| English words inside Arabic: IBM Plex Sans, same size and weight, isolated as LTR. No full English sentence inside an Arabic paragraph (give it its own paragraph). Acronyms keep their form (e.g. SUAS) and are explained at first use. | ✅ | G p.17 |
| ➕ **Numerals:** Arabic material uses Eastern Arabic digits (٠١٢٣). This is one of the four *fixed rules* on p.3, not only a style note. Never mix digit systems in one piece, except in technical codes (color codes, links). Examples: ٢٤٫٨٩٪ · ٢٤٠٬٤٦٠ ريالًا · ٢٣ سبتمبر ٢٠٢٦ · ١٤٤٨ هـ | ➕ | G p.3, p.17 |

### Color

| Rule | Status | Source |
|---|---|---|
| Palette with roles: **deep** #022C33 dark backgrounds and main text · **mid** #04424C the middle step of the gradient · **teal** #03606D headings and the primary brand color · **green** #0E8B6B emphasis and section numbers · **mint** #5FD4AA touches, glows and lines only · **box** #EDF4F2 box backgrounds and alternating rows · **page** #F7FAF9 page background | ✅➕ (roles) | G p.11 |
| 50–900 scales; 500 is the official color; light shades for backgrounds and borders, dark shades for hover and pressed states | ✅➕ | G p.12, K tokens.css |
| Proportions: 60% light / 25% deep and mid / 10% teal and green / **5% mint, never above 10%** | ✏️ (mint's target is 5%; 10% is the ceiling) | G p.13 |
| Official gradient: linear, 120°, #03606D 0% → #04424C 50% → #022C33 100%, plus a mint radial glow at 22% opacity. Used for covers, opening and closing panels, and headers. | ✅ | G p.13, K tokens.json |
| The mint → green gradient is for the mark only. ➕ It uses two colors that aren't in the palette (#2DB98A, #17806F); they are logo-only. | ✅➕ | G p.13, K colors.json |

### Contrast

From the guide's table `[G p.14]`, checked against my own WCAG calculations.

| Text on background | page | box | white | teal | mid | deep |
|---|---|---|---|---|---|---|
| white | ✗ | ✗ | – | ✅ 7.2 | ✅ 11.1 | ✅ 14.9 |
| deep | ✅ 14.2 | ✅ 13.3 | ✅ 14.9 | ✗ 2.1 | ✗ | – |
| teal | ✅ 6.9 | ✅ 6.5 | ✅ 7.2 | – | ✗ 1.5 | ✗ 2.1 |
| green | ◐ 4.1 | ◐ 3.8 | ◐ 4.3 | ✗ 1.7 | ✗ 2.6 | ◐ 3.5 |
| mint | ✗ 1.7 | ✗ 1.6 | ✗ 1.8 | ◐ 4.0 | ✅ 6.1 | ✅ 8.1 |

✅ ≥4.5, any text · ◐ 3–4.5, large text only (18 pt / 24 px, or 14 pt / 18.7 px bold) · ✗ below 3, never

➕ Rules you missed:
- Mint on teal and green on deep are large-text only.
- Dark text on teal fails (2.1), so teal buttons always take white text.

➕ Derived from the official scales, my calculations:
- **Small green text:** green-700 #0A644F (6.8 on page).
- **Muted text:** deep-400 #416166 (6.4).
- **Input borders:** need 3:1 against the page (WCAG 1.4.11). Use teal-400 #428892 (3.9); deep-300 is just under at 2.96.
- **Focus ring:** mint fails as a focus ring on light (1.7), so use teal (6.9) on light and mint (8.1) on dark.

### Type

| Rule | Status | Source |
|---|---|---|
| IBM Plex Sans Arabic (main) + IBM Plex Sans (English); weights 400 / 500 / 600 / 700. Both under the SIL Open Font License 1.1. | ✅ | G p.15, K fonts.md |
| ➕ Weight roles: 700 headings, large figures, approved lines · 600 subheads, labels, department names · 500 secondary lines and emphasis inside body text · 400 body, tables, captions | ➕ | G p.15 |
| Scale (px / line height): display 56/1.25 bold, H1 40/1.35 bold, H2 28/1.4 bold, H3 20/1.5 semibold, body 16/1.7, small 14/1.65, label 13/1.4 semibold, large figures 72/1.1 bold | ✅ (all match) | G p.16, K tokens.css |
| Never letter-space Arabic (it breaks the joins). ➕ The only letter-spacing allowed is +8% on Latin capitals in labels. Nothing under 12 px on screen (8 pt in print). | ✅➕ | G p.16 |
| ➕ The guide gives no responsive scale. **Assumption:** on small screens each heading clamps down to the step below it (display 40→56, H1 28→40, H2 22→28, H3 18→20); body and label sizes stay fixed. | ➕ | — |

### Voice

| Rule | Status | Source |
|---|---|---|
| Formal tone (organizations, leadership, university): complete, concise, institutional sentences; the fact and the number before the description; no exaggeration, no direct address. Youthful tone (students): short direct sentences, enthusiasm and confidence, addresses the student through their major, plain فصحى with no dialect. | ✅ | G p.18 |
| Approved lines and their roles: core idea «الصناعات العسكرية جزء من الصناعات الدفاعية لا كلها» · slogan «كل تخصص لبنة في حصن الوطن» · ➕ closing line «أول خطوة في بناء صناعة دفاعية وطنية هي بناء من يفهمها». The closing line belongs at the ends of pages and in the footer. | ✅➕ | G p.3, p.20 |
| Never use: camp, conscription, weapons; "military initiative"; "first in the world" or any claim without evidence; ➕ **«ادعمنا الآن!» in formal communication** | ✅➕ | G p.18 |

### Raw material for the visual language

- **What is published:**
  - The mark's anatomy: crenellations (5 merlons), pointed tower, diamond window, gradient shield `[G p.4]`.
  - A band of squares along the bottom of the cover and closing pages `[G p.1, p.20]`.
  - ■■■ marks beside section titles `[G p.4, 11, 15, 18]`.
  - Section numbers in green squares, and a mint–teal hairline across the top of every page `[G all pages]`.
  - The brick metaphor, from the slogan.
- **Still to come:** crenellations, bricks, squares, hairline and pattern files (`05-elements`), plus the Hisnathon, Hisn Exhibition, Build the Fortress and Hisn Ambassadors sub-brands (`08-sub-brands`), all "later batch" `[K README.md]`.
- **How to work until they arrive:**
  - Build each element as one small component (`Hairline`, `BattlementBand`, `SectionMarks`, `SectionNumber`, `BrandPlate`, `Brick`) that reproduces only what the guide already shows, so the official files can be swapped in one place.
  - Use the square and merlon rhythm, which the guide itself uses as a band. Don't use the tower or diamond as separate motifs.
  - Set «حصناثون» as type in Plex Sans Arabic Bold, never as an invented logo.

---

## 4. The current site (hisn-sa.org)

**What it has** `[L]`:
- Header with the Hisn mark and a KFUPM logo; the source carries a "TODO: replace with the official KFUPM logo file".
- A «قريبًا» badge and an H1 that rotates through 4 phrases every 4 s.
- The tagline «مبادرة التوعية بالصناعات الدفاعية وتمكين الطلاب فيها».
- An email form («بريدك الجامعي ليصلك الإطلاق» / «أبلغني») and a contact email.
- A crenellation band and a brick row at the bottom.
- Built as static HTML on Vercel. At 375 px there is no horizontal scroll, the form stacks, and the button is 51 px tall.

| Shortfall | Detail | Source |
|---|---|---|
| No content | One screen: no events, about, departments or majors | L |
| Positioning drift | It calls Hisn an "awareness initiative"; the guide calls it a talent incubator | L vs G p.3 |
| Engineering-only wording | «نمكّن جيلًا هندسيًا…» and «كل تخصص **هندسي** لبنة في الحصن» narrow the approved slogan to engineering, against "every major" | L vs G p.3 |
| Unapproved line | «حصنٌ متين.. لمستقبلٍ رصين» isn't an approved line | L vs G p.3 |
| Off-guide background | A radial gradient with an off-palette #0B5E66 replaces the official 120° gradient | L tokens.css vs G p.13 |
| Too much mint | Mint headline words, a mint button and a full-width mint band | L vs G p.13 |
| Accessibility | The H1 auto-rotates every 4 s with no pause control (WCAG 2.2.2, Level A). Input border is mint at 35% ≈ 2.0–2.3:1 (fails 1.4.11). Grey #6B7F82 is 4.0:1 on light (fails for small text). | L |
| Type | Body 17/1.8 and display line height 1.45 differ from the guide's 16/1.7 and 1.25 | L vs G p.16 |
| Performance | Fonts load through a CSS `@import` chain (HTML → fonts.css → Google CSS → font files), which blocks rendering | L |
| SEO and sharing | No OG image; `robots.txt` returns 404 | L |

**Keep:**
- Square corners (`--radius: 0`), the crenellation band and brick row, and the faint 72 px construction grid (Direction B only).
- The easing curve `cubic-bezier(0.2,0.7,0.2,1)` and the 200 / 400 / 600 ms durations.
- The mint focus ring on dark backgrounds.
- The accessible form pattern: a real label, `novalidate` with Arabic messages, and `aria-live` status.
- The `dir="ltr"` handling for email addresses, and `theme-color #022C33`.
- The core approved line. Note the teaser adds a comma («…الدفاعية، لا كلها») that the guide doesn't have.
- The subscriber list (see gap G-12 in §5).

---

## 5. Conflicts and gaps

### The six you found (all confirmed)

#### 1. Numerals
**Sources disagree:** The guide says Arabic-Indic digits in Arabic material, as a *fixed* rule `[G p.3, p.17]`. D1-7 sets `RIYADH_LOCALE = 'ar-SA-u-ca-gregory-nu-latn'`, and its tests expect '6:00', '18' and '2026' `[D D1-7]`.

**Effect on the design:** It touches every date, time, seat count, waitlist position and figure. The calendar needs tabular digits; I'll verify that Plex Arabic supports `tnum` in the prototype.

**Effect on the schedule:** About 3 hours:
- Change the locale to `nu-arab` and update 3 tests in D1-7.
- Add `fmtNum()` and make `t()` format numeric vars, which changes D1-2's test ('3' → '٣').

**Recommendation:** Follow the guide for anything displayed. Keep Latin for:
- technical values: URLs, emails, codes such as `SWE`, IDs
- form inputs (accept both digit systems; normalize to Latin on submit)
- CSV exports
- the machine key `riyadhDateKey` (already en-CA)

Abdullah's email templates should use the same helpers.

**Who decides:** the plan owner (**Assumption:** Abdulaziz, who owns the repo and reviews) with the brand owner (لجنة الدعم الفني). Question Q1.

#### 2. Hero gradient
**Sources disagree:** D1-8 says the hero runs from `--color-primary` to `--color-accent` (teal → mint). The guide's gradient runs 120° teal → mid → deep with a 22% mint glow, and mint ↔ green is logo-only `[G p.13]`.

**Effect on the design:** A teal → mint hero blows the mint budget and puts white text on mint (1.8:1, fails).

**Effect on the schedule:** None; it's the same CSS.

**Recommendation:** Use the guide's gradient, and update the D1-8 wording.

**Who decides:** You (the frontend owner), with an FYI to the team.

#### 3. Token source
**Sources disagree:** D1-1 says to copy hex values from the teaser `[D D1-1]`. The teaser's `tokens.css` shares the 7 core hexes, but adds off-guide values (#0B5E66, #8DE3C4, a failing grey #6B7F82, #CFE3DF) and a radial background `[L]`. The kit's `tokens.css` is official: scales, gradients, type scale, and a dark mode that switches on automatically with `prefers-color-scheme` `[K tokens.css]`.

**Effect on the design:** If the kit file is copied as is, visitors whose system is set to dark get an untested dark theme.

**Effect on the schedule:** One PR of about 1 hour, folded into D1-5.

**Recommendation:**
- The kit is the source of values.
- Keep dev-1's semantic names, which teammates already use, and add the scales.
- No dark mode at launch: set `color-scheme: light` and leave out the media query. The semantic layer means dark can come later without rework.

**Who decides:** You. Token names stay the same, so nothing breaks for others.

#### 4. Font weights
**Sources disagree:** D1-1 loads 400, 500 and 700. The guide needs 600 for H3, labels and department names `[G p.15–16]`.

**Effect on the design:** With no 600 file, the browser renders `font-semibold` as 700, which silently departs from the brand.

**Effect on the schedule:** 5 minutes, plus one font file per subset (**Assumption:** about 25–35 KB of woff2; I'll measure it in the build).

**Recommendation:** Add 600, and preload only the Arabic subset (see §8).

**Who decides:** You.

#### 5. Talent eligibility
**Sources disagree:** D1-17 lets any signed-in person with a complete profile submit, and registrations are only `registered | waitlisted | cancelled` `[D D1-17, D1-7]`. The committee asks for two ways in (attend, or join directly), staying in only through attendance, attendance confirmation, and automatic emails `[C]`.

**Effect on the design:** Path (b) "join directly" is already what D1-17 allows, so **the submission gate doesn't change**. What's missing:
1. Attendance marking. This is new admin UI on the event edit page.
2. A beneficiary status (confirmed or provisional) shown on Account and Talent.
3. Three emails: "you are now a Hisn beneficiary + invitation", "joined: attend one to stay", and alerts about upcoming events.
4. Talent joiners added to the alert list.
5. A rule for staying in.

**Effect on the schedule:**
- Me: about 1 day (the attendance UI in D1-15, status variants in D1-16 and D1-17).
- Abdulaziz: a column, 2 functions, an export flag.
- Abdullah: 2–3 email templates and a trigger.

**Recommendation:**
- At launch: attendance marking, status, the two transactional emails, and a confirmed/provisional flag in the export.
- No automatic removal at launch; the committee prunes using the export.
- Contracts in §8.

**Who decides:** The committee sets the rule and the grace period. Abdulaziz and Abdullah accept the backend scope. Question Q2.

#### 6. New pages
**Sources disagree:** The committee wants Hisnathon and Specializations sections `[C]`; dev-1.md has neither.

**Effect on the design:** Both pages can be static: data in the repo, no database. Specializations is the clearest form of the slogan (see §7).

**Effect on the schedule:**
- Specializations: about 1.5 days, with no backend dependency.
- Hisnathon: about 0.5–1 day.
- The content isn't ready yet, and the «مؤقت» CI check will block launch if drafts remain.

**Recommendation:** Build both behind flags. Ship each one only if its final content arrives by Fri 27 Nov noon; otherwise hide it and ship it after launch.

**Who decides:** The committee owns the content dates. Abdulaziz accepts the scope. Question Q3.

### Others I found

| # | Gap | Effect | Recommendation | Owner |
|---|---|---|---|---|
| G-1 | Kit folder names have three versions. The PDF and the kit's own `README.md` use `02-logo`, `09-web`, …; the ZIP has `01-logo`, `04-web` `[K README.md, G p.19]`. | Confusing paths | Trust the ZIP; fix the README in the next batch | Brand owner |
| G-2 | **The lockup SVGs use live `<text>`** (`font-family="HisnAr, 'IBM Plex Sans Arabic'"`). The README claims the font is embedded; it isn't `[K 01-logo/svg]`. Through `<img>`, an SVG can't use page fonts, so the wordmark renders in a system font. | **A visibly altered logo** | Convert the wordmark to outlines before web use. Default: I outline it from the kit's own SVG with Plex Sans Arabic Bold and send it for sign-off. | Brand owner signs off |
| G-3 | Every SVG carries a ≈7.7 KB C2PA provenance manifest; even the `.min.svg` files are 8.5 KB, of which the drawing is 0.8 KB | Page weight | Strip it in a web copy with SVGO; keep the originals | Me |
| G-4 | The kit's `--hisn-text: #1F3A40` isn't in the guide's palette; the guide says main text is deep | Minor | Use deep-500 (14.2:1) | Me |
| G-5 | The kit's hairline is `linear-gradient(90deg, mint, teal)`, mint on the left. The guide draws mint on the right (the start side in RTL), and the teaser uses `to left`, which matches. | Hairline points the wrong way | Use `to left` for RTL | Me |
| G-6 | `--color-accent` means mint `[D D1-1]`, which invites mint text on light (1.7:1) | Accessibility | Keep the name, document it as decorative only, add `--color-accent-strong` = green-700 for text | Me, team FYI |
| G-7 | No state colors in the guide; dev-1 needs `--color-danger` | Missing tokens | Danger #B42318 (6.3:1), warning #8A5A00 (5.6:1), success green-700, info teal. These are additions; flag them to the brand owner. | Me, brand owner |
| G-8 | **`t()` has no plurals.** «تبقّى {n} مقعدًا» is wrong for n = 1, 2 and 3–10. | Bad Arabic in key UI | Add `tn(key, n)` on `Intl.PluralRules('ar')` (zero/one/two/few/many/other), keys `seats.left.one` and so on. No dependency. | Me (lands with D1-7) |
| G-9 | The «مؤقت» check scans only `ar.json` and `content/**/*.md` `[D D1-4]`; a new `data/specializations.json` would bypass it | Drafts could ship | Add `data/specializations.json` to the scan | Me (D1-4) |
| G-10 | D1-14 to D1-17 are dated Wed 25 to Sat 28, on or after "feature-complete" Wed 25 | Unclear milestone | Clarify. **Assumption:** feature-complete means backend and public pages. | Plan owner |
| G-11 | Committee says "sessions and workshops"; `PublicEvent` has no type field | No type filter | Optional `kind` column; default: skip at launch | Abdulaziz |
| G-12 | Teaser subscribers signed up "to hear about the launch" with a university email `[L]` | Consent covers the launch only | Send one launch email with an opt-in link to the alert list; don't enroll them silently | Abdulaziz, Abdullah |
| G-13 | Alert-list emails need an unsubscribe link and page; neither is in dev-1's interfaces | Required for bulk email | Token-based unsubscribe (contract in §8) | Abdullah, Abdulaziz |
| G-14 | Hero takes `t('hero.quote')` and `t('hero.attribution')` `[D D1-8]` | Risk of an invented quote | Use an approved line attributed to «حصن»; no quotes from people unless the committee supplies them | Committee |
| G-15 | Department "example roles" (role1–4) overlap the Specializations job titles | Two sources of truth | One data source if the work areas match the departments (Q4) | Committee |
| G-16 | `<Bdi>` has no `lang`, so screen readers read English names with Arabic voices | Accessibility | Optional `lang` prop (`<bdi lang="en">`); existing tests unaffected | Me |

---

## 6. Sitemap and journeys

### Pages

| Page | URL | Purpose | Main action | Source |
|---|---|---|---|---|
| Home | `/` | Who Hisn is; what's next; find your major | Open the next event / find your major | D1-8 |
| Calendar | `/events?m=YYYY-MM` | All sessions and workshops by month | Open an event | D1-10, C |
| Event | `/events/[id]` | Details, seats, registration | Register / join the waitlist / cancel / watch the recording | D1-11 |
| Library | `/library?d=CODE` | Recordings of past events | Play a recording | D1-12 |
| Department ×6 | `/departments/[slug]` | A sector area: description, roles, its events | Register for its events / join the talent base | D1-9 |
| Specializations | `/specializations` | Search all majors | Pick your major | **New** (C) |
| Major | `/specializations/[code]` | Work areas → job titles for one major; static and shareable | Join the alert list / see related events | **New** (C) |
| Hisnathon | `/hisnathon` | Announcements, tracks, news | Register interest (alert list, source `hisnathon`) | **New** (C) |
| Talent base | `/talent` | Explain the two ways in; the form | Join | D1-17, C |
| Account | `/account` | Profile, my events, waitlist positions, talent status | Cancel / edit / see beneficiary status | D1-16 |
| Sign-in, profile overlay | `/sign-in`, overlay | Authentication; complete the profile | Sign in | Abdullah (D2) |
| Privacy | `/privacy` | Data policy | — | D1-6 |
| Unsubscribe | `/alerts/unsubscribe?token=` | Leave the alert list | Confirm | **New** (G-13) |
| 404, error | — | Recovery, with full navigation | Go home / retry | D1-5 |
| Admin list | `/admin` | Events with counts | New event / edit | D1-13 |
| Admin event | `/admin/events/[id]` | Form, status, warnings, **attendance** | Save / publish / mark attendance | D1-14, D1-15, **new** attendance |

The alert list has no page of its own. It's a form that appears in the footer, on the Major page, on Hisnathon, and in empty states.

### Five key journeys

**J1. Discover an event → register → attend → talent-base invitation** `[C path a]`
1. Home "Upcoming" or the Calendar → Event page.
2. Press «سجّل». If signed out, you're sent to `/sign-in?returnTo=/events/7` and come back to the same page.
3. If your profile is incomplete, the profile overlay opens and the registration re-runs after you save `[D D1-11]`.
4. You get the "registered" state, a screen-reader announcement, and a confirmation email (Abdullah).
5. On the day, an admin marks you present on `/admin/events/[id]` → attendance. **New.**
6. On your first attendance, the email «أصبحت من مستفيدي حصن» «مؤقت» goes out with a link to `/talent`. **New.**
7. `/talent` shows "confirmed beneficiary" → form → success screen.

**J2. Find my major → see the roles → join the alert list** `[C]`
1. Home "find your major" field, or nav «التخصصات» → `/specializations`.
2. Type your major in Arabic or English. Diacritics and letter variants (أ/إ/ا, ة/ه, ى/ي) are normalized, so either spelling matches.
3. Pick it → `/specializations/SWE`. The signature moment plays: work areas set in as bricks, then the job titles.
4. Inline alert form: «وصلني بفعاليات تخصصي» «مؤقت» → `newsletter_signup(p_source: 'specializations')`.
5. Secondary links: related department page, upcoming events.

**J3. Join the talent base directly → alerts → attend one → confirmed** `[C path b]`
1. Open `/talent` and see both ways in, explained.
2. Sign in, complete the profile, fill in the form and give consent → submit.
3. The success screen says you're "provisional until you attend one event" «مؤقت». Your email joins the alert list (source `talent`). You get the "attend one to stay" email. **New.**
4. Alert emails bring you to an event → J1 steps 2–6. Your status flips to "confirmed" on Account.

**J4. Full event → waitlist → promoted or leave**
1. The Event page shows «اكتملت المقاعد» and «انضم لقائمة الانتظار».
2. You join and see «ترتيبك ٣ في قائمة الانتظار» «مؤقت» (`t('waitlist.position')`).
3. If an admin raises capacity, `set_event_capacity` promotes you, Abdullah's email goes out, and the page shows "registered".
4. Or press «مغادرة القائمة» → ConfirmDialog → the result is announced.

**J5. Admin: create → publish → announce → attendance → recording**
1. `/admin` → «فعالية جديدة». The form uses Riyadh time and shows validation `[D D1-14]`.
2. Publish. Online events need a meeting link `[D D1-15]`.
3. Announce to the alert list (D2-14/15; **confirm whether this is automatic**).
4. After the start time, the attendance tab lists registrants with a checkbox each and "mark all", plus a count. Saving triggers the beneficiary emails. **New.**
5. After the event, paste the YouTube URL into "recording". It appears in the Library and as the "ended" state.

---

## 7. Two visual directions

### Shared ground (both directions)
- Light-first, following the 60 / 25 / 10 / 5 split.
- Square corners.
- Text-led hero with no photo, because `HERO_IMAGE = null` `[D D1-8]`.
- Plex Sans Arabic only. **Assumption:** its Latin glyphs match IBM Plex Sans; to verify in the prototype.
- Arabic-Indic numerals (pending Q1).
- Motion uses transform and opacity only.

### Direction A: «لبنة» (The Brick) — **recommended**

**Idea:** Every unit on the site is a brick, and every major is one of them. You are the next brick in the fortress.

| Trait | How A expresses it |
|---|---|
| وطني | The approved slogan is the structure itself: a national fortress built from its people's majors |
| تقني | One fixed module (the brick) governs every proportion; figures and labels are set like specifications |
| رصين | Mostly light, flat and square. No textures and no terracotta: bricks are abstract rectangles with 1 px "mortar" lines. Motion only *settles*. |
| حديث | Large, confident Arabic type set flush to the start side, asymmetric grids, and live data (seats, dates) carrying the visuals |

**Grid and layout**
- Base unit 8 px. A **brick = 2:1** (for example 48×24 in bands, 4×2 columns in cards).
- 12 columns at ≥1024 px, 8 at ≥640, 4 below. Gutters 24 / 16 px.
- Container 1200 px; Arabic body text capped at 36 rem (about 70 characters).
- **Running bond (offset rows) appears in exactly two places:** the majors wall and the battlement band. Everything else sits on the straight grid, for reading comfort.
- Each section opens with a green `SectionNumber` (٠١), ■■■, and an H2 at the start side, with a 1 px deep-100 "course line" under it.

**Type**
- Display 56 only in the home hero. H1 40 on inner pages.
- Large figures (72) for the event day number and the hero's next-event date.
- Labels (13/600) for metadata: date, department, format, seats.

**Color**
- 60%: page and box behind all content.
- 25%: deep and mid for the hero plate, the talent band, the footer, and the "registered" state.
- 10%: teal and green for headings, the primary button (teal with white, 7.2:1), links and section numbers.
- ≤5%: mint for the hairline, band highlights on dark, the focus ring on dark, and the selected brick's edge.

**Motion language: "settle"**

| Use | Motion | Duration | Easing |
|---|---|---|---|
| Enter (cards, list items) | `translateY(8px)→0` + `opacity 0→1`; 40 ms stagger, max 6 items | 220 ms | `--ease-brand` cubic-bezier(0.2,0.7,0.2,1) |
| Press | `translateY(1px)` | 80 ms | linear |
| Card hover | 2 px teal top edge `scaleX(0→1)` from inline-start | 200 ms | brand |
| Exit | reverse of enter, without the stagger | 160 ms | cubic-bezier(0.4,0,1,1) |
| Section reveal | one-shot via IntersectionObserver, below the fold only, never the LCP element | 220 ms | brand |

No parallax, no scroll-linked animation, no springs.

**Signature 1: the majors wall** (`/specializations`; a 2-course strip on Home)

| | Spec |
|---|---|
| Layout | Majors as bricks in running bond, each a link to `/specializations/[code]`: 6 per course at 1280 px, 2 at 375 px. On mobile, search comes first and the wall shows filtered results only. |
| Trigger | Selecting a major: click, Enter, or picking a combobox result. Next.js prefetches the route. |
| Motion | (1) The chosen brick's mint edge `scaleX` 0→1, 160 ms. (2) The detail page mounts: the major name settles in, then its **work areas set in as one course of bricks**, each `translateY(12px)→0` + opacity, 220 ms, 50 ms stagger. (3) Job titles fade in 120 ms after the last brick, over 180 ms. Total ≤600 ms. Easing `--ease-brand`. |
| Reduced motion | No translate. A single 120 ms opacity cross-fade. Focus moves to the page H1. |
| Low-end device | CSS transitions only, no JS animation library. Only the first 6 bricks stagger; the rest appear together. If `navigator.connection.saveData` or `deviceMemory ≤ 2`, `data-motion="lite"` applies the reduced-motion rules. |
| Without JS | The links work, and each major page is static (SSG). The direct URL renders the final state, which also makes it shareable and indexable. |

**Signature 2: laying the battlement band** (the home hero plate)

| | Spec |
|---|---|
| Layout | The guide's band of squares along the bottom edge of the deep hero plate `[G p.1]`: 24 merlons, 2:1, rendered as `<span>`s, `aria-hidden`. |
| Trigger | Page load, CSS-only (`animation-delay`), with no JavaScript dependency. |
| Motion | Each merlon `scaleY(0→1)` from the bottom, 180 ms, 30 ms stagger from inline-start to inline-end, total ≈900 ms, `--ease-brand`. The headline doesn't animate: it is the LCP element and must paint at once. |
| Reduced motion or low-end | The band is static. |

**Homepage, top to bottom**

| # | Band | 375 px | 1280 px |
|---|---|---|---|
| 1 | Header | 56 px tall. Horizontal lockup (≥96 px) at start. Sign-in and menu buttons at end; sign-in sits outside the menu `[D D1-5]`. | 72 px. Lockup at start; nav: Departments ▾ · Events · Specializations · Library · Talent base · Hisnathon (when its flag is on). Sign-in at end. |
| 2 | Hero plate (official gradient + glow) | Slogan as display (40 px clamp), 3 lines; «لبنة» may take mint (8.1:1) within the 5%. Official one-line about text. Full-width buttons, stacked: «ابحث عن تخصصك» «مؤقت» (white fill, deep text) and «تقويم الفعاليات» «مؤقت» (outline). Battlement band (S2) at the bottom. | Headline in columns 1–7 at 56 px. Columns 9–12: a **next-event brick** with the date as a 72 px figure, title, seats and a link (real data from `upcomingEvents({limit:1})`). Band along the bottom. |
| 3 | Find your major | ٠١ + H2 + search field + 2 courses (4 bricks) + "all majors" | Search at the start (4 columns) + a wall of 2 courses × 6 bricks |
| 4 | Upcoming events | ٠٢ + 3 EventCards stacked (date block at start, title, labels, status) + "calendar" | 3 cards in a row, 4 columns each |
| 5 | Departments | ٠٣ + 6 rows: icon, name, one-line summary, chevron (mirrored) | 3×2 grid of brick cards |
| 6 | Talent invitation (deep band) | Youthful line + the two ways in as two numbered bricks + CTA | Text in 6 columns at start; the two path bricks at end |
| 7 | Latest recordings | 3 VideoCards stacked (16:9, lazy thumbnails) | 3 in a row |
| 8 | Hisnathon (flag) | One brick: status, date, link | Wide brick, 8 columns |
| 9 | Footer (deep) | Battlement band on the top edge; official about text; closing approved line; alert-list form; links; contact `<Bdi>`; KFUPM logo | 4 columns, the same content |

**Event page, top to bottom**

| # | Band | 375 px | 1280 px |
|---|---|---|---|
| 1 | Breadcrumb | Events ‹ title (chevron mirrored) | same |
| 2 | Title block | Department label (13/600 teal) · H1 (28→40) · status badge (text + icon) | Columns 1–8 |
| 3 | Key facts (`<dl>`) | Day number 72 px + month and weekday · time range «٦:٠٠–٨:٠٠ م» with "Riyadh time" · format and location · presenter (`<Bdi lang="en">` when English) | A 2-column `<dl>` in columns 1–8 |
| 4 | Action brick | **Sticky bottom bar** (64 px + safe area): RegisterButton + seats. The seat meter is 10 bricks filled in proportion to seats taken, with text equivalent «تبقّى ٥ مقاعد» «مؤقت». | **Sticky card**, columns 9–12 (`top: 96px`): RegisterButton, seat meter, add-to-calendar |
| 5 | Image | EventImage 2:1; when null, department icon on box with a battlement edge `[D D1-8]` | At the top of columns 9–12 |
| 6 | Description | 16/1.7, max 36 rem | Columns 1–8 |
| 7 | Related | Department link + 2 events | 3 events |

**Risks:**
- Bricks can turn kitsch. Mitigation: abstract shapes, the bond in only two places, no texture.
- Running bond needs care at narrow widths: 2 per course, and the offset drops below 360 px.

**Build cost:** ≈2 days on top of the functional baseline (tokens and brand elements 0.5, hero S2 0.25, wall and explorer S1 1.0, seat meter and state polish 0.25), plus the new pages in §9.

### Direction B: «المخطط» (The Blueprint)

**Idea:** Hisn as an exact drawing of the fortress. Every page is a sheet, every major a labeled part, every path an annotated line from student to sector.

| Trait | How B expresses it |
|---|---|
| وطني | The national fortress drawn as a plan under construction |
| تقني | Engineering-drawing language: construction grid, leader lines, callouts, title blocks, dimensions |
| رصين | Fine lines, restraint, a lot of space |
| حديث | Editorial layouts with margin annotations |

**Grid and layout**
- A visible construction grid on page backgrounds: teal-100 1 px lines every 72 px, as in the teaser.
- Sheet frames with corner ticks, and a **title block** on each page: sheet number «ح-٠٣», page name, last updated.
- 12 columns. At ≥1024 px an annotation column on the inline-end side holds notes (presenter, format, rules); it folds inline on mobile.
- Data appears as tables and specification lists rather than cards.

**Type**
- Labels and callouts (13/600) carry much of the page.
- Numbers are set like dimensions.
- H1 40 on inner pages; display 56 on Home only.

**Color**
- 60%: light sheets.
- 25%: deep plates for the hero and footer.
- 10%: teal for lines, labels and links.
- 5%: mint on dark only, for the datum line and leader-line dots.

**Motion language: "draft"**
- Lines extend with `scaleX` from inline-start over 280 ms, then their labels fade in over 160 ms.
- Always one after the other, never at once. No page transitions.

**Signature 1: the explorer as an annotated drawing**
- Trigger: choosing a major.
- Motion:
  1. The major node appears (opacity, 160 ms).
  2. Leader lines to each work area extend (`scaleX`, 280 ms, 60 ms stagger).
  3. The area labels fade in (160 ms).
  4. Second-level lines run to the job titles.
  5. Total ≈900 ms, easing `--ease-brand`.
- Mobile: becomes a vertical tree with vertical leader lines (`scaleY`).
- Reduced motion: no line animation; a single opacity fade.
- Low-end: the lines are static and only the labels fade.

**Signature 2: the datum line**
- A mint–teal hairline under every page title.
- On navigation it extends to the width of the new title (`scaleX` 0→1, 300 ms).
- One continuity cue for the whole site. Reduced motion: static.

**Homepage, top to bottom**

| # | Band | 375 px | 1280 px |
|---|---|---|---|
| 1 | Header | Same as A, with a thin title-block strip (sheet ح-٠١) | Same as A |
| 2 | Hero sheet (deep plate) | Core idea line as display; a dimension line beneath it labeled «كل تخصص» «مؤقت»; one CTA | Headline in columns 1–8; columns 9–12: a "legend" of the three verbs تعرّف · تؤهل · تصل as numbered callouts |
| 3 | Explorer | Search + 5 example majors as a list with leader ticks | Search + a live mini-diagram of one major (S1) |
| 4 | Schedule | A table-like list: date column (day figure) · title · labels | A real `<table>` of the next 3 events with columns date / title / department / seats |
| 5 | Departments | A numbered index (٠١–٠٦) like a drawing legend | Legend down the start column; the description of the hovered or focused item at end |
| 6 | Talent | Sheet with the two paths as a flow diagram (2 nodes) | Same, wider |
| 7 | Recordings | List rows with thumbnails | 3 columns |
| 8 | Footer | Title-block style: sheet info, about, closing line, alert form | Same |

**Event page, top to bottom**

| # | Band | 375 px | 1280 px |
|---|---|---|---|
| 1 | Title block | Sheet number + status at end; H1 | H1 in columns 1–8; title block in columns 9–12 |
| 2 | Specification table | `<dl>` rows separated by hairlines: date, time, format, location, presenter, seats | Two-column `<dl>` |
| 3 | Datum bar (action) | Sticky bottom bar | A horizontal bar under the specs: RegisterButton + seats, with the datum line |
| 4 | Description + margin notes | Notes inline | Notes in the annotation column |

**Risks:**
- **"Blueprint" reads as engineering only**, which repeats the teaser's drift away from "every major".
- The grid backgrounds add noise on reading-heavy pages, and low-contrast lines disappear on cheap screens.
- Leader-line layouts are hard to make responsive and need custom SVG positioning, which means more bugs.
- The title-block system adds markup to every page.

**Build cost:** ≈3.5–4 days on top of the baseline (sheet and title-block system 0.75, grid backgrounds 0.25, responsive annotated explorer 2.5, datum line 0.25).

### Comparison

| Criterion | A «لبنة» | B «المخطط» |
|---|---|---|
| Brand fit | **5**: literally the slogan; works for every major | 4: strong تقني and رصين, but leans toward engineering |
| Distinctiveness | 4: brick bond plus live data is uncommon and fully ownable | 4: well executed, but blueprint styling is a familiar trope |
| Accessibility | **5**: cards and lists, simple reading order | 3: diagrams need a parallel text structure; thin lines; dense tables on mobile |
| Performance | **5**: CSS only, few DOM nodes | 4: SVG lines and grid layers |
| Schedule risk | **Low**: ≈2 days | Medium–high: ≈3.5–4 days |

**Recommendation: Direction A.** It turns the approved slogan into the structure of the site, welcomes non-engineering majors, costs about half as much, and puts its signature on the page the committee cares most about. B's annotation callouts can still appear once, on the Major page's role list, without adopting the whole blueprint system.

---

## 8. Frontend plan

### Tokens: brand kit → Tailwind v4 `@theme` (`app/globals.css`)

```css
@import "tailwindcss";

@theme {
  --color-*: initial;                      /* drop Tailwind's palette: off-brand colors can't be used */
  --color-white: #fff; --color-transparent: transparent; --color-current: currentColor;

  /* scales: copied 1:1 from the kit's tokens.css (50–900 each) */
  --color-deep-50: #F0F2F3;  /* … */ --color-deep-500: #022C33;  /* … */ --color-deep-900: #01181C;
  --color-mid-500: #04424C;  --color-teal-500: #03606D;  --color-green-500: #0E8B6B;  --color-mint-500: #5FD4AA;
  /* (all 50 values, generated from tokens.json by a 20-line script) */
  --color-page: #F7FAF9;  --color-box: #EDF4F2;

  /* semantic: dev-1 D1-1 names kept, values from the kit */
  --color-bg: var(--color-page);
  --color-surface: var(--color-box);
  --color-primary: var(--color-teal-500);
  --color-accent: var(--color-mint-500);          /* DECORATIVE ONLY: lines, glows; never text on light */
  --color-accent-strong: var(--color-green-700);  /* green text at any size (6.8:1) */
  --color-text: var(--color-deep-500);
  --color-heading: var(--color-teal-500);
  --color-muted: var(--color-deep-400);           /* 6.4:1 */
  --color-line: var(--color-deep-100);            /* decorative dividers */
  --color-field: var(--color-teal-400);           /* input borders, 3.9:1 */
  --color-danger: #B42318;  --color-warning: #8A5A00;  --color-success: var(--color-green-700);

  --font-sans: var(--font-plex), system-ui, sans-serif;

  /* type scale (G p.16); mobile floors are an assumption (§3) */
  --text-display: clamp(2.5rem, 1.9rem + 2.4vw, 3.5rem); --text-display--line-height: 1.25; --text-display--font-weight: 700;
  --text-h1: clamp(1.75rem, 1.3rem + 1.8vw, 2.5rem);     --text-h1--line-height: 1.35;      --text-h1--font-weight: 700;
  --text-h2: clamp(1.375rem, 1.2rem + .7vw, 1.75rem);    --text-h2--line-height: 1.4;       --text-h2--font-weight: 700;
  --text-h3: clamp(1.125rem, 1.08rem + .2vw, 1.25rem);   --text-h3--line-height: 1.5;       --text-h3--font-weight: 600;
  --text-body: 1rem;        --text-body--line-height: 1.7;
  --text-small: .875rem;    --text-small--line-height: 1.65;
  --text-label: .8125rem;   --text-label--line-height: 1.4;  --text-label--font-weight: 600;
  --text-figure: clamp(3rem, 2.2rem + 3.2vw, 4.5rem); --text-figure--line-height: 1.1; --text-figure--font-weight: 700;

  --radius-*: initial;  --radius-none: 0;  --radius-full: 9999px;   /* square brand; full only for the seat-meter dot */
  --ease-brand: cubic-bezier(0.2, 0.7, 0.2, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
}

@utility bg-brand {   /* official gradient + mint glow (G p.13) */
  background:
    radial-gradient(60% 70% at 25% 18%, rgb(95 212 170 / .22), transparent 60%),
    linear-gradient(120deg, #03606D 0%, #04424C 50%, #022C33 100%);
}
@utility hairline { background: linear-gradient(to left, #5FD4AA, #03606D); } /* mint at the RTL start */

:root { color-scheme: light; }   /* no dark mode at launch (§5 #3) */
```

- **Fonts:** `IBM_Plex_Sans_Arabic`, weights `['400','500','600','700']`, `display: 'swap'`, CSS variable `--font-plex`.
  - **Assumption, to verify:** preload only the Arabic subset, with Latin loading on demand by `unicode-range`.
  - No separate IBM Plex Sans until English pages exist, provided the prototype confirms that Plex Arabic's Latin glyphs match.
- The glow position follows the guide's cover (upper area, on the end side).

### Components

**Base:**
- `Button` (primary, secondary, ghost, on-dark; min 44×44)
- `TextLink`
- `Field`: input, textarea, select, with label, hint and error
- `Checkbox`, `Badge` and `StatusTag` (text + icon, never color alone)
- `Dialog` (native `<dialog>`)
- `Disclosure` (nav dropdown)
- `Skeleton`, `LiveRegion` + `announce()`
- `Bdi` (+ `lang`)
- `Num` and `DateTime` (Riyadh time, digits per Q1)
- `Logo` (outlined SVGs; the size prop refuses values below the minimums)
- `Icon` (Lucide wrapper with a `mirror` prop)
- `SkipLink`, `VisuallyHidden`

**Brand elements:** `Hairline`, `BattlementBand`, `SectionMarks` (■■■), `SectionNumber`, `BrandPlate`, `Brick`.

**Composite:**
- `Header`, `MobileMenu`, `Footer`, `Hero`, `SectionHeader`
- `DepartmentCard`, `EventCard` (upcoming, almost full, cancelled, ended with recording), `EventImage`, `EventFacts`
- `RegisterButton`, `SeatMeter`, `ConfirmDialog`
- `MonthGrid`, `EventList`, `MonthNav`, `NextEventBanner`
- `VideoCard`
- `MajorSearch` (combobox), `MajorsWall`, `RolePanel`
- `AlertForm` (with a `source` prop)
- `TalentStatus`, `AttendanceTable`, `EventForm`, `StatusControls`, `WarningBanners`
- `EmptyState`, `ErrorState`

**Share the base kit with Abdullah by Mon 16** so the sign-in page and profile overlay match.

### Register button: all states `[D D1-11]`

| State | Shown | Action | Screen-reader result |
|---|---|---|---|
| `open` | «سجّل» (primary teal) + seats line if capacity is set | `register` | «تم تسجيلك» «مؤقت» (polite) |
| `open_almost_full` | «سجّل» + warning tag «المقاعد شارفت على الاكتمال!» + seat meter | `register` | same |
| `registered` | Status block on deep: mint ✓ «مسجّل» + text button «إلغاء التسجيل» + add-to-calendar | ConfirmDialog → `cancel` | «أُلغي تسجيلك» «مؤقت» |
| `full` | Status «اكتملت المقاعد» + secondary button «انضم لقائمة الانتظار» | `joinWaitlist` | «ترتيبك {n} في قائمة الانتظار» «مؤقت» |
| `waitlisted` | `t('waitlist.position',{n})` + «مغادرة القائمة» | ConfirmDialog → `cancel` | «غادرت قائمة الانتظار» «مؤقت» |
| `closed` | Static status «أُغلق التسجيل» (**not** a disabled button) + alert-list prompt | — | — |
| `cancelled` | Danger banner at the top of the page + status «أُلغيت الفعالية» | — | — |
| `ended` | «انتهت» + «شاهد التسجيل» when `recordingUrl` is set; otherwise a link to the Library | link | — |
| Signed out | Same labels, rendered as a link to `/sign-in?returnTo=` | link | — |
| Profile needed | Opens the overlay (`useProfileGate`), then re-runs | — | Focus moves into the overlay |
| Pending | All buttons `disabled` + `aria-busy`; a spinner (rotate transform) after 300 ms | — | — |
| Error | Inline message under the button, `role="alert"`, with retry | retry | assertive |

### Other states (every page)

| State | Treatment |
|---|---|
| Loading | Brick-shaped skeletons at the final size (no CLS); opacity pulse 1.2 s; static under reduced motion. The calendar streams: the grid renders first and seats arrive through Suspense. |
| Empty | Calendar month: «لا فعاليات في هذا الشهر» «مؤقت» + NextEventBanner + AlertForm. Library: the same pattern. Account: "you haven't registered yet" + the next event. |
| Error | `app/error.tsx` with full navigation and a retry. Action errors stay inline next to the control, never as a toast alone. |
| Signed out | Header button; actionable states become links; Account and Talent redirect with `returnTo`. |
| Profile needed | Abdullah's overlay, built from my `Dialog` and `Field`. |

### Responsive rules

| Breakpoint | Columns, gutter | Changes |
|---|---|---|
| <640 | 4 cols, 16 px gutter, 20 px side margin | Stacked; sticky action bar on the event page; calendar as a list |
| ≥640 `sm` | 8 cols, 16 px | 2-column cards |
| ≥768 `md` | 8 cols, 24 px | Month grid appears `[D D1-10]` |
| ≥1024 `lg` | 12 cols, 24 px | Full nav in the header; sticky side card on the event page |
| ≥1280 `xl` | 12 cols, container 1200 px | — |

No horizontal scroll at 375 or 1280 px `[D D1-5]`. Content uses `scroll-padding-top` equal to the sticky header height (WCAG 2.4.11).

### Motion system

| Token | Value | Use |
|---|---|---|
| `--dur-fast` | 120 ms | hover, press, small fades |
| `--dur-base` | 200 ms | menus, tags, state changes |
| `--dur-lay` | 220 ms + 40–50 ms stagger | settle (enter), signatures |
| `--dur-slow` | 320 ms | dialogs, the mobile menu |

- Easing: `--ease-brand` on enter, `--ease-exit` at 0.8× duration on exit.
- Properties: **transform and opacity only.**
- Direction: "forward" means toward inline-end, so `translateX` is multiplied by `--dir` (−1 in RTL).
- Global `@media (prefers-reduced-motion: reduce)`: only opacity at ≤120 ms; signatures show their end state.
- No motion library. Motion (Framer) would cost ~30–40 KB gzipped of client JS.

### Arabic and RTL rules
- `<html lang="ar" dir="rtl">`. Logical properties only (enforced by D1-3).
- **Mirror:** chevrons, arrows, back/next, external-link, the breadcrumb separator.
- **Don't mirror:** media play, clock, check, search.
- Use the `rtl:-scale-x-100` variant through `Icon mirror`.
- English inside Arabic: `<Bdi lang="en">`. Email and URL inputs: `dir="ltr"`.
- Arabic punctuation (، ؛ ؟ « »). `text-align: start`, never justify, never kashida.
- Titles clamp to 2 lines with `line-clamp`.
- Dates: «الأربعاء ١٨ نوفمبر ٢٠٢٦ · ٦:٠٠ م» (Gregorian, Arabic month names), as in G p.17.
- English at launch: Arabic only (Q5 default). `t()` and the type tokens already have English counterparts in the kit, so adding `en.json` later doesn't require a redesign.

### Accessibility (WCAG 2.2 AA)
- **Focus:** 3 px ring, teal on light and mint on dark, 2 px offset; never removed.
- **Targets:** at least 44 × 44 px.
- **Calendar:** a semantic `<table>` with a `<caption>` (month name) and weekday `<th scope="col">` with full names in `<abbr title>`. Each day cell holds a list of event links; `aria-current="date"` marks today. Month navigation uses real links (`?m=`).
  - Tab moves through events in date order; days without events add no tab stops.
  - A roving-tabindex arrow-key grid is *not* needed for operability, so it's skipped as a cost.
- **Menus:** a disclosure (button with `aria-expanded` + a list of links), not ARIA `menu`. Esc closes it and returns focus.
- **Dialogs:** native `showModal()` gives the focus trap and Esc; focus returns to the trigger; `aria-labelledby`.
- **Announcements:** one polite live region in the layout; errors use `role="alert"`.
- **Forms:** labels, `aria-describedby` hints and errors, `aria-invalid`, and an error summary that takes focus on submit.
- **No auto-rotating content:** the teaser's rotating H1 is dropped (WCAG 2.2.2).
- **Spot checks:** axe in Playwright on each page, plus manual VoiceOver (iOS) and TalkBack (Android) passes on Sun 29.

### Performance budgets

Measured with Lighthouse mobile (Moto G Power emulation, slow 4G) and once on a real mid-range Android on Sun 29. **Assumption:** these are targets; the Next.js baseline will be measured in the first build.

| Page | LCP | INP | CLS | First-load JS (gzipped) |
|---|---|---|---|---|
| Home, Department, Major, Hisnathon, Privacy | ≤2.0 s | ≤200 ms | ≤0.05 | ≤130 KB |
| Calendar | ≤2.5 s (dynamic) | ≤200 ms | ≤0.05 | ≤135 KB |
| Event | ≤2.5 s (dynamic) | ≤200 ms | ≤0.05 | ≤145 KB |
| Specializations (search) | ≤2.0 s | ≤100 ms per keystroke | ≤0.05 | ≤135 KB |
| Library | ≤2.5 s | ≤200 ms | ≤0.05 | ≤135 KB |
| Account, Talent | ≤2.5 s | ≤200 ms | ≤0.05 | ≤150 KB |
| Admin | not budgeted (desktop) | ≤200 ms | — | — |
| Fonts, first view | — | — | — | ≤140 KB transfer |

**How the design meets them:**
- The hero is text, server-rendered; the LCP headline never animates in from opacity 0.
- Server Components by default. Client islands only for: MobileMenu, RegisterButton, AlertForm, VideoCard, MajorSearch, dialogs.
- No libraries added for motion, dates (`Intl`), search (a ~30-line normalizer) or dialogs (native).
- Brand elements are inline SVG or CSS under 2 KB. Logo SVGs are stripped from 8.5 KB to about 0.8 KB.
- YouTube iframes load only on click; thumbnails `loading="lazy"`; event images have fixed `aspect-ratio` boxes.
- `next/font` self-hosts the fonts with a metric-adjusted fallback, so there's no `@import` chain like the teaser's.
- INP: `useTransition` shows a pending state within one frame. Search filters fewer than 200 items in memory.

### Backend dependencies

| UI element | Data or action needed | Owner | In dev-1? | What I need to ask for |
|---|---|---|---|---|
| Header session | `getSession`, `signOut` | Abdullah D2-4 | ✅ | — |
| Sign-in, profile overlay | pages and `useProfileGate` | Abdullah D2-6/7 | ✅ | Use my `Field`, `Button`, `Dialog` (by Mon 16) |
| Alert form | `newsletter_signup(p_email, p_source)` | Abdulaziz A-5 | ✅ (footer only) | Accept sources `footer, home, specializations, hisnathon, talent, event`; confirm `signups` *is* the alert list |
| Event lists, Event page | `upcomingEvents`, `getPublicEvent`, `eventsInMonth`, `latestRecordings` | me + A-3/A-6 | ✅ | — |
| Seats, seat meter | `seats_left` | Abdullah D2-9 | ✅ | — |
| Register, waitlist, cancel | server actions, `waitlist_position` | Abdullah D2-11 | ✅ | — |
| Event announcements | D2-14/15 announcement send | Abdullah | ✅ partly | Who receives them (the `signups` list?), and is the send automatic on publish? |
| Unsubscribe page | token → unsubscribe | Abdullah + Abdulaziz | ❌ new | Contract below |
| **Attendance tab** | `attended_at` + `mark_attendance` | Abdulaziz | ❌ new | Contract below |
| Beneficiary email | trigger on first attendance | Abdullah | ❌ new | Template + trigger |
| Talent status (confirmed or provisional) | `my_beneficiary_status()` | Abdulaziz | ❌ new | Contract below |
| Talent join → alert list + "attend one" email | in `submitTalent` | Abdulaziz A-11 + Abdullah | ❌ new | Add both to the action |
| Export flag | confirmed or provisional in the A-14 export | Abdulaziz | ❌ new | A column in the export |
| Event type filter | `kind` column | Abdulaziz | ❌ optional | Skip at launch unless it's free |
| Hisnathon | `content/hisnathon/**.md` | me + committee | ❌ new | Content owner and date |
| Specializations | `data/specializations.json` | me + programs committee | ❌ new | Content in the sheet template below |
| Markdown render | the renderer A-11 adds for consent | Abdulaziz | ✅ (indirectly) | Reuse it for Hisnathon (server-only, 0 client KB) |

### Draft contracts (for review, not final)

**Attendance**
```sql
alter table registrations add column attended_at timestamptz null;      -- status machine untouched
create function mark_attendance(p_event_id bigint, p_user_ids uuid[], p_attended boolean)
  returns int;   -- admin only (is_admin()); only status='registered' rows; event must have started; returns rows changed
create function my_beneficiary_status()
  returns table (attended_count int, first_attended_at timestamptz);   -- own row via auth.uid()
alter table profiles add column beneficiary_email_sent_at timestamptz;   -- the email goes out once per person
```
```ts
// app/admin/actions.ts  (// attendance group)
export async function listRegistrants(eventId: number): Promise<
  { userId: string; nameAr: string; email: string; attendedAt: string | null }[]>
export async function setAttendance(eventId: number, userIds: string[], attended: boolean):
  Promise<{ ok: true; changed: number } | { ok: false; reason: 'not_started' }>
// lib/talent/status.ts
export type BeneficiaryStatus =
  | { kind: 'confirmed'; since: string }        // attended ≥ 1
  | { kind: 'provisional'; joinedAt: string }   // in the talent base, attended 0
  | { kind: 'none' }
```

**Alert list and its emails**
```sql
-- extend A-5
alter table signups add column source text not null default 'footer'
  check (source in ('footer','home','specializations','hisnathon','talent','event','teaser'));
alter table signups add column unsubscribed_at timestamptz,
                    add column unsubscribe_token uuid not null default gen_random_uuid();
create function newsletter_unsubscribe(p_token uuid) returns boolean;   -- idempotent
```
Emails (Abdullah):
- `event_announcement` to active signups and talent members, with a one-click unsubscribe link
- `beneficiary_welcome` on first attendance, with the talent invitation
- `talent_provisional` on joining via path (b)
- `launch_optin` to teaser subscribers (G-12)

**Hisnathon content** (static; scanned by the «مؤقت» check)
```
content/hisnathon/overview.md     front matter: title, status: upcoming|open|closed|done,
                                  registrationOpens, registrationCloses, startsAt, endsAt (ISO UTC), registrationUrl|null
content/hisnathon/tracks/*.md     front matter: code, title, order, summary   · body: details
content/hisnathon/news/YYYY-MM-DD-slug.md   front matter: title, publishedAt, pinned?
```

**Specializations data**
```ts
// data/specializations.json   (added to the «مؤقت» scan, G-9)
type Specializations = {
  version: string                       // e.g. "programs-2026-11-27"
  areas: { code: string; ar: string; en: string; departmentCode?: string }[]   // departmentCode links to a hub (Q4)
  majors: {
    majorCode: string                   // must exist in data/majors.json (unit test)
    areas: { areaCode: string; titles: { ar: string; en?: string }[] }[]
  }[]
}
```
The programs committee fills a three-column sheet: major · work area · job title, one row per title. A small script converts it to JSON, so nobody copies text out of a PDF by hand. A unit test checks that every `majorCode` and `areaCode` resolves.

---

## 9. Roadmap

### Phases on the D1 dates

| Date | D1 task (dev-1) | Design that lands inside it |
|---|---|---|
| Sat 14 | D1-3 lint | This discovery |
| Sun 15 | D1-4 CI (morning) | **Prototype** (afternoon, see below); extend the «مؤقت» scan (G-9) |
| Mon 16 | D1-5 shell | Brand tokens + 600 weight (§5 #3–4), base components, brand elements, outlined `Logo`, Header/Footer; share the kit with Abdullah |
| Tue 17 | D1-6 newsletter, privacy | `AlertForm` with `source`, alert-list wording |
| Wed 18 | D1-7 time logic | Numerals (Q1), `fmtNum`, `tn()` plurals (G-8) |
| Thu 19 | D1-8 homepage | Hero + **Signature 2**, EventCard variants, EventImage fallback |
| Fri 20 | D1-9 departments | Department layout; specializations data schema and sheet template sent to the committee |
| Sat 21 | D1-10 calendar | Table grid, mobile list, empty and next-event states |
| Sun 22 | D1-11 event page | RegisterButton (all states), SeatMeter, ConfirmDialog, sticky action |
| Mon 23 | D1-12 library + **D1-18 Specializations** (new) | VideoCard; MajorsWall + **Signature 1** |
| Tue 24 | D1-13 admin list + **D1-19 Hisnathon** (new, half day) | Admin table; Hisnathon page |
| Wed 25 | D1-14 event form | Form styling, errors |
| Thu 26 | D1-15 status + **attendance tab** (new) | AttendanceTable |
| Fri 27 | D1-16 account | Beneficiary status variants; **content cut-off at noon** for Specializations and Hisnathon |
| Sat 28 | D1-17 talent | Two ways in, provisional and confirmed copy |
| Sun 29 | Bug bash | Accessibility pass (axe, keyboard, VoiceOver, TalkBack), perf on a real Android, «مؤقت» sweep |
| Mon 30 | Fixes, launch | — |

### Cut line (in this order, if we fall behind)
1. Hisnathon page: hide its nav item and route behind the flag (ship it when the hackathon is announced).
2. Signature 1's animation: ship the static wall and Major pages.
3. Signature 2's animation: ship a static band.
4. Seat meter bricks: fall back to the text «تبقّى ٥ مقاعد» only.
5. Add-to-calendar, the event `kind` filter, the Library department filter UI.
6. Specializations, the whole section, if content misses the Fri 27 noon cut-off.

**Never cut:** every dev-1 function, all register states, accessibility, attendance marking (if Q2 says yes), the outlined logo.

### First step after you choose a direction
A **throwaway HTML prototype**, `prototype/index.html` in this design repo, plain HTML and CSS with the real tokens, timeboxed to about 5 hours on Sun 15:
1. The hero with the band animation.
2. An EventCard and a RegisterButton showing all 8 states, with a toggle.
3. The calendar: November 2026 as the table grid and as the mobile list.

I'll screenshot it at 375 px and 1280 px and check:
- Arabic-Indic digits and `tnum` in Plex Arabic
- Plex Arabic's Latin glyphs against IBM Plex Sans
- the 600 weight, and the contrast of every state
- reduced motion
- the 60 / 25 / 10 / 5 balance

Only after you sign off does anything go into the app repo, as the D1-5 PR.

---

## 10. Questions

These change the direction or the scope. Each has the default I'll use if nobody answers by **Mon 16 Nov, 12:00**.

| # | Question | Who | Default if no answer |
|---|---|---|---|
| Q1 | Do we follow the guide's Arabic-Indic digits (٠١٢٣) everywhere numbers are displayed, changing D1-7's locale and tests? | Plan owner + brand owner | **Yes:** Arabic-Indic for display; Latin only in technical values, inputs and exports |
| Q2 | Is "attend at least one session to stay" enforced at launch? If so, what is the grace period, and who removes provisional members? | Committee (+ Abdulaziz and Abdullah for scope) | Build attendance marking, confirmed/provisional status, the two emails and the export flag; **no automatic removal at launch** |
| Q3 | Are Specializations and Hisnathon in launch scope, and who delivers the final content by when? | Committee + Abdulaziz | Build both behind flags; ship each only if final content arrives by **Fri 27 Nov, 12:00** |
| Q4 | Are the programs committee's "work areas" the same as the six departments? | Programs committee | Separate lists; an area links to a department page only where one matches |
| Q5 | Is English needed at launch? | Committee | **No:** Arabic only; tokens and `t()` stay ready for `en.json` later |

**Then I'll stop and wait for your choice of direction (A or B).**
