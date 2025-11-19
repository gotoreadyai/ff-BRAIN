// path: src/engine/model.ts

export type LangCode = 'pl' | 'en' | string
export type Level = 1 | 2 | 3 | 4 | 5 // Poziomy trudności

// ===== MANIFEST =====

export type FitManifest = {
  version: number
  languages: LangCode[]
  levels: Level[]
  program: Program
  exercises: Exercise[]
  meals: Meal[]
  injuries: InjuryProtocol[]
}

// ===== PROGRAM =====

export type Program = {
  id: string
  title: Record<LangCode, string>
  description: Record<LangCode, string>
  goal: 'fat_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'general_health'
  phases: Phase[]
}

export type Phase = {
  id: string
  name: Record<LangCode, string>
  order: number
  durationWeeks: number
  description?: Record<LangCode, string>
  workoutSchedule: WorkoutSchedule
  nutritionGuidelines: NutritionGuidelines
  recoveryProtocol?: string // path to .md file
}

export type WorkoutSchedule = {
  daysPerWeek: number
  workouts: WorkoutReference[]
}

export type WorkoutReference = {
  id: string
  dayOfWeek?: number // 1=Monday, 7=Sunday, undefined=flexible
  type: 'strength' | 'cardio' | 'mobility' | 'rest' | 'active_recovery'
}

export type NutritionGuidelines = {
  caloriesTarget: number
  proteinGrams: number
  carbsGrams: number
  fatGrams: number
  mealsPerDay: number
  mealIds?: string[] // References to meal definitions
}

// ===== WORKOUTS & EXERCISES =====

export type Workout = {
  id: string
  name: Record<LangCode, string>
  type: 'strength' | 'cardio' | 'mobility' | 'active_recovery'
  durationMinutes: number
  exerciseBlocks: ExerciseBlock[]
  warmup?: string // path to .md file
  cooldown?: string // path to .md file
}

export type ExerciseBlock = {
  exercises: string[] // exercise IDs
  sets: number
  reps: number | string // "12" or "8-12" or "AMRAP"
  restSeconds: number
  notes?: Record<LangCode, string>
}

export type Exercise = {
  id: string
  name: Record<LangCode, string>
  description: Record<LangCode, string>
  equipment: string[]
  muscleGroups: string[]
  difficulty: Level
  formCues: Record<LangCode, string[]>
  videoUrl?: string
  alternatives?: string[] // Alternative exercise IDs for injuries
  contraindicatedInjuries?: string[] // Injury IDs that prevent this exercise
}

// ===== NUTRITION =====

export type Meal = {
  id: string
  name: Record<LangCode, string>
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'post_workout'
  calories: number
  protein: number
  carbs: number
  fat: number
  ingredients: Ingredient[]
  recipe?: Record<LangCode, string>
  prepTimeMinutes?: number
}

export type Ingredient = {
  name: Record<LangCode, string>
  amount: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

// ===== INJURIES & RECOVERY =====

export type InjuryProtocol = {
  id: string
  name: Record<LangCode, string>
  bodyPart: string
  severity: 'mild' | 'moderate' | 'severe'
  restrictedExercises: string[] // Exercise IDs to avoid
  recommendedExercises: string[] // Safe alternatives
  recoveryProtocol?: string // path to .md file with physio exercises
}

// ===== PACK STRUCTURE =====

export type Pack = {
  manifest: FitManifest
  files: Record<string, string> // path -> content (MD, JSON, or base64 image)
}

export type Store = {
  pack?: Pack
  lang: LangCode
  level: Level
}
