import './globals.css'
import type { Metadata } from 'next'
import { PWARegister } from '@/components/pwa-register'

export const metadata: Metadata = {
  title: 'keio-sop-coach',
  description: '慶應の派遣交換留学（学部生）志望動機書をローカルで分析・可視化するPWA',
  manifest: '/manifest.webmanifest',
  icons: [
    { rel: 'icon', url: '/icons/icon-192.png' },
    { rel: 'apple-touch-icon', url: '/icons/icon-192.png' }
  ]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <PWARegister />
        {children}
      </body>
    </html>
  )
}

