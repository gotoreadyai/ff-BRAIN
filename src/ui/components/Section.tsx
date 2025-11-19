// path: src/ui/components/Section.tsx

import { type ReactNode } from 'react'

type SectionHeaderProps = {
  title: string
  subtitle?: string
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="text-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </div>
  )
}

type StatBoxProps = {
  value: string | number
  label: string
}

export function StatBox({ value, label }: StatBoxProps) {
  return (
    <div className="text-center p-3 bg-gray-50 rounded-lg">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  )
}

type ProgressBarProps = {
  current: number
  total: number
  label?: string
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100)
  
  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{label}</span>
          <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
        </div>
      )}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

type IconBadgeProps = {
  icon: ReactNode
  variant: 'dark' | 'amber' | 'blue' | 'green'
  size?: 'md' | 'lg'
}

export function IconBadge({ icon, variant, size = 'md' }: IconBadgeProps) {
  const sizeClass = size === 'lg' ? 'w-28 h-28' : 'w-20 h-20'
  
  const styles = {
    dark: 'bg-gray-900',
    amber: 'bg-amber-500',
    blue: 'bg-blue-600',
    green: 'bg-green-600'
  }
  
  return (
    <div className={`${sizeClass} mx-auto rounded-lg ${styles[variant]} flex items-center justify-center`}>
      {icon}
    </div>
  )
}