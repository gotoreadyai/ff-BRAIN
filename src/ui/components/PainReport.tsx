// path: src/ui/components/PainReport.tsx

import { useState } from 'react'
import type { PainReport as PainReportType } from '../../engine/db'
import { Card, AlertCard } from './Card'
import { SmallButton, SecondaryButton, PrimaryButton } from './Button'

type PainReportListProps = {
  reports: PainReportType[]
  onRemove: (index: number) => void
  onAdd: () => void
}

export function PainReportList({ reports, onRemove, onAdd }: PainReportListProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">Ból lub dyskomfort?</h3>
        <SmallButton onClick={onAdd}>
          + Zgłoś
        </SmallButton>
      </div>

      {reports.length > 0 && (
        <div className="space-y-2">
          {reports.map((report, idx) => (
            <AlertCard key={idx} variant="amber">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-amber-900 text-sm">{report.bodyPart}</div>
                  <div className="text-xs text-amber-700">Poziom: {report.severity}/5</div>
                </div>
                <button
                  onClick={() => onRemove(idx)}
                  className="text-amber-600 hover:text-amber-800 text-lg font-bold"
                >
                  ×
                </button>
              </div>
            </AlertCard>
          ))}
        </div>
      )}
    </Card>
  )
}

type PainReportFormProps = {
  onSubmit: (report: PainReportType) => void
  onCancel: () => void
}

export function PainReportForm({ onSubmit, onCancel }: PainReportFormProps) {
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
        <PrimaryButton onClick={handleSubmit} disabled={!bodyPart} className="flex-1">
          Dodaj
        </PrimaryButton>
        <SecondaryButton onClick={onCancel}>
          Anuluj
        </SecondaryButton>
      </div>
    </div>
  )
}