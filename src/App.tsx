// path: src/App.tsx

import { useState } from 'react'
import { usePackCollection } from './features/pack/usePackCollection'
import { useCoach } from './features/coach/useCoach'
import { useTelemetry } from './features/telemetry/useTelemetry'
import PackLoader from './features/pack/PackLoader'
import AppLayout from './ui/AppLayout'
import PageTransition from './ui/PageTransition'

// Screens
import PhaseIntroScreen from './features/coach/screens/PhaseIntroScreen'
import DayPrepScreen from './features/coach/screens/DayPrepScreen'
import WorkoutScreen from './features/coach/screens/WorkoutScreen'
import FeedbackScreen from './features/coach/screens/FeedbackScreen'
import RecoveryScreen from './features/coach/screens/RecoveryScreen'
import PhaseCompleteScreen from './features/coach/screens/PhaseCompleteScreen'
import ProgressionScreen from './features/coach/screens/ProgressionScreen'

import type { LangCode, Level } from './engine/model'
import './index.css'

export default function App() {
  const { packs, activePack, isLoading, addZip } = usePackCollection()
  const [lang, setLang] = useState<LangCode>('pl')
  const [level, setLevel] = useState<Level>(1)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm">Ładowanie FitPack...</div>
      </div>
    )
  }

  if (!activePack) {
    return <PackLoader onZipUpload={addZip} />
  }

  return (
    <AppWithPack
      pack={activePack}
      lang={lang}
      level={level}
      onLangChange={setLang}
      onLevelChange={setLevel}
    />
  )
}

// ===== APP WITH PACK =====

type AppWithPackProps = {
  pack: NonNullable<ReturnType<typeof usePackCollection>['activePack']>
  lang: LangCode
  level: Level
  onLangChange: (lang: LangCode) => void
  onLevelChange: (level: Level) => void
}

function AppWithPack({ pack, lang, level, onLangChange, onLevelChange }: AppWithPackProps) {
  const { telemetry, isLoading: telemetryLoading } = useTelemetry()
  const coach = useCoach(pack, lang, level, telemetry)

  if (telemetryLoading || !coach.phase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm">Inicjalizacja AI Coach...</div>
      </div>
    )
  }

  const phases = pack.manifest.program.phases
  const allExercises = pack.manifest.exercises

  return (
    <AppLayout
      pack={pack}
      lang={lang}
      level={level}
      currentPhaseId={coach.state.currentPhaseId}
      currentDay={coach.state.currentDay}
      phases={phases}
      onPhaseChange={coach.goToPhase}
    >
      <PageTransition key={coach.state.screen}>
        {coach.state.screen === 'phase_intro' && (
          <PhaseIntroScreen
            phaseName={coach.phaseName}
            durationWeeks={coach.phase.durationWeeks}
            onAutoAdvance={coach.nextScreen}
          />
        )}

        {coach.state.screen === 'day_prep' && coach.todayWorkout && coach.adaptations && (
          <DayPrepScreen
            workout={coach.todayWorkout}
            exercises={allExercises}
            adaptations={coach.adaptations}
            dayNumber={coach.state.currentDay}
            totalDays={coach.totalPhaseDays}
            lang={lang}
            onStart={coach.nextScreen}
          />
        )}

        {coach.state.screen === 'workout' && coach.todayWorkout && (
          <WorkoutScreen
            workout={coach.todayWorkout}
            exercises={allExercises}
            lang={lang}
            onComplete={coach.handleWorkoutComplete}
          />
        )}

        {coach.state.screen === 'feedback' && (
          <FeedbackScreen
            onSubmit={(rpe, confidence, painReports) => {
              coach.setFeedbackRPE(rpe)
              coach.setFeedbackConfidence(confidence)
              painReports.forEach(report => coach.addPainReport(report))
              coach.nextScreen()
            }}
          />
        )}

        {coach.state.screen === 'recovery' && (
          <RecoveryScreen telemetry={telemetry} onNext={coach.nextScreen} />
        )}

        {coach.state.screen === 'phase_complete' && (
          <PhaseCompleteScreen
            phaseName={coach.phaseName}
            workoutsCompleted={coach.progression?.completedWorkouts.length || 0}
            onContinue={coach.nextScreen}
          />
        )}

        {coach.state.screen === 'progression' && (
          <ProgressionScreen onContinue={coach.nextScreen} />
        )}
      </PageTransition>
    </AppLayout>
  )
}