import { Play } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
import { deptIcon } from '@/lib/data/dept-icons'
import { cn } from '@/lib/cn'

const W = 320
const H = 200
const COURSE = 25
const BRICK = 64
const TONES = ['#02272D', '#033139', '#012C33', '#022026', '#033A42', '#023941']

/** a small deterministic hash, so a cover looks the same on every render (no Math.random) */
function hash(...n: number[]): number {
  let h = 2166136261
  for (const v of n) {
    h ^= v
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

/**
 * A generated video cover (redesign §5.7): no thumbnails are cleared, so each cover is a patch of
 * the wall in running bond, seeded by the event id, with the department's icon set in a deep
 * opening and a mint play square. Decorative (the card's title says what it is).
 */
export function RecordingCover({ id, departmentCode, className }: { id: number; departmentCode: string | null; className?: string }) {
  const bricks: { x: number; y: number; w: number; fill: string; lit: boolean }[] = []
  for (let row = 0; row * COURSE < H; row++) {
    const offset = row % 2 ? -BRICK / 2 : 0
    for (let col = 0; offset + col * BRICK < W; col++) {
      const r = hash(id, row, col)
      bricks.push({ x: offset + col * BRICK, y: row * COURSE, w: BRICK, fill: TONES[Math.floor(r * TONES.length)], lit: r > 0.93 })
    }
  }
  return (
    <div aria-hidden="true" className={cn('rec-cover relative aspect-[16/10] overflow-hidden bg-deep-900', className)}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="rec-wall absolute inset-0 size-full">
        {bricks.map((b, i) => (
          <g key={i}>
            <rect x={b.x + 1} y={b.y + 1} width={b.w - 2} height={COURSE - 2} fill={b.lit ? '#03606D' : b.fill} />
            <rect x={b.x + 1} y={b.y + 1} width={b.w - 2} height={1} fill="#fff" fillOpacity={b.lit ? 0.22 : 0.06} />
          </g>
        ))}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_30%_25%,rgb(95_212_170/0.16),transparent_65%)]" />
      <span className="rec-hole absolute inset-0 m-auto grid aspect-square h-[62%] place-items-center bg-deep-900 shadow-[inset_0_6px_14px_rgb(0_0_0/0.55)]">
        <Icon icon={deptIcon(departmentCode)} size={64} className="size-[58%] text-mint" />
      </span>
      <span className="rec-play absolute start-0 bottom-0 grid size-14 place-items-center bg-mint text-deep">
        <Play focusable="false" strokeWidth={2} className="size-6 fill-current" />
      </span>
    </div>
  )
}
