# Strathroy Dairy — Cash Rec — Roadmap
> Read this before starting any new feature or making architectural decisions.
> This is the single source of truth for what's built, what's next, and what's planned.

---

## Current Version: v27
**Working File:** `index.html`
**Publish File:** `index.html`
**Deployed:** GitHub repo pushed; live app remains on `index.html`
**Architecture:** Single-file vanilla HTML/CSS/JS app with localStorage persistence and SheetJS for .xlsx import/export

---

## Current State

| Feature | Status | Notes |
|---------|--------|-------|
| Dashboard with alerts | Complete | Unposted, mismatch, typo alerts |
| Daily tab — 4 sub-tabs | Complete | CT, DD, BOI, Dublin Cash — full persistence, negative paste, inline edit, flag persistence |
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
| Month-period rebuild | In progress | Continue in `cash_rec_period_full_test.html`; older `cash_rec_test.html` and `cash_rec_period_test.html` are non-production experiments and must not be mirrored into `index.html` |

---

## Completed

- v1–v4: Design spec, March data pre-loaded, core layout
- v5–v8: Dashboard alerts, BOI inline edit, Dublin Cash tab, CT/DD management
- v9–v15: Typo quarantine, multi-upload, Sage import, Section 2, Settings, localStorage
- v16–v27: Classification engine overhaul, SP netting by ref, contra fix, summary table rebuild, dedup on import, BOI Cash diff with contra explanation, Clear button fix, Reset All Sage Data

---

## In Progress

- Keep `index.html` stable while month-period workflow is rebuilt in isolation
- Rebuild close/open month flow in `cash_rec_period_full_test.html`
- Define the next-phase `Strathroy OS` hub that will sit above individual tools like Cash Rec and Payroll

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
| New month workflow | Rebuild as a full period archive model, not a partial month-end snapshot |
| History tab — live data | Final model must follow full archived months in `cash_rec_period_full_test.html` |
| Full period archive | Each closed month must retain all tab data and restore it on toolbar navigation |
| Reopen and reclose | Reopening a closed month, amending it, and closing it again must refresh both the month archive and the next month opening balance |
| Print / PDF export | One-click print layout or PDF generation |
| Reminder deadlines editable from Dashboard | Currently hardcoded in JS; allow user to add/edit/delete reminders from Dashboard UI |
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

### Phase 4 — Strathroy OS
| Item | Detail |
|------|--------|
| Main dashboard / launcher | Single Strathroy entry point to open Cash Rec, Payroll, Tolls, Holidays, Rebates, and later modules |
| Module model | Start as a browser-based hub with separate modules/pages, then pull shared pieces into one shell over time |
| Free-first build | Initial OS/dashboard can be built free using plain HTML/CSS/JS plus free hosting |
| Shared navigation | Consistent branding, quick launch cards, status, reminders, and recent activity across modules |
| Shared data direction | Long-term goal is one internal system rather than separate disconnected tools |

### Phase 5 — Payroll / Ops Modules
| Item | Detail |
|------|--------|
| Payroll | Next major module after Cash Rec |
| Holidays | Bulk-import structured holiday data for all employees and track balances/history |
| Tolls | Operational tracking module under the same shell |
| Rebates | Operational tracking module under the same shell |
| Employee records | Shared employee list for reuse across Payroll, Holidays, and later modules |

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
| v5 period | 09 Apr 2026 | Dublin Cash full persistence, negative paste, inline cell edit, CUSTOMERS localStorage, Dashboard Reminders layout |

---

## Deployment Rules

- Safe working file: `index.html`
- Current rebuild file: `cash_rec_period_full_test.html`
- Older test/experiment files: `cash_rec_test.html`, `cash_rec_period_test.html`
- Deploy target: `index.html`
- GitHub Pages branch/folder: `main` / `(root)`
- Hosted deploy does not carry `file://` localStorage forward
- Cross-PC workflow is now `Export Backup` -> move JSON -> `Import Backup`
- Do not copy period-rebuild changes into `index.html` until full month restore across all tabs is working

---

## Strathroy OS Notes

- The intended next platform is a lightweight internal `Strathroy OS` dashboard that launches business tools from one place.
- Planned first modules: `Cash Rec`, `Payroll`, `Tolls`, `Holidays`, `Rebates`.
- A first version can be built free of charge using browser-based pages and free hosting.
- NotebookLM is not the planned system of record for operational data; it may help with reading/supporting documents only.
- Holiday data should be imported into a dedicated module as structured records, not managed through document chat/search.
- Expected core data is mostly text/numeric and is small by modern standards, even across multiple years and around 70 employees.
- Excel files are expected to be import-only for data reading, not permanent primary storage.
- PDFs, payslips, and image-heavy storage are not part of the main expected data footprint.
- Browser `localStorage` is acceptable for prototypes and smaller tools, but a proper backend is preferred once Strathroy OS becomes the main internal shared system.
- A small backend such as Supabase free tier is the likely upgrade path if shared live multi-module data is needed.
