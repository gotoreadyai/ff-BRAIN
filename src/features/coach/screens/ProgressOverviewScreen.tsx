// path: src/features/coach/screens/ProgressOverviewScreen.tsx

import { X } from 'lucide-react'
import type { Pack, Phase } from '../../../engine/model'
import type { UserProgression } from '../../../engine/db'
import { getPhaseName, getTotalPhaseDays } from '../../../engine/manifest'
import { Card } from '../../../ui/components/Card'
import { StatBox, ProgressBar } from '../../../ui/components/Section'
import { PrimaryButton } from '../../../ui/components/Button'
import { AIAlert } from '../../../ui/components/AIAlert'
import { ProgramHeader, PhaseTimeline, TelemetryGrid } from '../../../ui/components/ProgressComponents'

type ProgressOverviewScreenProps = {
  pack: Pack
  progression: UserProgression
  currentPhase: Phase
  lang: string
  onClose: () => void
}

export default function ProgressOverviewScreen({
  pack,
  progression,
  currentPhase,
  lang,
  onClose
}: ProgressOverviewScreenProps) {
  const program = pack.manifest.program
  const phases = program.phases
  
  const totalWorkouts = progression.completedWorkouts.length
  const currentPhaseIdx = phases.findIndex(p => p.id === currentPhase.id)
  const totalPhaseDays = getTotalPhaseDays(currentPhase)
  const phaseProgress = Math.round((progression.currentDay / totalPhaseDays) * 100)
  
  const avgRPE = totalWorkouts > 0
    ? (progression.completedWorkouts.reduce((sum, w) => sum + w.rpe, 0) / totalWorkouts).toFixed(1)
    : '—'
  
  const avgConfidence = totalWorkouts > 0
    ? (progression.completedWorkouts.reduce((sum, w) => sum + w.confidence, 0) / totalWorkouts).toFixed(1)
    : '—'
  
  const totalPainReports = progression.completedWorkouts.reduce(
    (sum, w) => sum + w.painReported.length,
    0
  )

  const phaseData = phases.map((phase, idx) => ({
    id: phase.id,
    name: getPhaseName(phase, lang),
    durationWeeks: phase.durationWeeks,
    daysPerWeek: phase.workoutSchedule.daysPerWeek,
    isPast: idx < currentPhaseIdx,
    isCurrent: idx === currentPhaseIdx,
    progress: idx === currentPhaseIdx ? phaseProgress : undefined
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Twój postęp</h1>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <ProgramHeader
        title={program.title[lang] || program.title['pl']}
        description={program.description[lang] || program.description['pl']}
        goal={program.goal}
        phasesCount={phases.length}
      />

      <Card>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Aktualny postęp</h3>
        
        <ProgressBar
          current={progression.currentDay}
          total={totalPhaseDays}
          label={`Faza ${currentPhaseIdx + 1}/${phases.length}: ${getPhaseName(currentPhase, lang)}`}
        />

        <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t">
          <StatBox value={totalWorkouts} label="Treningi" />
          <StatBox value={avgRPE} label="Śr. RPE" />
          <StatBox value={avgConfidence} label="Śr. pewność" />
          <StatBox value={totalPainReports} label="Zgłoszenia bólu" />
        </div>
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Oś czasu programu</h3>
        <PhaseTimeline phases={phaseData} />
      </Card>

      {progression.adaptations.intensityModifier !== 1.0 && (
        <AIAlert title="Aktywne adaptacje AI">
          <p>
            Intensywność zmodyfikowana: {Math.round(progression.adaptations.intensityModifier * 100)}%
          </p>
          {Object.keys(progression.adaptations.exerciseReplacements).length > 0 && (
            <p>
              Zamieniono {Object.keys(progression.adaptations.exerciseReplacements).length} ćwiczeń
            </p>
          )}
        </AIAlert>
      )}

      <Card>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Telemetria</h3>
        <TelemetryGrid
          avgSleepHours={progression.telemetry.avgSleepHours}
          avgSteps={progression.telemetry.avgSteps}
          avgHeartRate={progression.telemetry.avgHeartRate}
          avgCaloriesBurned={progression.telemetry.avgCaloriesBurned}
        />
      </Card>

      <PrimaryButton onClick={onClose}>
        Zamknij
      </PrimaryButton>
    </div>
  )
}