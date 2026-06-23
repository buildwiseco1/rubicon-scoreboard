import { fetchLivePrices, getPriceForAsset } from '@/lib/prices'
import { getPredictions, getStatus, getPnL, getGeoPredictions, getRelativePredictions, getRelativeStatus, getWatchlistPredictions } from '@/lib/predictions'
import { EnrichedPrediction, EnrichedRelativePrediction } from '@/lib/types'
import PriceTicker from '@/components/PriceTicker'
import StatsBar from '@/components/StatsBar'
import PredictionCard from '@/components/PredictionCard'
import GeopoliticalCard from '@/components/GeopoliticalCard'
import RelativeTradeCard from '@/components/RelativeTradeCard'
import WatchlistCard from '@/components/WatchlistCard'

export const dynamic = 'force-dynamic'

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="h-px flex-1 bg-white/5" />
      <h2 className="font-outfit text-xs uppercase tracking-[0.3em] text-gray-500">{label}</h2>
      <div className="h-px flex-1 bg-white/5" />
    </div>
  )
}

export default async function Home() {
  const [prices, predictions, geoPredictions, relativePredictions, watchlistPredictions] = await Promise.all([
    fetchLivePrices(),
    Promise.resolve(getPredictions()),
    Promise.resolve(getGeoPredictions()),
    Promise.resolve(getRelativePredictions()),
    Promise.resolve(getWatchlistPredictions()),
  ])

  const enriched: EnrichedPrediction[] = predictions.map((pred) => {
    const currentPrice = getPriceForAsset(pred.asset, prices)
    let status = getStatus(pred, currentPrice)

    if (
      status !== 'STOPPED_OUT' &&
      pred.relativeTarget &&
      pred.entrySP500 &&
      currentPrice !== null &&
      prices.sp500 !== null
    ) {
      const assetReturn = ((currentPrice - pred.entry) / pred.entry) * 100
      const sp500Return = ((prices.sp500 - pred.entrySP500) / pred.entrySP500) * 100
      if (assetReturn - sp500Return >= pred.relativeTarget) status = 'TARGET_HIT'
    }

    return {
      ...pred,
      currentPrice,
      status,
      pnl: getPnL(pred, currentPrice),
    }
  })

  const enrichedRelative: EnrichedRelativePrediction[] = relativePredictions.map((pred) => {
    const ih2oPrice = prices.ih2o
    const sp500Price = prices.sp500
    const ih2oReturn = ih2oPrice !== null ? ((ih2oPrice - pred.entry) / pred.entry) * 100 : null
    const sp500Return = sp500Price !== null ? ((sp500Price - pred.entrySP500) / pred.entrySP500) * 100 : null
    const gap = ih2oReturn !== null && sp500Return !== null ? ih2oReturn - sp500Return : null
    return {
      ...pred,
      ih2oPrice,
      sp500Price,
      ih2oReturn,
      sp500Return,
      gap,
      status: getRelativeStatus(gap),
    }
  })

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="pt-14 pb-10 text-center px-4">
        <h1 className="font-outfit font-bold text-gold uppercase tracking-[0.22em] text-5xl md:text-7xl leading-none">
          Rubicon Intel
        </h1>
        <p className="text-gray-500 mt-4 text-base md:text-lg tracking-[0.1em]">
          The line has been crossed.
        </p>
      </header>

      {/* Live Price Ticker */}
      <PriceTicker initialPrices={prices} />

      {/* Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        {/* Live Trades */}
        <SectionDivider label="Live Trades" />
        {enriched.length === 0 && enrichedRelative.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No live trades found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            {enriched.map((pred) => (
              <PredictionCard key={pred.id} prediction={pred} />
            ))}
            {enrichedRelative.map((pred) => (
              <RelativeTradeCard key={pred.id} prediction={pred} />
            ))}
          </div>
        )}

        {/* Watchlist */}
        {watchlistPredictions.length > 0 && (
          <>
            <SectionDivider label="Watchlist" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
              {watchlistPredictions.map((pred) => (
                <WatchlistCard key={pred.id} prediction={pred} />
              ))}
            </div>
          </>
        )}

        {/* Geopolitical Calls */}
        <SectionDivider label="Geopolitical Calls" />
        {geoPredictions.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No geopolitical predictions found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {geoPredictions.map((pred) => (
              <GeopoliticalCard key={pred.id} prediction={pred} />
            ))}
          </div>
        )}

        {/* Stats Bar — at bottom */}
        <StatsBar trades={enriched} geoPredictions={geoPredictions} relativeTrades={enrichedRelative} />
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center mt-10">
        <p className="text-gray-600 text-sm">
          Rubicon Intel &copy; 2026 &mdash; Predictions are analytical forecasts, not financial advice.
        </p>
      </footer>
    </main>
  )
}