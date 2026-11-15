import { cacheLife } from 'next/cache'
import { Hero } from '@/components/hero/Hero'
import { Departments } from '@/components/home/Departments'
import { EventsTimetable } from '@/components/home/EventsTimetable'
import { MajorsBand } from '@/components/home/MajorsBand'
import { RecordingsStrip } from '@/components/home/RecordingsStrip'
import { TalentBand } from '@/components/home/TalentBand'
import { Verbs } from '@/components/home/Verbs'
import { latestRecordings, upcomingEvents } from '@/lib/events/queries'
import { seatsTaken } from '@/lib/events/seats'

/*
  Homepage «الجدار الحي» (redesign §5). Bands, top to bottom: the living wall (dark), the three
  verbs (deep, pinned), the band of majors (light), the events timetable (light), the departments
  index (box), the talent invitation (deep), the recordings strip (light), then the footer curtain.

  Cached for an hour with 'use cache' + cacheLife('hours') (Cache Components rejects
  `export const revalidate`). The seat meters are therefore up to an hour old; the event page shows
  live seats. Admin saves can still call revalidatePath('/').
*/
export default async function Home() {
  'use cache'
  cacheLife('hours')

  const [upcoming, recordings] = await Promise.all([upcomingEvents({ limit: 4 }), latestRecordings({ limit: 6 })])
  const taken = await seatsTaken(upcoming.map((e) => e.id))

  return (
    <>
      <Hero next={upcoming[0] ?? null} />
      <Verbs />
      <MajorsBand />
      <EventsTimetable number={1} events={upcoming} taken={taken} />
      <Departments number={2} />
      <TalentBand />
      <RecordingsStrip number={3} recordings={recordings} />
    </>
  )
}
