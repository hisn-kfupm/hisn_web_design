/**
 * The hero wall's geometry (redesign §5.1), pure so it can be tested: bricks in running bond,
 * each carrying a major, laid from the inline-start (right) edge, courses from the bottom up,
 * with a crenellated top course on the wall and on an optional tower at the inline-end side.
 * Coordinates are CSS pixels inside the canvas, origin top-left.
 */

export type Rect = { x: number; y: number; w: number; h: number }
export type Major = { code: string; ar: string }

export type Brick = Rect & {
  /** index of the course, 0 = bottom */
  course: number
  /** 0–1, how far along the course from the inline-start edge (for start → end staggers) */
  along: number
  kind: 'brick' | 'merlon'
  code: string
  label: string
  /** palette index, for subtle variation */
  tone: number
  /** a small per-brick random 0–1 */
  seed: number
}

export type WallSpec = {
  width: number
  /** top of the wall's crenellations (merlon row) */
  top: number
  /** bottom of the wall (usually the canvas height) */
  bottom: number
  course: number
  mortar: number
  /** a taller block at the inline-end side, from x0 to x1, whose crenellations start at `top` */
  tower?: { x0: number; x1: number; top: number } | null
  /** areas kept free of bricks (the next-event card's socket) */
  holes?: Rect[]
  majors: Major[]
  /** label width in px at the wall's label size */
  measure: (label: string) => number
  seed?: number
  rtl?: boolean
}

/** mulberry32: small deterministic PRNG, so the wall is the same on every visit */
export function prng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const overlaps = (a: Rect, b: Rect) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y

export const TONES = 6

export function layoutWall(spec: WallSpec): Brick[] {
  const { width, top, bottom, course: h, mortar, majors, measure } = spec
  const rtl = spec.rtl ?? true
  const rand = prng(spec.seed ?? 7)
  const holes = spec.holes ?? []
  const tower = spec.tower ?? null

  // majors in a shuffled order, cycled, so neighbours differ and every major appears
  const order = majors.map((m) => ({ m, k: rand() })).sort((a, b) => a.k - b.k).map((x) => x.m)
  let next = 0
  const take = () => order[next++ % order.length]

  const minW = h * 2.3
  const maxW = h * 6.5
  const pad = h * 0.5
  const widthOf = (label: string) => Math.min(maxW, Math.max(minW, Math.round(measure(label) + pad * 2)))

  const bricks: Brick[] = []
  const bodyTop = top + h // first full course below the merlons
  const towerBodyTop = tower ? tower.top + h : Infinity
  const courses = Math.max(0, Math.floor((bottom - bodyTop) / h))
  const towerCourses = tower ? Math.max(0, Math.floor((bottom - towerBodyTop) / h)) : 0
  let prevJoints: number[] = []

  const place = (rect: Rect, course: number, kind: Brick['kind'], major: Major | null) => {
    if (rect.w < h * 0.6) return
    if (kind === 'merlon' && holes.some((hole) => overlaps(rect, hole))) return
    const along = rtl ? (width - (rect.x + rect.w / 2)) / width : (rect.x + rect.w / 2) / width
    bricks.push({
      ...rect,
      course,
      along: Math.min(1, Math.max(0, along)),
      kind,
      code: major?.code ?? '',
      label: major?.ar ?? '',
      tone: Math.floor(rand() * TONES),
      seed: rand(),
    })
  }

  /** fill [a, b] at row y with label-sized bricks, from the inline-start edge */
  const fillSegment = (a: number, b: number, y: number, course: number, offset: number) => {
    const joints: number[] = []
    let cursor = rtl ? b + offset : a - offset // starts beyond the edge by `offset`
    let guard = 0
    while ((rtl ? cursor > a : cursor < b) && guard++ < 400) {
      const major = take()
      let w = widthOf(major.ar)
      let edge = rtl ? cursor - w : cursor + w
      // running bond: no joint within 0.4 course of a joint in the course below
      for (let tries = 0; tries < 3; tries++) {
        const clash = prevJoints.find((j) => Math.abs(j - edge) < h * 0.4)
        if (clash === undefined) break
        w += h * 0.55
        edge = rtl ? cursor - w : cursor + w
      }
      const x0 = rtl ? Math.max(a, edge) : Math.max(a, cursor)
      const x1 = rtl ? Math.min(b, cursor) : Math.min(b, edge)
      place({ x: x0 + mortar / 2, y: y + mortar / 2, w: x1 - x0 - mortar, h: h - mortar }, course, 'brick', major)
      if (edge > a && edge < b) joints.push(edge)
      cursor = edge
    }
    return joints
  }

  /** [a, b] minus the holes that cross row y, as separate spans (bricks are cut at a hole's sides) */
  const spans = (a: number, b: number, y: number): [number, number][] => {
    let list: [number, number][] = [[a, b]]
    for (const hole of holes) {
      if (hole.y >= y + h || hole.y + hole.h <= y) continue
      list = list.flatMap(([s, e]): [number, number][] => {
        if (hole.x >= e || hole.x + hole.w <= s) return [[s, e]]
        return ([[s, hole.x], [hole.x + hole.w, e]] as [number, number][]).filter(([p, q]) => q - p > 1)
      })
    }
    return list
  }

  for (let c = 0; c < Math.max(courses, towerCourses); c++) {
    const y = bottom - (c + 1) * h
    const offset = c % 2 === 0 ? 0 : h * 1.6
    const joints: number[] = []
    const [a, b] = c < courses ? [0, width] : tower ? [tower.x0, tower.x1] : [0, 0]
    const parts = spans(a, b, y)
    // lay spans from the inline-start edge, so the stagger reads start → end
    if (rtl) parts.reverse()
    for (const [s, e] of parts) joints.push(...fillSegment(s, e, y, c, s === a || e === b ? offset : 0))
    prevJoints = joints
  }

  // crenellations: merlons and gaps like the logo's الشرفات (merlon ≈ 1.6 × gap)
  const merlonW = Math.round(h * 2.1)
  const gapW = Math.round(h * 1.3)
  const crenellate = (a: number, b: number, y: number, course: number) => {
    const span = b - a
    const n = Math.max(1, Math.floor((span + gapW) / (merlonW + gapW)))
    const used = n * merlonW + (n - 1) * gapW
    const start = a + (span - used) / 2
    for (let i = 0; i < n; i++) {
      const x = start + i * (merlonW + gapW)
      place({ x: x + mortar / 2, y: y + mortar / 2, w: merlonW - mortar, h: h - mortar }, course, 'merlon', null)
    }
  }
  if (courses > 0) {
    if (tower && towerCourses > courses) {
      // the main wall's merlons run up to the tower; the tower carries its own
      if (rtl) crenellate(tower.x1 + gapW * 0.5, width + merlonW * 0.5, bodyTop - h, courses)
      else crenellate(-merlonW * 0.5, tower.x0 - gapW * 0.5, bodyTop - h, courses)
      crenellate(tower.x0, tower.x1, towerBodyTop - h, towerCourses)
    } else {
      crenellate(-merlonW * 0.35, width + merlonW * 0.35, bodyTop - h, courses)
    }
  }
  return bricks
}

/** joints (x of each brick edge) per course, for tests */
export function jointsByCourse(bricks: Brick[]): Map<number, number[]> {
  const map = new Map<number, number[]>()
  for (const b of bricks) {
    if (b.kind !== 'brick') continue
    const list = map.get(b.course) ?? []
    list.push(b.x, b.x + b.w)
    map.set(b.course, list)
  }
  return map
}
