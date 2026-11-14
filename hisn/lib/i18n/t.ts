import ar from './ar.json'

export type StringKey = keyof typeof ar

const strings: Record<string, string> = ar

/** Look up an Arabic UI string. `{name}` placeholders must all be supplied, or this throws. */
export function t(key: StringKey, vars?: Record<string, string | number>): string {
  return strings[key].replace(/\{(\w+)\}/g, (_match, name: string) => {
    if (!vars || !(name in vars)) throw new Error(`missing var ${name} for key ${key}`)
    return String(vars[name])
  })
}
