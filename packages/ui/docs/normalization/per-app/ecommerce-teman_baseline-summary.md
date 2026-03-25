# Per-App Baseline Summary - ecommerce-teman

- Total components audited: 122
- Classification counts:
  - ADOPT_NOW: 0
  - ADOPT_WITH_ADAPTER: 0
  - EXTEND_EXISTING: 0
  - NEW_SHARED_COMPONENT: 22
  - KEEP_APP_LOCAL: 79
  - MIGRATE_AFTER_SPLIT: 21

## Top 5 Highest-Parity-Risk Items

- PortalDeclarationIdTransEditParticipantPage (`src/app/(portal)/declaration/[idTrans]/edit-participant/page.tsx`): Critical purchase/payment/declaration flow; regression can block checkout or policy issuance.
- PortalDeclarationIdTransPage (`src/app/(portal)/declaration/[idTrans]/page.tsx`): Critical purchase/payment/declaration flow; regression can block checkout or policy issuance.
- PortalDeclarationIdTransSuccessPage (`src/app/(portal)/declaration/[idTrans]/success/page.tsx`): Critical purchase/payment/declaration flow; regression can block checkout or policy issuance.
- PaymentIdCompletePaymentPage (`src/app/payment/[id]/complete-payment/page.tsx`): Critical purchase/payment/declaration flow; regression can block checkout or policy issuance.
- PaymentIdMetodePembayaranMethodCodeOtenticPage (`src/app/payment/[id]/metode-pembayaran/[method]/code-otentic/page.tsx`): Critical purchase/payment/declaration flow; regression can block checkout or policy issuance.

## EXTEND_EXISTING Requirements

- None identified in this batch (current @repo/ui export surface only includes Box).

## NEW_SHARED_COMPONENT Visual Specs (props, variants, states)

### Checkbox
- Source: `src/common/components/checkbox.tsx`
- Story group: Inputs
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### Cookie
- Source: `src/common/components/cookie.tsx`
- Story group: Feedback
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### Datepicker
- Source: `src/common/components/datepicker.tsx`
- Story group: Inputs
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### ErrorContent
- Source: `src/common/components/error-content.tsx`
- Story group: Feedback
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### FileInput
- Source: `src/common/components/file-input.tsx`
- Story group: Inputs
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### FlashMessage
- Source: `src/common/components/flash-message.tsx`
- Story group: Feedback
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### HtmlContent
- Source: `src/common/components/html-content.tsx`
- Story group: Data Display
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### InputCurrency
- Source: `src/common/components/input-currency.tsx`
- Story group: Inputs
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### InputEmail
- Source: `src/common/components/input-email.tsx`
- Story group: Inputs
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### InputName
- Source: `src/common/components/input-name.tsx`
- Story group: Inputs
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### InputNumber
- Source: `src/common/components/input-number.tsx`
- Story group: Inputs
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### InputPhone
- Source: `src/common/components/input-phone.tsx`
- Story group: Inputs
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### InputSelectAutocomplete
- Source: `src/common/components/input-select-autocomplete.tsx`
- Story group: Inputs
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### InputSelect
- Source: `src/common/components/input-select.tsx`
- Story group: Inputs
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### InputText
- Source: `src/common/components/input-text.tsx`
- Story group: Inputs
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### Loader
- Source: `src/common/components/loader.tsx`
- Story group: Feedback
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### ModalFilter
- Source: `src/common/components/modal-filter.tsx`
- Story group: Overlays
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### ModalSort
- Source: `src/common/components/modal-sort.tsx`
- Story group: Overlays
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### OtpInput
- Source: `src/common/components/otp-input.tsx`
- Story group: Inputs
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### ReCaptcha
- Source: `src/common/components/ReCaptcha.tsx`
- Story group: Inputs
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### SelectPhoneCode
- Source: `src/common/components/select-phone-code.tsx`
- Story group: Inputs
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

### TagFilter
- Source: `src/common/components/tag-filter.tsx`
- Story group: Navigation
- Props: className + component-specific, app-agnostic visual props only.
- Variants: default plus semantic variants required by current usage.
- States: default, hover, focus, disabled, loading/error where applicable.

## KEEP_APP_LOCAL Refactor Candidates

- Total KEEP_APP_LOCAL count: 79
- Count with SoC potential HIGH or MEDIUM: 19
- AuthAuthPage: SoC strategy=container-shell; Shell is packages/ui candidate=NO
- PaymentIdVerifyPage: SoC strategy=container-shell; Shell is packages/ui candidate=NO
- ProductCategorySlugRiplayPage: SoC strategy=container-shell; Shell is packages/ui candidate=NO

## SoC Evaluation Summary

- Total Batch 1.5 candidates: 21
- SoC breakdown: HIGH=3, MEDIUM=18, LOW=0, NONE=101
- Projected NEW_SHARED_COMPONENT from splits: 18


## Batch 1.5 Amendment

- Components split: 21
- NEW_SHARED_COMPONENT candidates from splits: 18 (AlertBuyShell, CarouselHeroShell, CarouselPartnerShell, CarouselProgramShell, ChatbotPopupShell, CompareShell, FooterProductDetailShell, HeaderCompareShell, InfoProductFilterShell, InfoProductShell, ItemProductShell, ModalSampleImageShell, ModalSelectLangChangeShell, ModalSelectLangShell, ModalSuccessOpsShell, NavigationBarShell, NavigationShell, ViewImageShell)
- KEEP_APP_LOCAL-only Shells: 3 (AuthAuthPageShell, PaymentIdVerifyPageShell, ProductCategorySlugRiplayPageShell)
