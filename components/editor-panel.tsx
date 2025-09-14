"use client";
import { HighlightedTextarea } from '@/components/highlighted-textarea'
import { useDraftStore } from '@/store/useDraftStore'
import { CountBar } from '@/components/count-bar'

export function EditorPanel() {
  const fullText = useDraftStore(s => s.fullText)
  const setFullText = useDraftStore(s => s.setFullText)
  const highlight = useDraftStore(s => s.highlightRange)

  return (
    <div className="flex flex-col gap-3">
      <CountBar past={''} present={''} future={''} singleText={fullText} />
      <div>
        <HighlightedTextarea placeholder="本文をそのまま貼り付け（800字目安）" value={fullText} onChange={e => setFullText(e.target.value)} highlightRange={highlight} />
      </div>
    </div>
  )
}
