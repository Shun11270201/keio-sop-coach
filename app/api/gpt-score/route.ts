import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'nodejs'

type RubricId = 1|2|3|4|5|6

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY is not set' }, { status: 400 })
  }
  const body = await req.json().catch(() => null as any)
  if (!body || typeof body.thesis !== 'string') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { thesis, past, present, future } = body as { thesis: string, past: string, present: string, future: string }
  const full = `${thesis}\n\n【過去】\n${past}\n\n【現在】\n${present}\n\n【未来】\n${future}`.trim()

  const client = new OpenAI({ apiKey })

  const system = `あなたは選考委員の立場で、日本語の志望動機書（約800字）を次の6観点で評価します。代筆・書き換えは一切せず、現作文の分析のみ行います。

観点①〜⑥（各0〜4点）:
1 留学計画（履修/期間/単位/準備など具体性）
2 専門性（分野/研究テーマ/方法論の整合）
3 自己表現（動機の根拠や学びの内省）
4 自立心/成熟度/社会性/積極性/協調性（主体性・責任・協働）
5 語学（使用言語・4技能の裏付け）
6 異文化適応（多様性理解・現地適応の視点）

出力要件:
- JSONのみ。各観点のscoreと、本文からの短い根拠抜粋（text）を返す。
- 書き換え・新規提案はせず、既存本文の抜粋のみ。
- inconsistenciesには論理の抜け・因果の断絶・数値や年度の重複/矛盾を簡潔に列挙。`

  const user = `本文:\n${full}\n\n出力フォーマット(JSON):\n{\n  "rubric": [\n    { "rubric": 1, "score": 0, "evidences": [{ "text": "...", "confidence": 0.6 }] },\n    { "rubric": 2, "score": 0, "evidences": [{ "text": "...", "confidence": 0.6 }] },\n    { "rubric": 3, "score": 0, "evidences": [{ "text": "...", "confidence": 0.6 }] },\n    { "rubric": 4, "score": 0, "evidences": [{ "text": "...", "confidence": 0.6 }] },\n    { "rubric": 5, "score": 0, "evidences": [{ "text": "...", "confidence": 0.6 }] },\n    { "rubric": 6, "score": 0, "evidences": [{ "text": "...", "confidence": 0.6 }] }\n  ],\n  "inconsistencies": ["..."]\n}`

  try {
    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
    const content = resp.choices?.[0]?.message?.content || '{}'
    const data = JSON.parse(content)
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'OpenAI error' }, { status: 500 })
  }
}

