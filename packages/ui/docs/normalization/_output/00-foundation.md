# 00 — Design System Foundation

> **Batch:** Batch 2 — Design System Foundation
> **Branch:** `feat/ui`
> **Run date:** 2026-03-06
> **Per-app inputs loaded:** 27 files from `packages/ui/docs/normalization/per-app/`
> **Spec references:** `02-design-system-foundation.md`, `06-component-standards.md`
> **Current `@repo/ui` export surface:** `Box` only

---

## Objective Lock

This document is the **constitution** for `packages/ui`.
All Batch 3–5 implementation decisions must conform to it.
Any change to canonical prop names, variant values, tier assignments, or token keys after Batch 3 begins requires a **Foundation Amendment PR** reviewed by at least 2 app team leads.

---

## 1. App-Agnostic Principle

> **Rule:** `packages/ui` must never import from `apps/*`, `@/services/*`, `@/hooks/*`, or any domain namespace.

**In practice this means:**

- No `next/link`, `next/image`, `next/router`, `next/navigation` in any `packages/ui` source file
- No business logic, no API calls, no domain types (policy, claim, affiliate, etc.)
- No hardcoded app strings or `NEXT_PUBLIC_*` environment variables
- Props must carry only plain data types; all data transformation stays in the consuming app Container
- `packages/ui` components receive data via props; they never fetch, route, or hold domain state
- `href` props accept plain `string`, never `import('next/link').LinkProps['href']`
- `src` props for images accept `string`, never `import('next/image').ImageProps['src']`

---

## 2. Internal Package Contracts

| Package | What it provides | `packages/ui` may consume? |
|---|---|---|
| `@repo/config` | Semantic token source of truth (CSS variables) | ✅ Token definitions only |
| `@repo/helper` | App-agnostic utility functions | ✅ Only `cn()` via `@repo/helper` (apps); internal via `../../utils/cn` |
| `@repo/interface` | Shared cross-app interfaces | ✅ Read-only type imports only |
| `apps/*` | Any app-specific code | ❌ Never |

**`cn()` import rule:**
- **Inside `packages/ui` components:** `import { cn } from '../../utils/cn'`
- **In app code consuming `@repo/ui`:** `import { cn } from '@repo/helper'`
- Never `import { twMerge }` or `import { clsx }` directly in component files

---

## 3. Spec-First Mandate

> **Rule:** No component implementation is allowed without a spec document.

Every `packages/ui` component must have, in this order:

1. `<ComponentName>.spec.md` — written and reviewed BEFORE any code is written
2. `<ComponentName>.stories.tsx` — written BEFORE implementation (RED storybook state is intentional)
3. `<ComponentName>.tsx` — implementation (makes stories GREEN)
4. `index.ts` — named export

Storybook RED state is not a blocker for starting implementation — it is the **signal** that the spec is driving the code and not the other way around.

---

## 4. Storybook Mandate

Every component story file must cover:

- `Default` — baseline render with all required props
- `AllVariants` — one story per `variant` value
- `AllSizes` — one story per `size` value (if the component has a `size` prop)
- `DisabledState`
- `LoadingState` (if applicable)
- `ErrorState` (if applicable)
- `EdgeCase_LongContent` — at minimum
- Compound-component-specific stories (e.g., `DialogWithForm`, `TableWithPagination`)

Storybook story `title` must use the canonical group from §6.4 of `06-component-standards.md`:

```tsx
const meta: Meta<typeof ComponentName> = {
  title: 'Buttons/Button', // '<Group>/<ComponentName>' — always this exact format
};
```

Storybook axe-core a11y addon must show **zero violations** for each story before the component is considered complete.

---

## 5. Accessibility Minimum Bar

| Requirement | Minimum Standard |
|---|---|
| Keyboard navigation | All interactive elements reachable via Tab; triggers operable via Enter/Space; Esc closes overlays |
| Focus ring | `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` on all interactive elements |
| ARIA semantics | Correct role, aria-label, aria-describedby, aria-expanded, aria-controls per element type |
| Dialog/modal | Must have `DialogTitle` (or `sr-only` equivalent); focus trap on open; Esc to close |
| Error states | `aria-invalid="true"` + `aria-describedby` pointing to error message element |
| Loading states | `aria-busy="true"` on loading container or descriptive `aria-label` on spinner |
| Color contrast | WCAG AA minimum (4.5:1 for normal text, 3:1 for UI components and graphical elements) |
| Radix non-negotiables | Always include `DialogTitle` + `DialogDescription` (even if `sr-only`); never suppress Radix keyboard behavior |

---

## 6. Radix Primitive Mandate

> **Rule:** All `packages/ui` components that need accessibility (dialogs, dropdowns, tooltips, menus, checkboxes, radios, selects) MUST be built on Radix UI primitives. Custom reimplementations of these interaction patterns are not allowed.

Each component's required Radix package is documented in `01-component-taxonomy.md`.

Radix packages are declared as **direct dependencies** in `packages/ui/package.json`. Apps do not need to install Radix packages themselves.

---

## 7. Breaking Change Policy

The following changes are **breaking** if made after Batch 3 begins:

| Decision type | Breaking? |
|---|---|
| Canonical prop name (e.g., `variant` vs `type`) | ✅ Requires Foundation Amendment PR |
| Canonical variant value (e.g., `"default"` vs `"primary"`) | ✅ Requires Foundation Amendment PR |
| Tier assignment (Tier 1 vs Tier 2) | ✅ Requires Foundation Amendment PR |
| Token name (e.g., `--primary` vs `--brand`) | ✅ Requires Foundation Amendment PR |
| Shared-vs-local boundary ruling | ⚠️ Requires Amendment PR |
| Accessibility minimum bar upgrade | ✅ Non-breaking — can be upgraded without API change |

**Foundation Amendment PR requirements:**
- Description of what changed and why
- Impact analysis: which components and apps are affected
- Migration guide for consuming apps
- Reviewed and approved by ≥ 2 app team leads

---

## 8. Review Gate (All Must Pass Before Any Batch 3 Build Is Merged)

- [ ] `<Name>.spec.md` committed to `feat/ui`
- [ ] Stories committed (RED or GREEN — both valid at spec stage)
- [ ] API follows `02-api-conventions.md` (prop names, variant values, slot names)
- [ ] Tokens follow `03-token-theming-contract.md` — no hardcoded colors
- [ ] Boundary classification follows `04-shared-vs-local-boundary.md`
- [ ] Coverage row tracked in `05-coverage-baseline.md`
- [ ] Risk assessed in `06-risk-register.md` for HIGH-risk components
- [ ] `pnpm --filter @repo/ui check-types` passes
- [ ] `pnpm --filter @repo/ui lint` passes
- [ ] `pnpm --filter @repo/ui build` passes
- [ ] Storybook renders all stories with zero axe-core violations

---

## 9. Locked Consolidation Decisions (Cross-App Reconciliation)

The following component families have been normalized across all 27 app baselines:

| Raw app naming patterns | Normalized canonical | Decision basis |
|---|---|---|
| `Modal`, `Dialog`, `BottomSheetModal` | `Dialog` + `Drawer` | 26-app demand; different interaction semantics |
| `InputEmail`, `InputPhone`, `InputCurrency`, `InputText`, `InputName`, `InputNumber`, `UiInput`, `TextInput` | `Input` (base) with `inputMode` prop | Same root element; differ only by 1 prop |
| `Select`, `MultipleSelect`, `MultiSelect`, `SelectAutocomplete`, `InputSelect`, `SelectPhoneCode`, `UiSelect` | `Select` family (single + multi + searchable + phoneCode modes) | Same Radix primitive; mode flags absorb variants |
| `FlashMessage`, `Alert`, `AlertBanner`, `ErrorContent`, `Notification`, `NotificationBar`, `DrawerError` | `Alert` family (variant: `info | success | warning | error | destructive`) | Same visual pattern; only severity differs |
| `Loader`, `Loading`, `LoadingWrapper`, `SuspenseFallback` | `ContentLoadingWrapper` (overlay/inline/page variants) + `Skeleton` | Different structural roles; named per `06-component-standards.md §1` |
| `Datepicker`, `DatePicker`, `DatePickerModal`, `DayPicker`, `YearPicker`, `DatePickerV2` | `DatePicker` (with `mode="range"` and `mode="datetime"` extensions) | All use or should use `react-day-picker` |
| `Combobox`, `Autocomplete`, `InputAutocomplete`, `InputSelectAutocomplete`, `CustomSearchableDropdown` | `Combobox` | `Command` + `Popover`; different Radix primitive from `Select` |
| `Drewer`, `BottomSheet`, `DrawerModal` | `Drawer` | `vaul` library; slide-in pattern |
| Icon components (teman-affiliate-admin custom SVGs) | Deferred — use Lucide React directly | Icon sub-library deferred to Phase 3 scope decision |
| `PageHeader`, `NavigationBar` (top bar) | `PageHeader` (Tier 2, missing) | Domain-routing coupling; shared only for structural shell |
| `ReCaptcha`, `MicrosoftLoginButton` | KEEP_APP_LOCAL permanently | Auth/3rd-party SDK-coupled; can't be shared as primitives |

---

## 10. Shared Package Assessment

| Package | Current state | Batch 2 ruling |
|---|---|---|
| `@repo/config` | Token source exists | Lock semantic token contract before broad rollout (see `03-token-theming-contract.md`) |
| `@repo/helper` | Utility helpers | `cn()` exported here for app consumption; components use internal `../../utils/cn` path |
| `@repo/interface` | Cross-app interfaces | Keep read-only type imports only; no domain interface coupling in shared UI |