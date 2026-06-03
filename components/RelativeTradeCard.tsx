import { EnrichedRelativePrediction, RelativeStatus } from '@/lib/types'

const STATUS_STYLES: Record<RelativeStatus, { badge: string; label: string }> = {
  TARGET_HIT:    { badge: 'bg-green-900/50 text-green-400 border border-green-700', label: 'TARGET HIT' },
  ON_TRACK:      { badge: 'bg-green-900/50 text-green-400 border border-green-700', label: 'ON TRACK' },
  LAGGING:       { badge: 'bg-orange-900/50 text-orange-400 border border-orange-700', label: 'LAGGING' },
  THESIS_BROKEN: { badge: 'bg-red-900/50 text-red-400 border border-red-700', label: 'THESIS BROKEN' },
  OPEN:          { badge: 'bg-amber-900/50 text-amber-400 border border-amber-700', label: 'OPEN' },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatReturn(val: number | null): string {
  if (val === null) return 'N/A'
  return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`
}

function formatGap(gap: number | null): string {
  if (gap === null) return 'N/A'
  return `${gap >= 0 ? '+' : ''}${gap.toFixed(2)}%`
}

function returnColor(val: number | null): string {
  if (val === null) return 'text-gray-500'
  return val >= 0 ? 'text-green-400' : 'text-red-400'
}

function gapColor(gap: number | null): string {
  if (gap === null) return 'text-gray-500'
  if (gap >= 5) return 'text-green-400'
  if (gap >= 0) return 'text-green-400'
  if (gap >= -2) return 'text-orange-400'
  return 'text-red-400'
}

export default function RelativeTradeCard({ prediction }: { prediction: EnrichedRelativePrediction }) {
  const {
    id, asset, direction, entry, entrySP500, entryUnit,
    target, deadline, confidence, thesis, dateOpened, killCriteria,
    ih2oPrice, sp500Price, ih2oReturn, sp500Return, gap, status,
  } = prediction

  const { badge, label } = STATUS_STYLES[status]

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
          <span className="text-xs font-bold tracking-wider text-green-400">{direction}</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${badge}`}>{label}</span>
        </div>
      </div>

      {/* Instrument rows */}
      <div className="flex flex-col gap-2">
        {/* Column headers */}
        <div className="grid grid-cols-4 gap-2">
          <p className="text-gray-500 text-xs uppercase tracking-widest">Instrument</p>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Entry</p>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Live</p>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Return</p>
        </div>
        {/* IH2O row */}
        <div className="grid grid-cols-4 gap-2 items-baseline">
          <p className="text-white text-sm font-semibold">IH2O</p>
          <p className="font-mono text-sm tabular-nums text-white">{entry}{entryUnit}</p>
          <p className="font-mono text-sm tabular-nums text-gold font-semibold">
            {ih2oPrice !== null ? `${ih2oPrice.toFixed(0)}${entryUnit}` : 'N/A'}
          </p>
          <p className={`font-mono text-sm font-bold tabular-nums ${returnColor(ih2oReturn)}`}>
            {formatReturn(ih2oReturn)}
          </p>
        </div>
        {/* S&P 500 row */}
        <div className="grid grid-cols-4 gap-2 items-baseline">
          <p className="text-white text-sm font-semibold">S&amp;P 500</p>
          <p className="font-mono text-sm tabular-nums text-white">{entrySP500.toLocaleString()}</p>
          <p className="font-mono text-sm tabular-nums text-gold font-semibold">
            {sp500Price !== null ? sp500Price.toLocaleString('en-US', { maximumFractionDigits: 0 }) : 'N/A'}
          </p>
          <p className={`font-mono text-sm font-bold tabular-nums ${returnColor(sp500Return)}`}>
            {formatReturn(sp500Return)}
          </p>
        </div>
      </div>

      {/* Outperformance gap */}
      <div className="bg-navy rounded-xl px-4 py-3 flex items-center justify-between gap-4">
        <p className="text-gray-400 text-xs uppercase tracking-widest">Outperformance Gap</p>
        <div className="flex items-center gap-4">
          <span className={`font-mono font-bold text-lg tabular-nums ${gapColor(gap)}`}>
            {formatGap(gap)}
          </span>
          <span className="text-gray-600 text-xs">Target: <span className="text-green-400 font-mono">+{target}.00%</span></span>
        </div>
      </div>

      {/* Deadline */}
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs uppercase tracking-widest">Deadline</p>
        <p className="text-white text-sm">{formatDate(deadline)}</p>
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
      <div className="bg-red-950/20 border border-red-900/30 rounded-lg px-3 py-2">
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Kill Criteria</p>
        <p className="text-red-400/80 text-xs leading-relaxed">{killCriteria}</p>
      </div>
    </article>
  )
}
