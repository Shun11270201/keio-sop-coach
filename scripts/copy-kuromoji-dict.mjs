import { cp } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const src = resolve('node_modules/kuromoji/dict')
const dest = resolve('public/kuromoji/dict')

if (!existsSync(src)) {
  console.warn('[kuromoji] dict not found in node_modules. Install deps first.')
  process.exit(0)
}

await cp(src, dest, { recursive: true })
console.log('[kuromoji] dict copied to public/kuromoji/dict')

