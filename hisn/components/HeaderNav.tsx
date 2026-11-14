'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
import { useDisclosure } from '@/components/ui/useDisclosure'
import type { NavItem } from '@/components/nav-items'

type Props = {
  label: string
  departmentsLabel: string
  departments: NavItem[]
  items: NavItem[]
}

const isCurrent = (pathname: string | null, href: string) => !!pathname && (pathname === href || pathname.startsWith(href + '/'))

/** Desktop navigation (≥1024 px). Strings arrive as props so ar.json never ships to the browser. */
export function HeaderNav({ label, departmentsLabel, departments, items }: Props) {
  const pathname = usePathname()
  const { open: deptOpen, close: closeDept, toggle: toggleDept, id: deptId, buttonRef, panelRef } = useDisclosure<HTMLButtonElement, HTMLUListElement>()
  const deptCurrent = departments.some((d) => isCurrent(pathname, d.href))
  const link = 'inline-flex min-h-11 items-center gap-1.5 px-3 font-medium text-on-dark no-underline hover:text-white'
  const current = 'text-white underline decoration-mint decoration-2 underline-offset-[12px]'

  return (
    <nav aria-label={label} className="ms-6 hidden items-center gap-1 lg:flex">
      <div className="relative">
        <button ref={buttonRef} type="button" aria-expanded={deptOpen} aria-controls={deptId} onClick={toggleDept} className={`${link} ${deptCurrent ? current : ''}`}>
          {departmentsLabel}
          <Icon icon={ChevronDown} size={18} className={deptOpen ? 'rotate-180' : ''} />
        </button>
        <ul
          ref={panelRef}
          id={deptId}
          hidden={!deptOpen}
          data-testid="dept-menu"
          className="absolute start-0 top-full z-30 m-0 min-w-60 list-none border border-line bg-white py-2 text-deep shadow-[0_12px_32px_rgb(2_44_51/0.18)]"
        >
          {departments.map((d) => (
            <li key={d.href}>
              <Link
                href={d.href}
                onClick={() => closeDept()}
                aria-current={isCurrent(pathname, d.href) ? 'page' : undefined}
                className="flex min-h-11 items-center px-4 py-2.5 font-medium text-deep no-underline hover:bg-box aria-[current=page]:text-teal"
              >
                {d.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {items.map((item) => (
        <Link key={item.href} href={item.href} aria-current={isCurrent(pathname, item.href) ? 'page' : undefined} className={`${link} aria-[current=page]:text-white aria-[current=page]:underline aria-[current=page]:decoration-mint aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-[12px]`}>
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
