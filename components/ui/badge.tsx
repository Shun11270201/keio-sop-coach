import * as React from 'react'
import { clsx } from 'clsx'

export function Badge({ children, variant = 'secondary' as 'secondary' | 'outline', className }: { children: React.ReactNode, variant?: 'secondary' | 'outline', className?: string }) {
  const styles = variant === 'secondary' ? 'bg-gray-100 text-gray-800' : 'border border-gray-300'
  return <span className={clsx('inline-flex items-center rounded px-2 py-0.5 text-xs', styles, className)}>{children}</span>
}

