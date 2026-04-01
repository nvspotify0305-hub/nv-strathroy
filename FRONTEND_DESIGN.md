# Frontend Design — Strathroy Dairy Cash Rec
> Read this before writing ANY UI code, components, or styling.

---

This skill guides creation of distinctive, production-grade frontend interfaces
that avoid generic "AI slop" aesthetics. Implement real working code with
exceptional attention to aesthetic details and creative choices.

## Design Thinking

Before coding, understand the context and commit to a clear aesthetic direction:
- **Purpose**: Financial reconciliation tool for a dairy business — data-dense, precision-focused
- **Tone**: Utilitarian-refined — clean, professional, no decoration for its own sake
- **Constraints**: Single-file HTML, inline CSS/JS, no build tooling
- **Differentiation**: Tight typographic hierarchy using the DM family; navy/green/amber/red semantic palette

## Strathroy Cash Rec — Specific Context

- **Aesthetic**: Light, data-dense, utilitarian-refined — tight spacing, clear hierarchy, monospace numbers
- **Existing fonts**:
  - `DM Serif Display` — logo/brand header only (`strathroy_cash_rec_v27.html`, `.brand-name`)
  - `DM Sans` — all UI text, labels, buttons, body (weights: 300, 400, 500, 600)
  - `DM Mono` — all financial amounts, numeric data, table values (weights: 400, 500)
- **Color system**: CSS custom properties on `:root` — **always use variables, never hardcode hex**

  | Variable | Value | Use |
  |----------|-------|-----|
  | `--navy` | `#1B3F8D` | Primary — buttons, headers, key values |
  | `--navy-dk` | `#152f6a` | Hover states for navy |
  | `--navy-lt` | `#2a52b0` | Active/focus states |
  | `--navy-pale` | `#e8edf8` | Navy tint backgrounds |
  | `--green` | `#319B4C` | Success — reconciled, posted |
  | `--green-dk` | `#267a3c` | Hover for green |
  | `--green-pale` | `#e4f2e8` | Green tint backgrounds |
  | `--amber` | `#C4873A` | Warning — unposted, pending |
  | `--amber-pale` | `#f5ead8` | Amber tint backgrounds |
  | `--red` | `#B04040` | Error — mismatch, reversal, negative |
  | `--red-pale` | `#f5e0e0` | Red tint backgrounds |
  | `--bg` | `#F0F2F6` | Page background |
  | `--card` | `#ffffff` | Card/panel background |
  | `--card2` | `#f7f8fc` | Secondary card, highlighted rows |
  | `--ink` | `#1a1c22` | Primary text |
  | `--ink-mid` | `#454a5a` | Secondary text |
  | `--ink-lt` | `#8a90a0` | Light/muted text |
  | `--ink-faint` | `#c8ccd8` | Placeholder, disabled |
  | `--border` | `rgba(27,63,141,0.10)` | Subtle borders |
  | `--border-md` | `rgba(27,63,141,0.18)` | Medium borders |
  | `--shadow` | `0 1px 4px rgba(27,63,141,0.07), 0 4px 16px rgba(27,63,141,0.05)` | Card shadow |
  | `--shadow-lg` | `0 2px 12px rgba(27,63,141,0.10), 0 8px 32px rgba(27,63,141,0.08)` | Modal shadow |
  | `--r` | `10px` | Standard border radius |
  | `--r-sm` | `6px` | Small border radius |

- **Motion**: Subtle only — one animation exists:
  ```css
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(5px) }
    to   { opacity:1; transform:translateY(0) }
  }
  ```
  Used for modals and alerts appearing. No other animations.

- **Density**: Data-dense, compact — this is a reconciliation tool, not a marketing page
- **Theme support**: Single light theme only — no dark mode, no toggle

## General Rules

- Never use generic AI aesthetics: default Inter/Roboto, purple gradients, cookie-cutter card layouts
- Every design element must serve a functional purpose — this is a financial tool
- **Never hardcode hex colors** — use CSS custom properties only
- Monospace font (`DM Mono`) must be used for ALL financial amounts and numeric data
- Semantic color use is mandatory: green = good/posted, amber = warning/pending, red = error/mismatch
- Production-grade means it works perfectly at 1920×1080 (primary target screen)

## Framework-Specific Rules

- This is a single-file vanilla HTML/CSS/JS app — no components, no JSX, no build step
- All styles are inline `<style>` in the `<head>`
- All JS is inline `<script>` at the bottom of `<body>`
- When adding new UI, follow existing patterns exactly — check nearby similar elements before writing new CSS classes
- Use existing class names before creating new ones

## What to NEVER Do

- Introduce new fonts without explicit instruction — the DM family is locked
- Hardcode hex color values — always use `var(--variable-name)`
- Add decorative backgrounds, gradients, or textures — the aesthetic is clean and flat
- Use `alert()` — use the existing toast/notification system in the app
- Build elaborate animations — `fadeUp` is the only allowed motion pattern
- Make layout decisions that break the 1920×1080 target layout
- Add dark mode or theme toggle without explicit instruction
