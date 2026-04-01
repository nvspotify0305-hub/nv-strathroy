# CLAUDE.md — Strathroy Dairy Cash Rec App

## Project Overview

Single-file HTML/CSS/JS web app for daily cash reconciliation at Strathroy Dairy.
Built by NV (Nerijus). No framework, no build step, no server. Runs locally in browser.

**Current file:** `strathroy_cash_rec_v27.html`
**Version:** v27 (30 Mar 2026)
**Status:** Core rec working and verified against live Sage export. Ready for Claude Code handoff.

---

## Architecture

- **Single HTML file** — all CSS, JS, and data embedded inline
- **SheetJS CDN** — loaded from cdnjs for .xlsx parsing and export
- **Storage:** localStorage with in-memory fallback — key prefix `strathroy_mar2026_`
- **Settings:** localStorage key `strathroy_settings_v1`
- **Data:** March 2026 pre-loaded as JS constants, overridden by localStorage on load
- **No build process** — edit HTML file directly, open in browser
- **Target screen:** 1920×1080 (max-width: 1920px)
- **Recommended browser:** Chrome or Edge (Firefox may block localStorage on file://)

---

## Brand & Design

| Token | Value |
|---|---|
| Primary / Navy | `#1B3F8D` |
| Secondary / Green | `#319B4C` |
| Background | `#F0F2F6` |
| Card | `#FFFFFF` |
| Fonts | DM Serif Display (brand/logo) + DM Sans (UI) + DM Mono (numbers) |
| Logo | Strathroy S icon — embedded as base64 in topbar + footer + favicon |
| Watermark | Large faint S bottom-right via `body::before` |
| Footer | `NV · [year] · v27` |

---

## Screen Structure

```
TOPBAR (sticky navy)
  [Logo S icon] Strathroy Dairy / Cash Rec
  [Dashboard] [Daily] [Month End] [History]   ← main nav
  [◄ Mar 2026 ►] [Open] [Close Month] [⚙]    ← month bar + settings gear

SCREENS:
  Dashboard   — live debtors snapshot, month totals, dynamic alerts
  Daily       — sub-tabs (sticky): Summary | BOI Cash | Dublin Cash | CT | DD
  Month End   — Section 1 (Sage import) + Section 2 (Debtors Rec)
  History     — all closed months table (sample data only)

SETTINGS DRAWER (slides in from right, gear ⚙ button)
  Tabs: Classification Rules | Thresholds | BOI→HSBC | Period
```

---

## Data Model

### Pre-loaded constants (top of `<script>`) — overridden by localStorage on load

```js
CUSTOMERS      // Array of {acct, name, flag} — 51 customers (March list)
WE_CONFIG      // Object keyed by WE ref — labels, totals, floats, officeTotals, posted, postDate
SAMPLE         // Object keyed by WE ref — 2D array [custIdx][lodgeIdx] = amount|null
CT_DAYS        // Array of {date, total, count, rows[]} — sample rows only (3 per day)
DD_DATA        // Array of {date, amount, ref}
COUNTRY_DATA   // Array of {date, ref, rep, amount, posted}
```

### Runtime JS state (persisted to localStorage)
```js
ctDays[]       // All pasted CT days — persisted
ddData[]       // All DD entries — persisted
boiData[]      // All BOI Cash entries — persisted (renamed from Country Cash)
WE_CONFIG      // Dublin Cash config — persisted (post status, dates, floats)
SAMPLE         // Dublin Cash amounts — persisted
sageUploads[]  // Sage import sessions — persisted
sageAllRows[]  // All classified Sage rows — persisted (dates as ISO strings)
typoQueue[]    // Pending C/T typo verifications — persisted
dismissedAlerts// Set — persisted
snoozedAlerts  // Set — persisted
appSettings    // Settings object — persisted under strathroy_settings_v1
```

### localStorage keys
```
strathroy_mar2026_ctDays
strathroy_mar2026_ddData
strathroy_mar2026_boiData
strathroy_mar2026_weConfig
strathroy_mar2026_sample
strathroy_mar2026_sageUploads
strathroy_mar2026_sageAllRows
strathroy_mar2026_typoQueue
strathroy_mar2026_alerts
strathroy_settings_v1
```

### Persistence flags (critical — prevents constants overwriting cleared data)
```js
_ctLoaded   // true if ctDays loaded from localStorage (even if [])
_ddLoaded   // true if ddData loaded from localStorage (even if [])
_boiLoaded  // true if boiData loaded from localStorage (even if [])
```
`init*()` functions check these flags before loading hardcoded constants. This prevents deleted arrays from being repopulated on reload.

### WE_CONFIG / SAMPLE persistence
On load: **fully replaced** from storage (not merged). This ensures deleted WE batches don't reappear from the hardcoded constant.

---

## Key Business Logic

### Classification Engine (classifySageRef — ref, type, net)

**Critical principle:** SP rows classify by ref first — same rules as SR. SP only falls through to `rb` if its ref matches nothing operational. This ensures SP/CT offsets CT, SP/DD offsets DD, SP/PD offsets Country, etc.

Priority order — first match wins:

| Priority | Rule | Type |
|---|---|---|
| 1 | Custom rules from Settings (user-defined) | user-specified |
| 2 | WE + digits (NOT WEX) — SR or SP | cash |
| 3 | Blank ref + SR + amount matches WE_CONFIG lodgement total | cash |
| 4 | Blank ref + SR + no WE match | country |
| 5 | CT exact | ct |
| 6 | C or T single char | typo (quarantined) |
| 7 | DD exact | dd |
| 8 | 4–7 digit numeric ref (cheques) | country |
| 9 | CONTRA exact | contra |
| 10 | SETT DISC / SETTDISC prefix | disc |
| 11 | WEX prefix | country |
| 12 | CSH APO prefix | country |
| 13 | LATM prefix | country |
| 14 | PD + number | country |
| 15 | CT + number | country |
| 16 | CREDIT TRANSFE prefix | country |
| 17 | 365 MILK prefix | country |
| 18 | CITY DUB prefix | country |
| 19 | PMC prefix | country |
| 20 | EFT exact | country |
| 21 | SP type with no operational ref match | rb |
| 22 | Everything else | unclassified |

### Sign convention — uniform for ALL rows
```
signed = -r.net
SR NetValue is negative in Sage → -(-x) = positive collection
SP NetValue is positive in Sage → -(+x) = negative reversal (reduces bucket total)
```
Every category (ct, dd, cash, country, rb, disc, contra) uses `signed = -net`. No exceptions. Rev & Bounces no longer uses raw Sage sign.

### Contra classification
- Contra = customer offset (SR + SP net to zero on same account, e.g. credit note vs invoice)
- **No bank movement** — does not go through BOI or HSBC
- Classified as `contra` bucket in Section 1
- Included in **Sage side** of Factors chq: `-(cash + country + contra)`
- Shown in BOI Account section of Daily Summary (Sage column only, no App entry)
- App side Factors chq = `-(Dublin + BOI Cash + charges - interest)` — Contra excluded from App because it never physically transfers
- BOI Cash diff in Summary = +Contra amount — this is expected, shown as `+15,748.68 contra ℹ` not amber ⚠
- Drill-down suppressed when diff is fully explained by Contra

### BOI→HSBC transfer
```
App side:
  Dublin Cash (WE_CONFIG totals) 
+ BOI Cash posted (boiData)
+ Bank charges (Settings → BOI→HSBC)
- Credit interest (Settings → BOI→HSBC)
= Transfer to HSBC = Factors chq HSBC column

Sage side:
  Dublin Cash (Sage cash rows)
+ BOI Cash (Sage country rows)
+ Contra (Sage contra rows)
= Sage BOI Total = Factors chq Sage column
```

### Daily Summary structure
Columns: Item | App | Sage | Diff

**BOI Account section:**
- Dublin Cash (posted) — App vs Sage
- BOI Cash (posted) — App vs Sage (diff = Contra, shown as ℹ)
- Contra — Sage only (informational)
- Bank only (unposted) — App only
- Raw BOI Total — App and Sage
- + Bank charges / − Credit interest — App only (editable inline)
- Transfer to HSBC — App only (navy)

**HSBC Account section:**
- Credit Transfers (CT) — App vs Sage, diff cell
- Direct Debits (DD) — App vs Sage, diff cell

**Sage Only section:**
- Discount (Sett Disc) — App mirrors Sage (same source)
- Rev & Bounces (SP) — App mirrors Sage

**Total Receipts (net)** — App and Sage, diff cell (bold, navy, double border)
```
= Raw BOI + CT + DD − Disc − RB
```

### Section 2 Debtors Rec columns
- **Sage column**: CT, DD, Discount, Factors chq — fed from `renderSageImport()`
- **HSBC/Manual column**: CT from `ctDays`, DD from `ddData`, Factors chq from app BOI totals + contra (from `_sageTotals`) + charges, Discount mirrors Sage, Inv EURO + Credits = manual entry
- **Factors chq Sage** = `-(cash + country + contra)` from import totals
- **Factors chq HSBC** = `-(Dublin + BOI Cash + charges - interest)` from live app arrays

### Import engine
- **Dedup**: after every merge, rows are deduped by `acct|date.getTime()|ref|net`
- **Clear**: removes all rows in the session's date range regardless of source file; if last upload cleared, wipes `sageAllRows` and resets `_sageTotals`
- **Reset All Sage Data button**: red button in Section 1 — force-wipes all Sage state from memory + localStorage. Use when stale data causes doubled totals.
- **Multi-upload merge**: date-range-aware — removes prior rows in overlap range before adding new

### Dashboard alerts — dynamic (not hardcoded)
`renderDynamicAlerts()` called from `renderDashboard()` on every persist:
- Unposted WE batches → amber alert per batch
- Pending DDs (not confirmed) → info alert with count + total
- CT last entry info → green info always shown

### BOI Cash tab
- Renamed from "Country Cash" throughout (labels, dropdowns, export sheet, drill-down)
- Multi-day paste defaults to `posted: true` (BOI cash is received)
- WE batch delete button on unposted batches only (red ✕)

### Date format standard
- All dates stored and displayed as `DD Mon` (e.g. `02 Mar`)
- `normaliseDateToDisplay()` handles: Date objects, dd/mm/yyyy, yyyy-mm-dd, dd-mm-yyyy, Excel serials
- Sage import dates normalised on ingest

---

## Persistence Engine

```js
DB_PREFIX = 'strathroy_mar2026_'

persistAll()         // Called after every mutation — saves all arrays + calls renderDashboard()
loadPersistedData()  // Called at init — sets _*Loaded flags, restores from localStorage
checkStorage()       // Tests localStorage availability — falls back to _memStore
```

**Init sequence (critical order):**
```
loadSettings()
loadPersistedData()   // Sets _ctLoaded, _ddLoaded, _boiLoaded flags
initBOI()             // Skips constants if _boiLoaded
initDD()              // Skips constants if _ddLoaded
initCT()              // Skips constants if _ctLoaded
buildDCBlocks()
renderBOI() / renderDD() / renderCT() / buildDCBlocks()
renderSageImport() (if uploads exist)
recalcRec()
renderDashboard()
renderDailySummary()
```

---

## What's Built (v27)

### Core functionality — complete and verified against live Sage export
- [x] Full navigation — 4 screens, 5 daily sub-tabs
- [x] Settings drawer — 4 tabs (Rules/Thresholds/BOI→HSBC/Period)
- [x] Logo + favicon embedded as base64
- [x] **localStorage persistence** — all arrays, init flags prevent constant reload on delete
- [x] **WE_CONFIG full replace on load** — deleted batches don't reappear

### Dashboard
- [x] Live figures from runtime arrays
- [x] Month totals with 2dp formatting
- [x] Dynamic alerts (WE unposted, DD pending, CT last entry)
- [x] CT missing day detection (Mon–Fri gap scan)

### BOI Cash (renamed from Country Cash)
- [x] Inline edit (dblclick), sortable, Posted/Bank only toggle
- [x] Multi-day paste (defaults to posted:true)
- [x] WE batch delete button (unposted only)
- [x] .xlsx export

### Dublin Cash
- [x] 3 WE batches, full 51-customer grid
- [x] Post/unpost with auto-collapse/expand
- [x] Paste modal per lodgement
- [x] Column hide/show, inactivity flags
- [x] Sage Export CSV + .xlsx export

### CT
- [x] Day-level sort, full transaction expand
- [x] Confirm/Discard flow, dedup on paste
- [x] C/T typo quarantine, delete day
- [x] Per-day CSV + .xlsx export all

### DD
- [x] Inline edit, sortable, Pending/Hit bank toggle
- [x] Multi-day paste upload, .xlsx export

### Month End — Section 1 (Sage Import)
- [x] SheetJS .xlsx upload (click or drag)
- [x] Classification engine — 22 rules, SP netting by ref (not blanket rb)
- [x] Uniform sign convention: `signed = -net` for all types
- [x] Contra classified separately, shown in BOI Account section
- [x] Multi-upload with date-range merge + acct/date/ref/net dedup
- [x] Per-upload Clear — removes by date range, resets totals if last upload
- [x] **Reset All Sage Data** button — hard wipe of all Sage state
- [x] Unclassified quarantine panel with per-row release
- [x] C/T typo quarantine panel

### Month End — Section 2 (Debtors Rec)
- [x] Sage column fed from import (CT, DD, Discount, Factors chq incl. Contra)
- [x] HSBC/Manual column fed from live app data
- [x] Inv EURO + Credits: manual entry, both columns
- [x] Closing balance + debtors diff live

### Daily Summary
- [x] Full BOI Account section with Contra row + Raw BOI Total (App + Sage)
- [x] HSBC Account section (CT, DD with diffs)
- [x] Sage Only section (Disc, RB — App mirrors Sage)
- [x] **Total Receipts (net)** row — App + Sage + diff, verified 0.00 ✓ against live data
- [x] BOI Cash diff shows `contra ℹ` note when diff = Contra amount (not amber ⚠)
- [x] Drill-down suppressed when BOI Cash diff fully explained by Contra
- [x] Import status banner (pending/live)

---

## Verified March 2026 Figures (from live Sage import — 1720 rows)

| Category | Sage Total | Rows |
|---|---|---|
| CT (net of SP offsets) | €2,958,217.57 | 332 |
| DD (net of SP reversals) | €426,074.69 | 974 |
| Dublin Cash | €35,110.05 | 138 |
| BOI Cash (Country) | €110,279.50 | 229 |
| Contra | €15,748.68 | 10 |
| Discount | €72,273.63 | 36 |
| Rev & Bounces | €0.00 | 0 |
| **Total Receipts (net)** | **€3,474,345.79** | — |

App BOI Cash tab total = **€126,028.18** (BOI Cash + amounts that Sage shows as Contra)
Transfer to HSBC = €126,028.18 + €35,110.05 + €17.50 = **€161,155.73**
Sage Factors chq = €110,279.50 + €35,110.05 + €15,748.68 = **€161,138.23**
Diff = **€17.50** (bank charges only) ✓

---

## What's NOT Built Yet

- [ ] **Month-end balance checks** — HSBC: Opening − CT − DD − Factors = Closing; verify against bank statement
- [ ] **Opening balance carry-forward** — closing → next month opening
- [ ] **New month creation** — template from current month customer list + new localStorage prefix
- [ ] **Month selector** — past months load read-only from History
- [ ] **History tab** — currently sample data only, not connected to closed months
- [ ] **Print/PDF export** — month end rec printable summary
- [ ] **Mileage tab** — Barry O'Reilly, Declan Wren, Gavin Joyce, Paul Duffy
- [ ] **Multi-device sync** — GitHub storage or similar (planned for 2–3 user expansion)
- [ ] **Rolling ±1 day timing match** — engine built (`checkTimingOffset`) but not visually wired
- [ ] **Discount in App column** — currently mirrors Sage; no independent app entry path

---

## Session History

### Session 1 (26 Mar 2026)
v1→v4: Full design spec, all March data pre-loaded.

### Session 2A (27 Mar 2026)
v5→v8: Dashboard alerts, BOI inline edit, Dublin Cash post/collapse, CT sort/expand/dedup/export, DD sort/edit, Month End Section 1+2 fixes.

### Session 2B (30 Mar 2026)
v9→v15: C/T typo quarantine, duplicate detection, multi-day upload, Sage import engine (SheetJS), classification engine, Section 2 debtors rec, Daily Summary import-aware, Settings engine, localStorage persistence.

### Session 3 (30 Mar 2026)
v16→v27: Major classification overhaul and live testing against real Sage export.

**v16:** Init persistence bug fixed (_ctLoaded/_ddLoaded/_boiLoaded flags), WE_CONFIG full-replace on load, Dublin Cash WE batch delete button.

**v17:** SP netting by ref — SP rows classify by ref first (same rules as SR), only orphan SPs go to rb. Uniform sign convention (`signed = -net`) for all categories including rb. This was the fundamental classification fix.

**v18:** Modal max-height + preview panel scroll — multi-day paste Import button was unreachable with 30+ rows.

**v19:** BOI Cash rename (from Country Cash) throughout. Multi-day paste defaults to `posted: true`.

**v20:** Contra included in Factors chq Sage column. Dashboard `interest` variable fix. Transfer calc consistent across renderDashboard/renderDailySummary/recalcRec.

**v21:** Dashboard month totals use 2dp. Hardcoded sample alerts removed, replaced with `renderDynamicAlerts()` (WE unposted, DD pending, CT last entry).

**v22:** Sage import row-level dedup (acct+date+ref+net) — prevents doubled totals on re-upload.

**v23:** Clear button fix — removes rows by date range (not by source filename), resets `_sageTotals` and Summary when last upload cleared.

**v24:** Summary table rebuilt — Contra row added to BOI Account, Raw BOI Sage total, Disc/RB get App column, Total Receipts (net) row with diff. Reset All Sage Data button added. renderSageImport function declaration restored after accidental removal.

**v25:** BOI Cash diff — shows `contra ℹ` in grey when diff equals Contra (not amber ⚠). Drill-down suppressed when diff fully explained by Contra.

**v26:** Attempted to include Contra in App Transfer to HSBC — reverted. Contra is a customer offset with no bank movement; it belongs in Sage side only.

**v27:** Restored to v24 base, applied only the cosmetic Contra diff fix from v25. Confirmed: Total Receipts net = 0.00 ✓ against live March 2026 Sage export.

---

## Key Decisions & Principles

- **Post = locked**: Dublin Cash diff check before posting is the sole control gate
- **SP netting**: SP rows classify by ref first — SP/CT nets CT, SP/DD nets DD, SP/country nets Country. Only orphan SPs (no operational ref) go to Rev & Bounces
- **Uniform sign**: `signed = -net` for every row, every category. No exceptions.
- **Contra = Sage Only on App side**: no bank movement, not in App Transfer to HSBC. Sage Factors chq includes Contra; App Factors chq does not. Expected diff = Contra amount, shown as ℹ
- **WE ref beats all**: WE-prefixed rows always Dublin Cash regardless of transaction type
- **Init flags**: `_ctLoaded` etc prevent hardcoded constants overwriting cleared localStorage arrays
- **WE_CONFIG/SAMPLE full replace**: never merge on load — deleted batches must stay deleted
- **Dedup on import**: `acct|date|ref|net` key — re-uploading same file is idempotent
- **Clear by date range**: not by filename — prevents stale rows from prior sessions surviving
- **BOI Cash paste = posted:true**: received funds default to posted state
- **Custom rules first**: `applyCustomRules()` called before built-in rules in classifySageRef
- **Storage**: Chrome/Edge only. Firefox may block localStorage on file://

## Open Items for Claude Code

1. **Month-end balance checks** — wire closing balance to bank statement figure
2. **New month workflow** — new localStorage prefix, carry forward opening balance and customer list
3. **History tab** — connect to closed month data
4. **Print/PDF export** — month end summary printable
5. **Mileage tab** — 4 reps: Barry O'Reilly, Declan Wren, Gavin Joyce, Paul Duffy
6. **Multi-device sync** — GitHub or similar storage backend
7. **Discount App column** — currently no independent entry; consider if needed
