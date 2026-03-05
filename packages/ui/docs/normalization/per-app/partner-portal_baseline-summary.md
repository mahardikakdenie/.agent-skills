# Per-App Baseline Summary - partner-portal (Batch 1)

## Totals

- Total components audited: 77
- KEEP_APP_LOCAL: 54
- NEW_SHARED_COMPONENT: 23

## Top 5 Highest Parity Risk Items

| Component | Source | Parity risk | Notes |
|---|---|---|---|
| ClaimDetailView | `src/views/claim/detail/detail.view.tsx` | HIGH | Data/interaction heavy component; behavior parity must be validated by smoke route. Normalization delta: Next.js import coupling (next/*); Hardcoded color literals present; Uses `any` types; Inline style usage. |
| ClaimExportView | `src/views/claim/export/export.view.tsx` | HIGH | Data/interaction heavy component; behavior parity must be validated by smoke route. Normalization delta: Next.js import coupling (next/*); Hardcoded color literals present; Uses `any` types; Inline style usage. |
| ClaimImportView | `src/views/claim/import/import.view.tsx` | HIGH | Data/interaction heavy component; behavior parity must be validated by smoke route. Normalization delta: Next.js import coupling (next/*); Hardcoded color literals present; Uses `any` types; Inline style usage. |
| ClaimListView | `src/views/claim/list/list.view.tsx` | HIGH | Data/interaction heavy component; behavior parity must be validated by smoke route. State handling and keyboard/focus behavior are sensitive. Normalization delta: Next.js import coupling (next/*); Hardcoded color literals present; Uses `any` types; Inline style usage. |
| CustomerListView | `src/views/customer/list/list.view.tsx` | HIGH | Data/interaction heavy component; behavior parity must be validated by smoke route. State handling and keyboard/focus behavior are sensitive. Normalization delta: Next.js import coupling (next/*); Hardcoded color literals present; Uses `any` types; Inline style usage. |

## EXTEND_EXISTING Gaps

- None in this app baseline. @repo/ui currently exports only `Box`, so no extension candidates were identified in Batch 1.

## NEW_SHARED_COMPONENT Visual Specs

Each candidate below captures current local API/visual behavior to preserve during Batch 4 implementation.

### Button

- Source: `src/components/button.tsx`
- Story group: Buttons
- Props/API: ButtonProps; keys: onClick, variant, withIcon, disabled, additionalClassName, title
- Variants: variant("danger" | "warning")
- States: disabled, hover/focus

### ButtonCalendar

- Source: `src/components/button-calendar.tsx`
- Story group: Buttons
- Props/API: VariantProps, ButtonProps; keys: asChild
- Variants: variant, size
- States: disabled, hover/focus

### Calendar

- Source: `src/components/calendar.tsx`
- Story group: Inputs
- Props/API: CalendarProps
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: selected/checked, hover/focus

### Datepicker

- Source: `src/components/datepicker.tsx`
- Story group: Inputs
- Props/API: DatePickerProps; keys: label, title, initialValue, minimumDate, maximumDate, isDisabled, isWithShadow, isForceClear, bgDatePicker, heightDatePicker, borderDatePicker, errorMessage, onChange, onSubmit, onClear
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: disabled, error, open/closed

### DateRangePicker

- Source: `src/components/date-range-picker.tsx`
- Story group: Inputs
- Props/API: DatePickerDropdownProps; keys: onDateChange, defaultFromDate, defaultEndDate
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: default

### DragDropExcel

- Source: `src/components/drag-drop-excel.tsx`
- Story group: Inputs
- Props/API: ExcelDropUploadProps; keys: onDataParsed, disabled, setFileName, fileName
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: disabled

### DropFile

- Source: `src/components/drop-file.tsx`
- Story group: Inputs
- Props/API: DropFileProps; keys: title, onChange, onChangeBase64, onChangeUrl, initialValue
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: open/closed, hover/focus

### ImageOrDefault

- Source: `src/components/image-or-default.tsx`
- Story group: Data Display
- Props/API: ImageOrDefaultProps; keys: onClick, alt, src, additionalClassNameImg, additionalClassNameP, text, width, height, priority, layout
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: default

### Input

- Source: `src/components/input.tsx`
- Story group: Inputs
- Props/API: InputProps; keys: value, type, accept, onChange, onChangeFile, onEnter, onClear, disabled, withBorder, isCurrency, currency, placeholder, errorMessage, icon, max, min, isFormatNumber
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: disabled, error

### Modal

- Source: `src/components/modal.tsx`
- Story group: Overlays
- Props/API: ModalProps; keys: isOpen, onClose, widthClassName, heightClassName, bgColor, bgColorModal, style
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: open/closed

### MultipleSelect

- Source: `src/components/multiple-select.tsx`
- Story group: Inputs
- Props/API: MultipleSelectProps; keys: list, onChange, titleModal, labelMultipleSelect
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: disabled, open/closed, selected/checked

### NoRecentData

- Source: `src/components/no-recent-data.tsx`
- Story group: Feedback
- Props/API: Implicit/inline props; enforce explicit typed props during Batch 4.
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: empty

### Pagination

- Source: `src/components/pagination.tsx`
- Story group: Navigation
- Props/API: PaginationProps; keys: totalData, itemsPerPageOptions, currentPage, onPageChange, onItemsPerPageChange, limit
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: default

### Popover

- Source: `src/components/popover.tsx`
- Story group: Overlays
- Props/API: Implicit/inline props; enforce explicit typed props during Batch 4.
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: open/closed

### Select

- Source: `src/components/select.tsx`
- Story group: Inputs
- Props/API: SelectProps; keys: value, onChange, options, allOptions, disabled, isPriorityPlaceholder, withBorder, placeholderSelect, bgSelect, placeholderSelectClassName, placeholderStyle, errorMessage, icon, additionalClassNameSelect, chevronColor
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: disabled, error, open/closed, hover/focus

### Textarea

- Source: `src/components/textarea.tsx`
- Story group: Inputs
- Props/API: TextAreaProps; keys: value, onChange, onClear, disabled, withBorder, placeholder, errorMessage, max, min, height
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: disabled, error

### TimeInput

- Source: `src/components/time-input.tsx`
- Story group: Inputs
- Props/API: TimeInputProps; keys: onChange, initialValue, errorMessage
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: error, selected/checked, hover/focus

### Tooltip

- Source: `src/components/tooltip.tsx`
- Story group: Overlays
- Props/API: TooltipProps; keys: content, position, delay, backgroundColor, textColor, arrowColor, isShow
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: default

### UiButton

- Source: `src/components/ui/button.tsx`
- Story group: Misc
- Props/API: VariantProps, ButtonProps
- Variants: variant, size
- States: disabled, hover/focus

### UiInput

- Source: `src/components/ui/input.tsx`
- Story group: Misc
- Props/API: InputProps
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: disabled, hover/focus

### UiSelect

- Source: `src/components/ui/select.tsx`
- Story group: Misc
- Props/API: Implicit/inline props; enforce explicit typed props during Batch 4.
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: disabled, open/closed, hover/focus

### UiTable

- Source: `src/components/ui/table.tsx`
- Story group: Data Display
- Props/API: Implicit/inline props; enforce explicit typed props during Batch 4.
- Variants: No explicit CVA variant map; preserve existing visual mode behavior from local implementation.
- States: selected/checked, hover/focus

## KEEP_APP_LOCAL Refactor Candidates

- Total KEEP_APP_LOCAL: 54
- KEEP_APP_LOCAL with SoC potential HIGH or MEDIUM: 0

| Component | Source | SoC strategy | SoC potential | Shell as packages/ui candidate |
|---|---|---|---|---|
| ClaimDetailView | `src/views/claim/detail/detail.view.tsx` | hook-extraction | LOW | NO |
| PolicyDetailView | `src/views/policy/detail/detail.view.tsx` | hook-extraction | LOW | NO |
| ClaimListView | `src/views/claim/list/list.view.tsx` | hook-extraction | LOW | NO |

## SoC Evaluation Summary

- Total Batch 1.5 candidates: 0
- SoC potential HIGH: 0
- SoC potential MEDIUM: 0
- SoC potential LOW: 37
- SoC potential NONE: 40
- Projected NEW_SHARED_COMPONENT from splits: 0
- MIGRATE_AFTER_SPLIT entries in current baseline: 0


## Legacy Update Amendment - 2026-03-04 12:32 (+07)

- Legacy update integrated via integrate-app/partner-portal -> migrate-app/partner-portal.
- New components from legacy classified as:
  - MonthPicker -> NEW_SHARED_COMPONENT (queued via L5)
  - TableClaim -> KEEP_APP_LOCAL
- Baseline counters updated:
  - Total components audited: 77
  - KEEP_APP_LOCAL: 54
  - NEW_SHARED_COMPONENT: 23
  - _component-backlog.csv rows (excluding header): 77