// path: src/ui/components/Button.tsx

import { type ReactNode } from 'react'

type ButtonProps = {
  onClick: () => void
  children: ReactNode
  disabled?: boolean
  className?: string
}

export function PrimaryButton({ onClick, children, disabled, className = '' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full px-8 py-4 rounded-lg text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ onClick, children, className = '' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition ${className}`}
    >
      {children}
    </button>
  )
}

export function WarningButton({ onClick, children, className = '' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-6 py-3 rounded-lg text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition ${className}`}
    >
      {children}
    </button>
  )
}

export function SmallButton({ onClick, children, className = '' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition ${className}`}
    >
      {children}
    </button>
  )
}