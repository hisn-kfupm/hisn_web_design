import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { cacheLife } from 'next/cache'
import Home from '@/app/page'
import { upcomingEvents, latestRecordings } from '@/lib/events/queries'
import { departments } from '@/lib/data/labels'
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
    const brick = container.querySelector('[data-testid="next-event"]') as HTMLElement
    expect(within(brick).getByRole('link', { name: new RegExp(next.title) }).getAttribute('href')).toBe(`/events/${next.id}`)
  })

  it('lists the next three events, linked to their pages', async () => {
    const next = await upcomingEvents({ limit: 3 })
    const { container } = render(await Home())
    const section = container.querySelector('[data-testid="upcoming"]') as HTMLElement
    const hrefs = [...section.querySelectorAll('article a[href^="/events/"]')].map((a) => a.getAttribute('href'))
    expect(hrefs).toEqual(next.map((e) => `/events/${e.id}`))
    expect(within(section).getByRole('link', { name: t('home.events.all') }).getAttribute('href')).toBe('/events')
  })

  it('has one card per department, linked to its page', async () => {
    const { container } = render(await Home())
    const links = [...container.querySelectorAll('[data-testid="departments"] a')].map((a) => a.getAttribute('href'))
    expect(links).toEqual(departments.map((d) => `/departments/${d.slug}`))
  })

  it('invites to the talent base', async () => {
    const { container } = render(await Home())
    const band = container.querySelector('[data-testid="talent"]') as HTMLElement
    expect(within(band).getByRole('link', { name: t('home.talent.cta') }).getAttribute('href')).toBe('/talent')
  })

  it('shows the latest three recordings', async () => {
    const latest = await latestRecordings({ limit: 3 })
    const { container } = render(await Home())
    const section = container.querySelector('[data-testid="recordings"]') as HTMLElement
    for (const e of latest) expect(section.textContent).toContain(e.title)
    expect(section.querySelectorAll('article')).toHaveLength(latest.length)
  })

  it('numbers the sections in order', async () => {
    const { container } = render(await Home())
    const numbers = [...container.querySelectorAll('[data-testid="section-number"]')].map((n) => n.textContent)
    expect(numbers).toEqual(['01', '02', '03'])
  })
})
