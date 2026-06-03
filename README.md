# Rubicon Scoreboard

Public prediction tracking dashboard. Dark, professional, Bloomberg-meets-luxury-brand aesthetic built with Next.js 14 and Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding New Predictions

Edit `data/predictions.json` and append a new object:

```json
{
  "id": "PRED-008",
  "asset": "Gold (XAUUSD)",
  "direction": "LONG",
  "entry": 4800,
  "target": 5500,
  "stopLoss": 4400,
  "deadline": "2026-12-31",
  "confidence": 65,
  "thesis": "Your prediction thesis here.",
  "dateOpened": "2026-05-26"
}
```

Redeploy (or restart dev server) after editing the file — predictions are read from disk on each server request.

### Supported Assets for Live Prices

| Asset name in JSON | Live price source |
|--------------------|-------------------|
| `Gold (XAUUSD)` or anything containing "gold" / "xau" | Yahoo Finance `XAUUSD=X` |
| `Oil (Brent)` or anything containing "oil" / "brent" / "crude" | Yahoo Finance `BZ=F` |
| `DXY` or anything containing "dollar index" | Yahoo Finance `DX-Y.NYB` |

Any other asset name will show **N/A** for live price (the prediction card still displays correctly).

### Direction Values

- `"LONG"` — bullish; WIN when price rises to target
- `"SHORT"` — bearish; WIN when price falls to target

### Status Logic

| Status | Condition |
|--------|-----------|
| **WIN** | LONG: `currentPrice ≥ target` before deadline · SHORT: `currentPrice ≤ target` before deadline |
| **LOSS** | LONG: `currentPrice ≤ stopLoss` · SHORT: `currentPrice ≥ stopLoss` |
| **EXPIRED** | Deadline passed without hitting target or stop-loss |
| **OPEN** | None of the above |

## Live Price Sources

Prices are fetched server-side from **Yahoo Finance** (no API key required) and cached for 60 seconds per request. The client-side ticker auto-refreshes every 60 seconds via `/api/prices`.

If Yahoo Finance is unavailable, prices gracefully fall back to **N/A** — the dashboard never crashes.

### Upgrading to a Premium Data Source

For production reliability, replace the fetch calls in `lib/prices.ts` with a paid API:

| Provider | API Key env var |
|----------|-----------------|
| [Alpha Vantage](https://www.alphavantage.co/) | `ALPHA_VANTAGE_API_KEY` |
| [Finnhub](https://finnhub.io/) | `FINNHUB_API_KEY` |
| [Metals-API](https://metalpriceapi.com/) | `METALS_API_KEY` |

Add your key to `.env.local`:

```env
ALPHA_VANTAGE_API_KEY=your_key_here
```

Then update `lib/prices.ts` to use the new endpoint.

## Deployment

1. Push to GitHub
2. Import into [Vercel](https://vercel.com)
3. Deploy — no environment variables required for the default Yahoo Finance setup

The `data/predictions.json` file is read from the filesystem at request time. On Vercel this works correctly since Next.js bundles the `data/` directory.

## Tech Stack

- **Next.js 14** — App Router, server components, API routes
- **Tailwind CSS** — custom navy (`#1B2A4A`) / gold (`#C9A84C`) theme
- **TypeScript** — strict mode
- **Google Fonts** — Outfit (headings), system sans-serif (body)
- **Yahoo Finance** — free, no-key live price data
