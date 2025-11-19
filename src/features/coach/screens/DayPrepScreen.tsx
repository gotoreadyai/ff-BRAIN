// path: src/features/coach/screens/DayPrepScreen.tsx

import { motion } from 'framer-motion'
import type { Workout, Exercise } from '../../../engine/model'
import type { Adaptations } from '../../../engine/db'
import { getExerciseName } from '../../../engine/manifest'

type DayPrepScreenProps = {
  workout: Workout
  exercises: Exercise[]
  adaptations: Adaptations
  dayNumber: number
  totalDays: number
  lang: string
  onStart: () => void
}

export default function DayPrepScreen({
  workout,
  exercises,
  adaptations,
  dayNumber,
  totalDays,
  lang,
  onStart
}: DayPrepScreenProps) {
  const workoutName = workout.name[lang] || workout.name['pl'] || 'Trening'

  // Check for adaptations/warnings
  const hasReplacements = Object.keys(adaptations.exerciseReplacements).length > 0
  const isDeload = adaptations.intensityModifier < 0.95

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gray-900 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm opacity-70 mb-1">
              Dzień {dayNumber} / {totalDays}
            </div>
            <h1 className="text-2xl font-bold">{workoutName}</h1>
          </div>
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span>{workout.durationMinutes} min</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            <span>{workout.exerciseBlocks.length} ćwiczeń</span>
          </div>
        </div>
      </div>

      {/* AI Adaptations Warning */}
      {(hasReplacements || isDeload) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-1">
                AI zmodyfikował plan
              </h3>
              {isDeload && (
                <p className="text-sm text-amber-800 mb-1">
                  • Intensywność -{Math.round((1 - adaptations.intensityModifier) * 100)}%
                </p>
              )}
              {hasReplacements && (
                <p className="text-sm text-amber-800">
                  • {Object.keys(adaptations.exerciseReplacements).length} ćwiczeń zamieniono
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Exercise List */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Plan treningu</h3>
        <div className="space-y-3">
          {workout.exerciseBlocks.map((block, blockIdx) => (
            <div key={blockIdx} className="border-l-2 border-gray-900 pl-4 py-2">
              <div className="text-xs font-medium text-gray-500 mb-2">
                {block.sets} serie × {block.reps} powtórzeń
              </div>
              {block.exercises.map((exerciseId, exIdx) => {
                const exercise = exercises.find(e => e.id === exerciseId)
                if (!exercise) return null

                const isReplaced = adaptations.exerciseReplacements[exerciseId]
                const displayExercise = isReplaced
                  ? exercises.find(e => e.id === isReplaced)
                  : exercise

                return (
                  <div key={exIdx} className="flex items-center gap-3 mb-2">
                    <div className="w-7 h-7 rounded bg-gray-900 text-white flex items-center justify-center text-xs font-semibold">
                      {blockIdx + 1}.{exIdx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {getExerciseName(displayExercise, lang)}
                      </div>
                      {isReplaced && (
                        <div className="text-xs text-amber-600">
                          Zamieniono: {getExerciseName(exercise, lang)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        className="w-full px-8 py-4 rounded-lg text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 transition"
      >
        Rozpocznij trening →
      </button>
    </div>
  )
}