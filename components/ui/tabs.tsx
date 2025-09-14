"use client";
import * as React from 'react'

type TabsContextType = { value: string, setValue: (v: string) => void }
const TabsContext = React.createContext<TabsContextType | null>(null)

export function Tabs({ defaultValue, value, onValueChange, children }: { defaultValue?: string, value?: string, onValueChange?: (v: string) => void, children: React.ReactNode }) {
  const [internal, setInternal] = React.useState(value ?? defaultValue ?? '')
  const val = value ?? internal
  const setValue = (v: string) => {
    setInternal(v)
    onValueChange?.(v)
  }
  return <TabsContext.Provider value={{ value: val, setValue }}>{children}</TabsContext.Provider>
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="inline-flex items-center gap-1 rounded-md border border-gray-200 p-1 bg-white">{children}</div>
}

export function TabsTrigger({ value, children }: { value: string, children: React.ReactNode }) {
  const ctx = React.useContext(TabsContext)!
  const selected = ctx.value === value
  return (
    <button onClick={() => ctx.setValue(value)} className={`h-8 px-3 rounded-sm text-sm ${selected ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}>{children}</button>
  )
}

export function TabsContent({ value, children }: { value: string, children: React.ReactNode }) {
  const ctx = React.useContext(TabsContext)!
  if (ctx.value !== value) return null
  return <div className="mt-3">{children}</div>
}

