"use client";
import { useDraftStore } from '@/store/useDraftStore'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export function HeaderBar() {
  const run = useDraftStore(s => s.runAnalysis)
  const runGpt = useDraftStore(s => s.runGptAnalysis)
  const gptLoading = useDraftStore(s => s.gptLoading)
  const save = useDraftStore(s => s.saveToStorage)

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-lg supports-[backdrop-filter]:bg-card/80 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="text-xl font-bold text-foreground">keio-sop-coach</div>
            <div className="text-sm text-muted-foreground">慶應・派遣交換留学 志望動機書 可視化/採点</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={run} className="font-medium">
              再分析
            </Button>
            <Button size="sm" onClick={runGpt} disabled={gptLoading} className="font-medium">
              {gptLoading ? 'GPT採点中…' : 'GPT採点'}
            </Button>
            <div className="w-px h-6 bg-border mx-2" />
            <Button variant="outline" size="sm" onClick={save} className="font-medium">
              保存
            </Button>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={run}>
              🔄
            </Button>
            <Button variant="ghost" size="sm" onClick={runGpt} disabled={gptLoading}>
              {gptLoading ? '⏳' : '🤖'}
            </Button>
            <Button variant="ghost" size="sm" onClick={save}>
              💾
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
