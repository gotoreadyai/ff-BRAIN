// path: src/features/coach/screens/FeedbackScreen.tsx

import { useState } from 'react'
import type { PainReport } from '../../../engine/db'

type FeedbackScreenProps = {
  onSubmit: (
    rpe: 1 | 2 | 3 | 4 | 5,
    confidence: 1 | 2 | 3 | 4 | 5,
    painReports: PainReport[]
  ) => void
}

export default function FeedbackScreen({ onSubmit }: FeedbackScreenProps) {
  const [rpe, setRPE] = useState<1 | 2 | 3 | 4 | 5 | null>(null)
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5 | null>(null)
  const [painReports, setPainReports] = useState<PainReport[]>([])
  const [showPainForm, setShowPainForm] = useState(false)

  function handleSubmit() {
    if (!rpe || !confidence) return
    onSubmit(rpe, confidence, painReports)
  }

  const canSubmit = rpe !== null && confidence !== null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Jak się czułeś?</h1>
        <p className="text-sm text-gray-600">
          Feedback pomoże AI dostosować kolejne treningi
        </p>
      </div>

      {/* RPE Scale */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Trudność treningu (RPE)
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {([1, 2, 3, 4, 5] as const).map(value => (
            <button
              key={value}
              onClick={() => setRPE(value)}
              className={`aspect-square rounded-lg text-base font-semibold transition ${
                rpe === value
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>Bardzo łatwy</span>
          <span>Bardzo trudny</span>
        </div>
      </div>

      {/* Confidence Scale */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Pewność wykonania
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {([1, 2, 3, 4, 5] as const).map(value => (
            <button
              key={value}
              onClick={() => setConfidence(value)}
              className={`aspect-square rounded-lg text-base font-semibold transition ${
                confidence === value
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>Niepewnie</span>
          <span>Bardzo pewnie</span>
        </div>
      </div>

      {/* Pain Report */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">Ból lub dyskomfort?</h3>
          <button
            onClick={() => setShowPainForm(!showPainForm)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
          >
            {showPainForm ? 'Anuluj' : '+ Zgłoś'}
          </button>
        </div>

        {painReports.length > 0 && (
          <div className="space-y-2 mb-3">
            {painReports.map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div>
                  <div className="font-medium text-amber-900 text-sm">{report.bodyPart}</div>
                  <div className="text-xs text-amber-700">Poziom: {report.severity}/5</div>
                </div>
                <button
                  onClick={() => setPainReports(p => p.filter((_, i) => i !== idx))}
                  className="text-amber-600 hover:text-amber-800 text-lg font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {showPainForm && (
          <PainReportForm
            onSubmit={report => {
              setPainReports(p => [...p, report])
              setShowPainForm(false)
            }}
            onCancel={() => setShowPainForm(false)}
          />
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full px-8 py-4 rounded-lg text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Zapisz feedback →
      </button>
    </div>
  )
}

// ===== SUB COMPONENT =====

type PainReportFormProps = {
  onSubmit: (report: PainReport) => void
  onCancel: () => void
}

function PainReportForm({ onSubmit, onCancel }: PainReportFormProps) {
  const [bodyPart, setBodyPart] = useState('')
  const [severity, setSeverity] = useState<1 | 2 | 3 | 4 | 5>(3)

  const bodyParts = [
    'Dolny kręgosłup',
    'Górny kręgosłup',
    'Kolano (L)',
    'Kolano (R)',
    'Bark (L)',
    'Bark (R)',
    'Łokieć (L)',
    'Łokieć (R)',
    'Nadgarstek',
    'Biodro',
    'Inne'
  ]

  function handleSubmit() {
    if (!bodyPart) return
    onSubmit({ bodyPart, severity })
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Wybierz okolicę
        </label>
        <select
          value={bodyPart}
          onChange={e => setBodyPart(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
        >
          <option value="">-- Wybierz --</option>
          {bodyParts.map(part => (
            <option key={part} value={part}>
              {part}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nasilenie: {severity}/5
        </label>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={severity}
          onChange={e => setSeverity(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Lekki</span>
          <span>Silny</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!bodyPart}
          className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Dodaj
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
        >
          Anuluj
        </button>
      </div>
    </div>
  )
}