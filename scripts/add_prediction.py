#!/usr/bin/env python3
"""
Add a prediction to the Rubicon Scoreboard.

Routes tradeable predictions (with 'asset' field) to data/predictions.json
and geopolitical calls (with 'title' field) to data/geopolitical.json.

Usage:
    python3 scripts/add_prediction.py < prediction.json
    python3 scripts/add_prediction.py --file prediction.json

The prediction JSON must have these fields:
    Tradeable: id, asset, direction, predictionType, entry, target, deadline, confidence, thesis, dateOpened
    Geopolitical: id, title, call, confidence, deadline, status
"""

import json, sys, subprocess
from datetime import datetime
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parent.parent
PREDICTIONS_FILE = REPO_DIR / "data" / "predictions.json"
GEO_FILE = REPO_DIR / "data" / "geopolitical.json"

REQUIRED_TRADEABLE = [
    "id", "asset", "direction", "predictionType",
    "entry", "target", "deadline", "confidence", "thesis", "dateOpened"
]

REQUIRED_GEO = ["id", "title", "call", "confidence", "deadline", "status"]


def validate(pred, required):
    missing = [f for f in required if f not in pred or pred[f] is None]
    if missing:
        print(f"ERROR: Missing required fields: {missing}")
        sys.exit(1)


def append_to_file(filepath, pred):
    with open(filepath, "r") as f:
        data = json.load(f)
    data.append(pred)
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")


def git_commit_push(pred_id, filepath):
    subprocess.run(["git", "-C", str(REPO_DIR), "add", str(filepath.relative_to(REPO_DIR))], check=True)
    subprocess.run(["git", "-C", str(REPO_DIR), "commit", "-m", f"add {pred_id}"], check=True)
    subprocess.run(["git", "-C", str(REPO_DIR), "push"], check=True)


def main():
    # Read input
    if "--file" in sys.argv:
        idx = sys.argv.index("--file")
        filepath = Path(sys.argv[idx + 1])
        pred = json.loads(filepath.read_text())
    else:
        pred = json.load(sys.stdin)

    # Route by type
    if "asset" in pred:
        validate(pred, REQUIRED_TRADEABLE)
        target_file = PREDICTIONS_FILE
    elif "title" in pred:
        validate(pred, REQUIRED_GEO)
        target_file = GEO_FILE
    else:
        print("ERROR: Unknown prediction type. Must have 'asset' (tradeable) or 'title' (geopolitical).")
        sys.exit(1)

    # Append
    append_to_file(target_file, pred)
    print(f"Added {pred['id']} to {target_file.relative_to(REPO_DIR)}")

    # Git
    git_commit_push(pred["id"], target_file)
    print(f"Committed and pushed {pred['id']}")


if __name__ == "__main__":
    main()