"use client";
import type { Analysis, RubricScore, Evidence, RubricId } from '@/domain/types'
import { getTokenizer } from './kuromoji'
import { normalizeCount, splitSentences, kanjiRatio, detectPolitenessMixed, findLongSentences, extractNamedEntities } from './text'

const RUBRIC_KEYWORDS: Record<RubricId, string[]> = {
  1: ['計画', '履修', 'シラバス', '期間', '単位', '時間割', 'スケジュール', 'タイムライン', '準備'],
  2: ['専門', '研究', '関心', '領域', '分野', 'テーマ', '卒論', '演習', '方法論'],
  3: ['私は', '背景', '経験', '動機', '価値観', '強み', '弱み', '挑戦', '学び'],
  4: ['主体', '自立', '協働', '協調', '積極', 'リーダー', '責任', '成熟', '社会', '貢献'],
  5: ['英語', 'TOEFL', 'IELTS', 'CEFR', 'スピーキング', 'リスニング', 'リーディング', 'ライティング', '語学', '日本語', 'フランス語', 'ドイツ語'],
  6: ['異文化', '多様', '文化', '適応', '海外', '交流', '留学先', '現地', '価値観の違い']
}

function findAllOccurrences(text: string, term: string): [number, number][] {
  const spans: [number, number][] = []
  let idx = 0
  while (true) {
    const found = text.indexOf(term, idx)
    if (found === -1) break
    spans.push([found, found + term.length])
    idx = found + term.length
  }
  return spans
}

function scoreFromCount(count: number): 0|1|2|3|4 {
  if (count >= 8) return 4
  if (count >= 5) return 3
  if (count >= 3) return 2
  if (count >= 1) return 1
  return 0
}

type AnalyzeParams =
  | { thesis: string, past: string, present: string, future: string }
  | { body: string }

export async function analyzeAll(params: AnalyzeParams): Promise<Analysis> {
  const body = 'body' in params
    ? params.body
    : `${params.thesis}\n\n【過去】\n${params.past}\n\n【現在】\n${params.present}\n\n【未来】\n${params.future}`.trim()

  const charCount = normalizeCount(body)
  const sentences = splitSentences(body)
  const kanjiR = kanjiRatio(body)
  const politenessMixed = detectPolitenessMixed(body)
  const longSentenceIndices = findLongSentences(sentences)

  // Token repetition using kuromoji
  let repetitionRate = 0
  try {
    const tokenizer = await getTokenizer()
    type SimpleToken = { pos: string; basic_form?: string; surface_form: string }
    const tokens = tokenizer.tokenize(body) as unknown as SimpleToken[]
    const words = tokens
      .filter((t: SimpleToken) => ['名詞', '動詞', '形容詞'].includes(t.pos))
      .map((t: SimpleToken) => (t.basic_form && t.basic_form !== '*' ? t.basic_form : t.surface_form))
    const total = words.length
    const freq = new Map<string, number>()
    words.forEach(w => freq.set(w, (freq.get(w) || 0) + 1))
    const repeated = Array.from(freq.values()).filter(n => n >= 2).reduce((a, b) => a + b, 0)
    repetitionRate = total ? repeated / total : 0
  } catch {
    repetitionRate = 0
  }

  // Structure counts
  // Structure: if explicit sections exist, measure; else approximate thirds
  let structure: { pastChars: number; presentChars: number; futureChars: number }
  const hasMarkers = body.includes('【過去】') && body.includes('【現在】') && body.includes('【未来】')
  if (hasMarkers) {
    const past = body.split('【過去】')[1]?.split('【現在】')[0] || ''
    const present = body.split('【現在】')[1]?.split('【未来】')[0] || ''
    const future = body.split('【未来】')[1] || ''
    structure = {
      pastChars: normalizeCount(past),
      presentChars: normalizeCount(present),
      futureChars: normalizeCount(future)
    }
  } else {
    const len = normalizeCount(body)
    structure = { pastChars: Math.round(len/3), presentChars: Math.round(len/3), futureChars: len - 2*Math.round(len/3) }
  }

  // Rubric scoring and evidences
  const rubric: RubricScore[] = (Object.keys(RUBRIC_KEYWORDS) as unknown as RubricId[]).map(r => {
    const kw = RUBRIC_KEYWORDS[r]
    const evs: Evidence[] = []
    let count = 0
    kw.forEach(k => {
      const spans = findAllOccurrences(body, k)
      count += spans.length
      spans.forEach(([start, end]) => evs.push({ rubric: r, text: body.slice(start, end), start, end, confidence: 0.6 }))
    })
    const score = scoreFromCount(count)
    return { rubric: r, score, evidences: evs }
  })

  // Inconsistencies: simple heuristics
  const inconsistencies: string[] = []
  const required = [
    { key: '目的', re: /(目的|志望動機)/ },
    { key: '計画', re: /(計画|履修|シラバス|期間|単位)/ },
    { key: '志望先', re: /(大学|学部|コース|留学先)/ },
    { key: '帰国後', re: /(帰国後|将来|キャリア|活用)/ },
  ]
  required.forEach(({ key, re }) => {
    if (!re.test(body)) inconsistencies.push(`${key}に関する具体的な記述が不足しています。`)
  })
  const years = Array.from(new Set((body.match(/20\d{2}年/g) || [])))
  if (years.length > 1) inconsistencies.push(`複数の年度が記述されています: ${years.join('、')}。文脈の整合性を確認してください。`)
  const scores = Array.from(new Set((body.match(/(TOEFL|IELTS)\s?\d{2,3}/g) || [])))
  if (scores.length > 1) inconsistencies.push(`語学スコアが複数表記されています: ${scores.join(' / ')}。最新・正確な数値に揃えてください。`)

  const namedEntities = extractNamedEntities(body)

  return {
    charCount,
    sentences,
    kanjiRatio: kanjiR,
    repetitionRate,
    style: { politenessMixed, longSentenceIndices },
    structure,
    rubric,
    inconsistencies,
    namedEntities
  }
}
