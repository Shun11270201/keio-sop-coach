"use client";
import { create } from 'zustand'
import type { Analysis } from '@/domain/types'
import { analyzeAll } from '@/lib/analysis'

type State = {
  mode: 'structured' | 'single'
  fullText: string
  thesis: string
  past: string
  present: string
  future: string
  analysis: Analysis | null
  highlightRange: { start: number; end: number } | null
  loading: boolean
  gptLoading: boolean
  error?: string
}

type Actions = {
  setThesis: (v: string) => void
  setMode: (v: 'structured' | 'single') => void
  setFullText: (v: string) => void
  setPast: (v: string) => void
  setPresent: (v: string) => void
  setFuture: (v: string) => void
  runAnalysis: () => Promise<void>
  runGptAnalysis: () => Promise<void>
  setHighlight: (range: { start: number; end: number } | null) => void
  loadFromStorage: () => void
  saveToStorage: () => void
}

const STORAGE_KEY = 'keio-sop-coach/draft'

export const useDraftStore = create<State & Actions>((set, get) => ({
  mode: 'structured',
  fullText: '',
  thesis: '',
  past: '',
  present: '',
  future: '',
  analysis: null,
  highlightRange: null,
  loading: false,
  gptLoading: false,

  setThesis: (v) => set({ thesis: v }),
  setMode: (v) => set({ mode: v }),
  setFullText: (v) => set({ fullText: v }),
  setPast: (v) => set({ past: v }),
  setPresent: (v) => set({ present: v }),
  setFuture: (v) => set({ future: v }),
  setHighlight: (range) => set({ highlightRange: range }),

  loadFromStorage: () => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const data = JSON.parse(raw)
      set({
        mode: data.mode || 'structured',
        fullText: data.fullText || '',
        thesis: data.thesis || '',
        past: data.past || '',
        present: data.present || '',
        future: data.future || ''
      })
    } catch {}
  },
  saveToStorage: () => {
    if (typeof window === 'undefined') return
    const { mode, fullText, thesis, past, present, future } = get()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, fullText, thesis, past, present, future }))
  },

  runAnalysis: async () => {
    set({ loading: true })
    const { mode, fullText, thesis, past, present, future } = get()
    const analysis = await analyzeAll(
      mode === 'single'
        ? { body: fullText }
        : { thesis, past, present, future }
    )
    set({ analysis, loading: false })
  }
  ,
  runGptAnalysis: async () => {
    const { mode, fullText, thesis, past, present, future } = get()
    set({ gptLoading: true, error: undefined })
    try {
      const res = await fetch('/api/gpt-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'single'
            ? { body: fullText }
            : { thesis, past, present, future }
        )
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed')
      // Map GPT evidences (text only) onto positions in the current body
      const body = mode === 'single'
        ? fullText
        : `${thesis}\n\n【過去】\n${past}\n\n【現在】\n${present}\n\n【未来】\n${future}`.trim()
      const used: number[] = []
      const mappedRubric = (data.rubric || []).map((r: any) => {
        const evidences = (r.evidences || []).flatMap((e: any) => {
          const text: string = e?.text || ''
          if (!text) return []
          let from = 0
          const out: any[] = []
          while (true) {
            const idx = body.indexOf(text, from)
            if (idx === -1) break
            from = idx + text.length
            if (!used.includes(idx)) {
              used.push(idx)
              out.push({ rubric: r.rubric as number, text, start: idx, end: idx + text.length, confidence: e?.confidence ?? 0.6 })
              break
            }
          }
          return out
        })
        return { rubric: r.rubric as number, score: r.score as 0|1|2|3|4, evidences }
      })
      // Merge rubric + inconsistencies into existing analysis
      const current = get().analysis
      const merged = current ? { ...current, rubric: mappedRubric.length ? mappedRubric : current.rubric, inconsistencies: data.inconsistencies || current.inconsistencies } : null
      set({ analysis: merged || current, gptLoading: false })
    } catch (e: any) {
      set({ gptLoading: false, error: e?.message || 'GPT 採点に失敗しました' })
    }
  }
}))
