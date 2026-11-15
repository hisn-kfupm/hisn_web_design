import { gsap } from '@/lib/motion/gsap'
import { clamp01, smoothstep } from '@/lib/motion/eases'
import { layoutWall, prng, type Brick, type Major, type Rect } from './wall-layout'

/*
  The living wall's renderer (redesign §5.1). Canvas 2D, no React. The DOM owns everything that
  must be read; the wall itself is decorative (the canvas is aria-hidden).

  Drawing order per frame: light in the mortar (clipped to the wall's silhouette, under the bricks,
  so it only shows through the joints) → bricks (a cached static layer when nothing moves, drawn
  one by one during the lay-in and the ring) → search dimming → lit or glowing bricks on top →
  the socket of a pulled brick → a broad raking light → dust.

  It renders only while visible and while something moves; DPR is clamped to 2.
*/

/** brick faces: deep-600, mid, teal-800, teal-700, mid-600, mid-700; each brick also gets ±7%
    lightness from its seed, so the wall reads as fired bricks rather than one flat texture */
const PALETTE = ['#02272D', '#04424C', '#023941', '#024650', '#033A42', '#033139']
/** merlons: the lighter half of the palette, so the crenellations stand out against the sky */
const MERLONS = ['#04424C', '#024650', '#033A42']
const JITTER = 0.14

function hexRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
/** a face colour scaled in lightness by f (1 = unchanged) */
function shade(hex: string, f: number) {
  const [r, g, b] = hexRgb(hex).map((v) => Math.max(0, Math.min(255, Math.round(v * f))))
  return `rgb(${r},${g},${b})`
}
const SOCKET = '#01161A'
const MINT = '95,212,170'
const LIGHT = '233,249,243' // mint-100, the light's colour
const DUST = ['#5FD4AA', '#AFEAD5', '#E9F9F3']
const MORTAR = '#011316'
/** seconds one brick takes to drop into place */
const DROP = 0.4
/** seconds the courses take to be laid, bottom to top (slow enough to read course by course) */
const LAY = 0.8
/** when the crenellations start rising */
const MERLONS_AT = 0.74

export type WallGeometry = {
  top: number
  bottom: number
  tower: { x0: number; x1: number; top: number } | null
  /** the next-event card; becomes a socket in the wall */
  card: Rect | null
  /** where the copy sits: labels stay quieter there so the text reads */
  shade: Rect | null
}

type Glow = { b: Brick; v: number }
type Particle = { x: number; y: number; vx: number; vy: number; s: number; life: number; max: number; c: string }

export class WallEngine {
  private ctx: CanvasRenderingContext2D | null
  private layer: HTMLCanvasElement | null = null
  private dpr = 1
  private w = 0
  private h = 0
  private course = 40
  private labelPx = 12
  private family = 'sans-serif'
  private geometry: WallGeometry | null = null
  private socket: Rect | null = null
  private silhouette: Path2D | null = null
  private bricks: Brick[] = []
  private delays: number[] = []
  private courseStep = 0.04
  private noise: CanvasPattern | null = null
  private overlay: HTMLCanvasElement | null = null
  private socketAt = 0
  private rand = prng(11)
  private faces = new WeakMap<Brick, string>()

  private introT = -1
  private introDur = 1
  private ring = { x: 0, y: 0, t: -1 }
  private particles: Particle[] = []
  private pointer = { x: 0, y: 0, on: false }
  private light = { x: 0, y: 0, a: 0 }
  private lastPointer = 0
  private glows = new Set<Glow>()
  private matches: Set<string> | null = null
  private searchT = 0
  private pulled: Brick | null = null
  private dirty = true
  private visible = true
  private idleCall: gsap.core.Tween | null = null
  private destroyed = false

  constructor(
    private canvas: HTMLCanvasElement,
    private majors: Major[],
    private reduced: boolean,
  ) {
    this.ctx = canvas.getContext('2d')
    gsap.ticker.add(this.tick)
  }

  get ready() {
    return !!this.ctx
  }

  setFont(family: string) {
    this.family = family
  }

  setVisible(v: boolean) {
    this.visible = v
    if (v) this.dirty = true
  }

  /** size the canvas to its box and lay the wall out again */
  resize(geometry: WallGeometry, course: number) {
    const ctx = this.ctx
    if (!ctx) return
    this.geometry = geometry
    this.course = course
    this.labelPx = Math.max(12, Math.min(14, Math.round(course * 0.33)))
    this.dpr = Math.min(2, window.devicePixelRatio || 1)
    this.w = this.canvas.clientWidth
    this.h = this.canvas.clientHeight
    this.canvas.width = Math.round(this.w * this.dpr)
    this.canvas.height = Math.round(this.h * this.dpr)
    ctx.font = this.font()

    const { top, bottom, tower, card } = geometry
    const h = course
    // snap the card's socket to course lines, so bricks are cut cleanly around it
    this.socket = card
      ? (() => {
          const y0 = bottom - Math.ceil((bottom - (card.y - 6)) / h) * h
          const y1 = bottom - Math.floor((bottom - (card.y + card.h + 6)) / h) * h
          return { x: card.x - 8, y: y0, w: card.w + 16, h: Math.max(h, y1 - y0) }
        })()
      : null
    this.bricks = layoutWall({
      width: this.w,
      top,
      bottom,
      course: h,
      mortar: 2,
      tower,
      holes: this.socket ? [this.socket] : [],
      majors: this.majors,
      measure: (label) => ctx.measureText(label).width,
      seed: 7,
      rtl: getComputedStyle(this.canvas).direction !== 'ltr',
    })
    const path = new Path2D()
    for (const b of this.bricks) path.rect(b.x - 1, b.y - 1, b.w + 2, b.h + 2)
    if (this.socket) path.rect(this.socket.x, this.socket.y, this.socket.w, this.socket.h)
    this.silhouette = path

    // lay-in timing: courses bottom → top, each laid start → end
    const courses = Math.max(1, ...this.bricks.map((b) => b.course))
    const step = Math.min(0.075, LAY / courses)
    this.courseStep = step
    this.delays = this.bricks.map((b) =>
      b.kind === 'merlon' ? MERLONS_AT + b.along * 0.22 : b.course * step + b.along * 0.16 + b.seed * 0.03,
    )
    this.introDur = Math.max(...this.delays, 0) + DROP
    this.socketAt = this.socket ? this.layAt(this.socket.y + this.socket.h, this.socket.x + this.socket.w / 2) : 0
    if (this.pulled) this.pulled = this.bricks.find((b) => b.code === this.pulled?.code) ?? null
    this.buildLayer()
    this.dirty = true
    this.render()
  }

  /** the course-by-course lay-in; returns its duration in seconds */
  intro(): number {
    if (!this.ctx || this.reduced) return 0
    this.introT = 0
    const state = { t: 0 }
    gsap.to(state, {
      t: this.introDur,
      duration: this.introDur,
      ease: 'none',
      onUpdate: () => {
        this.introT = state.t
        this.dirty = true
      },
      onComplete: () => {
        this.introT = -1
        this.dirty = true
        // the first glow comes soon after the wall settles, so the resting hero shows a few names
        this.scheduleIdle(0.35, 3)
      },
    })
    return this.introDur
  }

  /** when the course at y (and x along it) is laid, in seconds from the start of the intro */
  layAt(y: number, x: number) {
    const bottom = this.geometry?.bottom ?? this.h
    const rtl = getComputedStyle(this.canvas).direction !== 'ltr'
    const along = rtl ? (this.w - x) / this.w : x / this.w
    return Math.max(0, Math.floor((bottom - y) / this.course)) * this.courseStep + along * 0.16
  }

  /** where the crenellations finish rising (seconds into the intro) */
  get crenellationsAt() {
    return Math.min(this.introDur, 0.9)
  }

  /** the impact: a ring of light through the mortar and a puff of tiny squares */
  impact(x: number, y: number, width: number) {
    if (!this.ctx || this.reduced) return
    this.ring = { x, y, t: 0 }
    gsap.to(this.ring, { t: 1, duration: 0.85, ease: 'power1.out', onComplete: () => void (this.ring.t = -1) })
    for (let i = 0; i < 16; i++) {
      const side = i % 2 === 0 ? -1 : 1
      const ox = x + side * (width / 2) * (0.55 + this.rand() * 0.5)
      this.particles.push({
        x: ox,
        y: y - 2,
        vx: side * (40 + this.rand() * 150),
        vy: -(50 + this.rand() * 140),
        s: 2 + Math.round(this.rand() * 3),
        life: 0,
        max: 0.45 + this.rand() * 0.45,
        c: DUST[i % DUST.length],
      })
    }
    this.dirty = true
  }

  pointerMove(x: number, y: number) {
    if (this.reduced) return
    if (!this.pointer.on && this.light.a < 0.02) {
      this.light.x = x
      this.light.y = y
    }
    this.pointer = { x, y, on: true }
    this.lastPointer = performance.now()
    this.dirty = true
  }

  pointerLeave() {
    this.pointer.on = false
    this.dirty = true
  }

  /** a tap reveals the touched brick's major */
  tap(x: number, y: number) {
    const b = this.bricks.find((k) => k.kind === 'brick' && x >= k.x && x <= k.x + k.w && y >= k.y && y <= k.y + k.h)
    if (b) this.glow(b, 1.6)
  }

  /** search: light these majors and dim the rest (null clears) */
  setMatches(codes: string[] | null) {
    if (codes) this.matches = new Set(codes)
    const to = codes ? 1 : 0
    if (this.reduced || !this.ctx) {
      this.searchT = to
      if (!codes) this.matches = null
      this.dirty = true
      this.render()
      return
    }
    gsap.to(this, {
      searchT: to,
      duration: 0.45,
      ease: 'settle',
      overwrite: true,
      onUpdate: () => void (this.dirty = true),
      onComplete: () => {
        if (!codes) this.matches = null
      },
    })
  }

  /** take the brick of this major out of the wall; returns its rect (canvas px) */
  pull(code: string, near: { x: number; y: number }): Rect | null {
    const shade = this.geometry?.shade
    const candidates = this.bricks.filter((b) => b.kind === 'brick' && b.code === code && b.x > 0 && b.x + b.w < this.w)
    if (!candidates.length) return null
    const score = (b: Brick) => {
      const inShade = shade && b.x < shade.x + shade.w && b.x + b.w > shade.x && b.y < shade.y + shade.h && b.y + b.h > shade.y
      return Math.hypot(b.x + b.w / 2 - near.x, b.y + b.h / 2 - near.y) + (inShade ? 2000 : 0)
    }
    const b = candidates.sort((p, q) => score(p) - score(q))[0]
    this.pulled = b
    this.dirty = true
    this.render()
    return { x: b.x, y: b.y, w: b.w, h: b.h }
  }

  unpull() {
    this.pulled = null
    this.dirty = true
    this.render()
  }

  destroy() {
    this.destroyed = true
    gsap.ticker.remove(this.tick)
    this.idleCall?.kill()
    gsap.killTweensOf(this)
    gsap.killTweensOf(this.ring)
  }

  // ───────────────────────── internals ─────────────────────────

  private font() {
    return `600 ${this.labelPx}px ${this.family}`
  }

  private glow(b: Brick, hold: number) {
    const g: Glow = { b, v: 0 }
    this.glows.add(g)
    gsap
      .timeline({ onComplete: () => void this.glows.delete(g), onUpdate: () => void (this.dirty = true) })
      .to(g, { v: 1, duration: 0.9, ease: 'sine.inOut' })
      .to(g, { v: 0, duration: 1.3, ease: 'sine.inOut' }, `+=${hold}`)
  }

  /** now and then one or two bricks glow softly and show their major (the first time, `count` at once) */
  private scheduleIdle(delay = 4 + this.rand() * 4, count = 0) {
    if (this.reduced || this.destroyed) return
    this.idleCall?.kill()
    this.idleCall = gsap.delayedCall(delay, () => {
      const quiet = performance.now() - this.lastPointer > 3000 && !this.matches && !this.pulled && this.visible
      if (quiet) {
        const pool = this.bricks.filter((b) => b.kind === 'brick' && b.x > 0 && b.x + b.w < this.w && !this.inShade(b))
        const n = count || (this.rand() < 0.35 ? 2 : 1)
        for (let i = 0; i < n && pool.length; i++) {
          // spread the first ones out: one from each part of the wall
          const slice = count ? pool.filter((b) => Math.floor(((b.x + b.w / 2) / this.w) * n) === i) : pool
          const from = slice.length ? slice : pool
          const b = from[Math.floor(this.rand() * from.length)]
          pool.splice(pool.indexOf(b), 1)
          this.glow(b, count ? 2.6 : 1.4)
        }
      }
      this.scheduleIdle()
    })
  }

  private inShade(b: Rect) {
    const s = this.geometry?.shade
    return !!s && b.x < s.x + s.w && b.x + b.w > s.x && b.y < s.y + s.h && b.y + b.h > s.y
  }

  private tick = (_time: number, deltaMs: number) => {
    if (!this.ctx || !this.visible || this.destroyed) return
    const dt = Math.min(0.05, deltaMs / 1000)
    let moving = false

    // the light eases after the pointer and fades in or out
    const target = this.pointer.on ? 1 : 0
    const k = 1 - Math.pow(0.001, dt) // frame-rate independent smoothing
    const dx = this.pointer.x - this.light.x
    const dy = this.pointer.y - this.light.y
    if (Math.abs(dx) + Math.abs(dy) > 0.3) {
      this.light.x += dx * Math.min(1, k * 1.5)
      this.light.y += dy * Math.min(1, k * 1.5)
      moving = true
    }
    const da = target - this.light.a
    if (Math.abs(da) > 0.004) {
      this.light.a += da * Math.min(1, k * (target ? 0.9 : 0.45))
      moving = true
    } else this.light.a = target

    if (this.particles.length) {
      for (const p of this.particles) {
        p.life += dt
        p.vy += 420 * dt
        p.vx *= 1 - 2.4 * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
      }
      this.particles = this.particles.filter((p) => p.life < p.max)
      moving = true
    }

    if (moving || this.dirty || this.introT >= 0 || this.ring.t >= 0 || this.glows.size) this.render()
  }

  private buildLayer() {
    if (!this.ctx) return
    const layer = this.layer ?? document.createElement('canvas')
    layer.width = this.canvas.width
    layer.height = this.canvas.height
    const c = layer.getContext('2d')
    if (!c) return
    this.layer = layer
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    c.clearRect(0, 0, this.w, this.h)
    this.prepText(c)
    if (this.socket) this.drawSocket(c, this.socket, 0.0)
    for (const b of this.bricks) this.drawBrick(c, b, 0, 1, 0, 0, 0, this.baseLabel(b))
    // texture and dusk live in their own layer, so the lay-in can reuse them cheaply
    const overlay = this.overlay ?? document.createElement('canvas')
    overlay.width = layer.width
    overlay.height = layer.height
    const o = overlay.getContext('2d')
    if (!o) return
    this.overlay = overlay
    o.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    o.clearRect(0, 0, this.w, this.h)
    this.drawTexture(o)
    this.drawAmbient(o, 1)
    c.setTransform(1, 0, 0, 1, 0, 0)
    c.drawImage(overlay, 0, 0)
  }

  /** a fine speckle over the bricks, so they read as fired clay rather than flat fills */
  private drawTexture(c: CanvasRenderingContext2D) {
    if (!this.silhouette) return
    if (!this.noise) {
      const n = document.createElement('canvas')
      n.width = n.height = 96
      const nc = n.getContext('2d')
      if (!nc) return
      const img = nc.createImageData(96, 96)
      for (let i = 0; i < img.data.length; i += 4) {
        const v = this.rand()
        const light = v > 0.5
        img.data[i] = img.data[i + 1] = img.data[i + 2] = light ? 255 : 0
        img.data[i + 3] = Math.round(Math.pow(this.rand(), 3) * (light ? 22 : 40))
      }
      nc.putImageData(img, 0, 0)
      this.noise = c.createPattern(n, 'repeat')
    }
    if (!this.noise) return
    c.save()
    c.clip(this.silhouette)
    c.fillStyle = this.noise
    c.fillRect(0, 0, this.w, this.h)
    c.restore()
  }

  /** dusk on the wall: the top courses catch the sky, the base sinks into shadow */
  private drawAmbient(c: CanvasRenderingContext2D, k: number) {
    if (!this.silhouette || !this.geometry) return
    const top = Math.min(this.geometry.top, this.geometry.tower?.top ?? Infinity)
    const g = c.createLinearGradient(0, top, 0, this.geometry.bottom)
    g.addColorStop(0, `rgba(${LIGHT},${0.045 * k})`)
    g.addColorStop(0.35, 'rgba(1,19,22,0)')
    g.addColorStop(1, `rgba(1,19,22,${0.32 * k})`)
    c.save()
    c.clip(this.silhouette)
    c.fillStyle = g
    c.fillRect(0, top, this.w, this.geometry.bottom - top)
    c.restore()
  }

  private baseLabel(b: Brick) {
    if (b.kind !== 'brick') return 0
    return this.inShade(b) ? 0.03 : 0.075
  }

  private prepText(c: CanvasRenderingContext2D) {
    c.font = this.font()
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.direction = 'rtl'
  }

  private drawSocket(c: CanvasRenderingContext2D, r: Rect, glow: number) {
    c.fillStyle = SOCKET
    c.fillRect(r.x, r.y, r.w, r.h)
    const g = c.createLinearGradient(0, r.y, 0, r.y + 10)
    g.addColorStop(0, 'rgba(0,0,0,0.55)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    c.fillStyle = g
    c.fillRect(r.x, r.y, r.w, 10)
    if (glow > 0) {
      c.strokeStyle = `rgba(${MINT},${0.5 * glow})`
      c.lineWidth = 1
      c.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1)
    }
  }

  /**
   * One brick: face with a touch of variation, bevel light on top, shadow at the bottom; when lit,
   * a wash and bright edges on the sides facing the light; when glowing, a mint rim.
   */
  private drawBrick(
    c: CanvasRenderingContext2D,
    b: Brick,
    dy: number,
    alpha: number,
    lift: number,
    lit: number,
    glow: number,
    label: number,
  ) {
    const x = b.x
    const y = b.y + dy - lift
    const { w, h } = b
    c.globalAlpha = alpha
    if (lift > 0.6) {
      c.fillStyle = 'rgba(0,10,12,0.55)'
      c.fillRect(x + 1, b.y + dy + h - lift, w - 1, lift)
    }
    c.fillStyle = this.face(b)
    c.fillRect(x, y, w, h)
    // subtle variation: a lighter upper face, darker toward the base
    c.fillStyle = `rgba(255,255,255,${0.012 + b.seed * 0.02})`
    c.fillRect(x, y, w, h * 0.4)
    c.fillStyle = 'rgba(0,0,0,0.12)'
    c.fillRect(x, y + h * 0.72, w, h * 0.28)
    // bevel: light on the top and inline-start edges, shadow on the bottom and inline-end
    c.fillStyle = `rgba(255,255,255,${b.kind === 'merlon' ? 0.16 : 0.1 + b.seed * 0.04})`
    c.fillRect(x, y, w, 1)
    c.fillStyle = 'rgba(255,255,255,0.035)'
    c.fillRect(x + w - 1, y, 1, h)
    c.fillStyle = 'rgba(0,8,10,0.45)'
    c.fillRect(x, y + h - 2, w, 2)
    c.fillStyle = 'rgba(0,0,0,0.22)'
    c.fillRect(x, y, 1, h)

    if (lit > 0.01) {
      const cx = x + w / 2
      const cy = y + h / 2
      const lx = this.light.x - cx
      const ly = this.light.y - cy
      const len = Math.hypot(lx, ly) || 1
      const nx = lx / len
      const ny = ly / len
      // a faint wash from the side facing the light
      const g = c.createLinearGradient(cx + nx * w * 0.5, cy + ny * h * 0.5, cx - nx * w * 0.2, cy - ny * h * 0.2)
      g.addColorStop(0, `rgba(${LIGHT},${0.075 * lit})`)
      g.addColorStop(1, `rgba(${LIGHT},0)`)
      c.fillStyle = g
      c.fillRect(x, y, w, h)
      // the edges facing the light catch it
      const edge = (a: number, ex: number, ey: number, ew: number, eh: number) => {
        c.fillStyle = `rgba(${LIGHT},${Math.min(0.9, a)})`
        c.fillRect(ex, ey, ew, eh)
      }
      if (ny < 0) edge(0.8 * lit * -ny + 0.12 * lit, x, y, w, 1.5)
      if (ny > 0) edge(0.4 * lit * ny, x, y + h - 1.5, w, 1.5)
      if (nx < 0) edge(0.75 * lit * -nx, x, y, 1.5, h)
      if (nx > 0) edge(0.75 * lit * nx, x + w - 1.5, y, 1.5, h)
    }
    if (glow > 0.01) {
      c.fillStyle = `rgba(${MINT},${0.13 * glow})`
      c.fillRect(x, y, w, h)
      c.strokeStyle = `rgba(${MINT},${0.75 * glow})`
      c.lineWidth = 1
      c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1)
    }
    if (label > 0.01 && b.label) {
      c.fillStyle = `rgba(${LIGHT},${Math.min(1, label)})`
      c.fillText(b.label, x + w / 2, y + h / 2 + 1, w - 10)
    }
    c.globalAlpha = 1
  }

  private face(b: Brick) {
    let f = this.faces.get(b)
    if (!f) {
      const base = b.kind === 'merlon' ? MERLONS[b.tone % MERLONS.length] : PALETTE[b.tone % PALETTE.length]
      f = shade(base, 1 + (b.seed - 0.5) * JITTER)
      this.faces.set(b, f)
    }
    return f
  }

  /**
   * A soft mint glow in the sky just behind the crenellated top course (and the tower's), so the
   * merlons and their gaps read as a silhouette against light. Drawn before the mortar, so the
   * wall covers it everywhere except the gaps and the sky above them.
   */
  private drawSky(c: CanvasRenderingContext2D, k: number) {
    const geo = this.geometry
    if (!geo || k <= 0.01) return
    const band = (x0: number, x1: number, top: number) => {
      const h = this.course
      const g = c.createLinearGradient(0, top - h * 2.6, 0, top + h * 1.2)
      g.addColorStop(0, `rgba(${MINT},0)`)
      g.addColorStop(0.62, `rgba(${MINT},${0.085 * k})`)
      g.addColorStop(1, `rgba(${MINT},0)`)
      c.fillStyle = g
      c.fillRect(x0, top - h * 2.6, x1 - x0, h * 3.8)
    }
    const t = geo.tower
    const rtl = getComputedStyle(this.canvas).direction !== 'ltr'
    if (t) {
      band(rtl ? t.x1 : 0, rtl ? this.w : t.x0, geo.top)
      band(t.x0, t.x1, t.top)
    } else band(0, this.w, geo.top)
  }

  /** how far a lit brick's name surfaces; under the copy it stays quiet so the text reads */
  private surface(b: Brick, lit: number) {
    return lit * (this.inShade(b) ? 0.22 : 0.85)
  }

  private litAt(b: Brick) {
    if (this.light.a < 0.01) return 0
    const R = this.course * 5.2
    const ex = Math.max(b.x - this.light.x, 0, this.light.x - (b.x + b.w))
    const ey = Math.max(b.y - this.light.y, 0, this.light.y - (b.y + b.h))
    const d = Math.hypot(ex, ey)
    if (d > R) return 0
    const f = 1 - smoothstep(0, R, d)
    return this.light.a * f * f
  }

  render() {
    const c = this.ctx
    if (!c || !this.w) return
    this.dirty = false
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    c.clearRect(0, 0, this.w, this.h)
    const silhouette = this.silhouette
    const intro = this.introT >= 0
    const ringOn = this.ring.t >= 0
    const glowOf = new Map<Brick, number>()
    for (const g of this.glows) glowOf.set(g.b, Math.max(glowOf.get(g.b) ?? 0, g.v))

    // 0 · the sky's glow behind the crenellations (rises with them during the lay-in)
    this.drawSky(c, intro ? clamp01((this.introT - MERLONS_AT) / 0.45) : 1)

    // 1 · mortar (only where the wall stands so far), then light in it
    if (silhouette) {
      c.save()
      if (intro) {
        // the wall rises: mortar only up to the courses laid so far
        const laid = (Math.max(0, this.introT - 0.08) / this.courseStep) * this.course + this.course
        c.beginPath()
        c.rect(0, (this.geometry?.bottom ?? this.h) - laid, this.w, laid + 2)
        c.clip()
      }
      c.fillStyle = MORTAR
      c.fill(silhouette)
      if (this.socket && intro && this.introT >= this.socketAt) this.drawSocket(c, this.socket, 0)
      c.restore()
    }
    if (silhouette && (this.light.a > 0.01 || ringOn || glowOf.size)) {
      c.save()
      c.clip(silhouette)
      if (this.light.a > 0.01) {
        const r = this.course * 4.5
        const g = c.createRadialGradient(this.light.x, this.light.y, 0, this.light.x, this.light.y, r)
        g.addColorStop(0, `rgba(${MINT},${0.9 * this.light.a})`)
        g.addColorStop(0.45, `rgba(${MINT},${0.35 * this.light.a})`)
        g.addColorStop(1, `rgba(${MINT},0)`)
        c.fillStyle = g
        c.fillRect(this.light.x - r, this.light.y - r, r * 2, r * 2)
      }
      if (ringOn) {
        const { x, y, t } = this.ring
        const r = this.ringRadius()
        const band = this.course * (2.6 - t)
        const g = c.createRadialGradient(x, y, Math.max(0, r - band), x, y, r + band * 0.3)
        const a = 0.95 * Math.pow(1 - t, 1.1)
        g.addColorStop(0, `rgba(${MINT},0)`)
        g.addColorStop(0.72, `rgba(${MINT},${a})`)
        g.addColorStop(1, `rgba(${MINT},0)`)
        c.fillStyle = g
        c.fillRect(0, 0, this.w, this.h)
      }
      for (const [b, v] of glowOf) {
        const r = b.w * 0.75
        const g = c.createRadialGradient(b.x + b.w / 2, b.y + b.h / 2, 0, b.x + b.w / 2, b.y + b.h / 2, r)
        g.addColorStop(0, `rgba(${MINT},${0.55 * v})`)
        g.addColorStop(1, `rgba(${MINT},0)`)
        c.fillStyle = g
        c.fillRect(b.x + b.w / 2 - r, b.y + b.h / 2 - r, r * 2, r * 2)
      }
      c.restore()
    }

    // 2 · bricks: one by one while they are being laid (no names yet, they are near-invisible
    // anyway), otherwise the cached layer
    this.prepText(c)
    const ringR = ringOn ? this.ringRadius() : 0
    const ringBand = this.course * 1.9
    const waveAt = (b: Brick) => {
      if (!ringOn) return 0
      const d = Math.hypot(b.x + b.w / 2 - this.ring.x, b.y + b.h / 2 - this.ring.y)
      return (1 - smoothstep(0, ringBand, Math.abs(d - ringR))) * Math.pow(1 - this.ring.t, 0.8)
    }
    if (intro) {
      const brickDrop = gsap.parseEase('brickDrop')
      const rise = gsap.parseEase('rise')
      this.bricks.forEach((b, i) => {
        const t = clamp01((this.introT - this.delays[i]) / DROP)
        if (t <= 0 || b === this.pulled) return
        if (b.kind === 'merlon') {
          c.save()
          c.beginPath()
          c.rect(b.x - 2, b.y - this.course, b.w + 4, b.h + this.course)
          c.clip()
          this.drawBrick(c, b, (1 - rise(t)) * b.h, 1, 0, 0, 0, 0)
          c.restore()
          return
        }
        const wave = waveAt(b)
        this.drawBrick(c, b, -22 * (1 - brickDrop(t)), clamp01(t * 3.5), wave * 3, 0, wave * 0.55, wave > 0.02 ? this.baseLabel(b) + wave * 0.9 : 0)
      })
      if (this.overlay) {
        c.save()
        c.globalAlpha = clamp01(this.introT / this.introDur)
        c.drawImage(this.overlay, 0, 0, this.w, this.h)
        c.restore()
      }
    } else if (this.layer) {
      c.drawImage(this.layer, 0, 0, this.w, this.h)
    }

    // 3 · search: dim the wall, light the matches
    if (silhouette && this.searchT > 0.01) {
      c.save()
      c.clip(silhouette)
      c.fillStyle = `rgba(1,22,26,${0.66 * this.searchT})`
      c.fillRect(0, 0, this.w, this.h)
      c.restore()
      if (this.matches?.size) {
        for (const b of this.bricks) {
          if (b.kind !== 'brick' || !this.matches.has(b.code) || b === this.pulled) continue
          const lit = this.litAt(b)
          const k = this.inShade(b) ? 0.4 : 1
          this.drawBrick(c, b, 0, 1, (lit + this.searchT) * 1.5 * k, lit, this.searchT * k, (0.25 + this.searchT * 0.75) * k)
        }
      }
    }

    // 4 · lit and glowing bricks on top
    if (!intro) {
      for (const b of this.bricks) {
        if (b === this.pulled) continue
        if (this.searchT > 0.01 && this.matches?.has(b.code)) continue
        const lit = this.litAt(b)
        const wave = waveAt(b)
        const glow = Math.max(glowOf.get(b) ?? 0, wave * 0.55)
        if (lit < 0.015 && glow < 0.01) continue
        const quiet = this.searchT > 0.01 ? 1 - this.searchT * 0.6 : 1
        const label = this.baseLabel(b) + this.surface(b, lit) + (glowOf.get(b) ?? 0) + (b.kind === 'brick' ? wave * (this.inShade(b) ? 0.3 : 0.9) : 0)
        this.drawBrick(c, b, 0, quiet, lit * 2 + glow + wave * 2, lit, glow, label)
      }
    }

    // 5 · the pulled brick's socket
    if (this.pulled) this.drawSocket(c, this.pulled, 1)

    // 6 · a broad raking light across the wall
    if (silhouette && this.light.a > 0.01) {
      c.save()
      c.clip(silhouette)
      c.globalCompositeOperation = 'lighter'
      const r = Math.max(this.w, this.h) * 0.42
      const g = c.createRadialGradient(this.light.x, this.light.y, 0, this.light.x, this.light.y, r)
      g.addColorStop(0, `rgba(${LIGHT},${0.045 * this.light.a})`)
      g.addColorStop(1, `rgba(${LIGHT},0)`)
      c.fillStyle = g
      c.fillRect(0, 0, this.w, this.h)
      c.restore()
    }

    // 7 · dust
    for (const p of this.particles) {
      c.globalAlpha = 1 - p.life / p.max
      c.fillStyle = p.c
      c.fillRect(p.x, p.y, p.s, p.s)
    }
    c.globalAlpha = 1
  }

  private ringRadius() {
    const t = this.ring.t
    return (1 - Math.pow(1 - t, 2.2)) * Math.hypot(this.w, this.h) * 0.85
  }
}
