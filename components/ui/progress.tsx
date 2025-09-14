import * as React from 'react'

export function Progress({ value, className }: { value: number, className?: string }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className={`h-2 w-full rounded bg-gray-200 ${className ?? ''}`}>
      <div className="h-2 rounded bg-gray-900" style={{ width: `${v}%` }} />
    </div>
  )
}

