import { EnrichedPrediction, GeoPrediction, EnrichedRelativePrediction } from '@/lib/types'

interface Props {
  trades: EnrichedPrediction[]
  geoPredictions: GeoPrediction[]
  relativeTrades: EnrichedRelativePrediction[]
}

export default function StatsBar({ trades, geoPredictions, relativeTrades }: Props) {
  const correct =
    trades.filter((t) => t.status === 'TARGET_HIT' || t.status === 'ON_TRACK').length +
    geoPredictions.filter((g) => g.status === 'CORRECT').length +
    relativeTrades.filter((r) => r.status === 'TARGET_HIT' || r.status === 'ON_TRACK').length

  const wrong =
    trades.filter((t) => t.status === 'STOPPED_OUT' || t.status === 'BREACHED').length +
    geoPredictions.filter((g) => g.status === 'WRONG').length +
    relativeTrades.filter((r) => r.status === 'THESIS_BROKEN').length

  const atRisk =
    trades.filter((t) => t.status === 'PARTIAL' || t.status === 'AT_RISK').length +
    relativeTrades.filter((r) => r.status === 'LAGGING').length

  const open =
    trades.filter((t) => t.status === 'OPEN').length +
    geoPredictions.filter((g) => g.status === 'OPEN').length +
    relativeTrades.filter((r) => r.status === 'OPEN').length

  const bestCallTrade = trades
    .filter((t) => t.pnl !== null && t.pnl > 0)
    .sort((a, b) => (b.pnl ?? 0) - (a.pnl ?? 0))[0]

  const bestCall = bestCallTrade ? bestCallTrade.id : 'None yet'

  const stats = [
    { label: 'Correct', value: correct.toString(), color: 'text-green-400' },
    { label: 'Wrong', value: wrong.toString(), color: 'text-red-400' },
    { label: 'At Risk', value: atRisk.toString(), color: 'text-yellow-400' },
    { label: 'Open', value: open.toString(), color: 'text-amber-400' },
    { label: 'Best Call', value: bestCall, color: 'text-gold' },
  ]

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-10">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-navy-light border border-gold/10 rounded-xl p-4 text-center"
        >
          <div className={`text-2xl font-outfit font-bold mb-1 tabular-nums ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-widest leading-tight">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
