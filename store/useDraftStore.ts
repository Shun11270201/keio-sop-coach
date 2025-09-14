"use client";
import { create } from 'zustand'
import type { Analysis } from '@/domain/types'
import { analyzeAll } from '@/lib/analysis'

type State = {
  thesis: string
  past: string
  present: string
  future: string
  analysis: Analysis | null
  highlightRange: { start: number; end: number } | null
  loading: boolean
}

type Actions = {
  setThesis: (v: string) => void
  setPast: (v: string) => void
  setPresent: (v: string) => void
  setFuture: (v: string) => void
  runAnalysis: () => Promise<void>
  setHighlight: (range: { start: number; end: number } | null) => void
  loadFromStorage: () => void
  saveToStorage: () => void
}

const STORAGE_KEY = 'keio-sop-coach/draft'

export const useDraftStore = create<State & Actions>((set, get) => ({
  thesis: '',
  past: '',
  present: '',
  future: '',
  analysis: null,
  highlightRange: null,
  loading: false,

  setThesis: (v) => set({ thesis: v }),
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
      set({ thesis: data.thesis || '', past: data.past || '', present: data.present || '', future: data.future || '' })
    } catch {}
  },
  saveToStorage: () => {
    if (typeof window === 'undefined') return
    const { thesis, past, present, future } = get()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ thesis, past, present, future }))
  },

  runAnalysis: async () => {
    set({ loading: true })
    const { thesis, past, present, future } = get()
    const analysis = await analyzeAll({ thesis, past, present, future })
    set({ analysis, loading: false })
  }
}))

