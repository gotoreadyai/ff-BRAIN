// path: src/features/coach/screens/PhaseIntroScreen.tsx

import { ArrowRight } from 'lucide-react'
import { IconBadge } from '../../../ui/components/Section'
import { PrimaryButton } from '../../../ui/components/Button'

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
        <IconBadge 
          icon={<ArrowRight className="w-10 h-10 text-white" />}
          variant="dark"
        />

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

        <PrimaryButton onClick={onAutoAdvance}>
          Rozpocznij fazę →
        </PrimaryButton>
      </div>
    </div>
  )
}