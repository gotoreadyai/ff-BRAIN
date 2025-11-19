// path: src/features/coach/screens/ProgressionScreen.tsx

import { Award } from 'lucide-react'
import { IconBadge } from '../../../ui/components/Section'
import { PrimaryButton } from '../../../ui/components/Button'
import { AlertCard } from '../../../ui/components/Card'

type ProgressionScreenProps = {
  onContinue: () => void
}

export default function ProgressionScreen({ onContinue }: ProgressionScreenProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md space-y-8">
        <IconBadge 
          icon={<Award className="w-16 h-16 text-white" />}
          variant="amber"
          size="lg"
        />

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

        <div className="grid grid-cols-3 gap-3">
          <AlertCard variant="amber">
            <div className="text-2xl mb-1">💪</div>
            <div className="text-xs font-semibold text-amber-900">Siła</div>
          </AlertCard>
          <AlertCard variant="blue">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-xs font-semibold text-blue-900">Dyscyplina</div>
          </AlertCard>
          <AlertCard variant="green">
            <div className="text-2xl mb-1">🧠</div>
            <div className="text-xs font-semibold text-green-900">Adaptacja</div>
          </AlertCard>
        </div>

        <PrimaryButton onClick={onContinue}>
          Zacznij nowy program →
        </PrimaryButton>
      </div>
    </div>
  )
}