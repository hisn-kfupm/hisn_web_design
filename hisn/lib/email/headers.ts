import { normalizeEmail } from '@/lib/email/normalize'
import { signToken } from '@/lib/tokens/sign'

/*
  The two headers every announcement carries for one-click unsubscribe (RFC 8058, spec §10.4).
  Resend doesn't add them for API sends, so the code does. Mail clients POST to the link; a person
  who opens it in a browser (GET) is sent to the confirm page instead.
*/
export function unsubscribeHeaders(email: string): Record<'List-Unsubscribe' | 'List-Unsubscribe-Post', string> {
  const token = signToken({ kind: 'unsub', sub: normalizeEmail(email) })
  return {
    'List-Unsubscribe': `<${siteUrl()}/api/unsubscribe?t=${token}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  }
}

/** SITE_URL without a trailing slash, read per call; a header without it could unsubscribe nobody */
function siteUrl(): string {
  const url = process.env.SITE_URL
  if (!url) throw new Error('SITE_URL must be set')
  return url.replace(/\/+$/, '')
}
