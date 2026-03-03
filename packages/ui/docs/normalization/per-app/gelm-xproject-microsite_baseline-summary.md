# Per-App Baseline Summary - gelm-xproject-microsite

## App Overview

- Framework: Next.js 16 App Router (React 19, TypeScript 5.9.2)
- UI libraries in use: HeroUI (`@heroui/react`, `@heroui/button`, `@heroui/theme`) plus local app components
- Shared package baseline: `@repo/ui` currently exports only `Box`

## Component Count Summary

- Total audited: 79
- MIGRATE_AFTER_SPLIT: 12
- NEW_SHARED_COMPONENT: 10
- KEEP_APP_LOCAL: 57

## P0 Critical Needs

- Complete Batch 1.5 splits for order/purchase views before any shared extraction to avoid coupling business orchestration into `@repo/ui`.
- Land shared form primitives (checkbox/input/select/datepicker/file-input) to reduce duplicate local field wrappers.
- Land shared feedback primitives (loader, flash/error messaging) to standardize loading/error behavior.

## New Shared Components Needed

- **Checkbox** (`src/common/components/checkbox.tsx`) - story group: Inputs; parity risk: MEDIUM
- **Datepicker** (`src/common/components/datepicker.tsx`) - story group: Inputs; parity risk: HIGH
- **Error Content** (`src/common/components/error-content.tsx`) - story group: Feedback; parity risk: MEDIUM
- **File Input** (`src/common/components/file-input.tsx`) - story group: Inputs; parity risk: HIGH
- **Flash Message** (`src/common/components/flash-message.tsx`) - story group: Feedback; parity risk: MEDIUM
- **Html Content** (`src/common/components/html-content.tsx`) - story group: Data Display; parity risk: MEDIUM
- **Input Select Autocomplete** (`src/common/components/input-select-autocomplete.tsx`) - story group: Inputs; parity risk: HIGH
- **Input Select** (`src/common/components/input-select.tsx`) - story group: Inputs; parity risk: HIGH
- **Input Text** (`src/common/components/input-text.tsx`) - story group: Inputs; parity risk: HIGH
- **Loader** (`src/common/components/loader.tsx`) - story group: Feedback; parity risk: MEDIUM

### NEW_SHARED Visual Specs (props, variants, states)

- **Checkbox**
Props: `checked?`, `defaultChecked?`, `disabled?`, `label?`, `onChange?`
Variants: `size(sm|md|lg)`, `tone(default|error)`
States: default, hover, focus, checked, disabled, error
- **Datepicker**
Props: `value?`, `defaultValue?`, `minDate?`, `maxDate?`, `onChange?`, `disabled?`
Variants: `size(sm|md|lg)`, `tone(default|error)`
States: default, hover, focus, open, selected, disabled, error
- **ErrorContent**
Props: `title`, `description?`, `actionLabel?`, `onAction?`
Variants: `tone(default|warning|danger)`
States: default, hover(action), focus(action), disabled(action)
- **FileInput**
Props: `accept?`, `multiple?`, `maxSize?`, `disabled?`, `onChange?`, `onError?`
Variants: `size(sm|md|lg)`, `tone(default|error)`
States: default, hover, focus, dragging, selected, disabled, error
- **FlashMessage**
Props: `open`, `title?`, `description?`, `tone(success|warning|danger|info)`, `onClose?`
Variants: `tone` only
States: hidden, visible, dismissing, focus(with close control)
- **HtmlContent**
Props: `html`, `sanitize?`, `className?`
Variants: `tone(default|muted)`
States: default, focus(within links), error(fallback when invalid payload)
- **InputSelectAutocomplete**
Props: `value?`, `options`, `placeholder?`, `disabled?`, `onChange?`, `onInputChange?`
Variants: `size(sm|md|lg)`, `tone(default|error)`
States: default, hover, focus, typing, selected, empty, disabled, error
- **InputSelect**
Props: `value?`, `options`, `placeholder?`, `disabled?`, `onChange?`
Variants: `size(sm|md|lg)`, `tone(default|error)`
States: default, hover, focus, open, selected, disabled, error
- **InputText**
Props: `value?`, `defaultValue?`, `placeholder?`, `disabled?`, `maxLength?`, `onChange?`
Variants: `size(sm|md|lg)`, `tone(default|error)`
States: default, hover, focus, typing, disabled, error
- **Loader**
Props: `inline?`, `overlay?`, `fullScreen?`, `label?`
Variants: `size(sm|md|lg)`, `tone(default|primary)`
States: default, visible, hidden (when loading false)

## Extend Existing Needed

- None in this app at current baseline (`@repo/ui` has only `Box`).

## Normalization Deltas

- Local components use mixed prop conventions (`isDisabled`, `onPress`, domain-specific props) and need normalized shared API contracts (`disabled`, `onChange`, semantic variants).
- Heavy reliance on HeroUI components in app code means visual extraction should preserve current behavior while migrating to token-driven primitives.
- Route-level pages and view components currently blend data orchestration with render logic; these must be split before migration.

## High-Risk Parity Items (Top 5)

- **Route app/(callback-handlers)/verify-payment** (`src/app/(callback-handlers)/verify-payment/page.tsx`): High regression risk because UI and domain orchestration are currently interleaved.
- **Route app/order/change-plan** (`src/app/order/change-plan/page.tsx`): Impacts transactional conversion and policy purchase funnel behavior.
- **Route app/order/personal-info** (`src/app/order/personal-info/page.tsx`): High regression risk because UI and domain orchestration are currently interleaved.
- **Route app/order/preview** (`src/app/order/preview/page.tsx`): Impacts transactional conversion and policy purchase funnel behavior.
- **Datepicker** (`src/common/components/datepicker.tsx`): Must preserve validation, disabled/loading semantics, and event contracts during extraction.

## Backlog CSV Row Count

- 79 rows

## SoC Evaluation Summary

- Batch 1.5 candidates: 12
- SoC potential breakdown: HIGH=6, MEDIUM=6, LOW=16, NONE=51
- Monolith count: 18
- Projected NEW_SHARED_COMPONENT candidates from splits: 6 (estimate)

## KEEP_APP_LOCAL Refactor Candidates

- KEEP_APP_LOCAL total: 57
- KEEP_APP_LOCAL with SoC HIGH/MEDIUM: 0
- Top 3: none (all KEEP_APP_LOCAL items are LOW/NONE SoC in current audit)

## Notes

- components.json not found (no shadcn registry manifest in app scope).
- Discovery included `packages/config`, `packages/helper`, and `packages/interface` boundaries for monorepo ownership validation.

## Batch 1.5 Amendment

- Components split: 12
- NEW_SHARED_COMPONENT candidates from splits: 0
- KEEP_APP_LOCAL-only Shells: 12
- Backlog CSV rows after split updates: 91
- Shell list:
  - VerifyPaymentShell
  - OrderPersonalInfoShell
  - HomeViewShell
  - ListPlanViewShell
  - FormPTVEligibilityShell
  - OrderChangePlanShell
  - OrderPersonalInfoFormShell
  - AdditionalInfoShell
  - DeclarationFormsShell
  - PersonalInfoShell
  - OrderPreviewShell
  - CardPersonalInfoShell
- Caller change check: zero caller files changed (only target component files + new shell files + local box primitive updated)
- Verification gate after all splits: check-types PASS, lint PASS (warnings only), build PASS
