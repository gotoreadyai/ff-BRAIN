// path: src/ui/components/Card.tsx

import { type ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-5 ${className}`}>
      {children}
    </div>
  )
}

type DarkCardProps = {
  children: ReactNode
  className?: string
}

export function DarkCard({ children, className = '' }: DarkCardProps) {
  return (
    <div className={`bg-gray-900 rounded-lg p-6 text-white ${className}`}>
      {children}
    </div>
  )
}

type AlertCardProps = {
  children: ReactNode
  variant: 'amber' | 'blue' | 'green'
}

export function AlertCard({ children, variant }: AlertCardProps) {
  const styles = {
    amber: 'bg-amber-50 border-amber-200',
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200'
  }
  
  return (
    <div className={`rounded-lg border p-4 ${styles[variant]}`}>
      {children}
    </div>
  )
}