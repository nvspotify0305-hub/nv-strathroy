## Codex Session — 2026-04-04

### Active File
- Active working file: `cash_rec_period_full_test_v5.html`
- Publish/live file still untouched: `index.html`

### Current Status
- Month archive flow is working in `v5`
- March can be reopened, amended, refreshed, and re-closed
- April retains its own entries after March is amended and re-closed
- Current-month entries now survive refresh in April
- Dublin Cash bulk paste now aligns with real account rows while keeping greyed rows in sequence
- Dublin Cash footer now follows office process:
  - `Total` app-calculated
  - `Opening float` manual
  - `Office total` manual
  - `Diff = (Total + Opening float) - Office total`
- History now shows:
  - closed months from saved summaries
  - current viewed month from live values
  - real `Diff` when one exists

### Confirmed Working
- Lock screen no longer returns on same-session refresh
- Backup/import includes period archive state
- Manual Month End fields persist on refresh
- `HSBC CT Adj` persists and affects HSBC/Manual closing only
- Fresh new months clear stale prior-month carry-over
- Reopen state now survives refresh
- April can legitimately carry different opening balances for:
  - Sage
  - HSBC / Manual

### Important Carry-Forward Rule
- New month opening balances come from prior month closing balances
- Sage opening carries from prior `Clos balance` Sage
- HSBC / Manual opening carries from prior `Clos balance` HSBC / Manual
- Do not use `Debtors (Sage)` manual input as carry-forward source

### History Rule
- Closed rows use saved archived summaries
- Current row uses live month values from the currently viewed period
- `Diff` should display if there is a real difference; otherwise show `✓`

### File Layout
- Keep `cash_rec_period_full_test_v5.html` at repo root as working file
- Keep snapshot rollback files at repo root
- Archive obsolete non-snapshot trial HTML files under `archive/legacy-html`

### Next Sensible Step
1. Promote `v5` into `index.html` when ready to go live
2. Commit and push only after final smoke check
