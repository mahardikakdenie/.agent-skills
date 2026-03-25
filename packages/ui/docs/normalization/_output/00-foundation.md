# 00 - Design System Foundation

> Batch: Batch 2 - Design System Foundation
> Branch: feat/ui
> Run date: 2026-03-06
> Inputs: 27 per-app baseline summaries from packages/ui/docs/normalization/per-app
> Required references read: migration-batch-prompts.md (Batch 2), 02-design-system-foundation.md, 06-component-standards.md
> Current @repo/ui export surface: Box only

---

## 1. Objective Lock

This document is the Batch 2 constitution for `packages/ui`.
All Batch 3 to Batch 5 implementation must conform to this contract.

Breaking-change rule once Batch 3 starts:
- Canonical prop names
- Canonical variant values
- Tier assignment
- Token names
- Shared-vs-local boundary rulings

Versioning rule:
- Foundation decisions in `00-foundation.md`, `02-api-conventions.md`, and `03-token-theming-contract.md` are semver-significant for `@repo/ui` once implementation begins.
- Any change to a locked item requires a Foundation Amendment PR with app impact, migration plan, and reviewer approval from the design system owners.

---

## 2. App-Agnostic Principle

Hard rules:
- `packages/ui` must not import from `apps/*`.
- `packages/ui` must not call APIs or access app service hooks.
- `packages/ui` must not use app domain models in component contracts.
- `packages/ui` must not use Next.js runtime APIs directly in shared components.
- `packages/ui` must not read `NEXT_PUBLIC_*` env values.

Implementation consequence:
- Shared components receive plain serializable props.
- Data fetching, routing, auth, and workflow orchestration remain in app-level containers.
- Any component that still needs app services after a shell split stays app-local.

---

## 3. Shared Package Contracts

| Package | Responsibility | Batch 2 ruling |
|---|---|---|
| `@repo/config` | Shared token and styling contract | Becomes the semantic token source of truth after a Batch 3 bootstrap update |
| `@repo/helper` | Shared app-agnostic utilities | Hosts the shared `cn()` helper and other neutral utilities; this is the single class-merge source for both apps and `@repo/ui` |
| `@repo/interface` | Shared cross-app types | Type-only contracts; no app domain leakage and no premature extraction |
| `apps/*` | Product applications | Never imported by `packages/ui` |

---

## 4. Workspace Reality Check

The prompt required reading the current workspace packages before locking the foundation. The rulings below reflect the actual `feat_ui` state, not a future-state assumption.

| Package | Current state on `feat/ui` | Batch 2 ruling | Required action before Batch 3 |
|---|---|---|---|
| `@repo/ui` | Only `Box` is exported from `src/index.ts`; several Radix/calendar/form deps are already installed | Treat coverage as `Box` only. No other component is "existing" until exported and documented | Keep taxonomy and coverage docs anchored to the real export surface |
| `@repo/config` | Exports `tailwind.css` with brand palette `@theme` tokens and icon utilities only | This is not yet the semantic CSS-variable contract required by shared components | Add a semantic token preset and publish the contract described in `03-token-theming-contract.md` |
| `@repo/helper` | Root `index.ts` now acts as a barrel and `src/cn.ts` holds the canonical implementation | Keep the package as the single class-merge source for both apps and `packages/ui`, with package-root exports re-exporting modular helper files | Add new helpers under `src/*` and re-export them through the package barrel instead of adding logic directly to the root file |
| `@repo/interface` | `index.ts` is empty | Keep it reserved for proven cross-app UI-facing types only | Add shared option/item contracts only when at least 2 apps need the same type |

---

## 5. Dependency and Quality Gate Baseline

The Batch 2 prompt explicitly requires dependency-gap analysis. The following matrix is the governing ruling for implementation planning.

| Capability | Current state on `feat_ui/packages/ui` | Batch 2 ruling |
|---|---|---|
| Core primitives | Radix `avatar`, `checkbox`, `dialog`, `label`, `popover`, `radio-group`, `select`, `slot`, `switch`, `tabs`, `tooltip` already installed | These packages are ready for Batch 3 implementation work |
| Calendar/form primitives | `react-day-picker`, `react-hook-form`, `vaul`, `lucide-react`, and `class-variance-authority` are installed in `@repo/ui`; `clsx` now lives in `@repo/helper` alongside the shared `cn()` helper | These packages are available, but only count as "ready" once canonical wrappers are built |
| `cn()` utility | `@repo/helper` now owns the canonical implementation via `src/cn.ts`, re-exported through the package barrel, with `tailwind-merge` installed there | Keep all class-merging behavior centralized in `@repo/helper` and add future helper modules under `src/*` instead of recreating package-private variants |
| Overlay/data/menu primitives not yet installed | No `@radix-ui/react-dropdown-menu`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-menubar`, `@radix-ui/react-accordion` | Install per implementation batch before those components ship |
| Headless input/data packages not yet installed | No `cmdk`, `@tanstack/react-table`, or `date-fns` in `@repo/ui` | These are blockers for `Command`/`Combobox`, `DataTable`, and the DatePicker family |
| Animation utility | No `tailwindcss-animate` in `@repo/ui` | Add before using the motion patterns documented in `03-token-theming-contract.md` |
| Quality tooling | No `vitest`, `jsdom`, `@testing-library/react`, `jest-axe`, or `@storybook/addon-a11y` in `@repo/ui` | Add before enforcing the zero-violation a11y gate and component-level test gate described by this foundation |

---

## 6. Spec-First and Storybook-First Policy

Each shared component requires:
1. `<Component>.spec.md` first
2. `<Component>.stories.tsx` as a first-class acceptance artifact
3. `<Component>.tsx` implementation
4. `index.ts` export

Minimum story coverage:
- default
- all variants
- all sizes (if size exists)
- disabled
- loading (if applicable)
- error (if applicable)
- long-content edge case

---

## 7. Accessibility Baseline

Mandatory for all shared components:
- Keyboard operability (tab, enter, space, esc where applicable)
- Visible focus ring
- Correct role and ARIA attributes
- Dialog title/description semantics
- Error-state semantics with `aria-invalid` and `aria-describedby`
- WCAG AA contrast minimum

Radix primitive policy:
- Use Radix primitives for dialogs, menus, tooltip, popover, select, checkbox, switch, tabs, and related interaction patterns.
- If a required Radix primitive is not installed yet, the component is blocked until the dependency gap is closed; do not improvise a lower-quality replacement.

---

## 8. API Normalization Decisions (Locked)

Cross-app consolidation decisions:
- `Modal` / `Dialog` family -> `Dialog`
- `BottomSheet` / `DrawerModal` / `Drewer` family -> `Drawer`
- `InputEmail` / `InputPhone` / `InputCurrency` / `InputText` / `InputName` / `InputNumber` family -> `Input` with mode-based API
- `Select` / `MultiSelect` / `MultipleSelect` / `SelectPhoneCode` family -> `Select`
- `SelectAutocomplete` / `InputAutocomplete` / searchable dropdown family -> `Combobox`
- `FlashMessage` / `Notification` / `ErrorContent` / `AlertBanner` family -> `Alert`
- `Loading` / `Loader` / `LoadingWrapper` / `SuspenseFallback` family -> no canonical shared wrapper; apps compose `Spinner` and `Skeleton` locally where needed
- `Datepicker` / `DatePicker` variants -> Date family with canonical `DatePicker`, `DateRangePicker`, and `MonthPicker`; time-enabled flows normalize through optional `withTime` support on `DatePicker` or `DateRangePicker`

Traceability:
- Detailed merge and split reasoning is deferred to the subsequent planning batch.
- App-side alias handling is deferred to downstream adapter planning and app-migration work.

---

## 9. Review Gate (Required Before Merge)

- API follows `02-api-conventions.md`
- Token usage follows `03-token-theming-contract.md`
- Boundary decision follows `04-shared-vs-local-boundary.md`
- Coverage row exists in `05-coverage-baseline.md`
- Risk row exists in `06-risk-register.md` for high-risk areas
- Consolidation ruling must be preserved in the subsequent planning batch for any newly merged family.
- Legacy alias handling must stay outside the Batch 2 foundation set and be resolved downstream.
- `pnpm --filter @repo/ui check-types` passes
- `pnpm --filter @repo/ui lint` passes
- `pnpm --filter @repo/ui build` passes
- Storybook render and a11y checks pass for introduced components

---

## 10. Batch 2 Input Completeness Matrix

| App | Baseline file | Loaded |
|---|---|---|
| admin-portal | `packages/ui/docs/normalization/per-app/admin-portal_baseline-summary.md` | yes |
| admin-portal-boost | `packages/ui/docs/normalization/per-app/admin-portal-boost_baseline-summary.md` | yes |
| affiliate-admin | `packages/ui/docs/normalization/per-app/affiliate-admin_baseline-summary.md` | yes |
| affiliate-portal | `packages/ui/docs/normalization/per-app/affiliate-portal_baseline-summary.md` | yes |
| agent-admin | `packages/ui/docs/normalization/per-app/agent-admin_baseline-summary.md` | yes |
| agent-microsite | `packages/ui/docs/normalization/per-app/agent-microsite_baseline-summary.md` | yes |
| agent-portal | `packages/ui/docs/normalization/per-app/agent-portal_baseline-summary.md` | yes |
| agent-web-portal | `packages/ui/docs/normalization/per-app/agent-web-portal_baseline-summary.md` | yes |
| boost-product-fe | `packages/ui/docs/normalization/per-app/boost-product-fe_baseline-summary.md` | yes |
| claim-portal | `packages/ui/docs/normalization/per-app/claim-portal_baseline-summary.md` | yes |
| customer-portal | `packages/ui/docs/normalization/per-app/customer-portal_baseline-summary.md` | yes |
| ecommerce-gelm | `packages/ui/docs/normalization/per-app/ecommerce-gelm_baseline-summary.md` | yes |
| ecommerce-teman | `packages/ui/docs/normalization/per-app/ecommerce-teman_baseline-summary.md` | yes |
| gegm-friendcover | `packages/ui/docs/normalization/per-app/gegm-friendcover_baseline-summary.md` | yes |
| gegm-friendcover-admin | `packages/ui/docs/normalization/per-app/gegm-friendcover-admin_baseline-summary.md` | yes |
| gelm-xproject-microsite | `packages/ui/docs/normalization/per-app/gelm-xproject-microsite_baseline-summary.md` | yes |
| gen-ai-portal | `packages/ui/docs/normalization/per-app/gen-ai-portal_baseline-summary.md` | yes |
| getrev-da-microsite | `packages/ui/docs/normalization/per-app/getrev-da-microsite_baseline-summary.md` | yes |
| grab-landing-page | `packages/ui/docs/normalization/per-app/grab-landing-page_baseline-summary.md` | yes |
| haruuz-microsite | `packages/ui/docs/normalization/per-app/haruuz-microsite_baseline-summary.md` | yes |
| mykawan-website | `packages/ui/docs/normalization/per-app/mykawan-website_baseline-summary.md` | yes |
| partner-portal | `packages/ui/docs/normalization/per-app/partner-portal_baseline-summary.md` | yes |
| sso-portal | `packages/ui/docs/normalization/per-app/sso-portal_baseline-summary.md` | yes |
| teman-affiliate-admin | `packages/ui/docs/normalization/per-app/teman-affiliate-admin_baseline-summary.md` | yes |
| teman-affiliate-microsite | `packages/ui/docs/normalization/per-app/teman-affiliate-microsite_baseline-summary.md` | yes |
| teman-affiliate-portal | `packages/ui/docs/normalization/per-app/teman-affiliate-portal_baseline-summary.md` | yes |
| ticket-portal | `packages/ui/docs/normalization/per-app/ticket-portal_baseline-summary.md` | yes |

Validation:
- Baseline files found: 27
- `migrate-app_*` app worktrees checked (excluding `migrate-app_base`): 27
- Missing baseline summaries: 0
