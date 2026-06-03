import fs from 'fs'
import path from 'path'
import { Prediction, Status, GeoPrediction, RelativePrediction, RelativeStatus, WatchlistPrediction, EnrichedWatchlistPrediction } from './types'

export function getPredictions(): Prediction[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'predictions.json')
    const data = fs.readFileSync(filePath, 'utf8')
    const all = JSON.parse(data) as Array<Record<string, unknown>>
    return all.filter((p) => p.type !== 'relative' && p.type !== 'watchlist') as unknown as Prediction[]
  } catch {
    return []
  }
}

export function getRelativePredictions(): RelativePrediction[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'predictions.json')
    const data = fs.readFileSync(filePath, 'utf8')
    const all = JSON.parse(data) as Array<Record<string, unknown>>
    return all.filter((p) => p.type === 'relative') as unknown as RelativePrediction[]
  } catch {
    return []
  }
}

export function getWatchlistPredictions(): EnrichedWatchlistPrediction[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'predictions.json')
    const data = fs.readFileSync(filePath, 'utf8')
    const all = JSON.parse(data) as Array<Record<string, unknown>>
    const watchlist = all.filter((p) => p.type === 'watchlist') as unknown as WatchlistPrediction[]
    return watchlist.map((pred) => ({
      ...pred,
      pnl: ((pred.manual_price - pred.entry) / pred.entry) * 100,
    }))
  } catch {
    return []
  }
}

export function getStatus(prediction: Prediction, currentPrice: number | null): Status {
  const deadlinePassed = new Date() > new Date(prediction.deadline)
  const sl = prediction.stopLoss

  if (currentPrice === null) {
    return deadlinePassed ? 'EXPIRED' : 'OPEN'
  }

  if (prediction.predictionType === 'HOLD_ABOVE') {
    if (sl !== null && currentPrice <= sl) return 'BREACHED'
    if (deadlinePassed) return 'EXPIRED'
    if (currentPrice > prediction.target) return 'ON_TRACK'
    return 'AT_RISK'
  }

  // STANDARD
  if (prediction.direction === 'LONG') {
    if (sl !== null && currentPrice < sl) return 'STOPPED_OUT'
    if (deadlinePassed) return 'EXPIRED'
    if (currentPrice >= prediction.target) return 'TARGET_HIT'
    if (currentPrice >= prediction.partialTarget) return 'PARTIAL'
    return 'OPEN'
  } else {
    // SHORT
    if (sl !== null && currentPrice > sl) return 'STOPPED_OUT'
    if (deadlinePassed) return 'EXPIRED'
    if (currentPrice <= prediction.target) return 'TARGET_HIT'
    if (currentPrice <= prediction.partialTarget) return 'PARTIAL'
    return 'OPEN'
  }
}

export function getPnL(prediction: Prediction, currentPrice: number | null): number | null {
  if (currentPrice === null) return null
  if (prediction.direction === 'LONG') {
    return ((currentPrice - prediction.entry) / prediction.entry) * 100
  }
  return ((prediction.entry - currentPrice) / prediction.entry) * 100
}

export function getRelativeStatus(gap: number | null): RelativeStatus {
  if (gap === null) return 'OPEN'
  if (gap >= 5) return 'TARGET_HIT'
  if (gap >= 0) return 'ON_TRACK'
  if (gap >= -10) return 'LAGGING'
  return 'THESIS_BROKEN'
}

export function getGeoPredictions(): GeoPrediction[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'geopolitical.json')
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data) as GeoPrediction[]
  } catch {
    return []
  }
}
