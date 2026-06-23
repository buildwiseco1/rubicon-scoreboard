'use client'

import { useState } from 'react'
import { EnrichedPrediction, EnrichedRelativePrediction, GeoPrediction, EnrichedWatchlistPrediction } from '@/lib/types'
import PredictionCard from './PredictionCard'
import GeopoliticalCard from './GeopoliticalCard'
import RelativeTradeCard from './RelativeTradeCard'
import WatchlistCard from './WatchlistCard'

type Tab = 'live' | 'watchlist' | 'geopolitical'

interface Props {
  enriched: EnrichedPrediction[]
  enrichedRelative: EnrichedRelativePrediction[]
  watchlistPredictions: EnrichedWatchlistPrediction[]
  geoPredictions: GeoPrediction[]
}

export default function TabbedContent({ enriched, enrichedRelative, watchlistPredictions, geoPredictions }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('live')

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'live', label: 'Live Trades', count: enriched.length + enrichedRelative.length },
    { id: 'watchlist', label: 'Watchlist', count: watchlistPredictions.length },
    { id: 'geopolitical', label: 'Geopolitical', count: geoPredictions.length },
  ]

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-8 border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-outfit font-semibold uppercase tracking-[0.15em] border-b-2 transition-colors duration-200 -mb-px ${
              activeTab === tab.id
                ? 'border-gold text-gold'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
            <span className={`ml-2 text-xs ${
              activeTab === tab.id ? 'text-gold/60' : 'text-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Live Trades */}
      {activeTab === 'live' && (
        <>
          {enriched.length === 0 && enrichedRelative.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No live trades found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enriched.map((pred) => (
                <PredictionCard key={pred.id} prediction={pred} />
              ))}
              {enrichedRelative.map((pred) => (
                <RelativeTradeCard key={pred.id} prediction={pred} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Watchlist */}
      {activeTab === 'watchlist' && (
        <>
          {watchlistPredictions.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No watchlist items yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {watchlistPredictions.map((pred) => (
                <WatchlistCard key={pred.id} prediction={pred} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Geopolitical */}
      {activeTab === 'geopolitical' && (
        <>
          {geoPredictions.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No geopolitical predictions yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {geoPredictions.map((pred) => (
                <GeopoliticalCard key={pred.id} prediction={pred} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}