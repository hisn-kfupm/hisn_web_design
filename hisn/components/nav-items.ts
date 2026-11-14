import { departments } from '@/lib/data/labels'
import { t, type StringKey } from '@/lib/i18n/t'

export type NavItem = { href: string; label: string }

/** Header links (dev-1 D1-5), resolved to Arabic on the server. */
export function primaryNav(): NavItem[] {
  return [
    { href: '/events', label: t('nav.events') },
    { href: '/library', label: t('nav.library') },
    { href: '/talent', label: t('nav.talent') },
  ]
}

export function departmentNav(): NavItem[] {
  return departments.map((d) => ({ href: `/departments/${d.slug}`, label: t(`dept.${d.code}.title` as StringKey) }))
}
