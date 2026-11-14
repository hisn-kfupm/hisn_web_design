# حصن — Hisn website (Phase 2)

Next.js 16 (App Router, Turbopack, Cache Components) · TypeScript · Tailwind CSS v4 (tokens in `app/globals.css` `@theme`) · Vitest · Playwright.

Design direction and decisions: [`../design/01-discovery.md`](../design/01-discovery.md) (Direction A «لبنة»). Task list: [`../dev-1.md`](../dev-1.md).

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint + Stylelint (logical properties only) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests (`tests/unit`, jsdom) |
| `npm run test:db` / `test:scripts` / `test:e2e` | DB, scripts and Playwright suites |
| `npm run check:content` | Fails while any «مؤقت» draft text remains (D1-4) |

Conventions (dev-1 "Rules for every task"): no literal UI text in components — every string is a key in `lib/i18n/ar.json` read with `t()`; logical properties only (`ms-*`, `pe-*`, `text-start`); wrap English names, emails and URLs inside Arabic in `<Bdi lang="en">`; times stored UTC, shown in Asia/Riyadh. Client components receive strings as props from server components, so `ar.json` stays out of the browser bundle.
