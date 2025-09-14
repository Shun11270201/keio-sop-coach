"use client";
import { Input } from '@/components/ui/input'
import { useDraftStore } from '@/store/useDraftStore'

export function ThesisInput() {
  const thesis = useDraftStore(s => s.thesis)
  const setThesis = useDraftStore(s => s.setThesis)
  return (
    <div>
      <label className="text-sm font-medium block mb-1">テーゼ（主張）1文（必須）</label>
      <Input placeholder="例：◯◯分野の研究深化と現地協働を通じ、帰国後に〜に貢献したい。" value={thesis} onChange={e => setThesis(e.target.value)} />
      <p className="text-xs text-gray-500 mt-1">面接官が一読で意図を掴める1文に。</p>
    </div>
  )
}

