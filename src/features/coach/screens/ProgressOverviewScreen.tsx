// path: src/features/coach/screens/ProgressOverviewScreen.tsx

import type { Pack, Phase } from '../../../engine/model'
import type { UserProgression } from '../../../engine/db'
import { getPhaseName, getTotalPhaseDays } from '../../../engine/manifest'

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
  
  // Calculate stats
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

  const programGoalText = {
    strength: 'Budowa siły',
    muscle_gain: 'Budowa masy',
    fat_loss: 'Redukcja tkanki tłuszczowej',
    endurance: 'Wytrzymałość',
    general_health: 'Ogólne zdrowie'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Twój postęp</h1>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Pack Info */}
      <div className="bg-gray-900 rounded-lg p-5 text-white">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold mb-1">
              {program.title[lang] || program.title['pl']}
            </h2>
            <p className="text-sm opacity-70">
              {program.description[lang] || program.description['pl']}
            </p>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="opacity-70">Cel:</span>{' '}
            <span className="font-semibold">{programGoalText[program.goal]}</span>
          </div>
          <div>
            <span className="opacity-70">Fazy:</span>{' '}
            <span className="font-semibold">{phases.length}</span>
          </div>
        </div>
      </div>

      {/* Current Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Aktualny postęp</h3>
        
        <div className="space-y-4">
          {/* Current Phase */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Faza {currentPhaseIdx + 1}/{phases.length}: {getPhaseName(currentPhase, lang)}
              </span>
              <span className="text-sm font-semibold text-gray-900">{phaseProgress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 transition-all"
                style={{ width: `${phaseProgress}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Dzień {progression.currentDay} / {totalPhaseDays}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{totalWorkouts}</div>
              <div className="text-xs text-gray-500 mt-1">Treningi</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{avgRPE}</div>
              <div className="text-xs text-gray-500 mt-1">Śr. RPE</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{avgConfidence}</div>
              <div className="text-xs text-gray-500 mt-1">Śr. pewność</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{totalPainReports}</div>
              <div className="text-xs text-gray-500 mt-1">Zgłoszenia bólu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline - All Phases */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Oś czasu programu</h3>
        <div className="space-y-3">
          {phases.map((phase, idx) => {
            const isPast = idx < currentPhaseIdx
            const isCurrent = idx === currentPhaseIdx
            const isFuture = idx > currentPhaseIdx
            
            return (
              <div key={phase.id} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                    isPast
                      ? 'bg-green-600 text-white'
                      : isCurrent
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isPast ? '✓' : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium ${isCurrent ? 'text-gray-900' : 'text-gray-600'}`}>
                    {getPhaseName(phase, lang)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {phase.durationWeeks} tyg. • {phase.workoutSchedule.daysPerWeek}x/tydzień
                  </div>
                  {isCurrent && (
                    <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-900"
                        style={{ width: `${phaseProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Adaptations Info */}
      {progression.adaptations.intensityModifier !== 1.0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-amber-900 mb-2">
            Aktywne adaptacje AI
          </h3>
          <p className="text-sm text-amber-800">
            Intensywność zmodyfikowana: {Math.round(progression.adaptations.intensityModifier * 100)}%
          </p>
          {Object.keys(progression.adaptations.exerciseReplacements).length > 0 && (
            <p className="text-sm text-amber-800 mt-1">
              Zamieniono {Object.keys(progression.adaptations.exerciseReplacements).length} ćwiczeń
            </p>
          )}
        </div>
      )}

      {/* Telemetry */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Telemetria</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {progression.telemetry.avgSleepHours.toFixed(1)}h
            </div>
            <div className="text-xs text-gray-500">Śr. sen</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {progression.telemetry.avgSteps.toLocaleString('pl-PL')}
            </div>
            <div className="text-xs text-gray-500">Śr. kroki</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {progression.telemetry.avgHeartRate}
            </div>
            <div className="text-xs text-gray-500">Śr. HR (bpm)</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">
              {progression.telemetry.avgCaloriesBurned}
            </div>
            <div className="text-xs text-gray-500">Śr. kcal</div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-full px-8 py-4 rounded-lg text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 transition"
      >
        Zamknij
      </button>
    </div>
  )
}