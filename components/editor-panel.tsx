"use client";
import { HighlightedTextarea } from '@/components/highlighted-textarea'
import { useDraftStore } from '@/store/useDraftStore'
import { CountBar } from '@/components/count-bar'

export function EditorPanel() {
  const fullText = useDraftStore(s => s.fullText)
  const setFullText = useDraftStore(s => s.setFullText)
  const highlight = useDraftStore(s => s.highlightRange)

  // Map global highlight range to each section
  function mapRange(section: 'past' | 'present' | 'future') {
    if (!highlight) return null
    const thesis = useDraftStore.getState().thesis
    const body = `${thesis}\n\n【過去】\n${past}\n\n【現在】\n${present}\n\n【未来】\n${future}`.trim()
    const pastStart = body.indexOf('【過去】\n') + '【過去】\n'.length
    const presentStart = body.indexOf('【現在】\n') + '【現在】\n'.length
    const futureStart = body.indexOf('【未来】\n') + '【未来】\n'.length
    const pastEnd = body.indexOf('\n\n【現在】')
    const presentEnd = body.indexOf('\n\n【未来】')
    const futureEnd = body.length

    const ranges = {
      past: [pastStart, pastEnd],
      present: [presentStart, presentEnd],
      future: [futureStart, futureEnd],
    } as const
    const [s, e] = ranges[section]
    if (highlight.start >= s && highlight.end <= e) {
      return { start: highlight.start - s, end: highlight.end - s }
    }
    return null
  }

  return (
    <div className="flex flex-col gap-3">
      <CountBar past={''} present={''} future={''} singleText={fullText} />
      <div>
        <HighlightedTextarea placeholder="本文をそのまま貼り付け（800字目安）" value={fullText} onChange={e => setFullText(e.target.value)} highlightRange={highlight} />
      </div>
    </div>
  )
}
