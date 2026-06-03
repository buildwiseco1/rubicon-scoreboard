import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rubicon Scoreboard — Rubicon Intel',
  description: 'Public prediction tracking dashboard. The line has been crossed.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="bg-navy min-h-screen antialiased">{children}</body>
    </html>
  )
}
