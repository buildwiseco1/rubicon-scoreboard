#!/usr/bin/env python3
"""
Resolve past-deadline predictions — auto-classify CORRECT/INCORRECT/STILL OPEN.

For tradeable predictions: checks if price target was hit before deadline.
For geopolitical calls: flags for manual review (can't auto-verify).

Updates predictions.json and geopolitical.json with resolution data,
then commits and pushes.

Usage:
    # Dry run — show what would change, no edits
    python3 scripts/resolve_predictions.py --dry-run

    # Live run — update files, commit, push
    python3 scripts/resolve_predictions.py --live

    # Provide manual resolution for a specific prediction
    python3 scripts/resolve_predictions.py --manual PRED-005A CORRECT "Ceasefire held through Aug 1"
"""

import json, sys, subprocess
from datetime import datetime, date
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parent.parent
TRADE_FILE = REPO_DIR / "data" / "predictions.json"
GEO_FILE = REPO_DIR / "data" / "geopolitical.json"
TRACK_FILE = REPO_DIR / "_Meta" / "Track_Record.md"

TODAY = date.today()

# ── Price map for common assets ──────────────────────────────────
# Update these before running, or pass via --prices
PRICES = {
    "gold": None,       # XAUUSD
    "oil": None,        # Brent
    "dxy": None,        # US Dollar Index
    "sp500": None,      # S&P 500
    "ntr": None,        # Nutrien
    "mos": None,        # Mosaic
    "mp": None,         # MP Materials
    "ih2o": None,       # iShares Water ETF
    "lysdy": None,      # Lynas ADR
}


def get_asset_key(asset: str) -> str | None:
    """Map asset name to PRICES key."""
    asset_lower = asset.lower()
    if "gold" in asset_lower or "xau" in asset_lower:
        return "gold"
    if "oil" in asset_lower or "brent" in asset_lower or "crude" in asset_lower:
        return "oil"
    if "dxy" in asset_lower:
        return "dxy"
    if "s&p" in asset_lower or "sp500" in asset_lower or "spx" in asset_lower:
        return "sp500"
    if "ntr" in asset_lower or "nutrien" in asset_lower:
        return "ntr"
    if "mos" in asset_lower or "mosaic" in asset_lower:
        return "mos"
    if "mp " in asset_lower or "mp materials" in asset_lower:
        return "mp"
    if "ih2o" in asset_lower:
        return "ih2o"
    if "lysdy" in asset_lower or "lynas" in asset_lower:
        return "lysdy"
    return None


def resolve_trade(pred: dict) -> tuple[str, str]:
    """
    Determine if a tradeable prediction hit its target.
    Returns (status, note).
    """
    direction = pred.get("direction", "LONG")
    pred_type = pred.get("predictionType", "STANDARD")
    target = pred.get("target")
    stop_loss = pred.get("stopLoss")
    entry = pred.get("entry")
    asset = pred.get("asset", "")

    price_key = get_asset_key(asset)
    current_price = PRICES.get(price_key) if price_key else None

    if current_price is None:
        return ("UNRESOLVED", f"Need current price for {asset}. Set in PRICES dict.")

    if pred_type == "HOLD_ABOVE":
        # Thesis: price stays above threshold
        if stop_loss and current_price <= stop_loss:
            return ("INCORRECT", f"Breached stop-loss {stop_loss}. Current: {current_price}.")
        if current_price > target:
            return ("CORRECT", f"Held above {target}. Current: {current_price}.")
        return ("INCORRECT", f"Fell below threshold {target}. Current: {current_price}.")

    # STANDARD
    if direction == "LONG":
        if stop_loss and current_price < stop_loss:
            return ("INCORRECT", f"Stop-loss {stop_loss} hit. Current: {current_price}.")
        if current_price >= target:
            return ("CORRECT", f"Target {target} hit. Entry {entry}, current {current_price}.")
        return ("INCORRECT", f"Target {target} not reached. Entry {entry}, current {current_price}.")
    else:
        # SHORT
        if stop_loss and current_price > stop_loss:
            return ("INCORRECT", f"Stop-loss {stop_loss} hit. Current: {current_price}.")
        if current_price <= target:
            return ("CORRECT", f"Target {target} hit. Entry {entry}, current {current_price}.")
        return ("INCORRECT", f"Target {target} not reached. Entry {entry}, current {current_price}.")


def resolve_geo(pred: dict) -> tuple[str, str]:
    """Flag geopolitical calls for manual resolution."""
    return ("FLAG_MANUAL", f"Cannot auto-verify: '{pred.get('call', '')}'. Requires news/event check.")


def update_track_record(results: list[dict]):
    """Append resolution entries to Track_Record.md."""
    if not TRACK_FILE.exists():
        TRACK_FILE.parent.mkdir(parents=True, exist_ok=True)
        TRACK_FILE.write_text("# Track Record\n\n| Date | ID | Asset | Outcome | Note |\n|------|-----|-------|---------|------|\n")

    with open(TRACK_FILE, "a") as f:
        for r in results:
            line = f"| {TODAY} | {r['id']} | {r.get('asset', '-')} | {r['outcome']} | {r['note']} |\n"
            f.write(line)


def main():
    dry_run = "--dry-run" in sys.argv
    live = "--live" in sys.argv
    manual_mode = "--manual" in sys.argv

    # Manual resolution mode
    if manual_mode:
        idx = sys.argv.index("--manual")
        pred_id = sys.argv[idx + 1]
        outcome = sys.argv[idx + 2].upper()
        note = sys.argv[idx + 3] if len(sys.argv) > idx + 3 else ""

        if outcome not in ("CORRECT", "INCORRECT", "PARTIAL", "STILL_OPEN"):
            print(f"ERROR: Invalid outcome '{outcome}'. Use CORRECT, INCORRECT, PARTIAL, or STILL_OPEN.")
            sys.exit(1)

        # Update tradeable or geo
        updated = False
        for fpath in [TRADE_FILE, GEO_FILE]:
            if not fpath.exists():
                continue
            data = json.loads(fpath.read_text())
            for p in data:
                if p.get("id") == pred_id:
                    p["status"] = outcome
                    p["resolutionNote"] = note
                    p["resolvedAt"] = str(TODAY)
                    updated = True
                    break
            if updated:
                with open(fpath, "w") as f:
                    json.dump(data, f, indent=2)
                    f.write("\n")
                break

        if not updated:
            print(f"ERROR: Prediction {pred_id} not found.")
            sys.exit(1)

        print(f"Resolved {pred_id}: {outcome} — {note}")
        if live:
            subprocess.run(["git", "-C", str(REPO_DIR), "add", str(fpath.relative_to(REPO_DIR))], check=True)
            subprocess.run(["git", "-C", str(REPO_DIR), "commit", "-m", f"resolve {pred_id}: {outcome}"], check=True)
            subprocess.run(["git", "-C", str(REPO_DIR), "push"], check=True)
            print(f"Committed and pushed.")
        return

    # Load price overrides
    prices_idx = None
    for i, arg in enumerate(sys.argv):
        if arg == "--prices" and i + 1 < len(sys.argv):
            try:
                overrides = json.loads(sys.argv[i + 1])
                PRICES.update(overrides)
            except json.JSONDecodeError:
                print("ERROR: --prices requires valid JSON. Example: --prices '{\"gold\": 4200, \"oil\": 80}'")
                sys.exit(1)
            break

    if not live and not dry_run:
        print("Usage: python3 scripts/resolve_predictions.py --dry-run | --live [--prices '{\"gold\":4200}']")
        print("       python3 scripts/resolve_predictions.py --manual PRED-ID OUTCOME \"note\"")
        sys.exit(1)

    results = []
    changes = []

    # Resolve tradeable predictions
    if TRADE_FILE.exists():
        data = json.loads(TRADE_FILE.read_text())
        modified = False
        for p in data:
            if p.get("resolvedAt"):
                continue  # Already resolved
            deadline = datetime.strptime(p["deadline"], "%Y-%m-%d").date()
            if deadline >= TODAY:
                continue  # Not yet due

            outcome, note = resolve_trade(p)
            result = {"id": p["id"], "asset": p.get("asset", "?"), "outcome": outcome, "note": note}

            if outcome == "UNRESOLVED":
                results.append(result)
                continue

            p["resolvedAt"] = str(TODAY)
            p["resolutionNote"] = f"{outcome}. {note}"
            p["status"] = outcome
            modified = True

            results.append(result)
            changes.append(f"  {p['id']} ({p.get('asset','?')}) → {outcome}")

        if modified:
            if dry_run:
                changes.insert(0, "[DRY RUN — would write to predictions.json:]")
            else:
                with open(TRADE_FILE, "w") as f:
                    json.dump(data, f, indent=2)
                    f.write("\n")

    # Resolve geopolitical calls
    if GEO_FILE.exists():
        data = json.loads(GEO_FILE.read_text())
        modified = False
        for p in data:
            if p.get("status") != "OPEN":
                continue
            deadline = datetime.strptime(p["deadline"], "%Y-%m-%d").date()
            if deadline >= TODAY:
                continue

            outcome, note = resolve_geo(p)
            result = {"id": p["id"], "asset": p.get("title", "?"), "outcome": outcome, "note": note}

            if outcome == "FLAG_MANUAL":
                results.append(result)
                changes.append(f"  {p['id']} ({p.get('title','?')}) → FLAG_MANUAL — needs human check")
            else:
                p["status"] = outcome
                p["resolutionNote"] = note
                modified = True
                results.append(result)
                changes.append(f"  {p['id']} ({p.get('title','?')}) → {outcome}")

            if modified and not dry_run:
                with open(GEO_FILE, "w") as f:
                    json.dump(data, f, indent=2)
                    f.write("\n")

    # Print report
    if not changes:
        print("No overdue unresolved predictions found.")
        return

    print("\n".join(changes))

    if not dry_run:
        # Update track record
        resolved_results = [r for r in results if r["outcome"] not in ("UNRESOLVED", "FLAG_MANUAL")]
        if resolved_results:
            update_track_record(resolved_results)

        # Git
        subprocess.run(["git", "-C", str(REPO_DIR), "add", "data/", "_Meta/"], check=True)
        subprocess.run(["git", "-C", str(REPO_DIR), "commit", "-m", f"resolve predictions — {TODAY} feedback loop"], check=True)
        subprocess.run(["git", "-C", str(REPO_DIR), "push"], check=True)

    # Flag manual reviews
    manual = [r for r in results if r["outcome"] == "FLAG_MANUAL"]
    unresolved = [r for r in results if r["outcome"] == "UNRESOLVED"]

    if manual:
        print(f"\n⚠️  {len(manual)} geo prediction(s) need manual review:")
        for r in manual:
            print(f"   {r['id']} — {r['note']}")
        print(f"   Run: python3 scripts/resolve_predictions.py --manual PRED-ID OUTCOME \"note\"")

    if unresolved:
        print(f"\n⚠️  {len(unresolved)} prediction(s) need price data:")
        for r in unresolved:
            print(f"   {r['id']} — {r['note']}")
        print(f"   Run: python3 scripts/resolve_predictions.py --live --prices '{{\"gold\":4200, \"oil\":80}}'")

    print(f"\nResolved: {len([r for r in results if r['outcome'] not in ('UNRESOLVED', 'FLAG_MANUAL')])}")
    print(f"Flagged manual: {len(manual)}")
    print(f"Need price data: {len(unresolved)}")


if __name__ == "__main__":
    main()