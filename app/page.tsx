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
      <main className="max-w-6xl mx-auto p-4 md:p-6 grid gap-4">
        <header>
          <h1 className="sr-only">keio-sop-coach</h1>
          <p className="text-gray-600">慶應の派遣交換留学（学部生）志望動機書（約800字）を、①〜⑥の選考観点と「過去→現在→未来」構成で可視化・添削（ローカル処理/PWA）。</p>
        </header>

        <ThesisInput />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="space-y-3">
            <EditorPanel />
          </section>
          <aside className="space-y-3">
            <HeatmapPanel />
            <StylePanel />
            <ConsistencyPanel />
          </aside>
        </div>

        <ExportPreview />
      </main>
    </>
  )
}
