import { describe, expect, it } from 'vitest'
import { layoutWall, prng, type WallSpec } from '@/components/hero/wall-layout'
import { majors } from '@/lib/data/labels'

const wallMajors = majors.filter((m) => m.code !== 'OTHER')
const spec: WallSpec = {
  width: 1280,
  top: 360,
  bottom: 800,
  course: 40,
  mortar: 2,
  majors: wallMajors,
  measure: (label) => label.length * 6.5,
}

describe('layoutWall', () => {
  it('is deterministic', () => {
    expect(layoutWall(spec)).toEqual(layoutWall(spec))
    const r = prng(1)
    expect(r()).toBe(prng(1)())
  })

  it('carries every major at least once on a desktop wall', () => {
    const codes = new Set(layoutWall(spec).filter((b) => b.kind === 'brick').map((b) => b.code))
    for (const m of wallMajors) expect(codes.has(m.code), m.code).toBe(true)
  })

  it('lays courses in running bond: inner joints never line up with the course below', () => {
    const bricks = layoutWall(spec).filter((b) => b.kind === 'brick')
    const joints = (c: number) =>
      bricks.filter((b) => b.course === c).flatMap((b) => [b.x - 1, b.x + b.w + 1]).filter((x) => x > 4 && x < spec.width - 4)
    const courses = Math.max(...bricks.map((b) => b.course))
    for (let c = 1; c <= courses; c++) {
      const below = joints(c - 1)
      for (const j of joints(c)) expect(below.some((k) => Math.abs(k - j) < 6), `course ${c} joint ${j}`).toBe(false)
    }
  })

  it('crowns the wall with merlons above the top course', () => {
    const bricks = layoutWall(spec)
    const merlons = bricks.filter((b) => b.kind === 'merlon')
    expect(merlons.length).toBeGreaterThan(5)
    const topBrick = Math.min(...bricks.filter((b) => b.kind === 'brick').map((b) => b.y))
    for (const m of merlons) expect(m.y).toBeLessThan(topBrick)
  })

  it('keeps bricks out of holes and builds the tower higher', () => {
    const hole = { x: 40, y: 500, w: 300, h: 200 }
    const bricks = layoutWall({ ...spec, tower: { x0: 0, x1: 400, top: 160 }, holes: [hole] })
    for (const b of bricks) {
      const inside = b.x < hole.x + hole.w && b.x + b.w > hole.x && b.y < hole.y + hole.h && b.y + b.h > hole.y
      expect(inside).toBe(false)
    }
    const towerTop = Math.min(...bricks.filter((b) => b.x < 400).map((b) => b.y))
    const wallTop = Math.min(...bricks.filter((b) => b.x > 600).map((b) => b.y))
    expect(towerTop).toBeLessThan(wallTop - 100)
  })
})
