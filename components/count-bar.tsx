"use client";
import { Progress } from '@/components/ui/progress'
import { useMemo } from 'react'

export function CountBar({ past, present, future, singleText }: { past: string, present: string, future: string, singleText?: string }) {
  const total = [...(singleText ?? (past + present + future)).replace(/\s/g, '')].length
  const targetMin = 760
  const targetMax = 840
  const inRange = total >= targetMin && total <= targetMax
  const warn = total > targetMax || total < targetMin
  const pct = Math.min(100, Math.round((total / targetMax) * 100))

  const segments = useMemo(() => [100, 0, 0], [])

  return (
    <div>
      <div className="flex items-center justify-between mb-1 text-sm">
        <span>文字数: <span className={warn ? 'text-red-600 font-semibold' : 'font-semibold'}>{total}</span> 字</span>
        <span className="text-gray-500">目標 760〜840 字</span>
      </div>
      <Progress value={pct} />
      
    </div>
  )
}
