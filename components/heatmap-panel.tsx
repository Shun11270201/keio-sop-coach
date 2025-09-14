"use client";
import { useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useDraftStore } from '@/store/useDraftStore'
import type { RubricId } from '@/domain/types'
import { Flame } from 'lucide-react'

const RUBRIC_LABEL: Record<RubricId, string> = {
  1: '留学計画',
  2: '専門性',
  3: '自己表現',
  4: '自立心/成熟度/社会性/積極性/協調性',
  5: '語学（4技能）',
  6: '異文化適応',
}

function colorForScore(score: 0|1|2|3|4) {
  return ['bg-gray-100', 'bg-red-200', 'bg-yellow-200', 'bg-green-200', 'bg-green-400'][score]
}

export function HeatmapPanel() {
  const analysis = useDraftStore(s => s.analysis)
  const run = useDraftStore(s => s.runAnalysis)
  const setHighlight = useDraftStore(s => s.setHighlight)
  const thesis = useDraftStore(s => s.thesis)
  const past = useDraftStore(s => s.past)
  const present = useDraftStore(s => s.present)
  const future = useDraftStore(s => s.future)

  useEffect(() => {
    // Auto-analyze after small delay
    const id = setTimeout(() => { run() }, 300)
    return () => clearTimeout(id)
  }, [thesis, past, present, future, run])

  return (
    <div className="grid gap-3">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2"><Flame className="w-4 h-4" />①〜⑥ 選考観点ヒートマップ</h3>
            <Button size="sm" onClick={run}>再分析</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {analysis?.rubric.map(r => (
              <div key={r.rubric} className="flex items-center gap-2">
                <div className={`w-2 h-6 rounded ${colorForScore(r.score)} mr-2`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{r.rubric}．{RUBRIC_LABEL[r.rubric]}</span>
                    <Badge variant="secondary">{r.score}/4</Badge>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">根拠: {r.evidences.length} 件</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-semibold">根拠スパン一覧（クリックでハイライト）</h3>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-64">
            <ul className="text-sm space-y-2">
              {analysis?.rubric.flatMap(r => r.evidences.map(e => ({ ...e, label: RUBRIC_LABEL[r.rubric] }))).map((e, i) => (
                <li key={i}>
                  <button className="text-left hover:bg-gray-100 rounded px-2 py-1 w-full" onClick={() => setHighlight({ start: e.start, end: e.end })}>
                    <span className="text-xs text-gray-500 mr-2">{e.rubric} {RUBRIC_LABEL[e.rubric as RubricId]}</span>
                    <span>{e.text}</span>
                  </button>
                </li>
              ))}
              {analysis && analysis.rubric.every(r => r.evidences.length === 0) && (
                <li className="text-gray-500">検出された根拠はありません。</li>
              )}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
