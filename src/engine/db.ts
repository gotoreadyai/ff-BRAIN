// path: src/engine/db.ts

import Dexie, { type Table } from 'dexie'
import type { Pack, FitManifest } from './model'

// ===== PACK RECORD =====

export type PackRecord = {
  id: string
  title: string
  manifest: FitManifest
  files: Record<string, string>
  createdAt: number
  updatedAt: number
}

// ===== USER PROGRESSION =====

export type UserProgression = {
  id: string // userId
  packId: string
  currentPhaseId: string
  currentDay: number // Day within phase (1-indexed)
  completedWorkouts: CompletedWorkout[]
  adaptations: Adaptations
  telemetry: TelemetrySnapshot
  createdAt: number
  updatedAt: number
}

export type CompletedWorkout = {
  workoutId: string
  date: string // YYYY-MM-DD
  timestamp: string // ISO timestamp
  exercises: CompletedExercise[]
  rpe: 1 | 2 | 3 | 4 | 5 // Rate of Perceived Exertion
  confidence: 1 | 2 | 3 | 4 | 5 // How confident they felt
  painReported: PainReport[]
  notes?: string
}

export type CompletedExercise = {
  exerciseId: string
  sets: CompletedSet[]
  skipped?: boolean
  skipReason?: string
}

export type CompletedSet = {
  reps: number
  weight?: number // kg
  completed: boolean
}

export type PainReport = {
  bodyPart: string
  severity: 1 | 2 | 3 | 4 | 5
  description?: string
}

export type Adaptations = {
  exerciseReplacements: Record<string, string> // originalId -> replacementId
  weightAdjustments: Record<string, number> // exerciseId -> weight in kg
  volumeAdjustments: Record<string, number> // exerciseId -> set multiplier (0.8, 1.0, 1.2)
  intensityModifier: number // Global modifier (0.8 = deload, 1.0 = normal, 1.2 = push)
}

export type TelemetrySnapshot = {
  avgSleepHours: number
  avgSteps: number
  avgHeartRate: number
  avgCaloriesBurned: number
  weight?: number
  bodyFat?: number
  lastUpdated: string // ISO timestamp
}

// ===== DATABASE =====

class FitPackDB extends Dexie {
  packs!: Table<PackRecord, string>
  progression!: Table<UserProgression, string>

  constructor() {
    super('fitpack_db')
    this.version(1).stores({
      packs: 'id, createdAt, updatedAt',
      progression: 'id, packId, updatedAt'
    })
  }
}

export const db = new FitPackDB()

// ===== CRUD OPERATIONS =====

export async function getAllPacks(): Promise<PackRecord[]> {
  return db.packs.orderBy('createdAt').toArray()
}

export async function addPack(pack: Pack, title: string): Promise<PackRecord> {
  const id = generatePackId()
  const now = Date.now()

  const record: PackRecord = {
    id,
    title,
    manifest: pack.manifest,
    files: pack.files,
    createdAt: now,
    updatedAt: now
  }

  await db.packs.add(record)
  return record
}

export async function removePack(id: string): Promise<void> {
  await db.packs.delete(id)
}

export async function getUserProgression(userId: string): Promise<UserProgression | undefined> {
  return db.progression.get(userId)
}

export async function saveUserProgression(progression: UserProgression): Promise<void> {
  progression.updatedAt = Date.now()
  await db.progression.put(progression)
}

export async function clearAll(): Promise<void> {
  await db.packs.clear()
  await db.progression.clear()
}

function generatePackId(): string {
  return `pack_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export default db
