# Language Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the navbar "Start a project" CTA with a minimal, visual-only `EN / عربي` language toggle (no translation/RTL/routing yet).

**Architecture:** A new controlled `LanguageToggle` component renders two buttons (`EN`, `عربي`). A single `useState<Locale>` lifted into `Nav` is the source of truth and drives both the desktop navbar instance and the mobile-menu instance. State is in-memory only - it survives client-side navigation (Nav lives in the root layout and never unmounts) and resets to `EN` on a hard reload. No persistence, since that belongs with real i18n.

**Tech Stack:** Next.js 16 (client component), React 19, Tailwind CSS v4 (design tokens in `styles/globals.css`), Vitest 4 + @testing-library/react (no @testing-library/user-event - use `fireEvent`).

**Spec:** `docs/superpowers/specs/2026-06-18-language-toggle-design.md`

---

## File Structure

- **Create** `components/ui/LanguageToggle.tsx` - the controlled toggle component. One responsibility: render two language buttons and report clicks via `onChange`. Exports the component and a `Locale` type.
- **Create** `tests/language-toggle.test.tsx` - unit test for the component.
- **Modify** `components/layout/Nav.tsx` - lift toggle state, render `LanguageToggle` in the desktop slot (replacing `MagneticButton`) and in the mobile menu footer; drop the unused `MagneticButton` import.

Notes for the implementer (codebase conventions):
- `cn(...)` is the className merge helper at `@/lib/utils` (clsx + tailwind-merge). Import it as `import { cn } from "@/lib/utils";`.
- Color tokens are CSS variables surfaced as Tailwind classes: `text-fg` (#0a0a0a), `text-fg-muted` (#737373), `text-fg-dim` (#a1a1a1). Do NOT use `lume`/gold here - the gold accent is reserved and used minimally.
- `data-cursor` on an interactive element opts it into the site's custom cursor; the old CTA had it, so the toggle keeps it.
- Font-size idiom for nav-level controls is `text-[length:var(--text-base)]`.
- Run a single test file with: `npx vitest run tests/language-toggle.test.tsx`. Run everything with: `npm test`.

---

## Task 1: LanguageToggle component (TDD)

**Files:**
- Create: `components/ui/LanguageToggle.tsx`
- Test: `tests/language-toggle.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/language-toggle.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

describe("LanguageToggle", () => {
  it("renders EN and عربي and marks the value prop active", () => {
    const { getByRole } = render(
      <LanguageToggle value="en" onChange={() => {}} />,
    );

    const en = getByRole("button", { name: "EN" });
    const ar = getByRole("button", { name: "عربي" });

    expect(en.getAttribute("aria-pressed")).toBe("true");
    expect(ar.getAttribute("aria-pressed")).toBe("false");
  });

  it("marks Arabic active when value is 'ar'", () => {
    const { getByRole } = render(
      <LanguageToggle value="ar" onChange={() => {}} />,
    );

    expect(
      getByRole("button", { name: "EN" }).getAttribute("aria-pressed"),
    ).toBe("false");
    expect(
      getByRole("button", { name: "عربي" }).getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("calls onChange with the clicked locale", () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <LanguageToggle value="en" onChange={onChange} />,
    );

    fireEvent.click(getByRole("button", { name: "عربي" }));
    expect(onChange).toHaveBeenCalledWith("ar");
  });

  it("exposes lang='ar' on the Arabic label", () => {
    const { getByRole } = render(
      <LanguageToggle value="en" onChange={() => {}} />,
    );

    expect(
      getByRole("button", { name: "عربي" }).getAttribute("lang"),
    ).toBe("ar");
  });

  it("is grouped and labeled for assistive tech", () => {
    const { getByRole } = render(
      <LanguageToggle value="en" onChange={() => {}} />,
    );

    expect(getByRole("group", { name: "Language" })).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/language-toggle.test.tsx`
Expected: FAIL - cannot resolve `@/components/ui/LanguageToggle` (module does not exist yet).

- [ ] **Step 3: Write the minimal implementation**

Create `components/ui/LanguageToggle.tsx`:

```tsx
"use client";

import { cn } from "@/lib/utils";

export type Locale = "en" | "ar";

const OPTIONS: ReadonlyArray<{
  value: Locale;
  label: string;
  lang?: string;
  dir?: "rtl";
}> = [
  { value: "en", label: "EN" },
  { value: "ar", label: "عربي", lang: "ar", dir: "rtl" },
];

export function LanguageToggle({
  value,
  onChange,
  className,
}: {
  value: Locale;
  onChange: (next: Locale) => void;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "flex items-center gap-2 text-[length:var(--text-base)] font-medium",
        className,
      )}
    >
      {OPTIONS.map((opt, i) => (
        <span key={opt.value} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className="select-none text-fg-dim">
              /
            </span>
          )}
          <button
            type="button"
            data-cursor
            lang={opt.lang}
            dir={opt.dir}
            aria-pressed={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "transition-colors duration-300",
              value === opt.value ? "text-fg" : "text-fg-muted hover:text-fg",
            )}
          >
            {opt.label}
          </button>
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/language-toggle.test.tsx`
Expected: PASS - all 5 tests green.

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/ui/LanguageToggle.tsx tests/language-toggle.test.tsx
git commit -m "feat(nav): add controlled EN/عربي LanguageToggle component"
```

---

## Task 2: Wire the toggle into Nav (desktop + mobile)

**Files:**
- Modify: `components/layout/Nav.tsx`

- [ ] **Step 1: Swap the import**

In `components/layout/Nav.tsx`, replace the `MagneticButton` import line:

```tsx
import { MagneticButton } from "@/components/ui/MagneticButton";
```

with:

```tsx
import { LanguageToggle, type Locale } from "@/components/ui/LanguageToggle";
```

- [ ] **Step 2: Add toggle state inside the `Nav` component**

`useState` is already imported. Just below `const [open, setOpen] = useState(false);` add:

```tsx
  const [locale, setLocale] = useState<Locale>("en");
```

- [ ] **Step 3: Replace the desktop CTA with the toggle**

Replace this block:

```tsx
            <div className="hidden items-center gap-[var(--vw-3)] md:flex">
              <MagneticButton
                href="/contact"
                className="rounded-full px-6 py-3 text-[length:var(--text-base)]"
              >
                Start a project
              </MagneticButton>
            </div>
```

with:

```tsx
            <div className="hidden items-center md:flex">
              <LanguageToggle value={locale} onChange={setLocale} />
            </div>
```

- [ ] **Step 4: Add the toggle to the mobile menu footer**

Replace this block (inside the mobile full-screen menu):

```tsx
            <div className="mt-12 flex items-center justify-end border-t border-line pt-6">
              <a href={`mailto:${site.email}`} className="text-fg-muted">
                {site.email}
              </a>
            </div>
```

with:

```tsx
            <div className="mt-12 flex items-center justify-between border-t border-line pt-6">
              <LanguageToggle value={locale} onChange={setLocale} />
              <a href={`mailto:${site.email}`} className="text-fg-muted">
                {site.email}
              </a>
            </div>
```

- [ ] **Step 5: Typecheck and lint (catches the now-unused import and any type errors)**

Run: `npm run typecheck`
Expected: no errors.

Run: `npm run lint`
Expected: no errors (in particular, no "MagneticButton is defined but never used" - confirms Step 1 fully removed it).

- [ ] **Step 6: Run the full test suite (confirm nothing regressed)**

Run: `npm test`
Expected: PASS for all files, including the existing `tests/hero.test.tsx` (its "start a project" link is the hero CTA, not the navbar, so it is unaffected).

- [ ] **Step 7: Visual check in the dev server**

Run: `npm run dev`, open the site, and confirm:
- Desktop navbar right side shows `EN / عربي`; `EN` reads active (full-contrast), `عربي` muted; hovering the muted one lifts it to full contrast; clicking swaps the active one.
- Open the mobile menu (narrow viewport / hamburger): the toggle sits at the bottom-left of the footer row with the email on the right.
- No gold/lume appears on the toggle.

Stop the dev server when done.

- [ ] **Step 8: Commit**

```bash
git add components/layout/Nav.tsx
git commit -m "feat(nav): replace Start a project CTA with the EN/عربي toggle"
```

---

## Self-Review (completed by plan author)

**Spec coverage:**
- Remove desktop "Start a project" MagneticButton → Task 2, Steps 1 and 3.
- Minimal `EN / عربي` text toggle, active=fg / inactive=fg-muted + hover lift → Task 1, Step 3.
- Toggle in mobile menu footer (justify-between, toggle left / email right) → Task 2, Step 4.
- No lume/gold → Task 1 (component uses only fg/fg-muted/fg-dim); verified visually in Task 2, Step 7.
- Controlled component, single lifted `useState` driving both instances → Task 1 (props) + Task 2, Steps 2-4.
- Arabic span `lang="ar"` + `dir="rtl"` → Task 1, Step 3 (the `عربي` button carries both); tested in Task 1, Step 1 (lang assertion).
- `role="group"` + `aria-label="Language"`, `aria-pressed` per button, `data-cursor` → Task 1, Step 3; tested in Task 1, Step 1.
- In-memory state, no persistence → Task 2, Step 2 (plain `useState`, nothing else).
- Tests in `tests/language-toggle.test.tsx`; no existing test breaks → Task 1 + Task 2, Step 6.

**Placeholder scan:** No TBD/TODO/"handle edge cases"/vague steps. Every code step shows complete code.

**Type consistency:** `Locale` ("en" | "ar") is defined and exported in Task 1 and imported/used identically in Task 2. `LanguageToggle` prop names (`value`, `onChange`) match between definition (Task 1) and usage (Task 2). `setLocale` matches the `onChange: (next: Locale) => void` signature (React's `Dispatch<SetStateAction<Locale>>` is assignable to it).
