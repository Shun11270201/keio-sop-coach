import * as React from 'react'

export function ScoreIndicator({ score }: { score: 0|1|2|3|4 }) {
  const cells = [0,1,2,3]
  const color = (i: number) => i < score ? 'bg-green-500' : 'bg-gray-200'
  return (
    <div className="flex items-center gap-1" aria-label={`score ${score}/4`}>
      {cells.map((i) => (
        <div key={i} className={`h-2.5 w-6 rounded ${color(i)}`} />
      ))}
    </div>
  )
}

