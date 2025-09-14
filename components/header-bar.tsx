"use client";
import { useDraftStore } from '@/store/useDraftStore'
import { Button } from '@/components/ui/button'
import { ExportBar } from '@/components/export-bar'
import { Sparkles } from 'lucide-react'

export function HeaderBar() {
  const mode = useDraftStore(s => s.mode)
  const setMode = useDraftStore(s => s.setMode)
  const run = useDraftStore(s => s.runAnalysis)
  const runGpt = useDraftStore(s => s.runGptAnalysis)
  const gptLoading = useDraftStore(s => s.gptLoading)
  const save = useDraftStore(s => s.saveToStorage)

  return (
    <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gray-800" />
          <div>
            <div className="font-bold leading-tight">keio-sop-coach</div>
            <div className="text-xs text-gray-600">慶應・派遣交換留学 志望動機書 可視化/採点</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm text-gray-600">入力モード</span>
          <button className={`h-8 px-3 rounded ${mode==='structured'?'bg-gray-900 text-white':'bg-gray-100'}`} onClick={()=>setMode('structured')}>分割</button>
          <button className={`h-8 px-3 rounded ${mode==='single'?'bg-gray-900 text-white':'bg-gray-100'}`} onClick={()=>setMode('single')}>一括</button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <Button variant="outline" size="sm" onClick={run}>再分析</Button>
          <Button size="sm" onClick={runGpt} disabled={gptLoading}>{gptLoading ? 'GPT採点中…' : 'GPT採点'}</Button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <Button variant="outline" size="sm" onClick={save}>保存</Button>
        </div>
      </div>
    </div>
  )
}

