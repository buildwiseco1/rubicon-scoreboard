'use client'

import { useEffect, useState } from 'react'
import { Prices } from '@/lib/types'

interface Props {
  initialPrices: Prices
}

function formatGold(v: number | null) {
  if (v === null) return 'N/A'
  return `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatOil(v: number | null) {
  if (v === null) return 'N/A'
  return `$${v.toFixed(2)}`
}

function formatDxy(v: number | null) {
  if (v === null) return 'N/A'
  return v.toFixed(3)
}

const ITEMS = [
  { key: 'gold' as const, label: 'Gold (XAUUSD)', fmt: formatGold },
  { key: 'oil' as const, label: 'Oil (Brent)', fmt: formatOil },
  { key: 'dxy' as const, label: 'DXY', fmt: formatDxy },
]

export default function PriceTicker({ initialPrices }: Props) {
  const [prices, setPrices] = useState<Prices>(initialPrices)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const refresh = async () => {
      setRefreshing(true)
      try {
        const res = await fetch('/api/prices')
        if (res.ok) {
          const data = await res.json()
          setPrices(data)
        }
      } finally {
        setRefreshing(false)
      }
    }

    const interval = setInterval(refresh, 60_000)
    return () => clearInterval(interval)
  }, [])

  const lastUpdated = new Date(prices.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  return (
    <div className="bg-navy-dark border-y border-gold/20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6 flex-wrap">
          {ITEMS.map(({ key, label, fmt }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-gold/70 text-xs font-outfit font-semibold uppercase tracking-widest">
                {label}
              </span>
              <span className="text-white font-mono text-sm font-medium tabular-nums">
                {fmt(prices[key])}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-gray-600 text-xs">
          {refreshing && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          )}
          <span>Updated {lastUpdated}</span>
        </div>
      </div>
    </div>
  )
}
