# Per-App Baseline Summary - claim-portal (Batch 1)

## App overview
- Framework: Next.js App Router (v16), React 19, TypeScript 5.9.2
- UI baseline in app: local components under `component/` + route views under `view/`
- Shared UI package status: `@repo/ui` stable export surface currently exposes `Box` only on this branch

## Component count summary
- Total components audited: 65
- KEEP_APP_LOCAL: 28
- MIGRATE_AFTER_SPLIT: 22
- NEW_SHARED_COMPONENT: 15

## Top 5 highest-parity-risk items
- `AlterationView` (`view/alteration.view.tsx`): multi-step workflow with service calls, validation, and modal-state coupling
- `NomineeView` (`view/nominee.view.tsx`): multi-step workflow with service calls, validation, and modal-state coupling
- `CreateNomineeModal` (`component/form/create-nominee-modal.tsx`): multi-step workflow with service calls, validation, and modal-state coupling
- `CancellationView` (`view/cancellation.view.tsx`): multi-step workflow with service calls, validation, and modal-state coupling
- `CreditView` (`view/credit.view.tsx`): multi-step workflow with service calls, validation, and modal-state coupling

## Components that EXTEND_EXISTING
- None in Batch 1. Current `@repo/ui` stable surface does not expose matching components beyond `Box`.

## NEW_SHARED_COMPONENT visual specs (props, variants, states)
- `Accordion`: props = items, defaultValue, type, collapsible, className; variants = single | multiple; states = collapsed, expanded, disabled, keyboard focus
- `BottomSheetModal`: props = isOpen, onClose, title, children, footer; variants = mobile sheet | desktop centered; states = open, close, drag-dismiss, loading content
- `Breadcrumb`: props = items, separator, onNavigate; variants = default | compact; states = default, hover, active, keyboard focus
- `Checkbox`: props = checked, onCheckedChange, disabled, label, error; variants = default | error; states = unchecked, checked, indeterminate, disabled, focus
- `DatePicker`: props = value, onChange, minDate, maxDate, disabled; variants = single-date | localized; states = idle, picker-open, selected, invalid, disabled
- `DateTimePicker`: props = value, onChange, minDateTime, maxDateTime, disabled; variants = date-only | date-time; states = idle, picker-open, selected, invalid, disabled
- `Input`: props = value, onChange, label, placeholder, error, icon; variants = default | password | numeric; states = default, focus, error, disabled, loading adornment
- `LoadingWrapper`: props = loading, fallback, children; variants = page | content | form; states = initial loading, delayed loading, resolved
- `PageTitle`: props = title, subtitle, breadcrumb, actions; variants = simple | with-breadcrumb | with-actions; states = default, responsive collapse
- `RadioGroup`: props = value, onValueChange, options, disabled; variants = inline | stacked; states = unchecked, checked, disabled, keyboard focus
- `Select`: props = value, onChange, options, placeholder, disabled, error; variants = single-select | searchable; states = closed, open, selected, empty, disabled, loading
- `Switch`: props = checked, onCheckedChange, labels, disabled; variants = binary-label | compact; states = off, on, disabled, focus-visible
- `Tabs`: props = value, onValueChange, items, orientation; variants = underline | pill; states = active, inactive, disabled, keyboard nav
- `TextArea`: props = value, onChange, rows, maxLength, error; variants = default | auto-grow; states = default, focus, error, disabled
- `Tooltip`: props = content, side, align, delayDuration, children; variants = top | bottom | left | right; states = hidden, visible, hover, focus, escape-close

## KEEP_APP_LOCAL refactor candidates
- Total KEEP_APP_LOCAL count: 28
- KEEP_APP_LOCAL with SoC potential HIGH or MEDIUM: 0
- Top 3 candidates: n/a (HIGH/MEDIUM candidates were flagged as `MIGRATE_AFTER_SPLIT` for Batch 1.5).

## SoC Evaluation Summary
- Total Batch 1.5 candidates: 22
- HIGH: 12
- LOW: 10
- MEDIUM: 10
- NONE: 33
- Projected NEW_SHARED_COMPONENT from splits: LoginModalShell, OtpModalShell, ClaimSummaryCardShell, ClaimUploadSectionShell, NomineeListShell, PolicyFormShell, UploadNricShell, ClaimStatusFormShell

## Backlog CSV row count
- Rows in `_component-backlog.csv`: 109

## Batch 1.5 Amendment

- Components split: 22
  - AuthView
  - ClaimStatusModal
  - SelectBank
  - SelectCountry
  - SelectPolicy
  - SelectRelationship
  - LoginModal
  - LoginModalPhone
  - OtpModal
  - OtpModalPhone
  - NomineeOtpModal
  - UploadNric
  - CreateNomineeModal
  - AlterationView
  - CancellationView
  - CheckClaimDetailsView
  - ClaimSummaryView
  - ClaimUploadModal
  - CreditView
  - IndexView
  - NewClaimView
  - NomineeView
- NEW_SHARED_COMPONENT candidates from splits: 0
- KEEP_APP_LOCAL-only Shells: 22
  - AuthViewShell
  - ClaimStatusModalShell
  - SelectBankShell
  - SelectCountryShell
  - SelectPolicyShell
  - SelectRelationshipShell
  - LoginModalShell
  - LoginModalPhoneShell
  - OtpModalShell
  - OtpModalPhoneShell
  - NomineeOtpModalShell
  - UploadNricShell
  - CreateNomineeModalShell
  - AlterationViewShell
  - CancellationViewShell
  - CheckClaimDetailsViewShell
  - ClaimSummaryViewShell
  - ClaimUploadModalShell
  - CreditViewShell
  - IndexViewShell
  - NewClaimViewShell
  - NomineeViewShell
- Deferred Batch 1.5 candidates (with reason): 0
  - None

## Legacy Update Amendment - 2026-03-04 11:24 (+07)

- Legacy update integrated via `integrate-app/claim-portal` -> `migrate-app/claim-portal` (with conflict resolution).
- New legacy additions absorbed as app-local support artifacts: `helpers/jwt.helper.ts`, `hook/use-user-info.hook.ts`.
- No new shared-component intake candidate created in this cycle (`L5` not required).
- Batch 1.5 split architecture preserved (no rollback to monolith containers).
- Baseline counters unchanged:
  - KEEP_APP_LOCAL: 28
  - MIGRATE_AFTER_SPLIT: 22
  - NEW_SHARED_COMPONENT: 15
  - `_component-backlog.csv` rows: 109
