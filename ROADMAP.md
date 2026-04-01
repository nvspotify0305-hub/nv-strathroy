# Strathroy Dairy — Cash Rec — Roadmap
> Read this before starting any new feature or making architectural decisions.
> This is the single source of truth for what's built, what's next, and what's planned.

---

## Current Version: v27
**File:** `strathroy_cash_rec_v27.html`
**Deployed:** Local file — open in Chrome/Edge
**Architecture:** Single-file vanilla HTML/CSS/JS app with localStorage persistence and SheetJS for .xlsx import/export

---

## Current State

| Feature | Status | Notes |
|---------|--------|-------|
| Dashboard with alerts | Complete | Unposted, mismatch, typo alerts |
| Daily tab — 4 sub-tabs | Complete | CT, DD, BOI, Dublin Cash |
| BOI inline editing | Complete | Paste cash receipts, mark posted |
| CT/DD data management | Complete | Pre-loaded, editable, persisted |
| Sage import (multi-upload) | Complete | Dedup on `acct\|date\|ref\|net` |
| 22-rule classification engine | Complete | SP netting by ref, uniform sign convention |
| Typo quarantine queue | Complete | Flags suspect Sage rows for review |
| Month End — Section 1 | Complete | Summary reconciliation table with Contra row |
| Month End — Section 2 | Complete | Detailed breakdown |
| Settings tab | Complete | Configurable options |
| localStorage persistence | Complete | 9 data keys + 1 settings key, in-memory fallback |
| .xlsx export | Complete | Via SheetJS CDN |
| History tab | Partial | Currently shows sample data only — not connected to live data |
| Clear by date range | Complete | Prevents stale rows |
| Reset All Sage Data | Complete | Full Sage data wipe |
| Daily Summary adjacent-day tolerance | Partial | Restored in `cash_rec_test.html` drill-down only; verify against duplicate Sage test file |
| Branding portability across PCs | Partial | Local `file://` branding still inconsistent across machines |

---

## Completed

- v1–v4: Design spec, March data pre-loaded, core layout
- v5–v8: Dashboard alerts, BOI inline edit, Dublin Cash tab, CT/DD management
- v9–v15: Typo quarantine, multi-upload, Sage import, Section 2, Settings, localStorage
- v16–v27: Classification engine overhaul, SP netting by ref, contra fix, summary table rebuild, dedup on import, BOI Cash diff with contra explanation, Clear button fix, Reset All Sage Data

---

## In Progress

- Verify current Sage import reconciliation behaviour in `cash_rec_test.html` against the user's duplicate/source-of-truth test file
- Confirm that Daily Summary date-level mismatches only surface true issues after adjacent-day timing offsets are collapsed
- Stabilise branding portability for logo/favicon across different PCs under local `file://` usage

---

## Phases

| Phase | Goal | Status |
|-------|------|--------|
| 1 — Finish app | Complete all functional features | In progress |
| 2 — Design polish | Branding, logo, visual improvements | Not started |
| 3 — GitHub deploy | Publish to GitHub Pages, set up collaborator access | Not started |

---

## Backlog
> Approved items — implement when prioritised.

### Phase 1 — Finish App (functional)
| Item | Detail |
|------|--------|
| Verify Daily Summary timing matches | Confirm CT/DD/Country drill-downs honour adjacent-day timing tolerance on real Sage test files |
| Month-end balance checks | HSBC statement reconciliation |
| New month workflow | New localStorage prefix, carry-forward balances |
| History tab — live data | Connect History tab to real persisted data (not sample) |
| Print / PDF export | One-click print layout or PDF generation |
| Mileage tab | 4 reps: Barry O'Reilly, Declan Wren, Gavin Joyce, Paul Duffy |
| Discount App column | Currently mirrors Sage only — extend to show App-side discounts |

### Phase 2 — Design Polish
| Item | Detail |
|------|--------|
| Logo / branding | Finalise logo/fav strategy so branding is consistent across different PCs and not dependent on local path/cached assets |
| Visual improvements | Review spacing, typography, colour use across all tabs |

### Phase 3 — GitHub
| Item | Detail |
|------|--------|
| GitHub Pages deploy | Publish single HTML file to GitHub Pages |
| Collaborator access | One read-only collaborator (view only, no edit permissions) |
| Multi-device access | Both users access via GitHub Pages URL |

---

## Declined (do not re-propose)
> Items explicitly rejected by the user. Do not suggest these again.

| Item | Reason | Date |
|------|--------|------|
| — | No declined items yet | — |

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| v1–v4 | 26 Mar 2026 | Design spec, March data pre-loaded |
| v5–v8 | 27 Mar 2026 | Dashboard alerts, BOI inline edit, Dublin Cash, CT/DD |
| v9–v15 | 30 Mar 2026 | Typo quarantine, multi-upload, Sage import, Section 2, Settings, localStorage |
| v16–v27 | 30 Mar 2026 | Classification overhaul, live testing, contra fix, final verification |
| v27 | 31 Mar 2026 | Replaced Sage vs Bank Rec panel with Sage Import Check waterfall (Total Sage → less Disc → less RB → = Total Receipts net) |

---

## Deployment Rules

- Bump version on every deploy: rename file to next vNN, update footer/console strings
- Working file: `strathroy_cash_rec_v27.html`
- Deploy target: Same file — open in Chrome/Edge
- Deploy: No command — just open the file
