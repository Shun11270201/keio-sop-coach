import http from 'node:http'
import { createReadStream, statSync, existsSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'

const root = resolve('out')
const port = process.env.PORT ? Number(process.env.PORT) : 8080
const host = process.env.HOST || '0.0.0.0'

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8'
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`)
  let filePath = join(root, decodeURIComponent(url.pathname))
  try {
    const stat = statSync(filePath)
    if (stat.isDirectory()) filePath = join(filePath, 'index.html')
  } catch {}
  if (!existsSync(filePath)) {
    // SPA fallback to index.html
    filePath = join(root, 'index.html')
  }
  const ext = extname(filePath)
  res.setHeader('Content-Type', types[ext] || 'application/octet-stream')
  createReadStream(filePath).pipe(res)
})

server.listen(port, host, () => {
  console.log(`Serving ./out at http://${host}:${port}`)
})

