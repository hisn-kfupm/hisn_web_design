'use client'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
import { useDisclosure } from '@/components/ui/useDisclosure'
import type { NavItem } from '@/components/nav-items'

type Props = {
  labels: { open: string; close: string; nav: string; departments: string }
  departments: NavItem[]
  items: NavItem[]
}

/**
 * Mobile navigation (<1024 px). The sign-in button is NOT in here: it stays in the header bar
 * (dev-1 D1-5), so `data-testid="auth-entry"` is never a descendant of this panel.
 */
export function MobileMenu({ labels, departments, items }: Props) {
  const { open, close, toggle, id, buttonRef, panelRef } = useDisclosure()
  const row = 'flex min-h-12 items-center border-b border-teal-100/15 font-medium text-on-dark no-underline hover:text-white'
  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={toggle}
        aria-label={open ? labels.close : labels.open}
        className="grid size-11 place-items-center border border-teal-100/35 text-white lg:hidden"
      >
        <Icon icon={open ? X : Menu} size={22} />
      </button>
      <nav
        ref={panelRef}
        id={id}
        hidden={!open}
        aria-label={labels.nav}
        data-testid="mobile-menu"
        className="bg-deep on-dark absolute inset-x-0 top-full z-30 border-t border-teal-100/15 pb-6 lg:hidden"
      >
        <ul className="wrap m-0 list-none p-0">
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={() => close()} className={row}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <p className="wrap mt-5 mb-1 text-label text-mint-200">{labels.departments}</p>
        <ul className="wrap m-0 list-none p-0" data-testid="mobile-dept-menu">
          {departments.map((d) => (
            <li key={d.href}>
              <Link href={d.href} onClick={() => close()} className={row}>{d.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
