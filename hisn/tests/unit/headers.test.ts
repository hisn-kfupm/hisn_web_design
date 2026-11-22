import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { unsubscribeHeaders } from '@/lib/email/headers'
import { verifyToken } from '@/lib/tokens/sign'

beforeEach(() => {
  vi.stubEnv('SITE_URL', 'https://x.test')
  vi.stubEnv('TOKEN_SECRET', 'x'.repeat(32))
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('unsubscribeHeaders', () => {
  it('points List-Unsubscribe at the one-click endpoint', () => {
    expect(unsubscribeHeaders('A@B.com')['List-Unsubscribe']).toMatch(/^<https:\/\/x\.test\/api\/unsubscribe\?t=[^>]+>$/)
  })

  it('carries an unsubscribe token for the normalized email', () => {
    const token = unsubscribeHeaders('A@B.com')['List-Unsubscribe'].match(/\?t=([^>]+)>$/)![1]
    expect(verifyToken(token, 'unsub')).toStrictEqual({ sub: 'a@b.com' })
  })

  it('asks for one-click unsubscribe (RFC 8058)', () => {
    expect(unsubscribeHeaders('A@B.com')['List-Unsubscribe-Post']).toBe('List-Unsubscribe=One-Click')
  })

  it('does not double the slash when SITE_URL ends with one', () => {
    vi.stubEnv('SITE_URL', 'https://x.test/')
    expect(unsubscribeHeaders('a@b.com')['List-Unsubscribe']).toMatch(/^<https:\/\/x\.test\/api\/unsubscribe\?t=/)
  })

  it('refuses to build the header without SITE_URL', () => {
    vi.stubEnv('SITE_URL', '')
    expect(() => unsubscribeHeaders('a@b.com')).toThrow('SITE_URL')
  })
})
