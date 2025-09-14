"use client";
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useDraftStore } from '@/store/useDraftStore'

const FILLERS = ['とても', 'かなり', 'やはり', 'やっぱり', 'まず', '次に', 'そこで', '一方で', 'また', 'そして']

export function StylePanel() {
  const a = useDraftStore(s => s.analysis)
  const thesis = useDraftStore(s => s.thesis)
  const fullText = useDraftStore(s => s.fullText)
  const body = `${thesis ? thesis + '\n' : ''}${fullText}`
  const fillers = FILLERS.filter(f => body.includes(f))

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">スタイルチェック</h3>
      </CardHeader>
      <CardContent>
        <ul className="text-sm space-y-1">
          <li>敬体/常体の混在: <b className={a?.style.politenessMixed ? 'text-red-700' : 'text-gray-700'}>{a?.style.politenessMixed ? 'あり' : 'なし'}</b></li>
          <li>同語反復率: <b>{Math.round((a?.repetitionRate || 0) * 100)}%</b></li>
          <li>長文（60字超）: <b className={a && a.style.longSentenceIndices.length ? 'text-red-700' : ''}>{a?.style.longSentenceIndices.length || 0} 文</b></li>
          {a && a.style.longSentenceIndices.length > 0 && (
            <li className="text-xs text-gray-600">※ 長文は読点や接続詞で2文に分割を検討。</li>
          )}
          <li>冗長語の可能性: {fillers.length ? <span className="text-red-700">{fillers.join('、')}</span> : <span className="text-gray-700">特になし</span>}</li>
        </ul>
      </CardContent>
    </Card>
  )
}
