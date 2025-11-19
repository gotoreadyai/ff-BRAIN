// path: src/features/coach/screens/DayPrepScreen.tsx

import type { Workout, Exercise } from '../../../engine/model'
import type { Adaptations } from '../../../engine/db'
import { getExerciseName } from '../../../engine/manifest'
import { WorkoutHeader, ExerciseBlock } from '../../../ui/components/WorkoutInfo'
import { AIAlert } from '../../../ui/components/AIAlert'
import { Card } from '../../../ui/components/Card'
import { PrimaryButton } from '../../../ui/components/Button'

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
  const hasReplacements = Object.keys(adaptations.exerciseReplacements).length > 0
  const isDeload = adaptations.intensityModifier < 0.95

  return (
    <div className="space-y-6">
      <WorkoutHeader
        name={workoutName}
        dayNumber={dayNumber}
        totalDays={totalDays}
        durationMinutes={workout.durationMinutes}
        exerciseCount={workout.exerciseBlocks.length}
      />

      {(hasReplacements || isDeload) && (
        <AIAlert>
          {isDeload && (
            <p>• Intensywność -{Math.round((1 - adaptations.intensityModifier) * 100)}%</p>
          )}
          {hasReplacements && (
            <p>• {Object.keys(adaptations.exerciseReplacements).length} ćwiczeń zamieniono</p>
          )}
        </AIAlert>
      )}

      <Card>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Plan treningu</h3>
        <div className="space-y-3">
          {workout.exerciseBlocks.map((block, blockIdx) => {
            const exerciseData = block.exercises.map(exerciseId => {
              const exercise = exercises.find(e => e.id === exerciseId)
              const replacementId = adaptations.exerciseReplacements[exerciseId]
              const displayExercise = replacementId
                ? exercises.find(e => e.id === replacementId)
                : exercise

              return {
                name: getExerciseName(displayExercise, lang),
                isReplaced: !!replacementId,
                originalName: replacementId ? getExerciseName(exercise, lang) : undefined
              }
            })

            return (
              <ExerciseBlock
                key={blockIdx}
                blockIndex={blockIdx + 1}
                sets={block.sets}
                reps={block.reps}
                exercises={exerciseData}
              />
            )
          })}
        </div>
      </Card>

      <PrimaryButton onClick={onStart}>
        Rozpocznij trening →
      </PrimaryButton>
    </div>
  )
}