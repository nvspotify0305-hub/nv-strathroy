## Codex Session - 2026-06-25 - Dublin WE Exports

- Scope: Dublin Cash export buttons and live promotion.
- Working file updated: `cash_rec_period_full_test_v5.html`.
- Live file updated: `index.html`.
- Added WE-level `Excel Export` button for a whole week-ending batch.
- Changed WE Sage export button to `Sage CSV`.
- Sage CSV output is whole-WE totals only with exact header `Accref,Value`.
- Follow-up: WE Excel export now uses the shared Strathroy Excel helper design snapshot.
- Follow-up: removed the old top-toolbar Dublin Cash month-level `Export .xlsx` button.
- Verification: JavaScript syntax check, export marker check, design check, live deploy check.
- Not changed: storage, auth, period archive model, rollback snapshots, Vercel project settings.
