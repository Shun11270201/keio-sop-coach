"use client";
import { Input } from '@/components/ui/input'
import { useDraftStore } from '@/store/useDraftStore'

export function ThesisInput() {
  const thesis = useDraftStore(s => s.thesis)
  const setThesis = useDraftStore(s => s.setThesis)
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-6 bg-primary rounded-full"></div>
        <label className="text-base font-semibold text-foreground">テーゼ（主張）1文</label>
        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">必須</span>
      </div>
      <Input
        placeholder="例：◯◯分野の研究深化と現地協働を通じ、帰国後に〜に貢献したい。"
        value={thesis}
        onChange={e => setThesis(e.target.value)}
        className="h-12 text-base"
      />
      <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
        💡 面接官が一読で意図を掴める1文に。
      </p>
    </div>
  )
}

