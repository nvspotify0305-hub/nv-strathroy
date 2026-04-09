## Codex Session — 2026-04-09

### Active File
- Active working file: `cash_rec_period_full_test_v5.html`
- Publish/live file: `index.html` (promoted this session)

### Current Status
- All Dublin Cash fixes applied and live
- Dashboard Reminders promoted to middle column; Recent Activity removed
- CUSTOMERS array now fully persisted to localStorage

### Changes This Session

#### Dublin Cash — Fixes
- **keepActive persistence** — `keepActive()` now clears `CUSTOMERS[idx].flag = null` and calls `persistAll()` so the choice survives reload
- **CUSTOMERS persistence (root fix)** — `CUSTOMERS` was never saved to localStorage; added `DB_KEYS.customers`, save in `persistAll()`, and splice-load in `loadPersistedData()`. This fixes both the re-flagging on reload and "Keep active" reverting after refresh
- **Office total save** — `recalcDiff()` was reading `offCell.textContent` instead of `offCell.value`, so Office total was never saved. Fixed to `.value` and added `cfg.officeTotals[lodge] = off` before `persistAll()`
- **Negative paste** — `applyPaste()` now handles Excel accounting format `(1234.56)` → stored as `-1234.56`; standard `-1234.56` already worked
- **Inline cell edit** — Double-click any amount cell to edit inline. Enter/blur commits; Escape cancels. Saves to SAMPLE, recalculates column total, rebuilds grid, persists

#### Dashboard
- **Recent Activity removed** — replaced with Reminders (deadline driven) in the middle column
- Reminders card was previously wrapping to bottom-left of the grid (row 2); now sits correctly in the middle column below Operations Snapshot

### Confirmed Working
- Lock screen no longer returns on same-session refresh
- Backup/import includes period archive state
- Manual Month End fields persist on refresh
- `HSBC CT Adj` persists and affects HSBC/Manual closing only
- Fresh new months clear stale prior-month carry-over
- Reopen state survives refresh
- Dublin Cash inactive flag changes (Keep active / Make inactive) survive reload
- Dublin Cash Office total persists and Diff calculates correctly
- Dublin Cash negative values paste correctly (both `-1234` and `(1234)` formats)
- Dublin Cash individual cells editable via double-click

### Carry-Forward Rules (unchanged)
- New month opening balances come from prior month closing balances
- Sage opening carries from prior `Clos balance` Sage
- HSBC / Manual opening carries from prior `Clos balance` HSBC / Manual
- Do not use `Debtors (Sage)` manual input as carry-forward source

### File Layout
- Keep `cash_rec_period_full_test_v5.html` at repo root as working file
- Rollback snapshots archived to `archive/legacy-html/`

### Next Sensible Steps
1. Smoke-test Dublin Cash on live URL after push
2. Consider adding ability to add/edit reminder deadlines from the Dashboard
3. Promote `v5` into `index.html` when ready for next release
