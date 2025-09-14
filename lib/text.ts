export function normalizeCount(text: string): number {
  // Count all code points as 1; normalize newlines/spaces
  return [...text.replace(/\s/g, '')].length
}

export function splitSentences(text: string): string[] {
  const parts = text
    .replace(/\r\n/g, '\n')
    .split(/(?<=[。！？!\?])\s*|\n+/)
    .map(s => s.trim())
    .filter(Boolean)
  return parts
}

export function kanjiRatio(text: string): number {
  const chars = [...text]
  if (chars.length === 0) return 0
  const kanji = chars.filter(c => /[\p{Script=Han}]/u.test(c)).length
  return kanji / chars.length
}

export function detectPolitenessMixed(text: string): boolean {
  const polite = /(です|ます|でした|ました|でしょう|ください)/g.test(text)
  const plain = /(だ|である|だった)(?![\p{Script=Hiragana}])/u.test(text) || /(?<![文用])だ。/.test(text)
  return polite && plain
}

export function findLongSentences(sentences: string[], threshold = 60): number[] {
  const idx: number[] = []
  sentences.forEach((s, i) => {
    if ([...s].length > threshold) idx.push(i)
  })
  return idx
}

export function extractNamedEntities(text: string): string[] {
  const entities = new Set<string>()
  // Simple patterns: Kanji sequences, Katakana sequences, alphanum with units
  const patterns = [
    /[\p{Script=Han}]{2,}/gu,
    /[\p{Script=Katakana}ー]{2,}/gu,
    /\b\d{1,4}(年|月|日|点|単位|人|校)\b/g,
    /\b(TOEFL|IELTS|CEFR|GPA)\b/gi
  ]
  patterns.forEach(re => {
    text.match(re)?.forEach(t => entities.add(t))
  })
  return Array.from(entities)
}

