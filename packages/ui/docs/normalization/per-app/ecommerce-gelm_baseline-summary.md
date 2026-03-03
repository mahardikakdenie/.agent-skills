# Per-App Baseline Summary - ecommerce-gelm

## Audit Coverage

- Total components audited: **62**
- ADOPT_NOW: **0**
- ADOPT_WITH_ADAPTER: **0**
- EXTEND_EXISTING: **0**
- NEW_SHARED_COMPONENT: **20**
- KEEP_APP_LOCAL: **28**
- MIGRATE_AFTER_SPLIT: **14**

## Top 5 Highest Parity-Risk Items

- src/views/order-personal-info/order-personal-info.view.tsx (HIGH) - Complex interactive behavior and async state transitions require strict parity validation.
- src/views/order-declaration/order-declaration.view.tsx (HIGH) - Complex interactive behavior and async state transitions require strict parity validation.
- src/app/(callback-handlers)/verify-payment/page.tsx (HIGH) - Complex interactive behavior and async state transitions require strict parity validation.
- src/views/home/components/button-select-product.tsx (HIGH) - Complex interactive behavior and async state transitions require strict parity validation.
- src/common/components/header-product-detail.tsx (HIGH) - Complex interactive behavior and async state transitions require strict parity validation.

## EXTEND_EXISTING Gap Notes

- None in this app audit; no current @repo/ui export matched with partial API.

## NEW_SHARED_COMPONENT Visual Spec (props, variants, states)

| Story group | Components | Core props | Variants | Required states |
| --- | --- | --- | --- | --- |
| Inputs | Checkbox, DatePicker, FileUpload, InputAffiliate, InputCurrency, InputEmail, InputName, InputNumber, InputPhone, InputSelectAutocomplete, InputSelect, InputText, SelectPhoneCode | name, value, label, placeholder, errorMessage, onChange | text, number, email, phone, select, autocomplete | default, focus, invalid, disabled, loading-options |
| Feedback | ErrorContent, FlashMessage, Loader, AlertAgeLimit | message, severity, open, onClose | success, error, warning, info | idle, visible, dismissing |
| Overlays | DialogSort, ModalSuccess, ViewImage | open, onOpenChange, title, description, actions | modal, drawer-style, media-preview | closed, open, confirm, cancel |

## KEEP_APP_LOCAL Refactor Candidates

- Total KEEP_APP_LOCAL: **28**
- KEEP_APP_LOCAL with SoC potential HIGH or MEDIUM: **0**
- Top 3 candidates: none (all HIGH/MEDIUM candidates were flagged as MIGRATE_AFTER_SPLIT).

## SoC Evaluation Summary

- Total Batch 1.5 candidates: **14**
- HIGH: **7**
- MEDIUM: **7**
- LOW: **11**
- NONE: **37**
- Projected NEW_SHARED_COMPONENT from splits:
  - Compare -> PlanComparisonTable
  - FooterTransaction -> TransactionFooterShell
  - FormStep -> ProgressStepHeader
  - HeaderProductDetail -> ProductHeaderShell
  - NavigationBar -> PageNavigationHeader
  - ButtonSelectProduct -> EligibilityDateModal

## Batch 1.5 Amendment

- Components split: **14**
- NEW_SHARED_COMPONENT candidates from splits: **3** (`CompareShell`, `FormStepShell`, `NavigationBarShell`)
- KEEP_APP_LOCAL-only Shells: **11** (`AuthPageShell`, `VerifyPaymentPageShell`, `FooterTransactionShell`, `HeaderProductDetailShell`, `NavbarHeaderShell`, `ButtonSelectProductShell`, `HomeViewShell`, `OrderDeclarationViewShell`, `OrderPersonalInfoViewShell`, `OrderPreviewViewShell`, `SaveInsuredShell`)
- Explicitly skipped in this run: **0** (all Batch 1.5 candidates completed)

