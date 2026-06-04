# Strathroy Dairy Cash Rec

Single-file HTML app for cash reconciliation.

## Publish Target

- Vercel live entry file: `index.html`
- Live URL: `https://strathroy-cash-recs.vercel.app/`
- Vercel project: `strathroy-cash-recs`
- GitHub repo `nvspotify0305-hub/nv-strathroy` is source control only; GitHub Pages is not the current public live host.
- Supporting assets: `images/`

## Working Files

- `index.html`: live file and current safe working file
- `cash_rec_period_test.html`: isolated month-period experiment, not production-ready
- `cash_rec_test.html`: older troubleshooting file, broken for period work

## Archive

- `archive/legacy-html/`: older local/reference HTML variants and dated backups
- `archive/images/`: superseded branding assets kept only for reference

## Vercel

1. Commit the approved `index.html` update.
2. Push to `main`.
3. Run `npx vercel deploy --prod --yes` from this folder.
4. Verify the production alias: `https://strathroy-cash-recs.vercel.app/`.

## Notes

- The app uses browser `localStorage`, so hosted data will be separate from `file://` data.
- Excel import/export depends on the SheetJS CDN.
- Google Fonts are loaded from Google Fonts CDN.
- `index.html` should remain protected until the month-period workflow is rebuilt correctly.
