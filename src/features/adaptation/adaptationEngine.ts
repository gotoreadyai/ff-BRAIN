// path: src/features/adaptation/adaptationEngine.ts

import type {
  CompletedWorkout,
  Adaptations,
  TelemetrySnapshot,
  PainReport
} from '../../engine/db'
import type { FitManifest } from '../../engine/model'

// ===== ADAPTATION RULES ENGINE =====

export type AdaptationContext = {
  recentWorkouts: CompletedWorkout[] // Last 3-5 workouts
  telemetry: TelemetrySnapshot
  currentAdaptations: Adaptations
  manifest: FitManifest
}

export type AdaptationDecision = {
  adjustments: Partial<Adaptations>
  reason: string
}

/**
 * Main adaptation function - analyzes recent performance and returns adjustments
 */
export function computeAdaptations(context: AdaptationContext): AdaptationDecision[] {
  const decisions: AdaptationDecision[] = []

  // Rule 1: Low confidence trend → deload
  const avgConfidence = computeAvgConfidence(context.recentWorkouts)
  if (avgConfidence < 2.5) {
    decisions.push({
      adjustments: {
        intensityModifier: 0.85,
        volumeAdjustments: {}
      },
      reason: 'Low confidence detected - reducing intensity by 15%'
    })
  }

  // Rule 2: High RPE trend → deload
  const avgRPE = computeAvgRPE(context.recentWorkouts)
  if (avgRPE > 4.2) {
    decisions.push({
      adjustments: {
        intensityModifier: 0.9,
        volumeAdjustments: {}
      },
      reason: 'High RPE detected - implementing deload week'
    })
  }

  // Rule 3: Pain reports → replace exercises
  const painReports = collectPainReports(context.recentWorkouts)
  const replacements = computeExerciseReplacements(painReports, context.manifest)
  if (Object.keys(replacements).length > 0) {
    decisions.push({
      adjustments: {
        exerciseReplacements: replacements
      },
      reason: `Pain detected - replaced ${Object.keys(replacements).length} exercise(s)`
    })
  }

  // Rule 4: Consistent high performance → progressive overload
  if (avgConfidence > 4 && avgRPE < 3.5 && painReports.length === 0) {
    const recentWorkout = context.recentWorkouts[context.recentWorkouts.length - 1]
    const progressions = computeProgressiveOverload(recentWorkout)
    if (Object.keys(progressions).length > 0) {
      decisions.push({
        adjustments: {
          weightAdjustments: progressions
        },
        reason: 'Strong performance - increasing weights'
      })
    }
  }

  // Rule 5: Poor sleep → active recovery
  if (context.telemetry.avgSleepHours < 6) {
    decisions.push({
      adjustments: {
        intensityModifier: 0.7
      },
      reason: 'Poor sleep recovery - switching to active recovery intensity'
    })
  }

  return decisions
}

/**
 * Merges multiple adaptation decisions into final adaptations
 */
export function mergeAdaptations(
  current: Adaptations,
  decisions: AdaptationDecision[]
): Adaptations {
  const merged: Adaptations = {
    exerciseReplacements: { ...current.exerciseReplacements },
    weightAdjustments: { ...current.weightAdjustments },
    volumeAdjustments: { ...current.volumeAdjustments },
    intensityModifier: current.intensityModifier
  }

  for (const decision of decisions) {
    if (decision.adjustments.exerciseReplacements) {
      Object.assign(merged.exerciseReplacements, decision.adjustments.exerciseReplacements)
    }
    if (decision.adjustments.weightAdjustments) {
      Object.assign(merged.weightAdjustments, decision.adjustments.weightAdjustments)
    }
    if (decision.adjustments.volumeAdjustments) {
      Object.assign(merged.volumeAdjustments, decision.adjustments.volumeAdjustments)
    }
    if (decision.adjustments.intensityModifier !== undefined) {
      merged.intensityModifier = Math.min(
        merged.intensityModifier,
        decision.adjustments.intensityModifier
      )
    }
  }

  return merged
}

// ===== HELPER FUNCTIONS =====

function computeAvgConfidence(workouts: CompletedWorkout[]): number {
  if (workouts.length === 0) return 3
  const sum = workouts.reduce((acc, w) => acc + w.confidence, 0)
  return sum / workouts.length
}

function computeAvgRPE(workouts: CompletedWorkout[]): number {
  if (workouts.length === 0) return 3
  const sum = workouts.reduce((acc, w) => acc + w.rpe, 0)
  return sum / workouts.length
}

function collectPainReports(workouts: CompletedWorkout[]): PainReport[] {
  const allReports: PainReport[] = []
  for (const workout of workouts) {
    allReports.push(...workout.painReported)
  }
  return allReports
}

function computeExerciseReplacements(
  painReports: PainReport[],
  manifest: FitManifest
): Record<string, string> {
  const replacements: Record<string, string> = {}

  // Group pain by body part
  const painByBodyPart = new Map<string, number>()
  for (const report of painReports) {
    const current = painByBodyPart.get(report.bodyPart) || 0
    painByBodyPart.set(report.bodyPart, Math.max(current, report.severity))
  }

  // Find exercises that affect painful areas
  for (const [bodyPart, severity] of painByBodyPart.entries()) {
    if (severity < 3) continue // Only replace if moderate+ pain

    // Find injury protocol
    const protocol = manifest.injuries.find(
      i => i.bodyPart.toLowerCase() === bodyPart.toLowerCase()
    )
    if (!protocol) continue

    // Replace restricted exercises with recommended alternatives
    for (const restrictedId of protocol.restrictedExercises) {
      const alternative = protocol.recommendedExercises[0]
      if (alternative && !replacements[restrictedId]) {
        replacements[restrictedId] = alternative
      }
    }
  }

  return replacements
}

function computeProgressiveOverload(
  workout: CompletedWorkout
): Record<string, number> {
  const progressions: Record<string, number> = {}

  for (const exercise of workout.exercises) {
    if (exercise.skipped) continue

    // Check if all sets completed with good form (no failures)
    const allCompleted = exercise.sets.every(s => s.completed)
    if (!allCompleted) continue

    // Get average weight
    const weights = exercise.sets
      .map(s => s.weight)
      .filter((w): w is number => w !== undefined)
    if (weights.length === 0) continue

    const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length

    // Progressive overload: +2.5kg for upper body, +5kg for lower body
    // (simple heuristic - can be refined)
    const increment = avgWeight > 40 ? 5 : 2.5
    progressions[exercise.exerciseId] = avgWeight + increment
  }

  return progressions
}

/**
 * Applies adaptations to a workout plan
 */
export function applyAdaptations(
  exerciseId: string,
  baseWeight: number | undefined,
  baseSets: number,
  adaptations: Adaptations
): { weight?: number; sets: number } {
  let weight = baseWeight
  let sets = baseSets

  // Apply weight adjustments
  if (weight && adaptations.weightAdjustments[exerciseId]) {
    weight = adaptations.weightAdjustments[exerciseId]
  }

  // Apply volume adjustments
  if (adaptations.volumeAdjustments[exerciseId]) {
    sets = Math.round(sets * adaptations.volumeAdjustments[exerciseId])
  }

  // Apply global intensity modifier
  if (weight) {
    weight = Math.round(weight * adaptations.intensityModifier * 2) / 2 // Round to nearest 0.5kg
  }
  sets = Math.max(1, Math.round(sets * adaptations.intensityModifier))

  return { weight, sets }
}
