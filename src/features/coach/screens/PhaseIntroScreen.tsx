// path: src/features/coach/screens/PhaseIntroScreen.tsx

import { motion } from 'framer-motion'

type PhaseIntroScreenProps = {
  phaseName: string
  durationWeeks: number
  onAutoAdvance: () => void
}

export default function PhaseIntroScreen({
  phaseName,
  durationWeeks,
  onAutoAdvance
}: PhaseIntroScreenProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md space-y-8">
        <div className="w-20 h-20 mx-auto rounded-lg bg-gray-900 flex items-center justify-center">
          <span className="text-3xl">→</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {phaseName}
          </h1>

          <p className="text-gray-600 text-lg mb-2">
            {durationWeeks} {durationWeeks === 1 ? 'tydzień' : 'tygodni'} treningu
          </p>

          <p className="text-gray-500 text-sm">
            AI dostosuje intensywność na podstawie Twojego feedbacku
          </p>
        </div>

        <button
          onClick={onAutoAdvance}
          className="px-8 py-3 rounded-lg text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 transition"
        >
          Rozpocznij fazę →
        </button>
      </div>
    </div>
  )
}