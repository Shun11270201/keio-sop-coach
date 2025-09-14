"use client";
import { create } from 'zustand'
import type { Analysis } from '@/domain/types'
import { analyzeAll } from '@/lib/analysis'

type State = {
  thesis: string
  fullText: string
  analysis: Analysis | null
  highlightRange: { start: number; end: number } | null
  loading: boolean
  gptLoading: boolean
  error?: string
}

type Actions = {
  setThesis: (v: string) => void
  setFullText: (v: string) => void
  runAnalysis: () => Promise<void>
  runGptAnalysis: () => Promise<void>
  setHighlight: (range: { start: number; end: number } | null) => void
  loadFromStorage: () => void
  saveToStorage: () => void
}

const STORAGE_KEY = 'keio-sop-coach/draft'

export const useDraftStore = create<State & Actions>((set, get) => ({
  thesis: '',
  fullText: '',
  analysis: null,
  highlightRange: null,
  loading: false,
  gptLoading: false,

  setThesis: (v) => set({ thesis: v }),
  setFullText: (v) => set({ fullText: v }),
  setHighlight: (range) => set({ highlightRange: range }),

  loadFromStorage: () => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const data = JSON.parse(raw)
      set({ thesis: data.thesis || '', fullText: data.fullText || '' })
    } catch {}
  },
  saveToStorage: () => {
    if (typeof window === 'undefined') return
    const { thesis, fullText } = get()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ thesis, fullText }))
  },

  runAnalysis: async () => {
    set({ loading: true })
    const { fullText } = get()
    const analysis = await analyzeAll({ body: fullText })
    set({ analysis, loading: false })
  },

  runGptAnalysis: async () => {
    const { fullText } = get()
    set({ gptLoading: true, error: undefined })
    try {
      const res = await fetch('/api/gpt-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: fullText })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed')
      // Map GPT evidences (text only) onto positions in the current body
      const body = fullText
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
      const current = get().analysis
      const merged = current ? { ...current, rubric: mappedRubric.length ? mappedRubric : current.rubric, inconsistencies: data.inconsistencies || current.inconsistencies } : { ...data, sentences: [], style: { politenessMixed: false, longSentenceIndices: [] }, structure: { pastChars: 0, presentChars: 0, futureChars: 0 }, charCount: body.length, kanjiRatio: 0, repetitionRate: 0 }
      set({ analysis: merged, gptLoading: false })
    } catch (e: any) {
      set({ gptLoading: false, error: e?.message || 'GPT 採点に失敗しました' })
    }
  }
}))
