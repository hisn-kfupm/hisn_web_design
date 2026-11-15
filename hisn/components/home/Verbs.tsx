import { BattlementBand } from '@/components/brand/BattlementBand'
import { fmtNum } from '@/lib/i18n/number'
import { t, type StringKey } from '@/lib/i18n/t'
import { VerbsStage } from './VerbsStage'

/**
 * «ماذا نفعل», the three verbs of the approved description (redesign §5.2): تعرّف · تؤهّل · تصل,
 * giant words on the deep band. The motion lives in VerbsStage; this resolves the strings.
 */
export function Verbs() {
  const verbs = [1, 2, 3].map((i) => ({
    n: fmtNum(i, { minimumIntegerDigits: 2 }),
    word: t(`home.verbs.${i}.word` as StringKey),
    line: t(`home.verbs.${i}.line` as StringKey),
  }))
  return (
    <VerbsStage title={t('home.verbs.title')} verbs={verbs}>
      <BattlementBand tone="page" edge="bottom" />
    </VerbsStage>
  )
}
