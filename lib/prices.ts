import { Prices } from './types'

async function fetchYahooPrice(symbol: string): Promise<number | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json',
      },
      next: { revalidate: 60 },
    })

    if (!res.ok) return null

    const data = await res.json()
    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice
    return typeof price === 'number' ? Math.round(price * 100) / 100 : null
  } catch {
    return null
  }
}

async function fetchGoldPrice(): Promise<number | null> {
  const spot = await fetchYahooPrice('XAUUSD=X')
  if (spot !== null) return spot
  return fetchYahooPrice('GC=F')
}

export async function fetchLivePrices(): Promise<Prices> {
  const [gold, oil, dxy, ih2o, sp500, ntr, mos, mp] = await Promise.all([
    fetchGoldPrice(),
    fetchYahooPrice('BZ=F'),
    fetchYahooPrice('DX-Y.NYB'),
    fetchYahooPrice('IH2O.L'),
    fetchYahooPrice('^GSPC'),
    fetchYahooPrice('NTR'),
    fetchYahooPrice('MOS'),
    fetchYahooPrice('MP'),
  ])

  return { gold, oil, dxy, ih2o, sp500, ntr, mos, mp, timestamp: new Date().toISOString() }
}

export function getPriceForAsset(asset: string, prices: Prices): number | null {
  const lower = asset.toLowerCase()
  if (lower.includes('gold') || lower.includes('xau')) return prices.gold
  if (lower.includes('oil') || lower.includes('brent') || lower.includes('crude')) return prices.oil
  if (lower.includes('dxy') || lower.includes('dollar index')) return prices.dxy
  if (lower.includes('ntr') || lower.includes('nutrien')) return prices.ntr
  if (lower.includes('mos') || lower.includes('mosaic')) return prices.mos
  if (lower.includes('mp materials') || lower.startsWith('mp (') || lower.startsWith('mp(')) return prices.mp
  return null
}
