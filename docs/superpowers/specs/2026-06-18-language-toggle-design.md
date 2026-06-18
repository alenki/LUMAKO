# Language toggle - replace navbar CTA with EN / عربي

Date: 2026-06-18
Status: Approved (design)
Scope: small - one new UI component + Nav wiring + a unit test

## Summary

Replace the navbar "Start a project" CTA with a minimal **EN / عربي** language
toggle. This is a **visual-only** toggle: it changes which language reads as
active, but it does **not** translate the site, flip layout direction, or change
routing. It is a forward-compatible placeholder for real i18n later.

The decision to keep this visual-only was explicit. There is currently no i18n
infrastructure in the project: the document is hardcoded `lang="en"`, and
`site.locale` ("Global") is only a display string. Real translation, RTL, and
routing are a separate, larger project.

## Goals

- Remove the desktop "Start a project" `MagneticButton` from the navbar.
- Add a minimal text toggle reading `EN / عربي` in its place.
- Show the same toggle inside the mobile full-screen menu.
- Keep the brand's single-accent discipline: no lume/gold on the toggle.

## Non-goals (explicit)

- Actual translation of any copy.
- RTL page flip or `<html dir>` changes.
- Locale routing, cookies, or persistence across hard reloads.
- Touching `site.locale` or any other content.

## Components

### 1. `components/ui/LanguageToggle.tsx` (new)

A small **controlled** component so a single source of truth can drive both the
desktop and mobile instances.

Props:

```
type Locale = "en" | "ar";
function LanguageToggle({
  value,
  onChange,
}: {
  value: Locale;
  onChange: (next: Locale) => void;
}): JSX.Element
```

Behavior and markup:

- Renders two `<button>`s - `EN` and `عربي` - separated by a thin `/`.
- Active language uses `text-fg`; inactive uses `text-fg-muted` with a hover
  lift to `text-fg` (mirrors the existing nav-link hover idiom).
- The Arabic label span carries `lang="ar"` and `dir="rtl"` so the script
  renders correctly while the page stays LTR.
- Each button: `type="button"`, `aria-pressed={value === "…"}`, `data-cursor`
  (preserves the custom-cursor behavior the old CTA had).
- Wrapped in a `role="group"` with `aria-label="Language"`.
- Clicking calls `onChange`; clicking the already-active language is a no-op.
- No `lume`/gold is used anywhere in the control.

### 2. `components/layout/Nav.tsx` (modify)

- Lift one `useState<Locale>("en")` into `Nav`; pass `value`/`onChange` to both
  toggle instances.
- **Desktop:** replace the `MagneticButton` ("Start a project") inside the
  `col-start-3 … hidden md:flex` slot with `<LanguageToggle/>`. Remove the now
  unused `MagneticButton` import.
- **Mobile:** add `<LanguageToggle/>` to the mobile menu's bottom row. Change
  that footer container from `justify-end` to `justify-between` so the toggle
  sits left and the email stays right.

## State and data flow

- A single in-memory `useState` in `Nav` is the source of truth.
- It persists across client-side navigation because `Nav` lives in the root
  layout and never unmounts. It resets to `EN` on a hard reload.
- No localStorage/cookie persistence: since nothing is translated yet, that
  plumbing belongs with the real i18n work, not this visual placeholder.

## Accessibility

- Toggle is a `role="group"` labeled "Language" containing two real buttons.
- `aria-pressed` communicates the active language to assistive tech.
- The Arabic label carries `lang="ar"` + `dir="rtl"`.

## Testing - `tests/language-toggle.test.tsx` (Vitest + Testing Library)

- Renders both `EN` and `عربي`; with `value="en"`, `EN` is `aria-pressed`.
- Clicking `عربي` calls `onChange("ar")`.
- `aria-pressed` reflects the `value` prop for each button.
- The Arabic span exposes `lang="ar"`.

No existing test breaks: there is no Nav test, and the hero test's
"Start a project" assertion targets the hero CTA, not the navbar.
