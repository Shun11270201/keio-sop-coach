import * as React from 'react'
import { clsx } from 'clsx'

export function Card({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={clsx('rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md', className)}>{children}</div>
}
export function CardHeader({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={clsx('p-6 border-b border-border', className)}>{children}</div>
}
export function CardContent({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={clsx('p-6', className)}>{children}</div>
}
