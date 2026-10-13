import React from 'react'

interface BadgeProps {
  variant?: 'primary' | 'accent' | 'success' | 'danger' | 'warning' | 'neutral'
  children: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children }) => {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-900 border-blue-300',
    accent: 'bg-amber-100 text-amber-900 border-amber-300',
    success: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    danger: 'bg-rose-100 text-rose-900 border-rose-300',
    warning: 'bg-amber-100 text-amber-900 border-amber-300',
    neutral: 'bg-slate-100 text-slate-800 border-slate-300',
  }[variant]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantClasses}`}
    >
      {children}
    </span>
  )
}
