"use client";
import * as React from 'react'
import { Textarea } from '@/components/ui/textarea'

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  highlightRange?: { start: number; end: number } | null
}

export function HighlightedTextarea({ highlightRange, ...props }: Props) {
  const ref = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    const ta = ref.current
    if (!ta || !highlightRange) return
    const { start, end } = highlightRange
    try {
      ta.focus()
      ta.setSelectionRange(start, end)
    } catch {}
  }, [highlightRange])

  return <Textarea ref={ref} {...props} />
}

