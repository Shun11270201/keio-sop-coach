"use client";
import { Progress } from '@/components/ui/progress'
import { useMemo } from 'react'

export function CountBar({ past, present, future, singleText }: { past: string, present: string, future: string, singleText?: string }) {
  const total = singleText !== undefined
    ? [...(singleText).replace(/\s/g, '')].length
    : [...(past + present + future).replace(/\s/g, '')].length
  const targetMin = 760
  const targetMax = 840
  const inRange = total >= targetMin && total <= targetMax
  const warn = total > targetMax || total < targetMin
  const pct = Math.min(100, Math.round((total / targetMax) * 100))

  const segments = useMemo(() => {
    if (singleText !== undefined) return [100, 0, 0]
    const p = [...past.replace(/\s/g, '')].length
    const c = [...present.replace(/\s/g, '')].length
    const f = [...future.replace(/\s/g, '')].length
    const sum = p + c + f || 1
    return [Math.round((p/sum)*100), Math.round((c/sum)*100), 100 - Math.round((p/sum)*100) - Math.round((c/sum)*100)]
  }, [past, present, future, singleText])

  return (
    <div>
      <div className="flex items-center justify-between mb-1 text-sm">
        <span>文字数: <span className={warn ? 'text-red-600 font-semibold' : 'font-semibold'}>{total}</span> 字</span>
        <span className="text-gray-500">目標 760〜840 字</span>
      </div>
      <Progress value={pct} />
      {singleText === undefined ? (
        <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
          <span>過去 {segments[0]}%</span>
          <span>現在 {segments[1]}%</span>
          <span>未来 {segments[2]}%</span>
        </div>
      ) : null}
    </div>
  )
}
