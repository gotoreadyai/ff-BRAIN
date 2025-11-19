// path: src/ui/components/ProgressComponents.tsx

import type { Phase } from '../../engine/model'
import { DarkCard } from './Card'
import { StatBox, ProgressBar } from './Section'
import { Check } from 'lucide-react'

type ProgramHeaderProps = {
  title: string
  description: string
  goal: string
  phasesCount: number
}

export function ProgramHeader({ title, description, goal, phasesCount }: ProgramHeaderProps) {
  const goalText = {
    strength: 'Budowa siły',
    muscle_gain: 'Budowa masy',
    fat_loss: 'Redukcja tkanki tłuszczowej',
    endurance: 'Wytrzymałość',
    general_health: 'Ogólne zdrowie'
  }

  return (
    <DarkCard>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-lg font-bold mb-1">{title}</h2>
          <p className="text-sm opacity-70">{description}</p>
        </div>
      </div>
      <div className="flex gap-4 text-sm">
        <div>
          <span className="opacity-70">Cel:</span>{' '}
          <span className="font-semibold">{goalText[goal as keyof typeof goalText]}</span>
        </div>
        <div>
          <span className="opacity-70">Fazy:</span>{' '}
          <span className="font-semibold">{phasesCount}</span>
        </div>
      </div>
    </DarkCard>
  )
}

type PhaseTimelineProps = {
  phases: Array<{
    id: string
    name: string
    durationWeeks: number
    daysPerWeek: number
    isPast: boolean
    isCurrent: boolean
    progress?: number
  }>
}

export function PhaseTimeline({ phases }: PhaseTimelineProps) {
  return (
    <div className="space-y-3">
      {phases.map((phase, idx) => (
        <div key={phase.id} className="flex items-start gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 ${
              phase.isPast
                ? 'bg-green-600 text-white'
                : phase.isCurrent
                ? 'bg-gray-900 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {phase.isPast ? <Check className="w-5 h-5" /> : idx + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-medium ${phase.isCurrent ? 'text-gray-900' : 'text-gray-600'}`}>
              {phase.name}
            </div>
            <div className="text-xs text-gray-500">
              {phase.durationWeeks} tyg. • {phase.daysPerWeek}x/tydzień
            </div>
            {phase.isCurrent && phase.progress !== undefined && (
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-900" style={{ width: `${phase.progress}%` }} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

type TelemetryGridProps = {
  avgSleepHours: number
  avgSteps: number
  avgHeartRate: number
  avgCaloriesBurned: number
}

export function TelemetryGrid({ 
  avgSleepHours, 
  avgSteps, 
  avgHeartRate, 
  avgCaloriesBurned 
}: TelemetryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatBox value={`${avgSleepHours.toFixed(1)}h`} label="Śr. sen" />
      <StatBox value={avgSteps.toLocaleString('pl-PL')} label="Śr. kroki" />
      <StatBox value={avgHeartRate} label="Śr. HR (bpm)" />
      <StatBox value={avgCaloriesBurned} label="Śr. kcal" />
    </div>
  )
}