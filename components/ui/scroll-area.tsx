import * as React from 'react'

export function ScrollArea({ className, children, style }: { className?: string, children: React.ReactNode, style?: React.CSSProperties }) {
  return (
    <div className={`overflow-auto thin-scrollbar ${className ?? ''}`} style={style}>{children}</div>
  )
}

