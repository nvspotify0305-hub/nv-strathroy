# Strathroy Dairy — Cash Rec — Project Context

## Architecture
- Framework: Vanilla HTML/CSS/JS — single-file app, no build step, no framework
- Main working file: `cash_rec_test.html`
- Deploy target: `index.html`
- Hosting: GitHub Pages + local working copy
- Active troubleshooting file: `cash_rec_test.html` for current reconciliation/debug work when the user explicitly scopes changes there

## Version
- Current: v27
- Version strings still drift across files; title/footer/console must be reviewed before any formal release
- Never change version string without explicit instruction from user

## Key Rules
- NEVER rewrite whole files — surgical edits only
- `cash_rec_test.html` is the active working file
- `index.html` is the GitHub Pages publish file and should be replaced from the approved working file on deploy
- No build step, no npm, no server — edit HTML and deploy by copy + git push
- All UI primitives and constants are inline in the single HTML file
- Pre-loaded data (CUSTOMERS, WE_CONFIG, SAMPLE, CT_DAYS, DD_DATA) must never be removed or overwritten by persistence logic — init flags (`_ctLoaded`, `_ddLoaded`, `_boiLoaded`) prevent this
- Dedup key on Sage import: `acct|date|ref|net` — re-uploads are idempotent
- SP netting by ref: SP rows classify by ref first; orphan SPs go to Rev & Bounces
- Uniform sign convention: `signed = -net` for every row, every category
- Contra = Sage only — no bank movement, not in App Transfer to HSBC
- WE ref beats all — WE-prefixed rows always classify as Dublin Cash
- Daily Summary date-level drill-downs must tolerate adjacent-day timing offsets for CT/DD/Country when the amounts net off across +1 day or weekend-shifted +2 days
- GitHub Pages does not solve cross-PC data continuity because the app still uses browser localStorage
- Cross-PC continuity currently relies on manual JSON backup/import, not automatic sync
- Extra unexpected columns in Sage export files can break import mapping even when the workbook transactions are otherwise correct

## Infrastructure
- Hosting: GitHub Pages repo `nvspotify0305-hub/nv-strathroy`
- Backend: None — purely client-side
- Local path: `C:\Claude Projects\Strathroy Projects\Cash Recs\cash_rec_test.html`
- External dependencies: Google Fonts CDN, SheetJS v0.18.5 (CDNJS)

## localStorage Keys
All data keys use prefix `strathroy_mar2026_`:
- `strathroy_mar2026_ctDays` — CT days data
- `strathroy_mar2026_ddData` — DD data
- `strathroy_mar2026_boiData` — BOI data
- `strathroy_mar2026_weConfig` — WE config
- `strathroy_mar2026_sample` — Sample rows
- `strathroy_mar2026_sageUploads` — Sage upload batches
- `strathroy_mar2026_sageAllRows` — All Sage rows
- `strathroy_mar2026_typoQueue` — Typo quarantine queue
- `strathroy_mar2026_alerts` — Alerts
- `strathroy_settings_v1` — App settings (separate key)

Fallback: `_memStore` in-memory object used when localStorage unavailable.

## Deploy Command
```cmd
cd "C:\Claude Projects\Strathroy Projects\Cash Recs"
copy cash_rec_test.html index.html
git add index.html
git commit -m "deploy update"
git push -u origin main
```

## Version Mismatch Rule
Before any deploy action, check the version string in both
the working file and deploy target.
If they do not match, STOP and ask the user which version to use.
Never resolve a mismatch automatically.

## Frontend Design Rule
Before writing any UI code, read FRONTEND_DESIGN.md.
This applies to every build, every change, every new feature.
No exceptions.

## Session Notes Rule
- SESSION_NOTES.md keeps ONLY the most recent session
- Delete previous entries on every update — no accumulation
- File stays lean — current state only, not a history log

## Current Focus
- GitHub deployment is now set up and live
- Manual backup/import is now implemented
- Next likely check is confirming backup import works on the work PC via the live site

## Knowledge Base
Read the relevant file before acting on these domains:

- ROADMAP.md           → feature state, what's built, what's next
- DEPLOY.md            → any deploy or versioning action
- FRONTEND_DESIGN.md   → any UI code, components, or styling
- ARCHITECTURE.md      → detailed architecture spec, data model, and business logic

## Deploy Lock Rule

> **Never deploy, push to git, or run deploy commands during a session automatically.**
> Only deploy when the user explicitly instructs with: "deploy", "push", "go live", or runs `/deploy`.
> This overrides all other instructions.

## Session Continuity Rules

### 1. Update CLAUDE.md After Every Session
At the end of every session, update this file with:
- Current version number
- Any features added, changed, or removed
- Any new rules or constraints discovered
- Any bugs fixed
- Anything that would matter to the next session

Do this automatically — do not wait to be asked.

### 2. Maintain SESSION_NOTES.md
After every session, update SESSION_NOTES.md with today's session only.
Delete previous entries. Keep latest only.

### 3. Start of Session Ritual
At the start of every session, before doing anything:
1. Read CLAUDE.md
2. Read SESSION_NOTES.md (if it exists)
3. Read ROADMAP.md
4. Confirm current version and last session summary
5. Ask the user what to work on — or continue from "Next Session" if told to go ahead

## Setup
This project was bootstrapped with /project-intelligence.
Re-run to regenerate missing files (existing files are never overwritten).
