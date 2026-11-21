import { createHmac } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { signToken, verifyToken, verifyTokenDetailed } from '@/lib/tokens/sign'

const SECRET = 'x'.repeat(32)
const nowSec = () => Math.floor(Date.now() / 1000)

/** a token in the documented format, for payloads signToken refuses to build */
function signByHand(payload: unknown, secret = SECRET): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${createHmac('sha256', secret).update(body).digest('base64url')}`
}

beforeEach(() => {
  vi.stubEnv('TOKEN_SECRET', SECRET)
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('signed tokens', () => {
  it('round-trips an unsubscribe token', () => {
    expect(verifyToken(signToken({ kind: 'unsub', sub: 'a@b.com' }), 'unsub')).toStrictEqual({ sub: 'a@b.com' })
  })

  it('uses the documented format: base64url(JSON) + "." + base64url(HMAC-SHA256)', () => {
    const payload = { kind: 'unsub', sub: 'a@b.com' } as const
    expect(signToken(payload)).toBe(signByHand(payload))
  })

  it('rejects a token whose payload part was changed by one character', () => {
    const [body, sig] = signToken({ kind: 'unsub', sub: 'a@b.com' }).split('.')
    const changed = body.slice(0, 5) + (body[5] === 'A' ? 'B' : 'A') + body.slice(6)
    expect(verifyToken(`${changed}.${sig}`, 'unsub')).toBeNull()
  })

  it('reports a cancel token past its exp as expired', () => {
    const t = signToken({ kind: 'cancel', sub: '42', ver: 1, exp: nowSec() - 1 })
    expect(verifyToken(t, 'cancel')).toBeNull()
    expect(verifyTokenDetailed(t, 'cancel')).toStrictEqual({ ok: false, reason: 'expired' })
  })

  it('treats a cancel token as expired from the second of its exp', () => {
    const t = signToken({ kind: 'cancel', sub: '42', ver: 1, exp: nowSec() })
    expect(verifyTokenDetailed(t, 'cancel')).toStrictEqual({ ok: false, reason: 'expired' })
  })

  it('returns sub and ver for a valid cancel token', () => {
    const t = signToken({ kind: 'cancel', sub: '42', ver: 2, exp: nowSec() + 3600 })
    expect(verifyToken(t, 'cancel')).toStrictEqual({ sub: '42', ver: 2 })
    expect(verifyTokenDetailed(t, 'cancel')).toStrictEqual({ ok: true, sub: '42', ver: 2 })
  })

  it.each([
    ['no ver', { kind: 'cancel', sub: '42', exp: nowSec() + 3600 }],
    ['ver 0', { kind: 'cancel', sub: '42', ver: 0, exp: nowSec() + 3600 }],
    ['a fractional ver', { kind: 'cancel', sub: '42', ver: 1.5, exp: nowSec() + 3600 }],
    ['ver as a string', { kind: 'cancel', sub: '42', ver: '2', exp: nowSec() + 3600 }],
  ])('rejects a hand-signed cancel payload with %s as invalid', (_, payload) => {
    expect(verifyTokenDetailed(signByHand(payload), 'cancel')).toStrictEqual({ ok: false, reason: 'invalid' })
  })

  it('rejects an unsubscribe token used as a cancel token', () => {
    const t = signToken({ kind: 'unsub', sub: 'a@b.com' })
    expect(verifyToken(t, 'cancel')).toBeNull()
    expect(verifyTokenDetailed(t, 'cancel')).toStrictEqual({ ok: false, reason: 'invalid' })
  })

  it('rejects a malformed token', () => {
    expect(verifyToken('abc', 'unsub')).toBeNull()
    expect(verifyTokenDetailed('abc', 'unsub')).toStrictEqual({ ok: false, reason: 'invalid' })
  })

  it('rejects a token signed with a different secret', () => {
    const t = signToken({ kind: 'unsub', sub: 'a@b.com' })
    vi.stubEnv('TOKEN_SECRET', 'y'.repeat(32))
    expect(verifyToken(t, 'unsub')).toBeNull()
  })

  it('refuses to sign without a TOKEN_SECRET of at least 32 characters', () => {
    vi.stubEnv('TOKEN_SECRET', 'short')
    expect(() => signToken({ kind: 'unsub', sub: 'a@b.com' })).toThrow('TOKEN_SECRET')
  })
})
