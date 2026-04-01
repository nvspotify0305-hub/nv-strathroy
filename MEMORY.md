# Project Memory
> Permanent record. Never delete entries. Append only.
> Each entry prefixed with date.

## Architectural Decisions
2026-03-30 — Single-file HTML/CSS/JS architecture chosen for simplicity and portability. No build step, no server, no framework. All code inline. Runs from file:// in Chrome/Edge.
2026-03-30 — localStorage with `strathroy_mar2026_` key prefix chosen for data persistence. In-memory fallback (`_memStore`) added for environments where localStorage is unavailable (Firefox file://, private mode).
2026-03-30 — SheetJS (CDN) chosen for .xlsx import/export — no npm dependency, works in browser.
2026-03-30 — Init flags (`_ctLoaded`, `_ddLoaded`, `_boiLoaded`) introduced at v16 to prevent hardcoded constants overwriting cleared localStorage arrays on page reload.
2026-03-30 — Dedup key `acct|date|ref|net` on Sage import makes re-uploads idempotent.

## Abandoned Approaches
2026-03-30 — No abandoned approaches documented at initial setup.

## Hard Rules Discovered
2026-03-30 — SP netting by ref: SP rows must classify by reference first (same rules as SR); only orphan SPs with no matching ref go to Rev & Bounces.
2026-03-30 — Uniform sign convention: `signed = -net` for every row, every category — no exceptions.
2026-03-30 — Contra = Sage only: contra entries have no bank movement and must not appear in App Transfer to HSBC.
2026-03-30 — WE ref beats all: any row with a WE-prefixed reference always classifies as Dublin Cash regardless of other rules.
2026-03-30 — Post = locked: Dublin Cash diff check before posting is the sole control gate.
2026-03-30 — WE_CONFIG/SAMPLE are full-replace on load: deleted batches stay deleted, never merge.

## Key Lessons Learned
2026-03-30 — Version strings in this project drift: filename (v27), title tag (v8), and footer/console (v16) all show different numbers. Canonical version is the filename. Update all three on every release.
2026-04-01 — `cash_rec_test.html` is currently the active troubleshooting file for Daily Summary / Sage import comparison issues; user requested fixes be limited there when diagnosing reconciliation behaviour.
2026-04-01 — Daily Summary date-level discrepancies can be cosmetic timing shifts; adjacent-day and weekend-shift offsets must be tolerated in drill-down matching instead of being surfaced as hard mismatches.
2026-04-01 — Local `file://` portability remains fragile for branding. Logo/favicon consistency across PCs requires either embedded assets or guaranteed identical relative `images` paths on every machine.
