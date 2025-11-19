// path: src/features/coach/screens/FeedbackScreen.tsx

import { motion } from 'framer-motion'
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
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-xl">
          <span className="text-4xl">📊</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Jak się czułeś?</h1>
        <p className="text-gray-600">
          Twoja odpowiedź pomoże AI dostosować kolejne treningi
        </p>
      </motion.div>

      {/* RPE Scale */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Jak trudny był trening? (RPE)
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {([1, 2, 3, 4, 5] as const).map(value => (
            <button
              key={value}
              onClick={() => setRPE(value)}
              className={`aspect-square rounded-xl text-lg font-semibold transition ${
                rpe === value
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg scale-110'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <span>Bardzo łatwy</span>
          <span>Bardzo trudny</span>
        </div>
      </motion.div>

      {/* Confidence Scale */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Jak pewnie wykonałeś ćwiczenia?
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {([1, 2, 3, 4, 5] as const).map(value => (
            <button
              key={value}
              onClick={() => setConfidence(value)}
              className={`aspect-square rounded-xl text-lg font-semibold transition ${
                confidence === value
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg scale-110'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <span>Niepewnie</span>
          <span>Bardzo pewnie</span>
        </div>
      </motion.div>

      {/* Pain Report */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Czy coś bolało?</h3>
          <button
            onClick={() => setShowPainForm(!showPainForm)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition"
          >
            {showPainForm ? 'Anuluj' : '+ Zgłoś ból'}
          </button>
        </div>

        {painReports.length > 0 && (
          <div className="space-y-2 mb-4">
            {painReports.map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div>
                  <div className="font-medium text-amber-900">{report.bodyPart}</div>
                  <div className="text-xs text-amber-700">Poziom: {report.severity}/5</div>
                </div>
                <button
                  onClick={() => setPainReports(p => p.filter((_, i) => i !== idx))}
                  className="text-amber-600 hover:text-amber-800"
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
      </motion.div>

      {/* Submit Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full px-8 py-4 rounded-2xl text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Zapisz feedback →
      </motion.button>
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
    <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Wybierz okolicę
        </label>
        <select
          value={bodyPart}
          onChange={e => setBodyPart(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
          Nasilenie bólu: {severity}/5
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
          className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed"
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
