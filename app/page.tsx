"use client";
import { useEffect } from 'react'
import { ThesisInput } from '@/components/thesis-input'
import { EditorPanel } from '@/components/editor-panel'
import { HeatmapPanel } from '@/components/heatmap-panel'
import { ConsistencyPanel } from '@/components/consistency-panel'
import { StylePanel } from '@/components/style-panel'
import { ExportPreview } from '@/components/export-bar'
import { useDraftStore } from '@/store/useDraftStore'
import { HeaderBar } from '@/components/header-bar'

export default function Page() {
  const load = useDraftStore(s => s.loadFromStorage)
  useEffect(() => { load() }, [load])

  return (
    <>
      <HeaderBar />
      <main className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        <header className="text-center max-w-4xl mx-auto">
          <h1 className="sr-only">keio-sop-coach</h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10 mb-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-primary">ローカル処理・PWA対応</span>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            慶應の派遣交換留学（学部生）志望動機書（約800字）を、<br className="hidden sm:block" />
            <span className="font-medium text-foreground">①〜⑥の選考観点</span>と<span className="font-medium text-foreground">「過去→現在→未来」構成</span>で可視化・添削
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <ThesisInput />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-6">
            <EditorPanel />
          </section>
          <aside className="space-y-6">
            <HeatmapPanel />
            <StylePanel />
            <ConsistencyPanel />
          </aside>
        </div>

        <div className="max-w-4xl mx-auto">
          <ExportPreview />
        </div>
      </main>
    </>
  )
}
