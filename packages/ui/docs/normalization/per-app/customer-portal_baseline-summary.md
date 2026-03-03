# Per-App Baseline Summary - customer-portal

## Totals

- Total components audited: 187
- MIGRATE_AFTER_SPLIT: 97
- NEW_SHARED_COMPONENT: 28
- EXTEND_EXISTING: 0
- ADOPT_WITH_ADAPTER: 0
- ADOPT_NOW: 0
- KEEP_APP_LOCAL: 62

## Top 5 Highest-Parity-Risk Items

- `src/app/[lang]/auth/page.tsx` - HIGH: Mixed data wiring + display logic; loading/error/empty and routing behavior can regress after split.
- `src/app/[lang]/claims/page.tsx` - HIGH: Mixed data wiring + display logic; loading/error/empty and routing behavior can regress after split.
- `src/app/[lang]/new-claim/page.tsx` - HIGH: Mixed data wiring + display logic; loading/error/empty and routing behavior can regress after split.
- `src/app/[lang]/policy/page.tsx` - HIGH: Mixed data wiring + display logic; loading/error/empty and routing behavior can regress after split.
- `src/common/components/claim-input-fields.tsx` - HIGH: Mixed data wiring + display logic; loading/error/empty and routing behavior can regress after split.

## EXTEND_EXISTING - Missing Variants/Props in @repo/ui

- None identified against the current stable export surface (`packages/ui/src/index.ts` exports only `Box`).

## NEW_SHARED_COMPONENT - Visual Specs (Props, Variants, States)

- `AlertBanner` [Feedback]
  Props: type, title, description, action, className.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled.
- `Checkbox` [Inputs]
  Props: label, size, useHTML, defaultSelected, isDisabled, onChange, onValueChange, classNames.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled.
- `CheckmarkIcon` [Buttons]
  Props: children, className.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled.
- `ClockCircleLinearIcon` [Misc]
  Props: children, className.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled.
- `DatePicker` [Inputs]
  Props: label, title, subtitle, initialValue, minimumDate, maximumDate, isDisabled, isLongDate.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled, error, loading.
- `DateTimePicker` [Inputs]
  Props: label, title, subtitle, initialValue, minimumDate, maximumDate, isDisabled, errorMessage.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled, error, loading.
- `DesktopTopBackButton` [Buttons]
  Props: children, className.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled.
- `EmptyData` [Feedback]
  Props: message.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled.
- `ErrorContent` [Feedback]
  Props: message.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled.
- `FileUpload` [Inputs]
  Props: isRequired, errorMessage, onChange, value, extensions, isClearable, onClear.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled, error, loading.
- `FlashMessage` [Feedback]
  Props: severity, isOpen, message, handleClose.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled.
- `HTMLContent` [Data Display]
  Props: url.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled.
- `ImageInput` [Inputs]
  Props: file, onChange, isDisabled.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled, error, loading.
- `InfiniteScrollInputSelectAutocomplete` [Inputs]
  Props: children, className.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled, error, loading.
- `InputCurrency` [Inputs]
  Props: label, labelPlacement, currency, name, value, onChange, errorMessage, isDisabled.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled, error, loading.
- `InputEmail` [Inputs]
  Props: label, labelPlacement, placeholder, name, value, onChange, errorMessage, isDisabled.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled, error, loading.
- `InputName` [Inputs]
  Props: label, labelPlacement, placeholder, name, value, onChange, errorMessage, isDisabled.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled, error, loading.
- `InputNumber` [Inputs]
  Props: label, labelPlacement, placeholder, name, value, onChange, errorMessage, isDisabled.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled, error, loading.
- `InputPhone` [Inputs]
  Props: label, labelPlacement, placeholder, name, value, onChange, errorMessage, isDisabled.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled, error, loading.
- `InputSelectAutocomplete` [Inputs]
  Props: name, item, value, keyField, label, labelPlacement, placeholder, errorMessage.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled, error, loading.
- `InputSelectDialog` [Inputs]
  Props: name, label, placeholder, items, value, onChange, errorMessage, isRequired.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled, error, loading.
- `InputSelect` [Inputs]
  Props: name, label, item, value, onChange, errorMessage, isRequired, isDisabled.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled, error, loading.
- `InputText` [Inputs]
  Props: label, labelPlacement, placeholder, name, value, onChange, errorMessage, isDisabled.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled, error, loading.
- `Loader` [Feedback]
  Props: useOverlay, isFullScreen.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled.
- `NotificationBar` [Feedback]
  Props: children, className.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled.
- `RenderStatus` [Feedback]
  Props: children, className.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled.
- `RowData` [Data Display]
  Props: label, value.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled.
- `SelectPhoneCode` [Inputs]
  Props: value, onChange.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled, error, loading.
- `ViewImage` [Inputs]
  Props: file.
  Variants: default, subtle, emphasized (to be finalized in Phase 02).
  States: default, hover, focus-visible, disabled, error, loading.

## KEEP_APP_LOCAL Refactor Candidates

- Final KEEP_APP_LOCAL count (after MIGRATE_AFTER_SPLIT gating): 62
- Initial KEEP_APP_LOCAL count (before MIGRATE_AFTER_SPLIT gating): 158
- Initial KEEP_APP_LOCAL with SoC HIGH or MEDIUM: 96
- Top 3 candidates:
  - `src/app/[lang]/auth/page.tsx`: strategy `container-shell`; Shell potential: likely app-local shell.
  - `src/app/[lang]/claims/page.tsx`: strategy `container-shell`; Shell potential: likely app-local shell.
  - `src/app/[lang]/home/page.tsx`: strategy `container-shell`; Shell potential: likely app-local shell.

## SoC Evaluation Summary

- Batch 1.5 candidates total: 97
- SoC potential HIGH: 48
- SoC potential MEDIUM: 49
- SoC potential LOW: 21
- SoC potential NONE: 69
- Projected NEW_SHARED_COMPONENT from splits: 1



