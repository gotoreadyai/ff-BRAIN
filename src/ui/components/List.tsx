// path: src/ui/components/List.tsx

import { type ReactNode } from 'react'

type ListItemProps = {
  icon?: ReactNode
  children: ReactNode
}

export function ListItem({ icon, children }: ListItemProps) {
  return (
    <li className="flex items-start gap-2 text-sm text-gray-700">
      {icon || <span className="text-gray-400 mt-0.5">•</span>}
      <span>{children}</span>
    </li>
  )
}

type BadgeProps = {
  children: ReactNode
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 whitespace-nowrap">
      {children}
    </span>
  )
}

type NumberBadgeProps = {
  number: number
  variant?: 'dark' | 'light'
}

export function NumberBadge({ number, variant = 'dark' }: NumberBadgeProps) {
  const styles = variant === 'dark' 
    ? 'bg-gray-900 text-white'
    : 'bg-gray-200 text-gray-600'
    
  return (
    <div className={`w-7 h-7 rounded flex items-center justify-center text-xs font-semibold ${styles}`}>
      {number}
    </div>
  )
}