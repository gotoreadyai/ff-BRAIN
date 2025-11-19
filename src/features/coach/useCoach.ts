// path: src/features/coach/useCoach.ts

import { useState, useEffect } from 'react'
import type { Pack, LangCode, Level, Phase, Workout } from '../../engine/model'
import type {
  UserProgression,
  CompletedWorkout,
  CompletedExercise,
  Adaptations,
  PainReport
} from '../../engine/db'
import { getUserProgression, saveUserProgression } from '../../engine/db'
import {
  getPhase,
  getPhaseName,
  getWorkout,
  getTotalPhaseDays,
  getDayOfWeek
} from '../../engine/manifest'
import {
  computeAdaptations,
  mergeAdaptations,
  type AdaptationContext
} from '../adaptation/adaptationEngine'
import type { TelemetrySnapshot } from '../../engine/db'

const DEMO_USER_ID = 'demo-user'

type Screen =
  | 'phase_intro'
  | 'day_prep'
  | 'rest_day'
  | 'workout'
  | 'feedback'
  | 'recovery'
  | 'phase_complete'
  | 'progression'

type CoachState = {
  screen: Screen
  currentPhaseId: string
  currentDay: number
  workoutData?: {
    workoutId: string
    startTime: string
    completedExercises: CompletedExercise[]
  }
  feedbackData?: {
    rpe?: 1 | 2 | 3 | 4 | 5
    confidence?: 1 | 2 | 3 | 4 | 5
    painReports: PainReport[]
    notes: string
  }
}

const INITIAL_STATE: CoachState = {
  screen: 'phase_intro',
  currentPhaseId: '',
  currentDay: 1,
  feedbackData: {
    painReports: [],
    notes: ''
  }
}

export function useCoach(
  pack: Pack,
  lang: LangCode,
  level: Level,
  telemetry: TelemetrySnapshot | null
) {
  const [state, setState] = useState<CoachState>(INITIAL_STATE)
  const [progression, setProgression] = useState<UserProgression | null>(null)

  // Initialize or load progression
  useEffect(() => {
    const init = async () => {
      let prog = await getUserProgression(DEMO_USER_ID)

      if (!prog) {
        // Create new progression
        const firstPhase = pack.manifest.program.phases[0]
        if (!firstPhase) return

        prog = {
          id: DEMO_USER_ID,
          packId: pack.manifest.program.id,
          currentPhaseId: firstPhase.id,
          currentDay: 1,
          completedWorkouts: [],
          adaptations: {
            exerciseReplacements: {},
            weightAdjustments: {},
            volumeAdjustments: {},
            intensityModifier: 1.0
          },
          telemetry: telemetry || {
            avgSleepHours: 7,
            avgSteps: 8000,
            avgHeartRate: 70,
            avgCaloriesBurned: 2000,
            lastUpdated: new Date().toISOString()
          },
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        await saveUserProgression(prog)
      }

      setProgression(prog)
      setState(s => ({
        ...s,
        currentPhaseId: prog!.currentPhaseId,
        currentDay: prog!.currentDay
      }))
    }

    init()
  }, [pack, telemetry])

  // Update telemetry
  useEffect(() => {
    if (!progression || !telemetry) return
    const updated = { ...progression, telemetry }
    setProgression(updated)
    saveUserProgression(updated)
  }, [telemetry])

  // Getters
  const phase = getPhase(pack.manifest, state.currentPhaseId)
  const phaseName = getPhaseName(phase, lang)
  const totalPhaseDays = phase ? getTotalPhaseDays(phase) : 0
  const dayOfWeek = getDayOfWeek(state.currentDay)

  // Get today's workout
  const todayWorkoutRef = phase?.workoutSchedule.workouts.find(
    w => w.dayOfWeek === undefined || w.dayOfWeek === dayOfWeek
  )
  const todayWorkout = todayWorkoutRef
    ? getWorkout(pack.manifest, todayWorkoutRef.id, pack.files)
    : undefined

  const isRestDay = !todayWorkout

  // ===== ACTIONS =====

  function nextScreen() {
    setState(s => {
      if (s.screen === 'phase_intro') {
        // Check if first day is rest day
        return { ...s, screen: isRestDay ? 'rest_day' : 'day_prep' }
      }
      
      if (s.screen === 'day_prep') {
        // CRITICAL FIX: Check if workout exists
        if (!todayWorkoutRef) {
          console.error('No workout found for day_prep screen')
          return { ...s, screen: 'rest_day' }
        }
        
        // Start workout
        return {
          ...s,
          screen: 'workout',
          workoutData: {
            workoutId: todayWorkoutRef.id,
            startTime: new Date().toISOString(),
            completedExercises: []
          }
        }
      }

      if (s.screen === 'rest_day') {
        // Move to next day after rest
        const nextDay = s.currentDay + 1

        if (nextDay > totalPhaseDays) {
          return { ...s, screen: 'phase_complete', currentDay: nextDay }
        }

        return {
          ...s,
          currentDay: nextDay,
          screen: 'day_prep'
        }
      }

      if (s.screen === 'feedback') return { ...s, screen: 'recovery' }
      
      if (s.screen === 'recovery') {
        // Save workout and move to next day
        if (s.workoutData && s.feedbackData) {
          saveCompletedWorkout(
            s.workoutData.workoutId,
            s.workoutData.completedExercises,
            s.feedbackData.rpe || 3,
            s.feedbackData.confidence || 3,
            s.feedbackData.painReports,
            s.feedbackData.notes
          )
        }

        const nextDay = s.currentDay + 1

        // Check if phase complete
        if (nextDay > totalPhaseDays) {
          return { ...s, screen: 'phase_complete', currentDay: nextDay }
        }

        // Next day - reset state
        return {
          ...s,
          screen: 'day_prep',
          currentDay: nextDay,
          workoutData: undefined,
          feedbackData: {
            painReports: [],
            notes: ''
          }
        }
      }
      
      if (s.screen === 'phase_complete') {
        return { ...s, screen: 'progression' }
      }
      
      if (s.screen === 'progression') {
        // Move to next phase
        const phases = pack.manifest.program.phases
        const currentIdx = phases.findIndex(p => p.id === s.currentPhaseId)
        const nextPhase = phases[currentIdx + 1]

        if (nextPhase) {
          return {
            ...s,
            screen: 'phase_intro',
            currentPhaseId: nextPhase.id,
            currentDay: 1,
            workoutData: undefined,
            feedbackData: {
              painReports: [],
              notes: ''
            }
          }
        } else {
          // Program complete - restart or show completion
          return {
            ...s,
            screen: 'phase_intro',
            currentPhaseId: phases[0].id,
            currentDay: 1
          }
        }
      }
      return s
    })
  }

  // NEW: Handle workout completion with exercise data
  function handleWorkoutComplete(completedExercises: CompletedExercise[]) {
    setState(s => ({
      ...s,
      screen: 'feedback',
      workoutData: {
        ...s.workoutData!,
        completedExercises
      }
    }))
  }

  function setFeedbackRPE(rpe: 1 | 2 | 3 | 4 | 5) {
    setState(s => ({
      ...s,
      feedbackData: { ...s.feedbackData!, rpe }
    }))
  }

  function setFeedbackConfidence(confidence: 1 | 2 | 3 | 4 | 5) {
    setState(s => ({
      ...s,
      feedbackData: { ...s.feedbackData!, confidence }
    }))
  }

  function addPainReport(report: PainReport) {
    setState(s => ({
      ...s,
      feedbackData: {
        ...s.feedbackData!,
        painReports: [...s.feedbackData!.painReports, report]
      }
    }))
  }

  function setFeedbackNotes(notes: string) {
    setState(s => ({
      ...s,
      feedbackData: { ...s.feedbackData!, notes }
    }))
  }

  async function saveCompletedWorkout(
    workoutId: string,
    exercises: CompletedExercise[],
    rpe: 1 | 2 | 3 | 4 | 5,
    confidence: 1 | 2 | 3 | 4 | 5,
    painReports: PainReport[],
    notes: string
  ) {
    if (!progression) return

    const completed: CompletedWorkout = {
      workoutId,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      exercises,
      rpe,
      confidence,
      painReported: painReports,
      notes
    }

    const updated: UserProgression = {
      ...progression,
      completedWorkouts: [...progression.completedWorkouts, completed],
      currentDay: state.currentDay
    }

    // Run adaptation engine
    if (updated.completedWorkouts.length >= 3) {
      const context: AdaptationContext = {
        recentWorkouts: updated.completedWorkouts.slice(-5),
        telemetry: updated.telemetry,
        currentAdaptations: updated.adaptations,
        manifest: pack.manifest
      }

      const decisions = computeAdaptations(context)
      updated.adaptations = mergeAdaptations(updated.adaptations, decisions)
    }

    setProgression(updated)
    await saveUserProgression(updated)
  }

  function goToPhase(phaseId: string) {
    setState(s => ({
      ...s,
      screen: 'phase_intro',
      currentPhaseId: phaseId,
      currentDay: 1,
      workoutData: undefined,
      feedbackData: {
        painReports: [],
        notes: ''
      }
    }))
  }

  return {
    state,
    progression,
    phase,
    phaseName,
    totalPhaseDays,
    todayWorkout,
    isRestDay,
    adaptations: progression?.adaptations,
    nextScreen,
    handleWorkoutComplete,
    setFeedbackRPE,
    setFeedbackConfidence,
    addPainReport,
    setFeedbackNotes,
    goToPhase
  }
}