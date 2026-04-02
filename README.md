# Strathroy Dairy Cash Rec

Single-file HTML app for cash reconciliation.

## Publish Target

- GitHub Pages entry file: `index.html`
- Supporting assets: `images/`

## Working Files

- `cash_rec_test.html`: current working file with the latest fixes
- `index.html`: GitHub Pages publish target

## Archive

- `archive/legacy-html/`: older local/reference HTML variants and dated backups
- `archive/images/`: superseded branding assets kept only for reference

## GitHub Pages

1. Create a GitHub repository.
2. Push this folder to the default branch.
3. In GitHub repo settings, open `Pages`.
4. Set source to `Deploy from a branch`.
5. Choose the default branch and `/ (root)`.
6. Save and wait for the Pages URL.

## Notes

- The app uses browser `localStorage`, so hosted data will be separate from `file://` data.
- Excel import/export depends on the SheetJS CDN.
- Google Fonts are loaded from Google Fonts CDN.
