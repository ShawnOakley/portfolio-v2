# Stage 0 spikes

Three short tests that settle open questions in the plan. Record each result
here; they decide wording on the home page and the design of the live demo.
Keep raw inputs and outputs in `docs/spikes/raw/` (git-ignored).

## A. Does CourtListener allow cross-origin requests from a browser?

Open the deployed site, open the browser console, and run (with your token):

```js
fetch("https://www.courtlistener.com/api/rest/v4/citation-lookup/", {
  method: "POST",
  headers: {
    Authorization: "Token YOUR_TOKEN",
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({ text: "Obergefell v. Hodges, 576 U.S. 644 (2015)" }),
})
  .then((r) => r.json())
  .then(console.log, console.error);
```

A JSON array means cross-origin works. A CORS error in the console means it
does not. Either way the engine stays in Python; this only records whether a
browser-direct path is possible at all.

- Result: The browser is not blocked. On 2026-11-16, from
  https://portfolio-v2-sage-xi-69.vercel.app, the page's own `fetch` of
  `POST /api/rest/v4/citation-lookup/` read the response. A placeholder token
  returned HTTP 401 and `{"detail":"Invalid token."}`. That is not a citation
  array, and it is not a CORS error. A real token is still required before
  this path can be treated as a working lookup.
- Date: 2026-11-16

## B. What does the lookup return for the Mata v. Avianca citations?

1. From the CourtListener docket for Mata v. Avianca (S.D.N.Y. 22-cv-1461),
   download the March 1, 2023 opposition to the motion to dismiss.
2. Convert it to text: `pdftotext -layout filing.pdf docs/spikes/raw/mata.txt`.
   If the PDF has no text layer, that is itself a finding: note it.
3. Run `python scripts/spike_lookup.py docs/spikes/raw/mata.txt`.
4. Paste the table below. For every row marked "found", compare the matched
   name with the name in the brief.

- Result table:
- Fabricated citations reported "not found":
- Fabricated citations reported "found" under a different case name:
- Citations the parser missed entirely (compare by eye with the filing):

## C. How many requests does one brief need?

The same script prints the budget. Run it on the Mata filing and on one
ordinary brief of 20 to 30 pages.

- Requests for a full check (Mata):
- Requests for a full check (ordinary brief):
- Your CourtListener tier and limits:
- Decision for the live demo's opinion cap:
