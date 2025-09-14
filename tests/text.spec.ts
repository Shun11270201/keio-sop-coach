import { describe, it, expect } from 'vitest'
import { normalizeCount, splitSentences, kanjiRatio, detectPolitenessMixed, findLongSentences } from '@/lib/text'

describe('text utils', () => {
  it('counts chars ignoring whitespace', () => {
    expect(normalizeCount('あい う\nえお')).toBe(5)
  })

  it('splits sentences by punctuation', () => {
    expect(splitSentences('今日は晴れ。明日も晴れ？')).toEqual(['今日は晴れ。', '明日も晴れ？'])
  })

  it('kanji ratio detects Han chars', () => {
    expect(kanjiRatio('漢字かな')).toBeCloseTo(2/4, 3)
  })

  it('politeness mixing detection', () => {
    expect(detectPolitenessMixed('私は勉強します。研究だ。')).toBe(true)
  })

  it('find long sentences > 60', () => {
    const long = 'あ'.repeat(61)
    expect(findLongSentences([long])).toEqual([0])
  })
})

