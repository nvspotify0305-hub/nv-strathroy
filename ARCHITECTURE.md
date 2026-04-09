# Strathroy Dairy Cash Rec App Architecture

## Overview

Single-file HTML/CSS/JS reconciliation app for Strathroy Dairy.

- Live publish file: `index.html`
- Test period rebuild file: `cash_rec_period_test.html`
- Older troubleshooting file: `cash_rec_test.html`
- Publish file: `index.html`
- Legacy reference area: `archive/legacy-html/`
- Stack: vanilla HTML/CSS/JS, SheetJS via CDN, browser `localStorage`
- Runtime model: no build step, no server, no backend

## File Roles

| File | Role |
|---|---|
| `index.html` | Live file and only safe working base right now |
| `cash_rec_period_test.html` | Test rebuild file for month-period logic; partial only, not production-ready |
| `cash_rec_test.html` | Older troubleshooting file; contains a broken partial period experiment |
| `archive/legacy-html/cash_rec_design_test.html` | Design/test variant kept out of the root |
| `archive/legacy-html/strathroy_cash_rec_v27.html` | Older local reference variant |
| `archive/legacy-html/cash_rec_test_backup_2026-04-01_before_sage_fix.html` | Dated backup snapshot |

## Runtime Model

- Everything is inline in one HTML file: layout, styles, app logic, and seeded data.
- SheetJS is loaded from CDN for `.xlsx` import/export.
- State is persisted in browser storage with an in-memory fallback.
- Hosted GitHub Pages data is separate from local `file://` browser data.
- Cross-PC transfer is currently handled by manual `Export Backup` and `Import Backup`.

## Persistence

Current storage prefix and settings key used by the app:

```js
DB_PREFIX = 'strathroy_mar2026_'
SETTINGS_KEY = 'strathroy_settings_v1'
```

Persisted runtime collections include:

```js
ctDays[]
ddData[]
boiData[]
WE_CONFIG
SAMPLE
sageUploads[]
sageAllRows[]
typoQueue[]
dismissedAlerts
snoozedAlerts
appSettings
```

Critical load flags:

```js
_ctLoaded
_ddLoaded
_boiLoaded
```

These prevent seeded constants from repopulating arrays that were intentionally cleared and then persisted as empty.

## Main Screens

- Dashboard
- Daily
- Month End
- History

Daily sub-tabs:

- Summary
- BOI Cash
- Dublin Cash
- CT
- DD

## Import And Classification

Sage import is centered around a classification engine that maps rows into operational buckets.

Core rules that matter most:

- Custom user rules run first.
- `WE` references classify to Dublin Cash.
- Blank `SR` refs attempt WE amount matching before falling back to Country/BOI Cash.
- `CT` refs classify to CT.
- `DD` refs classify to DD.
- Numeric cheque-like refs classify to Country/BOI Cash.
- `CONTRA` classifies separately.
- `SP` rows classify by reference first, not as blanket reversals.
- Unmatched `SP` rows fall through to Rev & Bounces.

Sign convention:

```js
signed = -net
```

That convention is applied uniformly across all imported row types.

## Import State Rules

- Sage uploads are deduped by `acct|date.getTime()|ref|net`.
- Re-import logic is date-range aware.
- Clearing an upload removes rows by date range, not just filename.
- The newer working/publish files track upload ownership with `_sessionId`.
- `Reset All Sage Data` force-clears persisted Sage import state.

## Daily Summary And Month-End Logic

Important accounting behaviors:

- Contra is a customer offset and has no bank movement.
- Sage-side Factors chq includes Contra.
- App-side transfer to HSBC does not include Contra.
- BOI Cash diffs explained entirely by Contra are informational rather than warning states.
- Total Receipts (net) is calculated from app and Sage category totals and compared directly.

## Branding

- Active app variants now use `images/Logo Official.jpg` for the visible logo.
- Branding consistency still depends on the `images` folder being present alongside the app files.
- Version strings still require manual review because filenames and visible labels can drift.

## Current Known State

- `cash_rec_test.html` contains the newer upload ownership fix using `_sessionId`.
- `index.html` is the live file and the only safe working base right now.
- `cash_rec_period_test.html` is where period work was isolated, but it is still not safe to treat as a working base.
- The current period rebuild is only partial: it handles some month-end persistence and close/open states, but does not yet restore full archived month state across all tabs.
- `archive/legacy-html/strathroy_cash_rec_v27.html` remains useful as an older reference but is not the main working file.
- Backup/import is the supported cross-PC workflow until a cloud sync path exists.

## Open Work

- Verify backup import on another PC via the live GitHub Pages site.
- Finalise favicon/embed strategy so branding is less path-dependent.
- Add month-end balance checks.
- Rebuild new-month workflow as a full period archive model.
- Connect closed-month navigation to full archived month state, not just a Section 2 snapshot.
- Decide whether cloud sync is worth adding beyond manual backup/import.
