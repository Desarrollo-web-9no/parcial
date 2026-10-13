import React from 'react'

interface BadgeProps {
  variant?: 'primary' | 'accent' | 'success' | 'danger' | 'warning' | 'neutral'
  children: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children }) => {
  const variantClasses = {
    primary: 'bg-gray-100 text-gray-900 border-gray-300',
    accent: 'bg-gray-100 text-gray-900 border-gray-300',
    success: 'bg-gray-100 text-gray-900 border-gray-300',
    danger: 'bg-gray-100 text-gray-900 border-gray-300',
    warning: 'bg-gray-100 text-gray-900 border-gray-300',
    neutral: 'bg-gray-100 text-gray-800 border-gray-300',
  }[variant]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantClasses}`}
    >
      {children}
    </span>
  )
}
