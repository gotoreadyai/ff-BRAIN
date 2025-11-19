// path: src/ui/AppLayout.tsx

import { type ReactNode, useState } from 'react'
import type { Pack, LangCode, Level, Phase } from '../engine/model'
import { getPhaseName } from '../engine/manifest'

type AppLayoutProps = {
  pack: Pack
  lang: LangCode
  level: Level
  currentPhaseId: string
  currentDay: number
  phases: Phase[]
  onPhaseChange: (phaseId: string) => void
  onShowProgress: () => void
  children: ReactNode
}

export default function AppLayout({
  pack,
  lang,
  level,
  currentPhaseId,
  currentDay,
  phases,
  onPhaseChange,
  onShowProgress,
  children
}: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  const currentPhase = phases.find(p => p.id === currentPhaseId)
  const phaseName = currentPhase ? getPhaseName(currentPhase, lang) : ''

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 flex-shrink-0 ${
          sidebarCollapsed ? 'w-14' : 'w-80'
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b border-gray-100 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                <span className="text-xl">💪</span>
              </div>
              <div>
                <div className="text-base font-bold text-gray-900">FitBrain Pack</div>
                <div className="text-xs text-gray-500">Training System</div>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title={sidebarCollapsed ? 'Rozwiń' : 'Zwiń'}
          >
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform ${
                sidebarCollapsed ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Progress Button */}
        <div className={`${sidebarCollapsed ? 'p-2' : 'p-4'} border-b border-gray-100`}>
          <button
            onClick={onShowProgress}
            className={`w-full rounded-lg text-sm font-medium transition bg-amber-500 text-white hover:bg-amber-700 ${
              sidebarCollapsed ? 'p-1 flex justify-center' : 'px-4 py-3'
            }`}
            title={sidebarCollapsed ? 'Twój postęp' : undefined}
          >
            {sidebarCollapsed ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Twój postęp</span>
              </div>
            )}
          </button>
        </div>

        {/* Phases List */}
        <div className={`flex-1 overflow-y-auto ${sidebarCollapsed ? 'p-2' : 'p-4'}`}>
          {!sidebarCollapsed && (
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Fazy ({phases.length})
            </div>
          )}
          <div className="space-y-2">
            {phases.map((phase, idx) => {
              const isActive = phase.id === currentPhaseId
              const name = getPhaseName(phase, lang)
              return (
                <button
                  key={phase.id}
                  onClick={() => onPhaseChange(phase.id)}
                  className={`w-full text-left rounded-lg text-sm transition ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  } ${sidebarCollapsed ? 'p-1 flex justify-center' : 'px-3 py-3'}`}
                  title={sidebarCollapsed ? name : undefined}
                >
                  {sidebarCollapsed ? (
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {idx + 1}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{name}</div>
                        <div
                          className={`text-xs ${
                            isActive ? 'text-white/70' : 'text-gray-500'
                          }`}
                        >
                          {phase.durationWeeks}w • {phase.workoutSchedule.daysPerWeek}x/tyg
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer Info */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="text-xs font-semibold text-gray-900 mb-2">AI Coach</div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Automatyczna adaptacja intensywności na podstawie feedbacku i telemetrii
            </p>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">{phaseName}</h1>
            {currentPhase && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 whitespace-nowrap">
                Dzień {currentDay} / {currentPhase.durationWeeks * 7}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">Poziom:</span> {level}
            </div>
            <div className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">Język:</span> {lang.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto w-full">{children}</div>
        </div>
      </main>
    </div>
  )
}