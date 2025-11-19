// path: src/features/coach/screens/RestDayScreen.tsx

type RestDayScreenProps = {
    dayNumber: number
    totalDays: number
    onNext: () => void
  }
  
  export default function RestDayScreen({ dayNumber, totalDays, onNext }: RestDayScreenProps) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dzień odpoczynku</h1>
          <p className="text-sm text-gray-600">
            Dzień {dayNumber} / {totalDays}
          </p>
        </div>
  
        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
          <h3 className="text-base font-semibold text-blue-900 mb-3">
            Regeneracja jest kluczowa
          </h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            Dziś nie masz zaplanowanego treningu. To czas dla organizmu na regenerację
            i adaptację do obciążeń z poprzednich dni. Mięśnie rosną podczas odpoczynku,
            nie podczas treningu.
          </p>
        </div>
  
        {/* Recovery Activities */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            Opcjonalne aktywności
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Lekki spacer 20-30 min (low intensity)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Stretching lub yoga 15-20 min</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Foam rolling na napięte partie mięśniowe</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Sauna lub ciepła kąpiel (jeśli dostępne)</span>
            </li>
          </ul>
        </div>
  
        {/* Nutrition Reminder */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            Pamiętaj o odżywianiu
          </h3>
          <p className="text-sm text-gray-700">
            Nawet w dniu odpoczynku dostarczaj organizmowi wystarczającą ilość białka
            (1.6-2.2g/kg masy ciała) oraz kalorii do regeneracji.
          </p>
        </div>
  
        {/* Next Button */}
        <button
          onClick={onNext}
          className="w-full px-8 py-4 rounded-lg text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 transition"
        >
          Następny dzień →
        </button>
      </div>
    )
  }