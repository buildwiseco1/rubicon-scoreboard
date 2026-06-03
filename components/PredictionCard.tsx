import { EnrichedPrediction, Status } from '@/lib/types'

const STATUS_STYLES: Record<Status, { badge: string; label: string }> = {
  TARGET_HIT:  { badge: 'bg-green-900/50 text-green-400 border border-green-700', label: 'TARGET HIT' },
  ON_TRACK:    { badge: 'bg-green-900/50 text-green-400 border border-green-700', label: 'ON TRACK' },
  PARTIAL:     { badge: 'bg-yellow-900/50 text-yellow-400 border border-yellow-700', label: 'PARTIAL' },
  AT_RISK:     { badge: 'bg-yellow-900/50 text-yellow-400 border border-yellow-700', label: 'AT RISK' },
  OPEN:        { badge: 'bg-amber-900/50 text-amber-400 border border-amber-700', label: 'OPEN' },
  STOPPED_OUT: { badge: 'bg-red-900/50 text-red-400 border border-red-700', label: 'STOPPED OUT' },
  BREACHED:    { badge: 'bg-red-900/50 text-red-400 border border-red-700', label: 'BREACHED' },
  EXPIRED:     { badge: 'bg-gray-800 text-gray-400 border border-gray-600', label: 'EXPIRED' },
}

function formatValue(asset: string, value: number | null): string {
  if (value === null) return 'N/A'
  if (asset.toLowerCase().includes('dxy')) {
    return value.toFixed(3)
  }
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

export default function PredictionCard({ prediction }: { prediction: EnrichedPrediction }) {
  const {
    id, asset, direction, predictionType, entry, target, stopLoss,
    deadline, confidence, thesis, dateOpened, currentPrice, status, pnl,
    resolvedAt, resolutionNote,
  } = prediction

  const { badge, label } = STATUS_STYLES[status]
  const directionColor = direction === 'LONG' ? 'text-green-400' : 'text-red-400'
  const pnlColor = pnl === null ? 'text-gray-500' : pnl >= 0 ? 'text-green-400' : 'text-red-400'
  const pnlLabel = pnl === null ? 'N/A' : `${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}%`

  const isAboveThreshold = predictionType === 'HOLD_ABOVE' && currentPrice !== null
  const thresholdMet = isAboveThreshold && currentPrice! > target
  const thresholdColor = thresholdMet ? 'text-green-400' : status === 'BREACHED' ? 'text-red-400' : 'text-yellow-400'

  return (
    <article className="bg-navy-light border border-gold/10 rounded-2xl p-6 flex flex-col gap-5 hover:border-gold/25 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-gold font-outfit text-xl font-semibold leading-tight">{asset}</h2>
          <p className="text-gray-500 text-xs mt-1 tracking-wide">
            {id} &middot; Opened {formatDate(dateOpened)}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-bold tracking-wider ${directionColor}`}>{direction}</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${badge}`}>{label}</span>
        </div>
      </div>

      {/* Price grid */}
      <div className="grid grid-cols-3 gap-3">
        <PriceCell label="Entry" value={formatValue(asset, entry)} />
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Live Price</p>
          <p className="font-mono text-sm tabular-nums text-gold font-semibold">
            {formatValue(asset, currentPrice)}
          </p>
          {isAboveThreshold && (
            <p className={`text-xs mt-0.5 font-semibold ${thresholdColor}`}>
              {thresholdMet
                ? `Above ${formatValue(asset, target)} ✓`
                : `Below ${formatValue(asset, target)} ✗`}
            </p>
          )}
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">P&amp;L</p>
          <p className={`font-mono font-bold text-base tabular-nums ${pnlColor}`}>{pnlLabel}</p>
        </div>
      </div>

      {/* Target / Stop / Deadline */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">
            {predictionType === 'HOLD_ABOVE' ? 'Threshold' : 'Target'}
          </p>
          <p className="text-green-400 font-mono text-sm tabular-nums">{formatValue(asset, target)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Stop Loss</p>
          <p className="text-red-400 font-mono text-sm tabular-nums">{formatValue(asset, stopLoss)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Deadline</p>
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

      {/* Resolution info */}
      {(resolvedAt || resolutionNote) && (
        <div className="border-t border-white/5 pt-3 flex flex-col gap-1">
          {resolvedAt && (
            <p className="text-gray-500 text-xs">Resolved: {formatDate(resolvedAt)}</p>
          )}
          {resolutionNote && (
            <p className="text-gray-400 text-xs italic">{resolutionNote}</p>
          )}
        </div>
      )}
    </article>
  )
}

function PriceCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className="font-mono text-sm tabular-nums text-white">{value}</p>
    </div>
  )
}
