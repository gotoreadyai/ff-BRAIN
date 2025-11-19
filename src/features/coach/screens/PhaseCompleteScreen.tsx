// path: src/features/coach/screens/PhaseCompleteScreen.tsx

import { motion } from 'framer-motion'

type PhaseCompleteScreenProps = {
  phaseName: string
  workoutsCompleted: number
  onContinue: () => void
}

export default function PhaseCompleteScreen({
  phaseName,
  workoutsCompleted,
  onContinue
}: PhaseCompleteScreenProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md space-y-8">
        <div className="w-24 h-24 mx-auto rounded-lg bg-green-600 flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Faza ukończona
          </h1>

          <p className="text-gray-600 text-lg mb-2">
            {phaseName}
          </p>

          <p className="text-gray-500 text-sm">
            Ukończono {workoutsCompleted} {workoutsCompleted === 1 ? 'trening' : 'treningów'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">100%</div>
            <div className="text-xs text-gray-500 mt-1">Adherence</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">+5kg</div>
            <div className="text-xs text-gray-500 mt-1">Progresja</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-500 mt-1">Kontuzje</div>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="px-8 py-3 rounded-lg text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 transition"
        >
          Następna faza →
        </button>
      </div>
    </div>
  )
}