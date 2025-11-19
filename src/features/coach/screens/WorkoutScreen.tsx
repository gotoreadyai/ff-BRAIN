// path: src/features/coach/screens/WorkoutScreen.tsx

import { useState, useEffect } from 'react'
import type { Workout, Exercise } from '../../../engine/model'
import type { CompletedSet } from '../../../engine/db'
import { getExerciseName, getExerciseFormCues } from '../../../engine/manifest'

type WorkoutScreenProps = {
  workout: Workout
  exercises: Exercise[]
  lang: string
  onComplete: (completedExercises: CompletedExerciseData[]) => void
}

export type CompletedExerciseData = {
  exerciseId: string
  sets: CompletedSet[]
  skipped?: boolean
  skipReason?: string
}

export default function WorkoutScreen({
  workout,
  exercises,
  lang,
  onComplete
}: WorkoutScreenProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [currentBlockIdx, setCurrentBlockIdx] = useState(0)
  const [currentSetIdx, setCurrentSetIdx] = useState(0)
  
  // CRITICAL: Track completed sets for each exercise
  const [completedData, setCompletedData] = useState<Record<string, CompletedSet[]>>({})

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(s => s + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const currentBlock = workout.exerciseBlocks[currentBlockIdx]
  const currentExerciseId = currentBlock?.exercises[0] // Simplified: one exercise per block
  const currentExercise = exercises.find(e => e.id === currentExerciseId)

  const totalSets = currentBlock?.sets || 0
  const isLastSet = currentSetIdx >= totalSets - 1
  const isLastBlock = currentBlockIdx >= workout.exerciseBlocks.length - 1

  function markSetCompleted(reps: number, weight?: number) {
    if (!currentExerciseId) return

    const newSet: CompletedSet = {
      reps,
      weight,
      completed: true
    }

    setCompletedData(prev => ({
      ...prev,
      [currentExerciseId]: [...(prev[currentExerciseId] || []), newSet]
    }))
  }

  function handleNextSet(reps: number, weight?: number) {
    // Mark current set as completed
    markSetCompleted(reps, weight)

    if (isLastSet) {
      if (isLastBlock) {
        // Workout complete - pass all data to parent
        const exerciseData: CompletedExerciseData[] = Object.entries(completedData).map(
          ([exerciseId, sets]) => ({
            exerciseId,
            sets,
            skipped: false
          })
        )
        onComplete(exerciseData)
      } else {
        // Move to next block
        setCurrentBlockIdx(i => i + 1)
        setCurrentSetIdx(0)
      }
    } else {
      // Next set in same block
      setCurrentSetIdx(i => i + 1)
    }
  }

  function handleSkipExercise(reason: string) {
    if (!currentExerciseId) return

    setCompletedData(prev => ({
      ...prev,
      [currentExerciseId]: []
    }))

    if (isLastBlock) {
      const exerciseData: CompletedExerciseData[] = Object.entries(completedData).map(
        ([exerciseId, sets]) => ({
          exerciseId,
          sets,
          skipped: exerciseId === currentExerciseId,
          skipReason: exerciseId === currentExerciseId ? reason : undefined
        })
      )
      onComplete(exerciseData)
    } else {
      setCurrentBlockIdx(i => i + 1)
      setCurrentSetIdx(0)
    }
  }

  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60
  const formCues = getExerciseFormCues(currentExercise, lang)

  // Get completed sets for current exercise
  const exerciseCompletedSets = completedData[currentExerciseId || ''] || []

  return (
    <div className="space-y-6">
      {/* Timer Card */}
      <div className="bg-gray-900 rounded-lg p-6 text-white">
        <div className="text-center">
          <div className="text-sm opacity-70 mb-2">Czas treningu</div>
          <div className="text-5xl font-bold tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Current Exercise */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-medium text-gray-500 mb-1">
              Seria {currentSetIdx + 1} / {totalSets}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {getExerciseName(currentExercise, lang)}
            </h2>
          </div>
        </div>

        {/* Target */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700">
            Cel: {currentBlock?.reps} powtórzeń • Odpoczynek: {currentBlock?.restSeconds}s
          </div>
        </div>

        {/* Set Progress Indicators */}
        <div className="mb-6 flex gap-2">
          {Array.from({ length: totalSets }).map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 h-2 rounded-full transition ${
                idx < exerciseCompletedSets.length
                  ? 'bg-green-600'
                  : idx === currentSetIdx
                  ? 'bg-gray-900'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Form Cues */}
        {formCues.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-xs font-semibold text-blue-900 mb-2 uppercase">
              Technika
            </div>
            <ul className="space-y-1">
              {formCues.slice(0, 3).map((cue, i) => (
                <li key={i} className="text-sm text-blue-800 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{cue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleNextSet(Number(currentBlock?.reps) || 0)}
            className="w-full px-6 py-4 rounded-lg text-lg font-semibold text-white bg-gray-900 hover:bg-gray-800 transition"
          >
            {isLastSet && isLastBlock ? 'Zakończ trening ✓' : 'Następna seria →'}
          </button>

          <button
            onClick={() => {
              if (confirm('Czy czujesz ból lub dyskomfort?')) {
                handleSkipExercise('Ból/dyskomfort')
              }
            }}
            className="w-full px-6 py-3 rounded-lg text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition"
          >
            Pomiń ćwiczenie (ból)
          </button>
        </div>
      </div>

      {/* Exercise Queue */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="text-xs font-semibold text-gray-500 mb-3 uppercase">
          Kolejne ćwiczenia
        </div>
        <div className="space-y-2">
          {workout.exerciseBlocks.slice(currentBlockIdx + 1, currentBlockIdx + 4).map((block, idx) => {
            const ex = exercises.find(e => e.id === block.exercises[0])
            return (
              <div key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-xs font-semibold">
                  {currentBlockIdx + idx + 2}
                </div>
                <span>{getExerciseName(ex, lang)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Completed Sets Summary */}
      {exerciseCompletedSets.length > 0 && (
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-xs font-semibold text-green-900 mb-2">
            Ukończone serie: {exerciseCompletedSets.length}/{totalSets}
          </div>
          <div className="space-y-1">
            {exerciseCompletedSets.map((set, idx) => (
              <div key={idx} className="text-sm text-green-800">
                Seria {idx + 1}: {set.reps} reps {set.weight ? `× ${set.weight}kg` : ''}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}