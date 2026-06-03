import { GeoPrediction, GeoStatus } from '@/lib/types'

const STATUS_STYLES: Record<GeoStatus, string> = {
  OPEN:    'bg-gray-800 text-gray-400 border border-gray-600',
  CORRECT: 'bg-green-900/50 text-green-400 border border-green-700',
  WRONG:   'bg-red-900/50 text-red-400 border border-red-700',
  PARTIAL: 'bg-yellow-900/50 text-yellow-400 border border-yellow-700',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function GeopoliticalCard({ prediction }: { prediction: GeoPrediction }) {
  const { id, title, call, confidence, deadline, status } = prediction

  return (
    <article className="bg-navy-light border border-gold/10 border-t-2 border-t-indigo-500/40 rounded-2xl p-5 flex flex-col gap-4 hover:border-gold/20 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-indigo-400/60 text-xs font-semibold uppercase tracking-[0.2em] mb-1.5">
            Geopolitical Call
          </p>
          <h2 className="font-outfit text-base font-semibold text-gold leading-snug">{title}</h2>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md flex-shrink-0 ${STATUS_STYLES[status]}`}>
          {status}
        </span>
      </div>

      {/* Call description */}
      <p className="text-gray-400 text-sm italic leading-relaxed">&ldquo;{call}&rdquo;</p>

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

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <span className="text-gray-600 text-xs font-mono">{id}</span>
        <div className="text-xs text-right">
          <span className="text-gray-500 uppercase tracking-widest">Deadline </span>
          <span className="text-gray-300">{formatDate(deadline)}</span>
        </div>
      </div>
    </article>
  )
}
