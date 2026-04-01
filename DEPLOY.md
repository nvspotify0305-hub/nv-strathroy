# Strathroy Dairy — Cash Rec — Deploy Reference
> Current deploy target is GitHub Pages, with `index.html` as the published entry file.

---

## Architecture

No build step. Static HTML app served by GitHub Pages.
No server, no npm, no deployment pipeline.

---

## Working File Rule

| File | Purpose |
|------|---------|
| `cash_rec_test.html` | Current working file with latest fixes |
| `index.html` | GitHub Pages deploy target |
| `strathroy_cash_rec_v27.html` | Legacy local version retained for reference |

When deploying, copy the latest approved working file into `index.html`.

---

## Version Rule

Version strings inside the HTML should still be updated together when a release is finalised:
1. Title tag
2. Footer / console strings
3. Any explicit visible version labels

The published filename on GitHub Pages should stay `index.html`.

---

## Deploy Steps

1. Confirm the latest approved app file.
2. Copy it to `index.html`.
3. Commit the changes.
4. Push to GitHub.
5. In GitHub Pages settings, publish from the root of the default branch.
6. Verify the live URL.

---

## Git Remote

| Key | Value |
|-----|-------|
| Repo | To be created |
| Local branch | Default branch |
| Remote branch | Default branch |
| Live URL | GitHub Pages URL |

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
| localStorage data differs from local file copy | Different origin between `file://` and hosted site | Expect separate stored data per origin |
| SheetJS CDN failure | No internet connection | .xlsx import/export will fail; core app still works |
| Google Fonts not loading | No internet connection | App uses system sans-serif fallback |

---

## Deploy Checklist

- [ ] Latest approved file copied into `index.html`
- [ ] Title / footer / console strings reviewed
- [ ] `index.html` opens correctly locally before push
- [ ] `images/` folder included
- [ ] GitHub Pages published from root branch
- [ ] Live URL smoke-tested on another PC

---

## What Claude Code Must Never Do

- Push to a remote without explicit user instruction
- Delete previous HTML versions without confirmation
- Assume hosted `localStorage` will carry over from local `file://`
