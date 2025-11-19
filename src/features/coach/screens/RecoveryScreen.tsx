// path: src/features/coach/screens/RecoveryScreen.tsx

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
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Regeneracja</h1>
        <p className="text-sm text-gray-600">Odpoczynek jest równie ważny jak trening</p>
      </div>

      {/* Telemetry Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {telemetry?.avgSleepHours.toFixed(1) || '—'}h
          </div>
          <div className="text-xs text-gray-500 mt-1">Średni sen</div>
          {sleepQuality === 'poor' && (
            <div className="mt-2 text-xs text-amber-600 font-medium">
              Za mało snu
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {telemetry?.avgSteps.toLocaleString('pl-PL') || '—'}
          </div>
          <div className="text-xs text-gray-500 mt-1">Kroki dziennie</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {telemetry?.avgHeartRate || '—'}
          </div>
          <div className="text-xs text-gray-500 mt-1">Śr. tętno (bpm)</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {telemetry?.avgCaloriesBurned || '—'}
          </div>
          <div className="text-xs text-gray-500 mt-1">Spalone kcal</div>
        </div>
      </div>

      {/* Recovery Tips */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Wskazówki regeneracyjne
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">•</span>
            <span>Pij minimum 2-3L wody dziennie</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">•</span>
            <span>Zadbaj o 7-9h snu dla optymalnej regeneracji</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">•</span>
            <span>Rozciąganie i foam rolling po treningu</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-400 mt-0.5">•</span>
            <span>Posiłek z białkiem w ciągu 2h po treningu</span>
          </li>
        </ul>
      </div>

      {/* AI Message */}
      {sleepQuality === 'poor' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-1 text-sm">AI Coach</h4>
              <p className="text-sm text-amber-800">
                Twój sen jest poniżej normy. Następny trening będzie lżejszy - priorytetem
                jest regeneracja. Postaraj się dziś wcześniej położyć spać.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={onNext}
        className="w-full px-8 py-4 rounded-lg text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 transition"
      >
        Kontynuuj →
      </button>
    </div>
  )
}