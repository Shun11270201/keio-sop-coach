"use client";
import { Button } from '@/components/ui/button'
import { useRef } from 'react'
import { useDraftStore } from '@/store/useDraftStore'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export function ExportBar() {
  const thesis = useDraftStore(s => s.thesis)
  const past = useDraftStore(s => s.past)
  const present = useDraftStore(s => s.present)
  const future = useDraftStore(s => s.future)
  const save = useDraftStore(s => s.saveToStorage)

  const combined = `${thesis}\n\n【過去】\n${past}\n\n【現在】\n${present}\n\n【未来】\n${future}`.trim()

  async function exportTxt() {
    const blob = new Blob([combined], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'sop_draft.txt'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  async function exportPdf() {
    const node = document.getElementById('exportArea')
    if (!node) return
    const canvas = await html2canvas(node, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height)
    const imgWidth = canvas.width * ratio
    const imgHeight = canvas.height * ratio
    pdf.addImage(imgData, 'PNG', (pageWidth - imgWidth)/2, 40, imgWidth, imgHeight)
    pdf.save('sop_draft.pdf')
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={save} variant="outline">ドラフト保存</Button>
      <Button onClick={exportTxt} variant="outline">.txt エクスポート</Button>
      <Button onClick={exportPdf}>.pdf エクスポート</Button>
    </div>
  )
}

export function ExportPreview() {
  const thesis = useDraftStore(s => s.thesis)
  const past = useDraftStore(s => s.past)
  const present = useDraftStore(s => s.present)
  const future = useDraftStore(s => s.future)
  return (
    <div id="exportArea" className="prose-like bg-white text-black p-8 rounded border border-gray-200">
      <h1 className="text-xl font-semibold mb-3">志望動機書（ドラフト）</h1>
      <p className="mb-4">{thesis}</p>
      <h2 className="font-semibold">【過去】</h2>
      <p className="mb-3 whitespace-pre-wrap">{past}</p>
      <h2 className="font-semibold">【現在】</h2>
      <p className="mb-3 whitespace-pre-wrap">{present}</p>
      <h2 className="font-semibold">【未来】</h2>
      <p className="whitespace-pre-wrap">{future}</p>
    </div>
  )
}

