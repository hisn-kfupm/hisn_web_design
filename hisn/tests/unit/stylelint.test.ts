// @vitest-environment node
import stylelint from 'stylelint'
import { describe, expect, it } from 'vitest'
import rc from '../../.stylelintrc.json'

const config = rc as stylelint.Config
const errored = async (code: string) => (await stylelint.lint({ code, config })).errored

describe('.stylelintrc.json', () => {
  it.each([
    'a{margin-left:1px}',
    'a{margin-right:1px}',
    'a{padding-left:1px}',
    'a{padding-right:1px}',
    'a{left:0}',
    'a{right:0}',
    'a{border-left:1px solid}',
    'a{border-right:1px solid}',
    'a{border-left-width:2px}',
    'a{border-top-right-radius:4px}',
    'a{scroll-margin-left:1rem}',
    'a{text-align:right}',
    'a{text-align:left}',
    'a{float:left}',
    'a{clear:right}',
  ])('rejects %s', async (code) => {
    expect(await errored(code)).toBe(true)
  })

  it.each([
    'a{margin-inline-start:1px}',
    'a{padding-inline:1rem}',
    'a{inset-inline-start:0}',
    'a{border-inline-end:1px solid}',
    'a{border-start-end-radius:4px}',
    'a{text-align:start}',
    'a{float:inline-start}',
    'a{margin:0 auto}',
  ])('accepts %s', async (code) => {
    expect(await errored(code)).toBe(false)
  })
})
