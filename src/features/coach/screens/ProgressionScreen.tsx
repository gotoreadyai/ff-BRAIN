// path: src/features/coach/screens/ProgressionScreen.tsx

import { motion } from 'framer-motion'

type ProgressionScreenProps = {
  onContinue: () => void
}

export default function ProgressionScreen({ onContinue }: ProgressionScreenProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md space-y-8">
        <div className="w-28 h-28 mx-auto rounded-lg bg-amber-600 flex items-center justify-center">
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Program ukończony
          </h1>

          <p className="text-gray-600 text-lg mb-2">
            Udało Ci się ukończyć cały program treningowy
          </p>

          <p className="text-gray-500 text-sm">
            Gratulacje konsystencji i wytrwałości
          </p>
        </div>

        {/* Achievement badges */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="text-2xl mb-1">💪</div>
            <div className="text-xs font-semibold text-amber-900">Siła</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-xs font-semibold text-purple-900">Dyscyplina</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-2xl mb-1">🧠</div>
            <div className="text-xs font-semibold text-green-900">Adaptacja</div>
          </div>
        </div>

        <button
          onClick={onContinue}
          className="px-8 py-3 rounded-lg text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 transition"
        >
          Zacznij nowy program →
        </button>
      </div>
    </div>
  )
}