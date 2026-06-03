# RUBICON SCOREBOARD — CLAUDE CODE SESSION FILE
> Claude Code reads this automatically every time you open this project.
> This replaces all re-explaining. Never ask the user to re-describe the project.

---

## PROJECT IDENTITY

- **Name:** Rubicon Intel / Rubicon Scoreboard
- **Tagline:** "The line has been crossed."
- **Purpose:** Public prediction tracking dashboard. Proves prediction accuracy over time.
- **Owner:** Personal project. No team. No database.
- **Local folder:** `C:\rubicon-scoreboard`
- **Live URL:** `https://rubicon-scoreboard-oa21sb6rg-buildwise-s-projects.vercel.app`
- **Vercel project name:** `rubicon-scoreboard` under `Buildwise's projects`

---

## TECH STACK

| Layer | Tool |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Data | `/data/predictions.json` — NO database |
| Hosting | Vercel (free tier) |
| Live prices | Free API — Gold (XAUUSD), Oil (Brent), DXY |

---

## DESIGN RULES — NEVER BREAK THESE

- **Primary background:** Navy `#1B2A4A`
- **Accent / highlight:** Gold `#C9A84C`
- **Headings font:** "Outfit" from Google Fonts
- **Body font:** System sans-serif
- **Theme:** Dark. Clean. Professional. Bloomberg terminal meets luxury brand.
- **Layout:** Fully responsive (mobile + desktop)
- **DO NOT** change any colors, fonts, or layout unless explicitly told to.
- **DO NOT** add features, sections, or cards unless explicitly told to.

---

## DEPLOYMENT RULES

- Vercel CLI is already installed globally.
- User is already logged in to Vercel. **DO NOT run `vercel login`.**
- To deploy: run `vercel --prod` from `C:\rubicon-scoreboard`
- Always confirm the live URL after deploying.
- Never change environment variables or Vercel project settings unless asked.

---

## PREDICTIONS DATA — `/data/predictions.json`

### Two types of predictions:

**Type 1 — Live Trades** (tradeable assets with price tracking)
```json
{
  "id": "PRED-006",
  "category": "trade",
  "asset": "Brent Crude Oil",
  "ticker": "BRENT",
  "direction": "LONG",
  "entry": 96,
  "target": 110,
  "stopLoss": 88,
  "deadline": "2026-09-30",
  "confidence": 72,
  "dateOpened": "2026-04-01",
  "thesis": "Oil stays above $95 through Q3 2026 driven by Hormuz risk premium"
}
```

**Type 2 — Geopolitical Watch** (non-tradeable, thesis-based calls)
```json
{
  "id": "PRED-001",
  "category": "geopolitical",
  "asset": "India-Pakistan Ceasefire",
  "direction": "WATCH",
  "thesis": "Ceasefire experiences at least one serious violation requiring third-party intervention before Oct 2026",
  "deadline": "2026-10-31",
  "confidence": 72,
  "dateOpened": "2026-04-29"
}
```

### Scoring logic:
- **WIN** — Price hits target before deadline (trades) OR thesis proves correct (geopolitical)
- **LOSS** — Price hits stop-loss (trades) OR thesis proves wrong
- **EXPIRED** — Deadline passed, outcome unclear
- **OPEN** — Active, no outcome yet

### Stats bar shows:
- Total predictions count
- Win rate (%)
- Active trades count
- Best call (highest confidence WIN)

---

## CURRENT PREDICTIONS ON SCOREBOARD

| ID | Type | Asset | Status |
|----|------|-------|--------|
| PRED-001 | Geopolitical | India-Pakistan Ceasefire | OPEN |
| PRED-003 | Geopolitical | HUMAIN / Vision 2030 Gap | OPEN |
| PRED-004 | Geopolitical | MBS Pattern Break | OPEN |
| PRED-005B | Geopolitical | Hormuz Not Fully Open | OPEN |
| PRED-005C | Geopolitical | Trump Deal Framework | OPEN |
| PRED-006 | Trade | Brent Crude Oil | OPEN |
| PRED-007 | Trade | Gold XAUUSD | OPEN |
| PRED-009 | Geopolitical | Pakistan No Abraham Accords | OPEN |
| PRED-010 | Geopolitical | Texas Senate Competitive | OPEN |
| PRED-011 | Geopolitical | China Clean-Tech Captures Asia | OPEN |
| PRED-012 | Geopolitical | Water / IH2O | OPEN |

> Before adding any new prediction, read the JSON file first and check for the highest existing ID to avoid duplicates. Next ID should follow the sequence.

---

## HOW TO ADD A NEW PREDICTION — EXACT STEPS

1. Read `data/predictions.json` — show the user the current list (IDs only, one line each)
2. Wait for user to confirm the new prediction details
3. Add it to the array using the correct format (Trade or Geopolitical — see above)
4. Never remove or edit existing predictions unless explicitly told to
5. Run `vercel --prod`
6. Confirm live URL

---

## WHAT NOT TO DO — EVER

- Do NOT run `vercel login`
- Do NOT change the design, colors, or fonts
- Do NOT remove existing predictions
- Do NOT add new sections or features unless asked
- Do NOT touch `.env.local` or API keys
- Do NOT change the Next.js config, package.json, or Tailwind config
- Do NOT rename files or restructure folders
- Do NOT ask the user to re-explain the project — read this file

---

## COMMON TASKS — QUICK REFERENCE

| What user says | What to do |
|----------------|------------|
| "Add a new prediction" | Read JSON → show current list → get details → add → deploy |
| "Deploy" / "Push live" | Run `vercel --prod` from project root |
| "Fix this error" | Read the error, find the file, fix it, redeploy |
| "Change [design element]" | Edit Tailwind class only — do not touch layout |
| "Show me current predictions" | Read and list `/data/predictions.json` |
| "Add news tracking" | NOT approved. Scope is locked. Tell user this is a future phase. |

---

## PROJECT PHILOSOPHY

This scoreboard has ONE job: prove prediction accuracy publicly over 30 days.
Every session should serve that goal. No scope creep. No new features unless explicitly approved.
