// path: src/features/coach/screens/WorkoutScreen.tsx

import { useState, useEffect } from 'react'
import type { Workout, Exercise } from '../../../engine/model'
import type { CompletedSet } from '../../../engine/db'
import { getExerciseName, getExerciseFormCues } from '../../../engine/manifest'
import { Card } from '../../../ui/components/Card'
import { PrimaryButton, WarningButton } from '../../../ui/components/Button'
import { 
  TimerDisplay, 
  SetProgress, 
  FormCues, 
  CompletedSetsDisplay,
  ExerciseQueue 
} from '../../../ui/components/WorkoutComponents'

export type CompletedExerciseData = {
  exerciseId: string
  sets: CompletedSet[]
  skipped?: boolean
  skipReason?: string
}

type WorkoutScreenProps = {
  workout: Workout
  exercises: Exercise[]
  lang: string
  onComplete: (completedExercises: CompletedExerciseData[]) => void
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
  const [completedData, setCompletedData] = useState<Record<string, CompletedSet[]>>({})

  useEffect(() => {
    const interval = setInterval(() => setElapsedSeconds(s => s + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const currentBlock = workout.exerciseBlocks[currentBlockIdx]
  const currentExerciseId = currentBlock?.exercises[0]
  const currentExercise = exercises.find(e => e.id === currentExerciseId)

  const totalSets = currentBlock?.sets || 0
  const isLastSet = currentSetIdx >= totalSets - 1
  const isLastBlock = currentBlockIdx >= workout.exerciseBlocks.length - 1

  function markSetCompleted(reps: number, weight?: number) {
    if (!currentExerciseId) return
    const newSet: CompletedSet = { reps, weight, completed: true }
    setCompletedData(prev => ({
      ...prev,
      [currentExerciseId]: [...(prev[currentExerciseId] || []), newSet]
    }))
  }

  function handleNextSet(reps: number, weight?: number) {
    markSetCompleted(reps, weight)

    if (isLastSet) {
      if (isLastBlock) {
        const exerciseData: CompletedExerciseData[] = Object.entries(completedData).map(
          ([exerciseId, sets]) => ({ exerciseId, sets, skipped: false })
        )
        onComplete(exerciseData)
      } else {
        setCurrentBlockIdx(i => i + 1)
        setCurrentSetIdx(0)
      }
    } else {
      setCurrentSetIdx(i => i + 1)
    }
  }

  function handleSkipExercise(reason: string) {
    if (!currentExerciseId) return

    setCompletedData(prev => ({ ...prev, [currentExerciseId]: [] }))

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

  const exerciseCompletedSets = completedData[currentExerciseId || ''] || []
  const formCues = getExerciseFormCues(currentExercise, lang)
  const upcomingExercises = workout.exerciseBlocks
    .slice(currentBlockIdx + 1, currentBlockIdx + 4)
    .map(block => ({
      name: getExerciseName(exercises.find(e => e.id === block.exercises[0]), lang)
    }))

  return (
    <div className="space-y-6">
      <TimerDisplay seconds={elapsedSeconds} />

      <Card>
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

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700">
            Cel: {currentBlock?.reps} powtórzeń • Odpoczynek: {currentBlock?.restSeconds}s
          </div>
        </div>

        <div className="mb-6">
          <SetProgress
            completedSets={exerciseCompletedSets.length}
            totalSets={totalSets}
            currentSet={currentSetIdx}
          />
        </div>

        <div className="mb-6">
          <FormCues cues={formCues} />
        </div>

        <div className="space-y-3">
          <PrimaryButton onClick={() => handleNextSet(Number(currentBlock?.reps) || 0)}>
            {isLastSet && isLastBlock ? 'Zakończ trening ✓' : 'Następna seria →'}
          </PrimaryButton>

          <WarningButton
            onClick={() => {
              if (confirm('Czy czujesz ból lub dyskomfort?')) {
                handleSkipExercise('Ból/dyskomfort')
              }
            }}
          >
            Pomiń ćwiczenie (ból)
          </WarningButton>
        </div>
      </Card>

      <ExerciseQueue exercises={upcomingExercises} />

      <CompletedSetsDisplay sets={exerciseCompletedSets} totalSets={totalSets} />
    </div>
  )
}