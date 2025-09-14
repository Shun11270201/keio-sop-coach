"use client";
import kuromoji from 'kuromoji'

let tokenizerPromise: Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>> | null = null

export function getTokenizer() {
  if (!tokenizerPromise) {
    tokenizerPromise = new Promise((resolve, reject) => {
      kuromoji.builder({ dicPath: '/kuromoji/dict' }).build((err, tokenizer) => {
        if (err) return reject(err)
        resolve(tokenizer)
      })
    })
  }
  return tokenizerPromise
}

