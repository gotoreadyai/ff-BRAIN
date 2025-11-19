// path: src/ui/components/WorkoutComponents.tsx

import { Clock } from 'lucide-react'
import type { CompletedSet } from '../../engine/db'
import { DarkCard } from './Card'
import { AlertCard } from './Card'
import { ListItem } from './List'

type TimerDisplayProps = {
  seconds: number
}

export function TimerDisplay({ seconds }: TimerDisplayProps) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60

  return (
    <DarkCard>
      <div className="text-center">
        <div className="text-sm opacity-70 mb-2">Czas treningu</div>
        <div className="text-5xl font-bold tabular-nums">
          {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
      </div>
    </DarkCard>
  )
}

type SetProgressProps = {
  completedSets: number
  totalSets: number
  currentSet: number
}

export function SetProgress({ completedSets, totalSets, currentSet }: SetProgressProps) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: totalSets }).map((_, idx) => (
        <div
          key={idx}
          className={`flex-1 h-2 rounded-full transition ${
            idx < completedSets
              ? 'bg-green-600'
              : idx === currentSet
              ? 'bg-gray-900'
              : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

type FormCuesProps = {
  cues: string[]
}

export function FormCues({ cues }: FormCuesProps) {
  if (cues.length === 0) return null

  return (
    <AlertCard variant="blue">
      <div className="text-xs font-semibold text-blue-900 mb-2 uppercase">
        Technika
      </div>
      <ul className="space-y-1">
        {cues.slice(0, 3).map((cue, i) => (
          <ListItem key={i} icon={<span className="text-blue-500 mt-0.5">•</span>}>
            <span className="text-blue-800">{cue}</span>
          </ListItem>
        ))}
      </ul>
    </AlertCard>
  )
}

type CompletedSetsDisplayProps = {
  sets: CompletedSet[]
  totalSets: number
}

export function CompletedSetsDisplay({ sets, totalSets }: CompletedSetsDisplayProps) {
  if (sets.length === 0) return null

  return (
    <AlertCard variant="green">
      <div className="text-xs font-semibold text-green-900 mb-2">
        Ukończone serie: {sets.length}/{totalSets}
      </div>
      <div className="space-y-1">
        {sets.map((set, idx) => (
          <div key={idx} className="text-sm text-green-800">
            Seria {idx + 1}: {set.reps} reps {set.weight ? `× ${set.weight}kg` : ''}
          </div>
        ))}
      </div>
    </AlertCard>
  )
}

type ExerciseQueueProps = {
  exercises: Array<{ name: string }>
}

export function ExerciseQueue({ exercises }: ExerciseQueueProps) {
  if (exercises.length === 0) return null

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="text-xs font-semibold text-gray-500 mb-3 uppercase">
        Kolejne ćwiczenia
      </div>
      <div className="space-y-2">
        {exercises.map((ex, idx) => (
          <div key={idx} className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-xs font-semibold">
              {idx + 2}
            </div>
            <span>{ex.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}