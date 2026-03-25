# Per-App Baseline Summary - haruuz-microsite (Batch 1)

## 1) App overview
- App: `haruuz-microsite`
- Framework: Next.js App Router (`next@^16`, `react@^19`)
- UI stack in app: HeroUI + app-local components in `src/common/components` and `src/app/**`
- Shared UI availability at audit time: `@repo/ui` exports only `Box`

## 2) Component count summary
- Total components audited: **45**
- `MIGRATE_AFTER_SPLIT`: **24**
- `KEEP_APP_LOCAL`: **13**
- `NEW_SHARED_COMPONENT`: **7**
- `EXTEND_EXISTING`: **1**
- `ADOPT_NOW`: **0**
- `ADOPT_WITH_ADAPTER`: **0**

## 3) P0 critical needs (migration blockers)
- Batch 1.5 SoC split for monolith route flows before any safe shared extraction:
  - `DeclarationPage`, `PreviewPage`, `PaymentPage`, `PersonalInfoPage`, `PaymentMethodPage`, `HomePage`
- Stable shell contracts needed post-split for high-risk shared surfaces:
  - `DatePicker`, `DatePickerModal`, `QuestionGroup`, `UploadCropImage`, `ModalProposalForm`

## 4) New shared components needed
- `InputText` (Inputs)
- `InputAutocomplete` (Inputs)
- `Loader` (Feedback)
- `SkeletonLoader` (Feedback)
- `NavigationBar` (Navigation)
- `ViewImage` (Overlays)
- `CustomRadio` (Inputs)

## 5) Extend existing needed
- `BodyWrapper` extends existing `Box` with missing container capabilities:
  - Max-width presets (`sm/md/lg/xl/full`)
  - Horizontal padding variants
  - Centering and responsive spacing tokens

## 6) Normalization deltas (highest impact)
- Mixed framework/UI abstraction usage (`@heroui/react`, direct `next/navigation` in reusable components).
- Reusable candidates still carry app/domain coupling (routing/constants/derived business rules).
- Several shells need API normalization before shared export (`size`, `variant`, error/disabled semantics).
- Route-level components combine orchestration and rendering; requires container/shell boundary before migration batches 2-4.

## 7) High-risk parity items (top 5)
1. `DeclarationPage` - very large multi-step form with modal branch orchestration.
2. `PreviewPage` - payment confirmation + proposal preview + modal stack in one surface.
3. `PaymentPage` - payment option and transaction state transitions tightly coupled to render tree.
4. `UploadCropImage` - upload/crop/preview async flow with interaction-heavy state transitions.
5. `QuestionGroup` - dynamic control rendering and conditional content/link behavior.

## 8) Backlog CSV row count
- `_component-backlog.csv` rows: **45**

## 9) SoC evaluation summary
- Batch 1.5 candidates (`YES`): **24**
- SoC potential breakdown:
  - `HIGH`: 16
  - `MEDIUM`: 8
  - `LOW`: 7
  - `NONE`: 14
- Monolith count (`is_monolith = YES`): **31**
- Projected NEW_SHARED_COMPONENT candidates from Batch 1.5 splits (Shell-level):
  - `DatePicker`, `DatePickerModal`, `FlashMessage`, `InputPhone`, `ModalPdf`, `ModalSelectPlan`, `QuestionGroup`, `UploadCropImage`

## 10) KEEP_APP_LOCAL refactor candidates
- Total `KEEP_APP_LOCAL`: **13**
- `KEEP_APP_LOCAL` with SoC potential `HIGH` or `MEDIUM`: **0**
- Top 3 KEEP_APP_LOCAL review notes:
  1. `NavbarHeader` - SoC `LOW`, strategy `render-prop`, shell is **not** currently a `packages/ui` candidate due route coupling.
  2. `HeaderProduct` - SoC `LOW`, strategy `prop-injection`, shell is **potentially partial** candidate later if domain transforms are isolated.
  3. `FormStep` - SoC `LOW`, strategy `render-prop`, shell can remain app-local unless reused in another app.

## NEW_SHARED visual specs (Batch 1 output)

### InputText
- API intent: `value`, `onChange`, `label?`, `placeholder?`, `error?`, `helperText?`, `disabled?`, `type?`, `maxLength?`.
- Variants: `default`, `filled`, `ghost`.
- Sizes: `sm`, `md`, `lg`.
- States: default, hover, focus, disabled, error, readOnly.
- Accessibility: associated label, error `aria-describedby`, keyboard focus ring tokenized.

### InputAutocomplete
- API intent: `items`, `value`, `onSelectionChange`, `label?`, `placeholder?`, `error?`, `disabled?`, `isLoading?`.
- Variants: `default`, `filled`.
- Sizes: `sm`, `md`, `lg`.
- States: default, loading, no-results, disabled, error.
- Accessibility: combobox roles, listbox keyboard nav, active descendant announcement.

### Loader
- API intent: `fullscreen?`, `label?`, `size?`, `overlay?`.
- Variants: `inline`, `overlay`, `page`.
- Sizes: `sm`, `md`, `lg`.
- States: visible/hidden.
- Accessibility: `aria-busy`, screen-reader label for loading context.

### SkeletonLoader
- API intent: `rows?`, `variant?`, `animated?`, `className?`.
- Variants: `text`, `card`, `table`, `avatar`.
- Sizes: token-driven height/width presets.
- States: loading only (non-interactive).
- Accessibility: hidden from assistive tech when decorative.

### NavigationBar
- API intent: `title`, `onBack?`, `backHref?`, `actions?`, `sticky?`.
- Variants: `default`, `compact`.
- Sizes: `md`, `lg`.
- States: default, with-actions, disabled-back.
- Accessibility: landmark semantics, keyboard support for action controls.

### ViewImage
- API intent: `src`, `alt`, `triggerLabel?`, `open?`, `onOpenChange?`, `title?`.
- Variants: `modal`, `drawer`.
- Sizes: `sm`, `md`, `lg`, `fullscreen`.
- States: closed, open, loading-image, error-image.
- Accessibility: focus trap, dismiss via Esc, labelled dialog/title.

### CustomRadio
- API intent: `value`, `label`, `description?`, `image?`, `selected?`, `disabled?`, `onChange`.
- Variants: `card`, `inline`.
- Sizes: `sm`, `md`, `lg`.
- States: default, hover, selected, focused, disabled.
- Accessibility: proper radio group semantics and keyboard arrow navigation.

## Batch 1.5 Amendment - 2026-03-02

- Components split: **24**
  - FlashMessage -> FlashMessageContainer + FlashMessageShell
  - InputPhone -> InputPhoneContainer + InputPhoneShell
  - ModalPdf -> ModalPdfContainer + ModalPdfShell
  - ModalSelectPlan -> ModalSelectPlanContainer + ModalSelectPlanShell
  - CallbackAuthPage -> CallbackAuthPageContainer + CallbackAuthPageShell
  - CallbackLoginPage -> CallbackLoginPageContainer + CallbackLoginPageShell
  - ModalInvalidPlan -> ModalInvalidPlanContainer + ModalInvalidPlanShell
  - ModalPolicyholderExist -> ModalPolicyholderExistContainer + ModalPolicyholderExistShell
  - FooterTransaction -> FooterTransactionContainer + FooterTransactionShell
  - ChoosePlanPage -> ChoosePlanPageContainer + ChoosePlanPageShell
  - LoginPage -> LoginPageContainer + LoginPageShell
  - PaymentPage -> PaymentPageContainer + PaymentPageShell
  - PaymentMethodPage -> PaymentMethodPageContainer + PaymentMethodPageShell
  - PaymentStatusPage -> PaymentStatusPageContainer + PaymentStatusPageShell
  - PersonalInfoPage -> PersonalInfoPageContainer + PersonalInfoPageShell
  - QuestionGroup -> QuestionGroupContainer + QuestionGroupShell
  - CardSelectPlan -> CardSelectPlanContainer + CardSelectPlanShell
  - DatePicker -> DatePickerContainer + DatePickerShell
  - DatePickerModal -> DatePickerModalContainer + DatePickerModalShell
  - ModalProposalForm -> ModalProposalFormContainer + ModalProposalFormShell
  - UploadCropImage -> UploadCropImageContainer + UploadCropImageShell
  - DeclarationPage -> DeclarationPageContainer + DeclarationPageShell
  - HomePage -> HomePageContainer + HomePageShell
  - PreviewPage -> PreviewPageContainer + PreviewPageShell
- NEW_SHARED_COMPONENT candidates from splits: **2**
  - FlashMessageShell
  - ModalSelectPlanShell
- KEEP_APP_LOCAL-only Shells: **22**
  - InputPhoneShell
  - ModalPdfShell
  - CallbackAuthPageShell
  - CallbackLoginPageShell
  - ModalInvalidPlanShell
  - ModalPolicyholderExistShell
  - FooterTransactionShell
  - ChoosePlanPageShell
  - LoginPageShell
  - PaymentPageShell
  - PaymentMethodPageShell
  - PaymentStatusPageShell
  - PersonalInfoPageShell
  - QuestionGroupShell
  - CardSelectPlanShell
  - DatePickerShell
  - DatePickerModalShell
  - ModalProposalFormShell
  - UploadCropImageShell
  - DeclarationPageShell
  - HomePageShell
  - PreviewPageShell
- Deferred Batch 1.5 candidates: **0**
- Deferral reason: n/a
- Gate status for completed splits:
  - pnpm --filter haruuz-microsite check-types PASS
  - pnpm --filter haruuz-microsite lint PASS (warnings only)
  - pnpm --filter haruuz-microsite build PASS

## Legacy Update Amendment - 2026-03-04 11:51 (+07)

- Legacy update integrated via `integrate-app/haruuz-microsite` -> `migrate-app/haruuz-microsite` with conflict-safe merge.
- No new component files introduced by this legacy delta.
- No shared-component intake candidate introduced (`L5` not required).
- Baseline counters unchanged:
  - Total components audited: 45
  - NEW_SHARED_COMPONENT: 7
  - KEEP_APP_LOCAL: 13
  - MIGRATE_AFTER_SPLIT: 24
  - SPLIT: 24

## Legacy Update Amendment - 2026-03-05 09:21 (+07)

- Legacy update integrated via `integrate-app/haruuz-microsite` -> `migrate-app/haruuz-microsite` (`de886751cf8f7d513a965c8cfca669111766c496`).
- Conflict handling preserved all Batch 1.5 split container/shell boundaries (`callback/login`, `declaration`, `datepicker`, `upload-crop-image`).
- No new component files detected in this delta.
- No shared-component intake candidates introduced (`L5` not required).
- Baseline counters unchanged:
  - Total components audited: 45
  - NEW_SHARED_COMPONENT: 7
  - KEEP_APP_LOCAL: 13
  - MIGRATE_AFTER_SPLIT: 24
  - SPLIT: 24
