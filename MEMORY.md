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
2026-04-01 — A Sage workbook with an extra unexpected column can break import mapping even when the underlying transactions are correct. If Sage totals look wrong but the raw workbook matches the app tabs, inspect the workbook shape first.
2026-04-01 — `cash_rec_test.html` contains the newer Sage upload ownership fix (`_sessionId`-based clear/re-import behaviour). The archived `strathroy_cash_rec_v27.html` does not.
2026-04-01 — GitHub Pages for this project now publishes from `index.html` in repo `nvspotify0305-hub/nv-strathroy`.
2026-04-01 — GitHub Pages does not solve cross-PC data continuity by itself because the app still stores state in browser `localStorage`; hosted origin data is separate from `file://` data.
2026-04-02 — Manual backup/import is now implemented as the project's cross-PC workflow: export one JSON backup file from one machine, import it on the other machine, restore into that browser's `localStorage`, then reload.
2026-04-02 — The current live GitHub deploy that includes backup/import is commit `846ecf5` on `main`.
2026-04-02 — Footer left-hand branding now explicitly keeps the version label together with `Strathroy Dairy · Cash Rec`; footer currently shows `v16`.
2026-04-02 — Active app variants now use the official logo asset at `images/Logo Official.jpg` instead of the generated placeholder wordmark.
2026-04-02 — Branding portability is improved but not fully solved: active files now share one relative image path, so consistency still depends on shipping the `images` folder with the app.
2026-04-02 — Legacy HTML variants and superseded branding assets were moved into `archive/` so the repo root stays focused on active app files and core project docs.
2026-04-02 — Cash Rec now includes a client-side privacy lock screen in `cash_rec_test.html` and `index.html` with a manual `Lock` button and 10-minute inactivity auto-lock.
2026-04-02 — Current Cash Rec lock password is `Pass01`; it is hardcoded client-side and should be treated as convenience privacy only, not true secure authentication.
2026-04-03 — `index.html` is the only safe working/live file and must remain untouched while month-period logic is unresolved.
2026-04-03 — `cash_rec_test.html` is no longer a safe base for month-period work; it contains a broken partial period experiment.
2026-04-03 — `cash_rec_period_test.html` contains useful trial work, but it is still not production-ready and should not be treated as the current safe working base.
2026-04-03 — A partial month-end snapshot model is not sufficient for this app. The correct requirement is a full per-period archive that restores all tabs and imported/live month data when switching back to a closed month.
2026-04-03 — The required month model is: closed March preserves full March state, open April starts clean except for carried opening balance, and toolbar month switching must swap the full month dataset rather than just Debtors Reconciliation values.
2026-04-03 — `cash_rec_period_full_test.html` was created as a fresh rebuild base copied from stable `index.html`; this is the correct file to continue the month-period rebuild in the next session.
2026-04-03 — Required reopen rule: if March is reopened, amended, and closed again, the March archive must be replaced with the amended full-month state and April opening balance must refresh from the new March closing balance.
2026-04-04 — Safe active month-period file is now `cash_rec_period_full_test_v2.html`; rollback copy is `cash_rec_period_full_test_snapshot_2026-04-04.html`.
2026-04-04 — Period backup/import must include `strathroy_periods_v1`; otherwise imported live data can appear while Dashboard, Daily Summary, or month history are rebuilt from stale archive state.
2026-04-04 — Same-session refresh lock behavior in the period rebuild now depends on session-scoped unlock state, so refresh should not return to the lock screen while the browser session remains open.
2026-04-04 — The manual Debtors Reconciliation inputs `In Euro`, `Credits`, and `Debtors (Sage)` are not implied by CT/DD/BOI datasets; they must be persisted explicitly as part of the saved period snapshot or they will be lost on refresh.
2026-04-04 — Final working month-period file is now `cash_rec_period_full_test_v4.html`; `index.html` remains untouched until explicit promotion approval.
2026-04-04 — Period persistence must write and read both `strathroy_periods_v1` and the app’s `DB_KEYS.periods`; split-key storage caused reopened-month refreshes to revert to stale period state.
2026-04-04 — Reopen/amend/re-close carry-forward must use prior month closing balances, not the manual `Debtors (Sage)` input. Sage and HSBC/Manual openings can legitimately differ in the next month.
2026-04-04 — History needs two sources: closed months should read archived summaries, but the currently viewed month should render from live current values so the History diff does not show stale saved numbers.
2026-04-04 — Final working month-period file advanced to `cash_rec_period_full_test_v5.html`.
2026-04-04 — Dublin Cash bulk paste must preserve row order for greyed attention rows and skip only rows with no real account code. Permanently deleted customers must also be removed from the stored customer/sample arrays so future pastes stay aligned.
2026-04-04 — Dublin Cash footer rule is operational, not derived: `Total` is app-calculated, `Opening float` is manual, `Office total` is manual, and `Diff = (Total + Opening float) - Office total`.
