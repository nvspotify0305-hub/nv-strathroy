# Strathroy Dairy — Cash Rec — Roadmap
> Read this before starting any new feature or making architectural decisions.
> This is the single source of truth for what's built, what's next, and what's planned.

---

## Current Version: v27
**Working File:** `cash_rec_test.html`
**Publish File:** `index.html`
**Deployed:** GitHub repo pushed; backup/import deploy live on `main` via commit `846ecf5`
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
| GitHub Pages deployment | Complete | Repo pushed and live from `main` root |
| Branding portability across PCs | Partial | Official logo is now standardised to `images/Logo Official.jpg` in active files, but consistency still depends on the bundled `images` folder and version strings still need manual review |
| Backup / import portability | Complete | Manual JSON transfer workflow now implemented for cross-PC use |
| Cross-PC data sync | Partial | Manual backup/import exists; no live cloud sync |

---

## Completed

- v1–v4: Design spec, March data pre-loaded, core layout
- v5–v8: Dashboard alerts, BOI inline edit, Dublin Cash tab, CT/DD management
- v9–v15: Typo quarantine, multi-upload, Sage import, Section 2, Settings, localStorage
- v16–v27: Classification engine overhaul, SP netting by ref, contra fix, summary table rebuild, dedup on import, BOI Cash diff with contra explanation, Clear button fix, Reset All Sage Data

---

## In Progress

- Verify backup import on the user's work PC against the live GitHub Pages site
- Confirm whether manual backup/import is sufficient or whether Supabase is still wanted later

---

## Phases

| Phase | Goal | Status |
|-------|------|--------|
| 1 — Finish app | Complete all functional features | In progress |
| 2 — Design polish | Branding, logo, visual improvements | In progress |
| 3 — GitHub deploy | Publish to GitHub Pages, set up collaborator access | In progress |

---

## Backlog
> Approved items — implement when prioritised.

### Phase 1 — Finish App (functional)
| Item | Detail |
|------|--------|
| Data export / import | Completed on 2026-04-02; keep for future enhancements only |
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
| Logo / branding | Official logo is now swapped into active files; next step is to finalise favicon/embed strategy so branding is not dependent on local path/cached assets |
| Visual improvements | Review spacing, typography, colour use across all tabs |

### Phase 3 — GitHub
| Item | Detail |
|------|--------|
| GitHub Pages deploy | Live now; smoke-test on another PC after import |
| Collaborator access | One read-only collaborator (view only, no edit permissions) |
| Multi-device access | Hosted URL works, but data still needs export/import or cloud sync |

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

- Working file: `cash_rec_test.html`
- Deploy target: `index.html`
- GitHub Pages branch/folder: `main` / `(root)`
- Hosted deploy does not carry `file://` localStorage forward
- Cross-PC workflow is now `Export Backup` -> move JSON -> `Import Backup`
