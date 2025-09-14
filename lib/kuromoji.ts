"use client";

let tokenizerPromise: Promise<any> | null = null

export function getTokenizer(): Promise<any> {
  if (!tokenizerPromise) {
    tokenizerPromise = (async () => {
      const kuromoji: any = await import('kuromoji')
      return await new Promise((resolve, reject) => {
        kuromoji.builder({ dicPath: '/kuromoji/dict' }).build((err: any, tokenizer: any) => {
          if (err) return reject(err)
          resolve(tokenizer)
        })
      })
    })()
  }
  return tokenizerPromise
}
