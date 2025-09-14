"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HighlightedTextarea } from '@/components/highlighted-textarea'
import { useDraftStore } from '@/store/useDraftStore'
import { CountBar } from '@/components/count-bar'
import { Input } from '@/components/ui/input'

export function EditorPanel() {
  const mode = useDraftStore(s => s.mode)
  const setMode = useDraftStore(s => s.setMode)
  const fullText = useDraftStore(s => s.fullText)
  const setFullText = useDraftStore(s => s.setFullText)
  const past = useDraftStore(s => s.past)
  const present = useDraftStore(s => s.present)
  const future = useDraftStore(s => s.future)
  const setPast = useDraftStore(s => s.setPast)
  const setPresent = useDraftStore(s => s.setPresent)
  const setFuture = useDraftStore(s => s.setFuture)
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
      {mode === 'single' ? (
        <CountBar past={''} present={''} future={''} singleText={fullText} />
      ) : (
        <CountBar past={past} present={present} future={future} />
      )}
      <div className="flex items-center gap-2 text-sm">
        <label className="font-medium">入力モード:</label>
        <button className={`h-8 px-3 rounded ${mode==='structured'?'bg-gray-900 text-white':'bg-gray-100'}`} onClick={()=>setMode('structured')}>分割</button>
        <button className={`h-8 px-3 rounded ${mode==='single'?'bg-gray-900 text-white':'bg-gray-100'}`} onClick={()=>setMode('single')}>一括</button>
      </div>
      {mode === 'single' ? (
        <div>
          <HighlightedTextarea placeholder="本文をそのまま貼り付け（800字目安）" value={fullText} onChange={e => setFullText(e.target.value)} highlightRange={highlight} />
        </div>
      ) : (
      <Tabs defaultValue="past">
        <TabsList>
          <TabsTrigger value="past">過去（目安260）</TabsTrigger>
          <TabsTrigger value="present">現在（目安280）</TabsTrigger>
          <TabsTrigger value="future">未来（目安260）</TabsTrigger>
        </TabsList>
        <TabsContent value="past">
          <HighlightedTextarea placeholder="過去：背景・経験・動機の源泉。" value={past} onChange={e => setPast(e.target.value)} highlightRange={mapRange('past')} />
        </TabsContent>
        <TabsContent value="present">
          <HighlightedTextarea placeholder="現在：専門性・計画の具体、準備状況。" value={present} onChange={e => setPresent(e.target.value)} highlightRange={mapRange('present')} />
        </TabsContent>
        <TabsContent value="future">
          <HighlightedTextarea placeholder="未来：留学の活用、帰国後の展望と因果。" value={future} onChange={e => setFuture(e.target.value)} highlightRange={mapRange('future')} />
        </TabsContent>
      </Tabs>
      )}
    </div>
  )
}
