// path: src/ui/components/WorkoutInfo.tsx

import { Clock, ClipboardList } from 'lucide-react'
import { DarkCard } from './Card'
import { Badge } from './List'

type WorkoutHeaderProps = {
  name: string
  dayNumber: number
  totalDays: number
  durationMinutes: number
  exerciseCount: number
}

export function WorkoutHeader({ 
  name, 
  dayNumber, 
  totalDays, 
  durationMinutes, 
  exerciseCount 
}: WorkoutHeaderProps) {
  return (
    <DarkCard>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm opacity-70 mb-1">
            Dzień {dayNumber} / {totalDays}
          </div>
          <h1 className="text-2xl font-bold">{name}</h1>
        </div>
      </div>

      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{durationMinutes} min</span>
        </div>
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4" />
          <span>{exerciseCount} ćwiczeń</span>
        </div>
      </div>
    </DarkCard>
  )
}

type ExerciseBlockProps = {
  blockIndex: number
  sets: number
  reps: number | string
  exercises: Array<{
    name: string
    isReplaced?: boolean
    originalName?: string
  }>
}

export function ExerciseBlock({ blockIndex, sets, reps, exercises }: ExerciseBlockProps) {
  return (
    <div className="border-l-2 border-gray-900 pl-4 py-2">
      <div className="text-xs font-medium text-gray-500 mb-2">
        {sets} serie × {reps} powtórzeń
      </div>
      {exercises.map((exercise, idx) => (
        <div key={idx} className="flex items-center gap-3 mb-2">
          <div className="w-7 h-7 rounded bg-gray-900 text-white flex items-center justify-center text-xs font-semibold">
            {blockIndex}.{idx + 1}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-900 text-sm">
              {exercise.name}
            </div>
            {exercise.isReplaced && (
              <div className="text-xs text-amber-600">
                Zamieniono: {exercise.originalName}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}