import * as React from 'react'
import { clsx } from 'clsx'

export function Card({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={clsx('rounded-lg border border-gray-200 bg-white', className)}>{children}</div>
}
export function CardHeader({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={clsx('p-4 border-b border-gray-100', className)}>{children}</div>
}
export function CardContent({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={clsx('p-4', className)}>{children}</div>
}

