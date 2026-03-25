# Per-App Baseline Summary - agent-microsite

## App Overview
- Framework: Next.js 16 (App Router)
- Language/runtime: TypeScript + React 19
- UI stack in app: NextUI legacy components plus app-local UI modules
- Shared UI package availability: `@repo/ui` currently exports `Box` only on this branch baseline

## Component Count Summary
- Total components audited: 90
- ADOPT_NOW: 0
- ADOPT_WITH_ADAPTER: 0
- EXTEND_EXISTING: 0
- NEW_SHARED_COMPONENT: 17
- KEEP_APP_LOCAL: 73
- MIGRATE_AFTER_SPLIT: 0

## Top 5 Highest-Parity-Risk Items
- SetInsuredPerson.view (src/views/set-insured-person/set-insured-person.view.tsx): Critical workflow behavior and state transitions must remain identical.
- Page (TermsAndConditions) (src/app/terms-and-conditions/page.tsx): Critical workflow behavior and state transitions must remain identical.
- UploadCropImage (src/common/components/upload-crop-image.tsx): Critical workflow behavior and state transitions must remain identical.
- DeclarationPerInsured.view (src/views/declaration-per-insured/declaration-per-insured.view.tsx): Critical workflow behavior and state transitions must remain identical.
- Datepicker (src/common/components/datepicker.tsx): Critical workflow behavior and state transitions must remain identical.

## EXTEND_EXISTING Requirements
- None in this app at Batch 1 baseline.

## NEW_SHARED_COMPONENT Visual Specs (Initial)
### Checkbox
- Props: define app-agnostic props from current local API at `src/common/components/checkbox.tsx`.
- Variants: normalize to shared `variant` and `size` conventions where applicable.
- States: default, hover, focus, disabled, loading, error (if applicable).
- Story group: Inputs.
### Datepicker
- Props: define app-agnostic props from current local API at `src/common/components/datepicker.tsx`.
- Variants: normalize to shared `variant` and `size` conventions where applicable.
- States: default, hover, focus, disabled, loading, error (if applicable).
- Story group: Inputs.
### ErrorContent
- Props: define app-agnostic props from current local API at `src/common/components/error-content.tsx`.
- Variants: normalize to shared `variant` and `size` conventions where applicable.
- States: default, hover, focus, disabled, loading, error (if applicable).
- Story group: Feedback.
### FlashMessage
- Props: define app-agnostic props from current local API at `src/common/components/flash-message.tsx`.
- Variants: normalize to shared `variant` and `size` conventions where applicable.
- States: default, hover, focus, disabled, loading, error (if applicable).
- Story group: Feedback.
### HtmlContent
- Props: define app-agnostic props from current local API at `src/common/components/html-content.tsx`.
- Variants: normalize to shared `variant` and `size` conventions where applicable.
- States: default, hover, focus, disabled, loading, error (if applicable).
- Story group: Layout.
### InputCurrency
- Props: define app-agnostic props from current local API at `src/common/components/input-currency.tsx`.
- Variants: normalize to shared `variant` and `size` conventions where applicable.
- States: default, hover, focus, disabled, loading, error (if applicable).
- Story group: Inputs.
### InputEmail
- Props: define app-agnostic props from current local API at `src/common/components/input-email.tsx`.
- Variants: normalize to shared `variant` and `size` conventions where applicable.
- States: default, hover, focus, disabled, loading, error (if applicable).
- Story group: Inputs.
### InputName
- Props: define app-agnostic props from current local API at `src/common/components/input-name.tsx`.
- Variants: normalize to shared `variant` and `size` conventions where applicable.
- States: default, hover, focus, disabled, loading, error (if applicable).
- Story group: Inputs.
### InputNumber
- Props: define app-agnostic props from current local API at `src/common/components/input-number.tsx`.
- Variants: normalize to shared `variant` and `size` conventions where applicable.
- States: default, hover, focus, disabled, loading, error (if applicable).
- Story group: Inputs.
### InputPhone
- Props: define app-agnostic props from current local API at `src/common/components/input-phone.tsx`.
- Variants: normalize to shared `variant` and `size` conventions where applicable.
- States: default, hover, focus, disabled, loading, error (if applicable).
- Story group: Inputs.
### InputSelectAutocomplete
- Props: define app-agnostic props from current local API at `src/common/components/input-select-autocomplete.tsx`.
- Variants: normalize to shared `variant` and `size` conventions where applicable.
- States: default, hover, focus, disabled, loading, error (if applicable).
- Story group: Inputs.
### InputSelectAutocomplete2
- Props: define app-agnostic props from current local API at `src/common/components/input-select-autocomplete2.tsx`.
- Variants: normalize to shared `variant` and `size` conventions where applicable.
- States: default, hover, focus, disabled, loading, error (if applicable).
- Story group: Inputs.
### InputSelect
- Props: define app-agnostic props from current local API at `src/common/components/input-select.tsx`.
- Variants: normalize to shared `variant` and `size` conventions where applicable.
- States: default, hover, focus, disabled, loading, error (if applicable).
- Story group: Inputs.
### InputText
- Props: define app-agnostic props from current local API at `src/common/components/input-text.tsx`.
- Variants: normalize to shared `variant` and `size` conventions where applicable.
- States: default, hover, focus, disabled, loading, error (if applicable).
- Story group: Inputs.
### Loader
- Props: define app-agnostic props from current local API at `src/common/components/loader.tsx`.
- Variants: normalize to shared `variant` and `size` conventions where applicable.
- States: default, hover, focus, disabled, loading, error (if applicable).
- Story group: Feedback.
### ModalSort
- Props: define app-agnostic props from current local API at `src/common/components/modal-sort.tsx`.
- Variants: normalize to shared `variant` and `size` conventions where applicable.
- States: default, hover, focus, disabled, loading, error (if applicable).
- Story group: Overlays.
### SelectPhoneCode
- Props: define app-agnostic props from current local API at `src/common/components/select-phone-code.tsx`.
- Variants: normalize to shared `variant` and `size` conventions where applicable.
- States: default, hover, focus, disabled, loading, error (if applicable).
- Story group: Inputs.

## KEEP_APP_LOCAL Refactor Candidates
- Total KEEP_APP_LOCAL: 73
- KEEP_APP_LOCAL with SoC potential HIGH or MEDIUM: 0
- Top 3 candidates: None

## SoC Evaluation Summary
- Total Batch 1.5 candidates: 0
- Monolith count: 53
- HIGH: 0
- MEDIUM: 0
- LOW: 53
- NONE: 37
- Projected NEW_SHARED_COMPONENT from splits: 0
## Legacy Update - 2026-03-04 10:48 (+07)
- Source: subtree pull from agent-microsite/stage into integrate-app/agent-microsite, then merge to migrate-app/agent-microsite.
- Net changed files from this legacy sync: 3.
- Changed files:
  - src/app/payment/[idTrans]/method/page.tsx
  - src/app/payment/[idTrans]/method/components/radio-group.tsx
  - src/app/payment/[idTrans]/method/hooks.tsx
- New component introduced by legacy: none (new file is hook/helper, not shared UI primitive).
- packages/ui intake queue impact:
  - NEW_SHARED_COMPONENT: none
  - EXTEND_EXISTING: none
- Verification after merge:
  - pnpm --filter agent-microsite check-types -> PASS
  - pnpm --filter agent-microsite lint -> PASS (warnings only)
  - pnpm --filter agent-microsite build -> PASS