#!/usr/bin/env python3
"""
Check for past-deadline predictions that haven't been resolved.

Scans data/predictions.json and data/geopolitical.json.
Flags entries where deadline has passed but no resolution recorded.

Usage:
    python3 scripts/check_outcomes.py
"""

import json
from datetime import datetime
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parent.parent
PREDICTIONS_FILE = REPO_DIR / "data" / "predictions.json"
GEO_FILE = REPO_DIR / "data" / "geopolitical.json"

TODAY = datetime.now().date()


def main():
    overdue = []

    # Tradeable predictions
    if PREDICTIONS_FILE.exists():
        data = json.loads(PREDICTIONS_FILE.read_text())
        for p in data:
            deadline = datetime.strptime(p["deadline"], "%Y-%m-%d").date()
            resolved = p.get("resolvedAt") or p.get("resolutionNote")
            if deadline < TODAY and not resolved:
                overdue.append({
                    "id": p["id"],
                    "type": "trade",
                    "asset": p.get("asset", "?"),
                    "deadline": p["deadline"],
                    "thesis": p.get("thesis", "")[:80],
                    "confidence": p.get("confidence", "?"),
                })

    # Geopolitical
    if GEO_FILE.exists():
        data = json.loads(GEO_FILE.read_text())
        for p in data:
            deadline = datetime.strptime(p["deadline"], "%Y-%m-%d").date()
            if deadline < TODAY and p.get("status") == "OPEN":
                overdue.append({
                    "id": p["id"],
                    "type": "geo",
                    "asset": p.get("title", "?"),
                    "deadline": p["deadline"],
                    "thesis": p.get("call", "")[:80],
                    "confidence": p.get("confidence", "?"),
                })

    if not overdue:
        print("All predictions up to date. No overdue unresolved entries.")
        return

    print(f"FLAGGED: {len(overdue)} overdue unresolved prediction(s)\n")
    for p in sorted(overdue, key=lambda x: x["deadline"]):
        flag = "URGENT" if datetime.strptime(p["deadline"], "%Y-%m-%d").date() < TODAY.replace(month=TODAY.month - 1) else "DUE"
        print(f"[{flag}] {p['id']} ({p['type']}) — {p['asset']}")
        print(f"      Deadline: {p['deadline']} | Confidence: {p['confidence']}")
        print(f"      {p['thesis']}")
        print()


if __name__ == "__main__":
    main()