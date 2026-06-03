import { EnrichedWatchlistPrediction } from '@/lib/types'

function formatUSD(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function WatchlistCard({ prediction }: { prediction: EnrichedWatchlistPrediction }) {
  const {
    id, asset, direction, entry, target, partialTarget, manual_price,
    deadline, confidence, thesis, dateOpened, exchange, target_pct,
    horizon_months, killCriteria, pnl,
  } = prediction

  const pnlColor = pnl === null ? 'text-gray-500' : pnl >= 0 ? 'text-green-400' : 'text-red-400'
  const pnlLabel = pnl === null ? 'N/A' : `${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}%`

  return (
    <article className="bg-navy-light border border-gold/10 rounded-2xl p-6 flex flex-col gap-5 hover:border-gold/25 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-gold font-outfit text-xl font-semibold leading-tight">{asset}</h2>
          <p className="text-gray-500 text-xs mt-1 tracking-wide">
            {id} &middot; Opened {formatDate(dateOpened)}
            {exchange && <span> &middot; {exchange}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-bold tracking-wider ${direction === 'LONG' ? 'text-green-400' : 'text-red-400'}`}>
            {direction}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-900/50 text-blue-300 border border-blue-700">
            WATCH
          </span>
        </div>
      </div>

      {/* Price grid */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Entry</p>
          <p className="font-mono text-sm tabular-nums text-white">{formatUSD(entry)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Manual Price</p>
          <p className="font-mono text-sm tabular-nums text-gold font-semibold">{formatUSD(manual_price)}</p>
          <p className="text-gray-600 text-xs mt-0.5">Updated manually</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Hyp. P&amp;L</p>
          <p className={`font-mono font-bold text-base tabular-nums ${pnlColor}`}>{pnlLabel}</p>
        </div>
      </div>

      {/* Target / Conservative / Deadline */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
            Target {target_pct ? `(+${target_pct}%)` : ''}
          </p>
          <p className="text-green-400 font-mono text-sm tabular-nums">{formatUSD(target)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Conservative</p>
          <p className="text-yellow-400 font-mono text-sm tabular-nums">
            {partialTarget ? formatUSD(partialTarget) : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
            Review {horizon_months ? `(${horizon_months}m)` : ''}
          </p>
          <p className="text-white text-sm">{formatDate(deadline)}</p>
        </div>
      </div>

      {/* Confidence bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500 text-xs uppercase tracking-widest">Confidence</span>
          <span className="text-gold text-xs font-semibold tabular-nums">{confidence}%</span>
        </div>
        <div className="w-full bg-navy rounded-full h-1">
          <div
            className="bg-gold h-1 rounded-full transition-all duration-500"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* Thesis */}
      <div className="border-t border-white/5 pt-4">
        <p className="text-gray-400 text-sm italic leading-relaxed">&ldquo;{thesis}&rdquo;</p>
      </div>

      {/* Kill criteria */}
      {killCriteria && (
        <div className="border-t border-white/5 pt-3">
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-1">Kill Criteria</p>
          <p className="text-gray-400 text-xs leading-relaxed">{killCriteria}</p>
        </div>
      )}
    </article>
  )
}
