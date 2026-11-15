import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { cacheLife } from 'next/cache'
import Home from '@/app/page'
import { upcomingEvents, latestRecordings } from '@/lib/events/queries'
import { seatsTaken } from '@/lib/events/seats'
import { departments, majors } from '@/lib/data/labels'
import { HERO_IMAGE } from '@/lib/config/content'
import { t } from '@/lib/i18n/t'

vi.mock('next/cache', () => ({ cacheLife: vi.fn() }))

const NOW = new Date('2026-11-15T09:00:00Z')
beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(NOW)
})
afterAll(() => {
  vi.useRealTimers()
})
beforeEach(() => {
  vi.mocked(cacheLife).mockClear()
})

const section = (container: HTMLElement, id: string) => container.querySelector(`[data-testid="${id}"]`) as HTMLElement

describe('homepage', () => {
  it('caches for an hour (Cache Components replaces dev-1’s `revalidate = 3600`)', async () => {
    render(await Home())
    expect(cacheLife).toHaveBeenCalledWith('hours')
  })

  it('has one h1: the slogan', async () => {
    render(await Home())
    const h1 = screen.getAllByRole('heading', { level: 1 })
    expect(h1).toHaveLength(1)
    expect(h1[0].textContent).toBe(t('brand.slogan'))
  })

  it('keeps the typographic hero while HERO_IMAGE is null', async () => {
    expect(HERO_IMAGE).toBeNull()
    const { container } = render(await Home())
    expect(container.querySelector('[data-testid="hero"] img')).toBeNull()
  })

  it('shows the next event in the hero brick', async () => {
    const [next] = await upcomingEvents({ limit: 1 })
    const { container } = render(await Home())
    const brick = section(container, 'next-event')
    expect(within(brick).getByRole('link', { name: new RegExp(next.title) }).getAttribute('href')).toBe(`/events/${next.id}`)
  })

  it('sets the three verbs of the approved description, composed (filled) without JS', async () => {
    const { container } = render(await Home())
    const verbs = section(container, 'verbs')
    expect(verbs.getAttribute('data-band')).toBe('dark')
    const words = [...verbs.querySelectorAll('[data-word]')].map((w) => w.textContent)
    expect(words).toEqual([t('home.verbs.1.word'), t('home.verbs.2.word'), t('home.verbs.3.word')])
    for (const w of verbs.querySelectorAll<HTMLElement>('[data-word]')) expect(w.style.getPropertyValue('--fill')).toBe('')
    expect(verbs.textContent).toContain(t('home.verbs.1.line'))
  })

  it('runs a decorative band of majors, with one sentence for screen readers', async () => {
    const { container } = render(await Home())
    const band = section(container, 'majors-band')
    const rows = band.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(rows.textContent).toContain(majors[0].ar)
    expect(rows.textContent).not.toContain(majors.find((m) => m.code === 'OTHER')!.ar)
    expect(band.querySelector('.sr-only')?.textContent).toBe(t('home.majors.sr'))
  })

  it('lists the next four events as timetable rows, linked to their pages, with seat meters', async () => {
    const next = await upcomingEvents({ limit: 4 })
    const taken = await seatsTaken(next.map((e) => e.id))
    const { container } = render(await Home())
    const timetable = section(container, 'upcoming')
    const rows = [...timetable.querySelectorAll('li[data-course]')]
    expect(rows).toHaveLength(next.length)
    expect(rows.map((r) => r.querySelector('h3 a')?.getAttribute('href'))).toEqual(next.map((e) => `/events/${e.id}`))
    const metered = next.filter((e) => e.capacity !== null && taken.has(e.id))
    expect(metered.length).toBeGreaterThan(0)
    expect(timetable.querySelectorAll('[data-testid="seat-meter"]')).toHaveLength(metered.length)
    expect(within(timetable).getByRole('link', { name: t('home.events.all') }).getAttribute('href')).toBe('/events')
  })

  it('indexes the departments with one link each to its page, described by its summary', async () => {
    const { container } = render(await Home())
    const index = section(container, 'departments')
    const links = [...index.querySelectorAll('h3 a')]
    expect(links.map((a) => a.getAttribute('href'))).toEqual(departments.map((d) => `/departments/${d.slug}`))
    const described = links[0].getAttribute('aria-describedby')!
    expect(container.querySelector(`[id="${described}"]`)?.textContent).toBe(t(`dept.${departments[0].code}.summary` as never))
    // the preview panel repeats the active item: hidden from assistive tech, out of the tab order
    const panelLinks = [...index.querySelectorAll('[aria-hidden="true"] a')]
    expect(panelLinks.every((a) => a.getAttribute('tabindex') === '-1')).toBe(true)
  })

  it('invites to the talent base with the guide’s line, the two ways in and the CTA', async () => {
    const { container } = render(await Home())
    const band = section(container, 'talent')
    expect(band.querySelector('h2')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(t('home.talent.line'))
    expect(band.querySelectorAll('[data-brick]')).toHaveLength(2)
    expect(within(band).getByRole('link', { name: t('home.talent.cta') }).getAttribute('href')).toBe('/talent')
  })

  it('shows the latest recordings in the strip, each linked into the library', async () => {
    const latest = await latestRecordings({ limit: 6 })
    const { container } = render(await Home())
    const strip = section(container, 'recordings')
    expect(strip.querySelectorAll('article')).toHaveLength(latest.length)
    for (const e of latest) {
      expect(strip.textContent).toContain(e.title)
      expect(strip.querySelector(`a[href="/library#recording-${e.id}"]`)).not.toBeNull()
    }
    expect(within(strip).getByRole('link', { name: t('home.recordings.all') }).getAttribute('href')).toBe('/library')
  })

  it('numbers the sections in order', async () => {
    const { container } = render(await Home())
    const numbers = [...container.querySelectorAll('[data-testid="section-number"]')].map((n) => n.textContent)
    expect(numbers).toEqual(['٠١', '٠٢', '٠٣'])
  })
})
