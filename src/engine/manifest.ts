// path: src/engine/manifest.ts

import { marked } from 'marked'
import type { FitManifest, Phase, Workout, Exercise, Meal, LangCode } from './model'

// ===== PHASE GETTERS =====

export function getPhase(manifest: FitManifest, phaseId: string): Phase | undefined {
  return manifest.program.phases.find(p => p.id === phaseId)
}

export function getPhaseName(phase: Phase | undefined, lang: LangCode): string {
  if (!phase?.name) return ''
  return phase.name[lang] || phase.name['pl'] || ''
}

export function getPhaseDescription(phase: Phase | undefined, lang: LangCode): string {
  if (!phase?.description) return ''
  return phase.description[lang] || phase.description['pl'] || ''
}

// ===== WORKOUT GETTERS =====

export function getWorkout(
  manifest: FitManifest,
  workoutId: string,
  files: Record<string, string>
): Workout | undefined {
  const workoutPath = `/workouts/${workoutId}.json`
  const workoutFile = files[workoutPath]
  if (!workoutFile) return undefined

  try {
    return JSON.parse(workoutFile) as Workout
  } catch {
    return undefined
  }
}

export function getWorkoutName(workout: Workout | undefined, lang: LangCode): string {
  if (!workout?.name) return ''
  return workout.name[lang] || workout.name['pl'] || ''
}

// ===== EXERCISE GETTERS =====

export function getExercise(manifest: FitManifest, exerciseId: string): Exercise | undefined {
  return manifest.exercises.find(e => e.id === exerciseId)
}

export function getExerciseName(exercise: Exercise | undefined, lang: LangCode): string {
  if (!exercise?.name) return ''
  return exercise.name[lang] || exercise.name['pl'] || ''
}

export function getExerciseDescription(exercise: Exercise | undefined, lang: LangCode): string {
  if (!exercise?.description) return ''
  return exercise.description[lang] || exercise.description['pl'] || ''
}

export function getExerciseFormCues(exercise: Exercise | undefined, lang: LangCode): string[] {
  if (!exercise?.formCues) return []
  return exercise.formCues[lang] || exercise.formCues['pl'] || []
}

// ===== MEAL GETTERS =====

export function getMeal(manifest: FitManifest, mealId: string): Meal | undefined {
  return manifest.meals.find(m => m.id === mealId)
}

export function getMealName(meal: Meal | undefined, lang: LangCode): string {
  if (!meal?.name) return ''
  return meal.name[lang] || meal.name['pl'] || ''
}

export function getMealRecipe(meal: Meal | undefined, lang: LangCode): string {
  if (!meal?.recipe) return ''
  return meal.recipe[lang] || meal.recipe['pl'] || ''
}

// ===== MARKDOWN RENDERING =====

export function renderMarkdown(md: string): string {
  const withoutFrontmatter = md.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/m, '')
  return marked.parse(withoutFrontmatter) as string
}

export function getMarkdownFile(files: Record<string, string>, path: string): string {
  const fullPath = path.startsWith('/') ? path : '/' + path
  const content = files[fullPath]
  if (!content) return ''
  return renderMarkdown(content)
}

// ===== PROGRAM INFO =====

export function getProgramTitle(manifest: FitManifest, lang: LangCode): string {
  return manifest.program.title[lang] || manifest.program.title['pl'] || ''
}

export function getProgramDescription(manifest: FitManifest, lang: LangCode): string {
  return manifest.program.description[lang] || manifest.program.description['pl'] || ''
}

// ===== HELPERS =====

export function getTotalPhaseDays(phase: Phase): number {
  return phase.durationWeeks * 7
}

export function getCurrentWeek(currentDay: number): number {
  return Math.ceil(currentDay / 7)
}

export function getDayOfWeek(currentDay: number): number {
  // Returns 1-7 (Monday to Sunday)
  const dayMod = currentDay % 7
  return dayMod === 0 ? 7 : dayMod
}
