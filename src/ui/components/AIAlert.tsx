// path: src/ui/components/AIAlert.tsx

import { Zap } from 'lucide-react'
import { AlertCard } from './Card'

type AIAlertProps = {
  children: React.ReactNode
  title?: string
}

export function AIAlert({ children, title = 'AI zmodyfikował plan' }: AIAlertProps) {
  return (
    <AlertCard variant="amber">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 mb-1">
            {title}
          </h3>
          <div className="text-sm text-amber-800 space-y-1">
            {children}
          </div>
        </div>
      </div>
    </AlertCard>
  )
}