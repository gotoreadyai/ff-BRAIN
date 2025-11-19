// path: src/features/coach/screens/RecoveryScreen.tsx

import type { TelemetrySnapshot } from '../../../engine/db'
import { SectionHeader, StatBox } from '../../../ui/components/Section'
import { Card } from '../../../ui/components/Card'
import { ListItem } from '../../../ui/components/List'
import { AIAlert } from '../../../ui/components/AIAlert'
import { PrimaryButton } from '../../../ui/components/Button'

type RecoveryScreenProps = {
  telemetry: TelemetrySnapshot | null
  onNext: () => void
}

export default function RecoveryScreen({ telemetry, onNext }: RecoveryScreenProps) {
  const sleepQuality = telemetry
    ? telemetry.avgSleepHours >= 7 ? 'good' : telemetry.avgSleepHours >= 6 ? 'ok' : 'poor'
    : 'unknown'

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Regeneracja"
        subtitle="Odpoczynek jest równie ważny jak trening"
      />

      <div className="grid grid-cols-2 gap-4">
        <StatBox 
          value={telemetry?.avgSleepHours.toFixed(1) + 'h' || '—'} 
          label="Średni sen"
        />
        <StatBox 
          value={telemetry?.avgSteps.toLocaleString('pl-PL') || '—'} 
          label="Kroki dziennie"
        />
        <StatBox 
          value={telemetry?.avgHeartRate || '—'} 
          label="Śr. tętno (bpm)"
        />
        <StatBox 
          value={telemetry?.avgCaloriesBurned || '—'} 
          label="Spalone kcal"
        />
      </div>

      <Card className="bg-gray-50 border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Wskazówki regeneracyjne
        </h3>
        <ul className="space-y-2">
          <ListItem>Pij minimum 2-3L wody dziennie</ListItem>
          <ListItem>Zadbaj o 7-9h snu dla optymalnej regeneracji</ListItem>
          <ListItem>Rozciąganie i foam rolling po treningu</ListItem>
          <ListItem>Posiłek z białkiem w ciągu 2h po treningu</ListItem>
        </ul>
      </Card>

      {sleepQuality === 'poor' && (
        <AIAlert title="AI Coach">
          <p>
            Twój sen jest poniżej normy. Następny trening będzie lżejszy - priorytetem
            jest regeneracja. Postaraj się dziś wcześniej położyć spać.
          </p>
        </AIAlert>
      )}

      <PrimaryButton onClick={onNext}>
        Kontynuuj →
      </PrimaryButton>
    </div>
  )
}