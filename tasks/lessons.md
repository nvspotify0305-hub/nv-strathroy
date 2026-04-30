# Lessons — append only, never delete
# Format: [DATE] — [what went wrong] → [correct pattern going forward]

2026-03-30 — Version strings drift across filename / title tag / footer / console → canonical is filename; update all three on every release.
2026-03-30 — Init flags (_ctLoaded, _ddLoaded, _boiLoaded) prevent hardcoded constants overwriting cleared localStorage on reload → always check these flags before initialising arrays.
2026-03-30 — Sage import dedup key is acct|date|ref|net → re-upload is idempotent; never break this key.
2026-04-04 — Carry-forward must use prior month closing balances → never use the manual Debtors (Sage) input as a carry-forward source.
2026-04-04 — Period backup/import must include strathroy_periods_v1 → otherwise history rebuilds from stale archive state.
2026-04-04 — WE_CONFIG/SAMPLE are full-replace on load → never merge; deleted batches stay deleted.
2026-04-04 — Dublin Cash bulk paste: skip only rows with no real account code → do not skip greyed/attention rows.
2026-04-09 — .textContent on an <input> element always returns "" → always use .value for input elements.
2026-04-09 — Hardcoded const arrays (e.g. CUSTOMERS) lose user edits on reload → add to DB_KEYS, save in persistAll(), splice-load in loadPersistedData().
2026-04-09 — Dashboard grid is 3-column (300px 1fr 280px) → a 4th direct child wraps to bottom-left row 2; place additions inside a column's flex stack instead.
2026-04-30 — Sage dedup (acct|date|ref|net) must only run cross-file, never within the same upload. A single export can have two genuinely identical SR rows (posted twice, one reversed by SP same day); deduping within the file removes one SR, leaving the SP with no row to net against and producing a zero instead of the correct receipt total. Fix: build newKeys from the current upload rows, filter only the previous-session rows against it, then concat the full current upload unchanged.
