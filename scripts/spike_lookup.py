"""Stage 0 spikes B and C: what does CourtListener say about a brief's citations?

Usage:
    export COURTLISTENER_TOKEN=...          # never commit this
    python scripts/spike_lookup.py path/to/brief.txt

Prints one row per citation (status and the case names CourtListener matched)
and then the request budget a full check of this brief would need.
Standard library only. Makes one request per 64,000 characters of text.
"""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

URL = "https://www.courtlistener.com/api/rest/v4/citation-lookup/"
MAX_CHARS = 64_000  # documented per-request text limit
STATUS = {
    200: "found",
    300: "ambiguous",
    400: "unrecognized reporter",
    404: "not found in CourtListener",
    429: "not looked up (over 250 in one request)",
}


def chunks(text: str, size: int = MAX_CHARS) -> list[str]:
    """Split on paragraph boundaries so no citation is cut in half."""
    out: list[str] = []
    current = ""
    for para in text.split("\n\n"):
        piece = para + "\n\n"
        if len(current) + len(piece) > size and current:
            out.append(current)
            current = ""
        while len(piece) > size:  # a single oversized paragraph
            out.append(piece[:size])
            piece = piece[size:]
        current += piece
    if current.strip():
        out.append(current)
    return out


def lookup(text: str, token: str) -> list[dict]:
    data = urllib.parse.urlencode({"text": text}).encode()
    req = urllib.request.Request(
        URL, data=data, headers={"Authorization": f"Token {token}"}
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as res:
            return json.load(res)
    except urllib.error.HTTPError as err:
        body = err.read().decode(errors="replace")
        sys.exit(f"HTTP {err.code} from CourtListener: {body[:500]}")


def case_names(result: dict) -> str:
    names = [
        c.get("case_name") or c.get("case_name_full") or "(no name field)"
        for c in result.get("clusters") or []
    ]
    return "; ".join(names) or "-"


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    token = os.environ.get("COURTLISTENER_TOKEN")
    if not token:
        sys.exit("Set COURTLISTENER_TOKEN first.")
    with open(sys.argv[1], encoding="utf-8") as f:
        parts = chunks(f.read())

    results: list[dict] = []
    for i, part in enumerate(parts):
        if i:
            time.sleep(13)  # stay under 5 requests a minute
        results.extend(lookup(part, token))

    print("| Citation | Status | CourtListener matched |")
    print("| --- | --- | --- |")
    for r in results:
        status = STATUS.get(r.get("status"), str(r.get("status")))
        print(f"| {r.get('citation')} | {status} | {case_names(r)} |")

    found = [r for r in results if r.get("status") in (200, 300)]
    opinions = {
        c.get("id") or c.get("absolute_url")
        for r in found
        for c in r.get("clusters") or []
    }
    total = len(parts) + len(opinions)
    print()
    print(f"Citations parsed: {len(results)}")
    print(f"Lookup requests (existence check): {len(parts)}")
    print(f"Distinct opinions to fetch for quote and support checks: {len(opinions)}")
    print(f"Requests for a full check: {total}")
    print(
        "At 5 per minute, 50 per hour, 125 per day: "
        f"about {max(1, -(-total // 5))} min if under 50, "
        f"{'fits' if total <= 50 else 'does NOT fit'} in one hour, "
        f"{'fits' if total <= 125 else 'does NOT fit'} in one day."
    )
    print()
    print(
        "Compare each 'found' row's matched name with the name in the brief. "
        "A real volume and page under a different case name is the case the "
        "name check exists for."
    )


if __name__ == "__main__":
    main()
