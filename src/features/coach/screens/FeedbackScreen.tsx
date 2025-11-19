// path: src/features/coach/screens/FeedbackScreen.tsx

import { useState } from 'react'
import type { PainReport } from '../../../engine/db'
import { SectionHeader } from '../../../ui/components/Section'
import { RatingScale } from '../../../ui/components/RatingScale'
import { PainReportList, PainReportForm } from '../../../ui/components/PainReport'
import { PrimaryButton } from '../../../ui/components/Button'

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
      <SectionHeader 
        title="Jak się czułeś?"
        subtitle="Feedback pomoże AI dostosować kolejne treningi"
      />

      <RatingScale
        title="Trudność treningu (RPE)"
        value={rpe}
        onChange={setRPE}
        lowLabel="Bardzo łatwy"
        highLabel="Bardzo trudny"
      />

      <RatingScale
        title="Pewność wykonania"
        value={confidence}
        onChange={setConfidence}
        lowLabel="Niepewnie"
        highLabel="Bardzo pewnie"
      />

      {showPainForm ? (
        <PainReportForm
          onSubmit={report => {
            setPainReports(p => [...p, report])
            setShowPainForm(false)
          }}
          onCancel={() => setShowPainForm(false)}
        />
      ) : (
        <PainReportList
          reports={painReports}
          onRemove={idx => setPainReports(p => p.filter((_, i) => i !== idx))}
          onAdd={() => setShowPainForm(true)}
        />
      )}

      <PrimaryButton onClick={handleSubmit} disabled={!canSubmit}>
        Zapisz feedback →
      </PrimaryButton>
    </div>
  )
}