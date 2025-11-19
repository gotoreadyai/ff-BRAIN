// path: src/ui/components/RatingScale.tsx

type RatingScaleProps = {
    title: string
    value: number | null
    onChange: (value: 1 | 2 | 3 | 4 | 5) => void
    lowLabel: string
    highLabel: string
  }
  
  export function RatingScale({ title, value, onChange, lowLabel, highLabel }: RatingScaleProps) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="grid grid-cols-5 gap-2">
          {([1, 2, 3, 4, 5] as const).map(num => (
            <button
              key={num}
              onClick={() => onChange(num)}
              className={`aspect-square rounded-lg text-base font-semibold transition ${
                value === num
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      </div>
    )
  }