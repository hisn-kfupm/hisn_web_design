import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'

/*
  Signed links in emails (spec §8.5): unsubscribe, and cancel a registration or a waitlist place.
  Format: base64url(JSON payload) + '.' + base64url(HMAC-SHA256(TOKEN_SECRET, first part)).
  A cancel token carries the registration_version it was issued for, so an old link can't cancel a
  newer registration, and it expires when the event starts. A token only identifies; acting on it
  is a POST behind a confirm page (HR-5).
*/

export type TokenPayload =
  | { kind: 'unsub'; sub: string } // sub = normalized email; no expiry
  | { kind: 'cancel'; sub: string; ver: number; exp: number }
// cancel: sub = registration id as string; ver = registrations.registration_version; exp = Unix SECONDS (event start)

const PART = /^[A-Za-z0-9_-]+$/

/** read on every call, never cached, so a rotated secret takes effect at once */
function secret(): string {
  const s = process.env.TOKEN_SECRET
  if (!s || s.length < 32) throw new Error('TOKEN_SECRET must be set to at least 32 characters')
  return s
}

const mac = (body: string) => createHmac('sha256', secret()).update(body).digest('base64url')

/** a well-formed payload of this kind (expiry is checked separately) */
function isPayload(p: unknown, kind: TokenPayload['kind']): p is TokenPayload {
  if (typeof p !== 'object' || p === null) return false
  const o = p as Record<string, unknown>
  if (o.kind !== kind || typeof o.sub !== 'string' || o.sub === '') return false
  if (kind === 'unsub') return true
  return Number.isInteger(o.ver) && (o.ver as number) >= 1 && Number.isInteger(o.exp)
}

/** Throws on a malformed payload rather than mailing a link that can never work. */
export function signToken(p: TokenPayload): string {
  const { kind } = p
  if (!isPayload(p, kind)) throw new Error(`malformed ${kind} token payload`)
  const body = Buffer.from(JSON.stringify(p)).toString('base64url')
  return `${body}.${mac(body)}`
}

/**
 * Bad format, bad signature, wrong kind, or a cancel token without an integer ver ≥ 1 → 'invalid';
 * a valid cancel token whose exp has been reached → 'expired'.
 */
export function verifyTokenDetailed(
  t: string,
  kind: 'unsub' | 'cancel',
): { ok: true; sub: string; ver?: number } | { ok: false; reason: 'invalid' | 'expired' } {
  const invalid = { ok: false, reason: 'invalid' } as const
  const parts = typeof t === 'string' ? t.split('.') : []
  if (parts.length !== 2 || !parts.every((part) => PART.test(part))) return invalid

  const [body, sig] = parts
  const given = Buffer.from(sig)
  const expected = Buffer.from(mac(body))
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return invalid

  let payload: unknown
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
  } catch {
    return invalid
  }
  if (!isPayload(payload, kind)) return invalid
  if (payload.kind === 'unsub') return { ok: true, sub: payload.sub }
  if (payload.exp <= Math.floor(Date.now() / 1000)) return { ok: false, reason: 'expired' }
  return { ok: true, sub: payload.sub, ver: payload.ver }
}

/** The token's subject (and version, for cancel tokens), or null for any failure. */
export function verifyToken(t: string, kind: 'unsub' | 'cancel'): { sub: string; ver?: number } | null {
  const r = verifyTokenDetailed(t, kind)
  if (!r.ok) return null
  return r.ver === undefined ? { sub: r.sub } : { sub: r.sub, ver: r.ver }
}
