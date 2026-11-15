/*
  STAND-IN DATA — delete this file once A-2 (supabaseProdServer) and A-3/A-6 (events table and seed)
  are on main, and switch lib/events/queries.ts to the real queries written in its comments.

  Rows look like what the events table returns (snake_case, UTC ISO times). Dates are relative to
  "now" so the homepage always has upcoming events and recordings while the stand-in is in use.
  Every title carries «مؤقت». A meeting_url column is included on purpose: the real table has one,
  and toPublicEvent must drop it.
*/

export type EventRow = {
  id: number
  title: string
  description: string
  department_code: string | null
  starts_at: string
  ends_at: string
  format: 'in_person' | 'online'
  location: string | null
  presenter: string | null
  capacity: number | null
  registration_closes_at: string
  status: 'draft' | 'published' | 'cancelled'
  image_url: string | null
  recording_url: string | null
  meeting_url: string | null
}

/** same names as SEED.events.* in tests/fixtures/seed.ts (A-6) */
export const STAND_IN_IDS = { draft: 9007, cancelled: 9008, pastWithRecording: 9101, pastNoRecording: 9105 } as const

const DAY = 86_400_000
const pad = (n: number) => String(n).padStart(2, '0')

/** UTC ISO for a Riyadh wall-clock time (UTC+3, no DST) `days` days from now */
function riyadhAt(now: number, days: number, hour: number, minute = 0): string {
  const day = new Date(now + 3 * 3_600_000 + days * DAY).toISOString().slice(0, 10)
  return new Date(`${day}T${pad(hour)}:${pad(minute)}:00+03:00`).toISOString()
}

type Sample = Omit<EventRow, 'starts_at' | 'ends_at' | 'registration_closes_at'> & {
  day: number
  from: [number, number]
  to: [number, number]
}

const base = { description: 'وصف تجريبي للفعالية. «مؤقت»', presenter: null, image_url: null, meeting_url: null }

const SAMPLES: Sample[] = [
  { ...base, id: 9001, title: 'مدخل إلى هندسة الأنظمة في القطاع الدفاعي «مؤقت»', department_code: 'DEPT_3', day: 3, from: [18, 0], to: [20, 0], format: 'in_person', location: 'مبنى 58 · قاعة 102', capacity: 30, status: 'published', recording_url: null },
  { ...base, id: 9002, title: 'الأمن السيبراني بعيون غير المبرمجين «مؤقت»', department_code: 'DEPT_4', day: 7, from: [19, 0], to: [21, 0], format: 'in_person', location: 'مبنى 22 · المسرح', capacity: 40, status: 'published', recording_url: null },
  { ...base, id: 9003, title: 'البيانات والذكاء الاصطناعي في الصناعة «مؤقت»', department_code: 'DEPT_6', day: 9, from: [21, 0], to: [22, 30], format: 'online', location: null, capacity: null, status: 'published', recording_url: null },
  { ...base, id: 9004, title: 'لقاء مفتوح: أين يعمل خريجو الإدارة في القطاع؟ «مؤقت»', department_code: 'DEPT_2', day: 11, from: [18, 0], to: [19, 30], format: 'in_person', location: 'كلية الإدارة الصناعية', capacity: 25, status: 'published', recording_url: null },
  { ...base, id: 9005, title: 'الصناعات الدفاعية أوسع مما تظن «مؤقت»', department_code: 'DEPT_1', day: 14, from: [18, 0], to: [20, 0], format: 'in_person', location: 'قاعة المحاضرات الرئيسية', capacity: 60, status: 'published', recording_url: null },
  { ...base, id: 9006, title: 'ورشة: سيرة ذاتية لقطاع تقني «مؤقت»', department_code: 'DEPT_5', day: 16, from: [18, 0], to: [20, 0], format: 'in_person', location: 'مبنى 58 · قاعة 102', capacity: 30, status: 'published', recording_url: null },
  { ...base, id: STAND_IN_IDS.draft, title: 'مسودة لم تُنشر «مؤقت»', department_code: 'DEPT_1', day: 2, from: [18, 0], to: [20, 0], format: 'in_person', location: 'مبنى 58', capacity: 30, status: 'draft', recording_url: null },
  { ...base, id: STAND_IN_IDS.cancelled, title: 'ورشة: التصميم الصناعي للمنتجات التقنية «مؤقت»', department_code: 'DEPT_5', day: 5, from: [18, 0], to: [20, 30], format: 'in_person', location: 'مبنى 19 · المعمل', capacity: 20, status: 'cancelled', recording_url: null },
  { ...base, id: STAND_IN_IDS.pastWithRecording, title: 'كيف تقرأ وصفًا وظيفيًا في القطاع الدفاعي «مؤقت»', department_code: 'DEPT_1', day: -6, from: [18, 0], to: [20, 0], format: 'online', location: null, capacity: null, status: 'published', recording_url: 'https://youtu.be/standin0001' },
  { ...base, id: 9102, title: 'ورشة: أساسيات سلاسل الإمداد «مؤقت»', department_code: 'DEPT_5', day: -12, from: [19, 0], to: [21, 0], format: 'in_person', location: 'مبنى 24 · قاعة 108', capacity: 30, status: 'published', recording_url: 'https://youtu.be/standin0002' },
  { ...base, id: 9103, title: 'من الفكرة إلى النموذج الأولي «مؤقت»', department_code: 'DEPT_3', day: -19, from: [18, 0], to: [20, 0], format: 'in_person', location: 'مبنى 58 · قاعة 102', capacity: 30, status: 'published', recording_url: 'https://youtu.be/standin0003' },
  { ...base, id: 9104, title: 'أدوار غير تقنية في شركات الدفاع «مؤقت»', department_code: 'DEPT_2', day: -26, from: [18, 0], to: [19, 30], format: 'online', location: null, capacity: null, status: 'published', recording_url: 'https://youtu.be/standin0004' },
  { ...base, id: STAND_IN_IDS.pastNoRecording, title: 'جلسة تعارف مع لجنة حصن «مؤقت»', department_code: 'DEPT_4', day: -4, from: [18, 0], to: [19, 0], format: 'in_person', location: 'مبنى 22', capacity: 50, status: 'published', recording_url: null },
]

/** the stand-in events table at the given moment */
export function standInRows(now: number = Date.now()): EventRow[] {
  return SAMPLES.map(({ day, from, to, ...row }) => {
    const startsAt = riyadhAt(now, day, ...from)
    return { ...row, starts_at: startsAt, ends_at: riyadhAt(now, day, ...to), registration_closes_at: startsAt }
  })
}
