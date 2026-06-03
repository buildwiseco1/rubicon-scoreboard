import { NextResponse } from 'next/server'
import { fetchLivePrices } from '@/lib/prices'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const prices = await fetchLivePrices()
    return NextResponse.json(prices)
  } catch {
    return NextResponse.json(
      { gold: null, oil: null, dxy: null, ih2o: null, sp500: null, ntr: null, mos: null, timestamp: new Date().toISOString() },
      { status: 200 }
    )
  }
}
