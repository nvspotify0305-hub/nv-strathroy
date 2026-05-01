## Codex Session — 2026-05-01

### Active File
- Working file: `cash_rec_period_full_test_v5.html`
- Publish/live file: `index.html` (promoted twice this session)
- Commits pushed:
  - `2bbcf60` — Deploy v18: Add Debtors Rec XLSX export button and function
  - `09543d2` — Deploy v19: Add Summary tab XLS export; remove version from browser tab title
- Live URL: `https://nvspotify0305-hub.github.io/nv-strathroy/`

### Completed This Session

#### Feature — Summary Tab XLS Export
- Added `↓ Export XLS` button to the Summary tab card header (right side, alongside "Live · vs Sage import")
- Added `exportSummary()` function using HTML-to-Excel blob approach (no new CDN, full colour support)
- Reads all live DOM values: `sum-app-*`, `sum-sage-*`, `sum-diff-*`, `adj-charges`, `adj-interest`, `sum-app-transfer`, `bchk-hsbc-*`, `bchk-boi-*`, `sic-*`
- Exports 4 sections: Receipts Reconciliation · Transfer Adjustments · Bank Posting Check · Sage Import Check
- Styling: navy title bar, navy section headers, grey column headers with navy underline, grey total rows, green ✓ for balanced diffs, red for non-zero diffs, amber for unposted, Courier New for all amounts
- Bank Posting Check: HSBC (002) and BOI (005) side-by-side in 4 columns
- Filename: `Summary_[Month]_[Year].xls`

#### Polish — Browser Tab Title
- Removed `v16` version string from `<title>` tag only
- Tab now shows "Strathroy Dairy — Cash Rec" (no version)
- Footer and console version strings left unchanged

#### Feature — Debtors Rec XLSX Export (earlier in session)
- Added `↓ Export XLSX` button in Debtors Rec section (section 2)
- Added `exportDebtorsRec()` using SheetJS; reads all `rec-*` element IDs
- Filename: `DebtorsRec_[Month]_[Year].xlsx`

### Next Session
1. Smoke-test Summary export on live URL — click `↓ Export XLS`, verify all 4 sections, colours, and ✓ ticks
2. Smoke-test Debtors Rec export — verify all rows/values correct
3. Complete April reconciliation (Dublin Cash office totals, Factors chq HSBC side)

---

## Codex Session — 2026-04-30

### Active File
- Working file: `cash_rec_period_full_test_v5.html`
- Publish/live file: `index.html` (promoted twice this session)
- Live site pushed to GitHub Pages from `main`
- Commits pushed:
  - `b5fa568` — Fix classification rule for CSH/CHS APO/PO variants; make unclassified Review status clickable
  - `64c849f` — Fix Sage dedup to cross-file only; preserve identical SR rows within same upload
- Live URL: `https://nvspotify0305-hub.github.io/nv-strathroy/`

### Completed This Session

#### Investigation — April Sage Import (`apr 26.xlsx`)
- Confirmed column detection works correctly for long Sage field names (e.g. `SLPostedCustomerTrans.NetValue`)
- No extra column issue — all 5 columns resolved correctly

#### Fix 1 — Classification: CSH/CHS APO/PO variants
- Two rows were landing in Unclassified (€2,635 total, 2 rows) instead of Country Cash:
  - `CHS APO 0308-01` (€1,690, acct M065, 7 Apr) — "CHS" is a transposition of "CSH"
  - `CSH PO 0308-01` (€945, acct M065, 14 Apr) — "PO" is an abbreviation of "APO"
- Pattern `/^CSH\s*APO/i` broadened to `/^(CSH|CHS)\s*(APO|PO)\b/i`
- After fix: both rows auto-classify as Country Cash; Unclassified shows ✓ Clean; Factors chq Sage updates correctly

#### Fix 2 — UX: ⚠ Review status now clickable
- The `⚠ Review` text in the Unclassified classification row was not a button — clicking it did nothing
- Now scroll-links to the unclassified release panel above on click (cursor:pointer + scrollIntoView)

#### Fix 3 — Sage dedup: cross-file only
- Root cause: `apr 26.xlsx` contains J059 CT −€3,594 twice on 24 Apr (posted twice, one reversed by SP same day)
- Old dedup (within the whole merged array) removed one SR, leaving the SP with no row to net against → J059 net = 0, CT total €3,452,232 instead of correct €3,455,826, diff +€3,594 vs app
- Fix: dedup now only removes rows from previous-session uploads that match the new upload; rows within the same file upload are kept intact
- After fix: both SR rows survive, SP cancels one, J059 net = +€3,594 ✓, CT diff disappears
- Lesson recorded in `tasks/lessons.md`

### Next Session
1. Smoke-test live URL: re-drop `apr 26.xlsx` and confirm Unclassified = ✓ Clean, CT diff = 0
2. Enter Dublin Cash office totals to clear the red Diff on Dublin Cash lodgements
3. Complete April reconciliation (Factors chq HSBC side — enter bank charges/interest as needed)

## Codex Session — 2026-04-16

### Active File
- Publish/live file edited directly: `index.html`
- Live site pushed to GitHub Pages from `main`
- Commit pushed: `d7d93f8` — `Fix dashboard alerts and CT duplicates`
- Live URL: `https://nvspotify0305-hub.github.io/nv-strathroy/`

### Completed This Session

#### Logo
- Reduced topbar logo width from `152px` to `118px`
- Reduced lock screen logo width from `138px` to `112px`

#### Dashboard Alerts
- Added period-aware date helpers:
  - `parsePeriodDate`
  - `isCurrentPeriodDate`
  - `periodDateKey`
- Right-hand Dashboard alerts now filter to the active/current month only:
  - unposted WE lodgements
  - pending DD confirmations
  - CT last-entry summary
  - CT missing weekday scan
- `renderDashboard()` now refreshes CT missing-day alerts so month navigation does not leave stale closed-month alerts visible.

#### Daily CT
- CT paste now blocks duplicate days by date, not just matching date + total.
- Duplicate CT day import is stopped before preview confirmation.
- `confirmCT()` also re-checks duplicate dates before adding, preventing race/stale pending imports.
- User-facing warning says to delete the existing CT day first if it needs replacing.

### Verification
- Ran inline JavaScript syntax check with Node: OK
- Ran `git diff --check`: OK, only existing Git CRLF warning
- Pushed `main` to `origin/main`

### Local Worktree Notes
- These files remain local/uncommitted and were intentionally not included in the live push:
  - `images/Logo Official.jpg`
  - `images/Logo Official.original.jpg`
  - `error images/`
  - `project-intelligence.skill`
  - `tasks/`

### Next Session
1. Smoke-test live URL after GitHub Pages propagation.
2. Confirm Dashboard alerts no longer show closed-month items after switching periods.
3. Confirm CT duplicate-day paste is blocked for existing days and still allows new days.

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
