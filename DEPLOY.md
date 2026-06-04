# Strathroy Dairy — Cash Rec — Deploy Reference
> Current live target is Vercel, with `index.html` as the published entry file.

---

## Architecture

No build step. Static HTML app served by Vercel.
No server and no app build pipeline; Vercel publishes the static root files.

---

## Working File Rule

| File | Purpose |
|------|---------|
| `cash_rec_period_full_test_v5.html` | Current working file with latest fixes |
| `index.html` | Vercel deploy target |
| `archive/legacy-html/` | Legacy local/reference HTML files retained outside the root |

When deploying, copy the latest approved working file into `index.html`.

---

## Version Rule

Version strings inside the HTML should still be updated together when a release is finalised:
1. Title tag
2. Footer / console strings
3. Any explicit visible version labels

The published filename on Vercel should stay `index.html`.

---

## Standard Deploy — Windows CMD

```cmd
cd "C:\Claude Projects\Strathroy Projects\Cash Recs"
copy cash_rec_period_full_test_v5.html index.html
git add cash_rec_period_full_test_v5.html index.html
git commit -m "deploy update"
git push -u origin main
npx vercel deploy --prod --yes
```

If other deploy docs changed in the same session, include them in the same commit:

```cmd
git add index.html DEPLOY.md README.md MEMORY.md ROADMAP.md SESSION_NOTES.md CLAUDE.md
git commit -m "deploy update"
git push -u origin main
```

## First-Time Terminal Auth / Push Fixes

If terminal push is not authenticated:

```cmd
git credential-manager github login
```

If Git blocks the repo as unsafe for the current Windows user:

```cmd
git config --global --add safe.directory "C:/Claude Projects/Strathroy Projects/Cash Recs"
```

---

## Git Remote

| Key | Value |
|-----|-------|
| Repo | `nvspotify0305-hub/nv-strathroy` |
| Local branch | `main` |
| Remote branch | `main` |
| Live URL | `https://strathroy-cash-recs.vercel.app/` |
| Vercel project | `strathroy-cash-recs` |

## Vercel Settings

Linked project file:

`.vercel/project.json`

Current project:

- Project ID: `prj_jYTdTrGEspSVwf2diLYm2N6jL9Cn`
- Team ID: `team_NRo8pioFnSjkswAP2G0GUSBq`
- Production alias: `https://strathroy-cash-recs.vercel.app/`

## Legacy GitHub Pages Notes

Repo settings path:

`https://github.com/nvspotify0305-hub/nv-strathroy/settings/pages`

Old GitHub Pages URL:

`https://nvspotify0305-hub.github.io/nv-strathroy/`

As of 2026-06-04 this URL returned GitHub's "site not found" page during verification; do not treat it as the current live Cash Recs address unless GitHub Pages is deliberately re-enabled.

Former required settings:
- Repository visibility: `Public` on the current plan
- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

---

## Propagation

- Deploy propagation time: usually under a few minutes after push
- Cache clearing: hard refresh if stale

---

## Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | Recommended | Full support |
| Edge | Recommended | Full support |
| Firefox | Generally OK | Hosted URL avoids most `file://` storage issues |

---

## Known Warnings

| Warning | Cause | Action |
|---------|-------|--------|
| GitHub Pages unavailable | Old GitHub Pages route is not the current live target | Use the Vercel live URL unless GitHub Pages is deliberately re-enabled |
| localStorage data differs from local file copy | Different origin between `file://` and hosted site | Expect separate stored data per origin |
| SheetJS CDN failure | No internet connection | .xlsx import/export will fail; core app still works |
| Google Fonts not loading | No internet connection | App uses system sans-serif fallback |

---

## Deploy Checklist

- [ ] Latest approved file copied into `index.html`
- [ ] `cash_rec_test.html` and `index.html` kept in sync
- [ ] Title / footer / console strings reviewed
- [ ] `index.html` opens correctly locally before push
- [ ] `images/` folder included
- [ ] Vercel production deploy is ready and aliased
- [ ] Live URL smoke-tested on another PC
- [ ] Remember hosted site uses different `localStorage` from local `file://`
- [ ] If cross-PC continuity is needed, remind user to use `Export Backup` / `Import Backup`

---

## What Claude Code Must Never Do

- Push to a remote without explicit user instruction
- Delete previous HTML versions without confirmation
- Assume hosted `localStorage` will carry over from local `file://`
