## Codex Session — 2026-04-09

### Active File
- Working file: `cash_rec_period_full_test_v5.html`
- Publish/live file: `index.html` (promoted this session ×3)

### Completed This Session

#### Dublin Cash
- keepActive now persists: `CUSTOMERS[idx].flag = null` + `persistAll()`
- Root fix: CUSTOMERS array added to `DB_KEYS`, saved in `persistAll()`, splice-loaded in `loadPersistedData()` — flag changes survive reload
- Office total save fixed: `recalcDiff` was reading `offCell.textContent` (always empty on an input) — changed to `.value`, added `cfg.officeTotals[lodge] = off` before persist
- Negative paste: `applyPaste` now handles `(1234.56)` accounting format → stored as `-1234.56`
- Inline cell edit: double-click any amount cell to edit; Enter/blur commits, Escape cancels; saves to SAMPLE, recalculates column total, rebuilds grid, persists
- **Delete single lodgement column:** `✕` button on each lodgement `<th>` (unposted batches only); splices all parallel arrays + SAMPLE, resets hidden-col state, rebuilds. If last lodgement, offers to delete whole batch instead.

#### Dashboard
- Recent Activity card removed
- Reminders (deadline driven) moved into middle column (was wrapping to bottom-left row 2 of grid)

#### Version
- Title tag corrected from v27 → v16 to match JS/console strings (all now v16)

### Known Issues
- None outstanding

### Next Session
1. Smoke-test all Dublin Cash fixes on live URL
2. Consider making Dashboard reminder deadlines editable from the UI (currently hardcoded in JS)
