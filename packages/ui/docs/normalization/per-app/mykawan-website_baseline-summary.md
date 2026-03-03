# MyKawan Website - Per-App Baseline Summary (Batch 1)

## App overview

- Framework: Next.js 16.1.6 (Pages Router) + React 19.2.4
- UI baseline: @repo/ui consumed, but current export surface is Box only
- Local UI stack: react-modal, react-slick, react-bootstrap, legacy CSS + custom styles
- Audit scope: apps/mykawan-website/components/** JSX-rendering UI components

## Component count summary

- Total components audited: 60
- KEEP_APP_LOCAL: 31
- MIGRATE_AFTER_SPLIT: 17
- NEW_SHARED_COMPONENT: 12

## Top 5 highest parity risk items

- CalcFinanceInsurance (C:\Users\user\friendsuretech\projects\frontend-workspace-worktree\migrate-app_mykawan-website\apps\mykawan-website\components\elements\calcFinanceInsurance.js): Large stateful flow; preserve validation, async loading/error states, and locale-dependent rendering.
- CalcLivingCosts (C:\Users\user\friendsuretech\projects\frontend-workspace-worktree\migrate-app_mykawan-website\apps\mykawan-website\components\elements\calcLivingCosts.js): Large stateful flow; preserve validation, async loading/error states, and locale-dependent rendering.
- JobFormMalay (C:\Users\user\friendsuretech\projects\frontend-workspace-worktree\migrate-app_mykawan-website\apps\mykawan-website\components\elements\job-form\jobFormMalay.js): Large stateful flow; preserve validation, async loading/error states, and locale-dependent rendering.
- JobFormIndonesian (C:\Users\user\friendsuretech\projects\frontend-workspace-worktree\migrate-app_mykawan-website\apps\mykawan-website\components\elements\job-form\jobFormIndonesian.js): Large stateful flow; preserve validation, async loading/error states, and locale-dependent rendering.
- JobFormEnglish (C:\Users\user\friendsuretech\projects\frontend-workspace-worktree\migrate-app_mykawan-website\apps\mykawan-website\components\elements\job-form\jobFormEnglish.js): Large stateful flow; preserve validation, async loading/error states, and locale-dependent rendering.

## Components that EXTEND_EXISTING

- None detected in this app baseline.

## Components that are NEW_SHARED_COMPONENT (visual spec)

- BackToTop [Navigation]
  Props: href?, label, icon?, showAfter?
  Variants: default | subtle
  States: hidden, visible, hover, active
- ConfirmLeaveModal [Overlays]
  Props: open, onOpenChange, title, description, confirmLabel?, cancelLabel?, onConfirm?, onCancel?, children?
  Variants: default | destructive | success
  States: default, hover, focus-trap, loading, disabled, close
- DropdownAddress [Inputs]
  Props: value, onChange, options, placeholder, disabled, error?, label?
  Variants: default | outline
  States: default, hover, focus, disabled, error, empty
- DropdownClassification [Inputs]
  Props: value, onChange, options, placeholder, disabled, error?, label?
  Variants: default | outline
  States: default, hover, focus, disabled, error, empty
- DropdownTitle [Inputs]
  Props: value, onChange, options, placeholder, disabled, error?, label?
  Variants: default | outline
  States: default, hover, focus, disabled, error, empty
- Loading [Feedback]
  Props: size?, label?, fullScreen?
  Variants: spinner | skeleton | inline
  States: loading, delayed-loading, hidden
- Tabs [Navigation]
  Props: href?, label, icon?, showAfter?
  Variants: default | subtle
  States: hidden, visible, hover, active
- ModalOtpVoucher [Overlays]
  Props: open, onOpenChange, title, description, confirmLabel?, cancelLabel?, onConfirm?, onCancel?, children?
  Variants: default | destructive | success
  States: default, hover, focus-trap, loading, disabled, close
- ModalQrVoucher [Overlays]
  Props: open, onOpenChange, title, description, confirmLabel?, cancelLabel?, onConfirm?, onCancel?, children?
  Variants: default | destructive | success
  States: default, hover, focus-trap, loading, disabled, close
- ModalRedeemSuccess [Overlays]
  Props: open, onOpenChange, title, description, confirmLabel?, cancelLabel?, onConfirm?, onCancel?, children?
  Variants: default | destructive | success
  States: default, hover, focus-trap, loading, disabled, close
- ModalTncVoucherRedeem [Overlays]
  Props: open, onOpenChange, title, description, confirmLabel?, cancelLabel?, onConfirm?, onCancel?, children?
  Variants: default | destructive | success
  States: default, hover, focus-trap, loading, disabled, close
- ModalVoucherDetail [Overlays]
  Props: open, onOpenChange, title, description, confirmLabel?, cancelLabel?, onConfirm?, onCancel?, children?
  Variants: default | destructive | success
  States: default, hover, focus-trap, loading, disabled, close

## KEEP_APP_LOCAL refactor candidates

- Total KEEP_APP_LOCAL count (final classification): 31
- KEEP_APP_LOCAL components with SoC potential HIGH or MEDIUM (from initial KEEP baseline): 17
- Top 3 candidates:
- CalcFinanceInsurance: strategy hook-extraction; Shell as packages/ui candidate: NO (domain calculator semantics).
- JobFormMalay: strategy hook-extraction; Shell as packages/ui candidate: NO (domain-specific job posting flow).
- VoucherRedeem: strategy container-shell; Shell as packages/ui candidate: YES (voucher card/overlay shell).

## SoC evaluation summary

- Total Batch 1.5 candidates: 17
- SoC potential LOW: 27
- SoC potential MEDIUM: 17
- SoC potential NONE: 16
- Projected NEW_SHARED_COMPONENT from splits: 3-5 shell candidates after Batch 1.5.

## Notes for Phase 02 cross-app reconciliation

- This app has many route-coupled and data-coupled components; most split opportunities are app-first refactors before extraction.
- @repo/ui parity baseline is currently minimal (Box only), so shared candidates are net-new unless packages/ui expands before Batch 2/3/4.
- Backlog CSV row count: 60

## Batch 1.5 Amendment (2026-03-02)

- Components split: 17
  - CalcFamily -> Family (container) + CalcFamilyShell
  - CalcFinanceInsurance -> FinanceInsurance (container) + CalcFinanceInsuranceShell
  - CalcHouseholdBills -> HouseholdBills (container) + CalcHouseholdBillsShell
  - CalcIncome -> CalcIncome (container) + CalcIncomeShell
  - CalcLeisure -> Leisure (container) + CalcLeisureShell
  - CalcLivingCosts -> LivingCosts (container) + CalcLivingCostsShell
  - CalcTravel -> Travel (container) + CalcTravelShell
  - JobFormEnglish -> JobFormEnglish (container) + JobFormEnglishShell
  - JobFormIndonesian -> JobFormIndonesian (container) + JobFormIndonesianShell
  - JobFormMalay -> JobFormMalay (container) + JobFormMalayShell
  - ModalDeliveryAddress -> DeliveryAddressModal (container) + DeliveryAddressModalShell
  - ModalTncVoucher -> TncVoucherModal (container) + TncVoucherModalShell
  - PointProfile -> PointProfile (container) + PointProfileShell
  - QuestionQuiz -> QuestionFlow (container) + QuestionQuizShell
  - Register -> Register (container) + RegisterShell
  - RegisterForm -> RegisterForm (container) + RegisterFormShell
  - VoucherRedeem -> Voucher (container) + VoucherRedeemShell
- NEW_SHARED_COMPONENT candidates from splits: 0
- KEEP_APP_LOCAL-only Shells: 17
  - CalcFamilyShell
  - CalcFinanceInsuranceShell
  - CalcHouseholdBillsShell
  - CalcIncomeShell
  - CalcLeisureShell
  - CalcLivingCostsShell
  - CalcTravelShell
  - DeliveryAddressModalShell
  - JobFormEnglishShell
  - JobFormIndonesianShell
  - JobFormMalayShell
  - PointProfileShell
  - RegisterFormShell
  - RegisterShell
  - QuestionQuizShell
  - TncVoucherModalShell
  - VoucherRedeemShell
- Remaining Batch 1.5 candidates (explicitly deferred in this pass): 0
  - None.
- Backlog CSV row count after Batch 1.5 updates: 77
