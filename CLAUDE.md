# Strathroy Dairy — Cash Rec — Current Context

## Active Files
- Active month-period file: `cash_rec_period_full_test_v5.html`
- Stable rollback snapshots:
  - `cash_rec_period_full_test_snapshot_2026-04-04.html`
  - `cash_rec_period_full_test_v2_snapshot_before_ct_adj_2026-04-04.html`
  - `cash_rec_period_full_test_v3_snapshot_before_reopen_test_2026-04-04.html`
  - `cash_rec_period_full_test_v4_snapshot_before_dublin_fix_2026-04-04.html`
- Publish/live file: `index.html`

## Core Rules
- Surgical edits only; do not rewrite whole files without clear need
- Do not modify `index.html` unless the user explicitly approves promotion
- Do not deploy or push unless explicitly asked
- Canonical working period file is now `cash_rec_period_full_test_v5.html`
- Keep snapshot files as rollback references

## Architecture
- Single-file HTML/CSS/JS app, no build step, no server
- Local path: `C:\Claude Projects\Strathroy Projects\Cash Recs`
- GitHub Pages repo remains `nvspotify0305-hub/nv-strathroy`
- External deps remain CDN fonts + SheetJS

## Persistence
- Main data prefix: `strathroy_mar2026_`
- Settings key: `strathroy_settings_v1`
- Period archive key: `strathroy_periods_v1`
- Current code also mirrors periods to `DB_KEYS.periods` to avoid split-key refresh bugs
- Backup/import must include period archive state

## Month-Period Model
- Full month archive model is in `v5`
- Closing a month archives the full snapshot and creates the next month
- Reopening a month allows amendment, refresh, and re-close
- Re-closing a prior month must refresh the next month opening balances without wiping real next-month work

## Carry-Forward Rules
- New month openings come from prior month closing balances
- Carry forward separately:
  - Sage opening from prior `Clos balance` Sage
  - HSBC / Manual opening from prior `Clos balance` HSBC / Manual
- Do not use manual `Debtors (Sage)` input as the carry-forward source

## History Rules
- Closed months show archived saved summaries
- Current viewed month row shows live current values
- `Diff` shows the real difference if one exists, otherwise `✓`
- Hide empty placeholder future months from History

## Confirmed Working In v5
- Same-session refresh no longer returns to lock screen
- April entries persist and survive refresh
- Reopen state survives refresh
- `HSBC CT Adj` persists and affects only HSBC / Manual CT/closing
- Fresh open months clear stale prior-month carry-over
- History diff behavior now matches viewed month vs closed month expectations
- Dublin Cash bulk paste skips only blank-account rows, not greyed customers
- Dublin Cash footer rule is:
  - `Total` from pasted values
  - `Opening float` manual
  - `Office total` manual
  - `Diff = (Total + Opening float) - Office total`

## Reference Files
- `SESSION_NOTES.md` for current handoff
- `MEMORY.md` for permanent lessons
- `ROADMAP.md`, `ARCHITECTURE.md`, `DEPLOY.md` for broader context

## Deploy Rule
- Only deploy when the user explicitly says `deploy`, `push`, `go live`, or `/deploy`
## Plan Before Code Rule
Do not make any changes until you have 95% confidence in the approach.
Ask follow-up questions until you reach that level.
Show a plan — what changes, where, in what order — and wait for approval.
This applies to every task, every session, no exceptions.
