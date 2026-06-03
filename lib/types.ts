export type PredictionType = 'STANDARD' | 'HOLD_ABOVE'

export interface Prediction {
  id: string
  asset: string
  direction: 'LONG' | 'SHORT'
  predictionType: PredictionType
  entry: number
  target: number
  partialTarget: number
  stopLoss: number | null
  deadline: string
  confidence: number
  thesis: string
  dateOpened: string
  resolvedAt: string | null
  resolutionNote: string | null
  relativeTarget?: number
  entrySP500?: number
  exchange?: string
  target_pct?: number
  horizon_months?: number
  killCriteria?: string
}

export type Status =
  | 'TARGET_HIT'
  | 'ON_TRACK'
  | 'PARTIAL'
  | 'AT_RISK'
  | 'OPEN'
  | 'STOPPED_OUT'
  | 'BREACHED'
  | 'EXPIRED'

export interface Prices {
  gold: number | null
  oil: number | null
  dxy: number | null
  ih2o: number | null
  sp500: number | null
  ntr: number | null
  mos: number | null
  mp: number | null
  timestamp: string
}

export interface EnrichedPrediction extends Prediction {
  currentPrice: number | null
  status: Status
  pnl: number | null
}

export type GeoStatus = 'OPEN' | 'CORRECT' | 'WRONG' | 'PARTIAL'

export interface GeoPrediction {
  id: string
  title: string
  call: string
  confidence: number
  deadline: string
  status: GeoStatus
}

export interface RelativePrediction {
  id: string
  type: 'relative'
  asset: string
  direction: 'LONG' | 'SHORT'
  entry: number
  entrySP500: number
  entryUnit: string
  target: number
  stopLoss: null
  deadline: string
  confidence: number
  thesis: string
  dateOpened: string
  killCriteria: string
}

export type RelativeStatus = 'TARGET_HIT' | 'ON_TRACK' | 'LAGGING' | 'THESIS_BROKEN' | 'OPEN'

export interface EnrichedRelativePrediction extends RelativePrediction {
  ih2oPrice: number | null
  sp500Price: number | null
  ih2oReturn: number | null
  sp500Return: number | null
  gap: number | null
  status: RelativeStatus
}

export interface WatchlistPrediction {
  id: string
  type: 'watchlist'
  asset: string
  direction: 'LONG' | 'SHORT'
  entry: number
  target: number
  partialTarget?: number
  manual_price: number
  deadline: string
  confidence: number
  thesis: string
  dateOpened: string
  exchange?: string
  target_pct?: number
  horizon_months?: number
  killCriteria?: string
}

export interface EnrichedWatchlistPrediction extends WatchlistPrediction {
  pnl: number | null
}
