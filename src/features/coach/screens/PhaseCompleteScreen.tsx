// path: src/features/coach/screens/PhaseCompleteScreen.tsx

import { Check } from 'lucide-react'
import { IconBadge, StatBox } from '../../../ui/components/Section'
import { PrimaryButton } from '../../../ui/components/Button'

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
        <IconBadge 
          icon={<Check className="w-12 h-12 text-white" strokeWidth={3} />}
          variant="green"
        />

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

        <div className="grid grid-cols-3 gap-4">
          <StatBox value="100%" label="Adherence" />
          <StatBox value="+5kg" label="Progresja" />
          <StatBox value="0" label="Kontuzje" />
        </div>

        <PrimaryButton onClick={onContinue}>
          Następna faza →
        </PrimaryButton>
      </div>
    </div>
  )
}