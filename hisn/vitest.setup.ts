import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => cleanup())

// next/font needs Next's compiler; in unit tests it only has to hand back class names.
vi.mock('next/font/google', () => ({
  IBM_Plex_Sans_Arabic: () => ({ className: 'font-plex', variable: 'font-plex-var', style: { fontFamily: 'IBM Plex Sans Arabic' } }),
}))
