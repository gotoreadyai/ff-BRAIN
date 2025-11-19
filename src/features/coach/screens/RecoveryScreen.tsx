// path: src/features/coach/screens/RecoveryScreen.tsx

import { motion } from 'framer-motion'
import type { TelemetrySnapshot } from '../../../engine/db'

type RecoveryScreenProps = {
  telemetry: TelemetrySnapshot | null
  onNext: () => void
}

export default function RecoveryScreen({ telemetry, onNext }: RecoveryScreenProps) {
  const sleepQuality = telemetry
    ? telemetry.avgSleepHours >= 7
      ? 'good'
      : telemetry.avgSleepHours >= 6
      ? 'ok'
      : 'poor'
    : 'unknown'

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-xl">
          <span className="text-4xl">😴</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Regeneracja</h1>
        <p className="text-gray-600">Odpoczynek jest równie ważny jak trening</p>
      </motion.div>

      {/* Telemetry Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 p-5 text-center"
        >
          <div className="text-3xl mb-2">😴</div>
          <div className="text-2xl font-bold text-gray-900">
            {telemetry?.avgSleepHours.toFixed(1) || '—'}h
          </div>
          <div className="text-xs text-gray-500 mt-1">Średni sen</div>
          {sleepQuality === 'poor' && (
            <div className="mt-2 text-xs text-amber-600 font-medium">
              ⚠️ Za mało snu
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-200 p-5 text-center"
        >
          <div className="text-3xl mb-2">🚶</div>
          <div className="text-2xl font-bold text-gray-900">
            {telemetry?.avgSteps.toLocaleString('pl-PL') || '—'}
          </div>
          <div className="text-xs text-gray-500 mt-1">Kroki dziennie</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-5 text-center"
        >
          <div className="text-3xl mb-2">❤️</div>
          <div className="text-2xl font-bold text-gray-900">
            {telemetry?.avgHeartRate || '—'}
          </div>
          <div className="text-xs text-gray-500 mt-1">Śr. tętno (bpm)</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-gray-200 p-5 text-center"
        >
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-gray-900">
            {telemetry?.avgCaloriesBurned || '—'}
          </div>
          <div className="text-xs text-gray-500 mt-1">Spalone kcal</div>
        </motion.div>
      </div>

      {/* Recovery Tips */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          💡 Wskazówki regeneracyjne
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Pij minimum 2-3L wody dziennie</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Zadbaj o 7-9h snu dla optymalnej regeneracji</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Rozciąganie i foam rolling po treningu</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Posiłek z białkiem w ciągu 2h po treningu</span>
          </li>
        </ul>
      </motion.div>

      {/* AI Message */}
      {sleepQuality === 'poor' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">AI Coach mówi:</h4>
              <p className="text-sm text-amber-800">
                Twój sen jest poniżej normy. Następny trening będzie lżejszy - priorytetem
                jest regeneracja. Postaraj się dziś wcześniej położyć spać.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Next Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onNext}
        className="w-full px-8 py-4 rounded-2xl text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-xl transition"
      >
        Kontynuuj →
      </motion.button>
    </div>
  )
}
