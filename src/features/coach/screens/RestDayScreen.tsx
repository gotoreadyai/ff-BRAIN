// path: src/features/coach/screens/RestDayScreen.tsx

import { Smile } from 'lucide-react'
import { IconBadge } from '../../../ui/components/Section'
import { AlertCard, Card } from '../../../ui/components/Card'
import { ListItem } from '../../../ui/components/List'
import { PrimaryButton } from '../../../ui/components/Button'

type RestDayScreenProps = {
  dayNumber: number
  totalDays: number
  onNext: () => void
}

export default function RestDayScreen({ dayNumber, totalDays, onNext }: RestDayScreenProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <IconBadge 
          icon={<Smile className="w-10 h-10 text-white" />}
          variant="blue"
        />
        <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-2">Dzień odpoczynku</h1>
        <p className="text-sm text-gray-600">
          Dzień {dayNumber} / {totalDays}
        </p>
      </div>

      <AlertCard variant="blue">
        <h3 className="text-base font-semibold text-blue-900 mb-3">
          Regeneracja jest kluczowa
        </h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          Dziś nie masz zaplanowanego treningu. To czas dla organizmu na regenerację
          i adaptację do obciążeń z poprzednich dni. Mięśnie rosną podczas odpoczynku,
          nie podczas treningu.
        </p>
      </AlertCard>

      <Card>
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Opcjonalne aktywności
        </h3>
        <ul className="space-y-2">
          <ListItem>Lekki spacer 20-30 min (low intensity)</ListItem>
          <ListItem>Stretching lub yoga 15-20 min</ListItem>
          <ListItem>Foam rolling na napięte partie mięśniowe</ListItem>
          <ListItem>Sauna lub ciepła kąpiel (jeśli dostępne)</ListItem>
        </ul>
      </Card>

      <Card className="bg-gray-50 border-gray-200">
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          Pamiętaj o odżywianiu
        </h3>
        <p className="text-sm text-gray-700">
          Nawet w dniu odpoczynku dostarczaj organizmowi wystarczającą ilość białka
          (1.6-2.2g/kg masy ciała) oraz kalorii do regeneracji.
        </p>
      </Card>

      <PrimaryButton onClick={onNext}>
        Następny dzień →
      </PrimaryButton>
    </div>
  )
}