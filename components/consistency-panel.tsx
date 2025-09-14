"use client";
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDraftStore } from '@/store/useDraftStore'

export function ConsistencyPanel() {
  const analysis = useDraftStore(s => s.analysis)
  return (
    <div className="grid gap-3">
      <Card>
        <CardHeader>
          <h3 className="font-semibold">整合性チェック</h3>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {analysis?.inconsistencies.map((i, idx) => (
              <li key={idx} className="text-red-700">{i}</li>
            ))}
            {analysis && analysis.inconsistencies.length === 0 && (
              <li className="text-gray-600">主要な不整合は見つかりませんでした。</li>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="font-semibold">固有名詞 / 数値 抽出</h3>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analysis?.namedEntities.map((e, i) => (
              <Badge key={i}>{e}</Badge>
            ))}
            {analysis && analysis.namedEntities.length === 0 && (
              <span className="text-sm text-gray-600">検出なし</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

