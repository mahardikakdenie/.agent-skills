# 02 - API Conventions

> **Batch:** Batch 2 - Design System Foundation
> **Branch:** `feat/ui`
> **Run date:** 2026-03-06
> **Source:** `06-component-standards.md 2 Prop Naming Conventions`
> **Breaking change rule:** After Batch 3 begins, any change to canonical prop names or variant values requires a Foundation Amendment PR.

---

## Global Naming Rules

Source: `06-component-standards.md 2`

| Convention | Canonical | Forbidden |
|---|---|---|
| Variant prop | `variant` | `kind`, `type`, `mode`, `color`, `intent` |
| Size prop | `size` | `width`, `scale`, `height`, small/medium/large literals |
| Size values | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` - **default: `'md'`** | `'small'`, `'medium'`, `'large'`, `'tiny'`, `'huge'` |
| Core variant values | `'default' \| 'primary' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost' \| 'link'` | ad-hoc aliases such as `'danger'`, `'warning-style'`, `'info-color'` |
| Extended semantic variants | `'success' \| 'warning' \| 'info'` only when the component communicates status/feedback or a Batch 2 parity ruling explicitly allows it | undocumented one-off literals or `'error'` (map to `'destructive'`) |
| Disabled | `disabled` | `isDisabled`, `readOnly` (unless semantically distinct) |
| Loading | `loading` | `isLoading`, `pending`, `busy` |
| Error | `error?: string \| boolean` | `hasError`, `isError`, `errorMessage` (use `error` for both) |
| Required | `required` | `isRequired` |
| Class override | `className` | `additionalClassName`, `classNames`, `extraClass` |
| Open/close trigger | `open` + `onClose` | `isOpen` + `onDismiss`, `show` + `hide` |
| Value change | `onChange` or `onValueChange` | `onChangeValue`, `handleChange` |
| Close callback | `onClose` | `onDismiss`, `handleClose` |
| Open callback | `onOpen` | `handleOpen` |
| Select | `onSelect` | `onPick`, `onChoose` |
| Slot naming | `children`, `label`, `description`, `icon`, `leftIcon`, `rightIcon`, `actions`, `footer`, `trigger` | ad-hoc slot names |

---

## Legacy -> Canonical Prop Mapping

Cross-app conflicts identified across all 27 baselines:

| Legacy pattern | Canonical | Apps affected |
|---|---|---|
| `isDisabled` | `disabled` | teman-affiliate-microsite, haruuz-microsite, gelm-xproject-microsite, ticket-portal |
| `isLoading` / `pending` / `filled` | `loading` | customer-portal, ticket-portal, teman-affiliate-microsite |
| `errorMessage` | `error` | partner-portal, affiliate-admin, affiliate-portal, customer-portal |
| `kind="primary"` | `variant="primary"` | partner-portal, affiliate-admin |
| `danger` (variant) | `destructive` | partner-portal, affiliate-admin, affiliate-portal |
| `isOpen` + `onClose` | `open` + `onClose` | partner-portal, affiliate-admin, teman-affiliate-admin, claim-portal |
| `onChangeValue` / `onSelect` | `onChange` or `onValueChange` | customer-portal, ecommerce-teman |
| `additionalClassName` | `className` | partner-portal, affiliate-admin |
| `withBorder` (boolean) | `variant="outline"` | affiliate-admin, partner-portal |
| `isCurrency`, `isFormatNumber` | `inputMode="currency"` / `inputMode="number"` | partner-portal, agent-admin |
| `isForceClear` | `clearable` | partner-portal |
| `isWithShadow` | `shadow` | partner-portal (deprecated; use `className` instead) |
| `onPress` (NextUI/HeroUI) | `onClick` | teman-affiliate-microsite, haruuz-microsite, agent-microsite |
| `allOptions` / `options` divergence | `options: SelectOption[]` | partner-portal, affiliate-admin |
| `placeholderSelectClassName`, `bgSelect`, `chevronColor` | `className` + `variant` | partner-portal (style overrides -> collapse) |
| `isLongDate` | `formatDate` | customer-portal |
| `titleModal` | `label` | partner-portal MultipleSelect |

---

## TypeScript Conventions

Source: `06-component-standards.md 3`

### Component Interface Pattern

```ts
// Always export the props interface
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}
```

### Generic Data Components

```ts
// Use generics for data-display components
export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  loading?: boolean;
}
export function DataTable<TData>({ data, columns, loading }: DataTableProps<TData>) { ... }
```

### Ref Forwarding (mandatory for all Tier 1 and focusable Tier 2)

```ts
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Box
      as="input"
      ref={ref}
      className={cn(inputVariants(), className)}
      {...props}
    />
  )
);
Input.displayName = 'Input';
```

> **React 19 note:** Projects using React 19 can accept `ref` as a regular prop without `forwardRef`. Check consuming app `package.json`. Both patterns are valid - use `forwardRef` as the safe default.

Variant vocabulary rule:
- Start from the core variant set.
- Only status-bearing components (`Alert`, `Badge`) and explicitly approved parity-preserving components may add `success`, `warning`, or `info`.
- Legacy `error` and `danger` values normalize to `destructive`.

---

## Canonical Component Contracts

### Box

```ts
export type BoxPadding = 'none' | 'sm' | 'md' | 'lg'
export type BoxContainer = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface BoxOwnProps {
  asChild?: boolean
  padding?: BoxPadding
  container?: BoxContainer
  centered?: boolean
  className?: string
}

export type BoxProps<C extends React.ElementType = 'div'> =
  PolymorphicComponentPropsWithRef<C, BoxOwnProps>
```

Rules:
- `padding` is the only shared spacing preset API for `Box`; use `className` for anything more specific.
- `container` is a max-width preset only; do not fold route shells, sidebar chrome, or app layout policy into `Box`.
- `centered` is layout-only (`flex items-center justify-center`) and must stay generic.
- `Box` is the authored DOM primitive for shared source. Semantic HTML and SVG output must be expressed through `Box` with the `as` prop instead of direct native JSX tags.

Story group: `Misc`

### Authored DOM Policy

- Shared component source and stories in `packages/ui` must author DOM nodes through `Box`.
- Do not hand-write native JSX tags such as `div`, `span`, `button`, `input`, `textarea`, `table`, `svg`, or `path` in shared authored JSX.
- When semantic output is required, express it as `Box` with `as`, for example `Box as="button"`, `Box as="input"`, `Box as="table"`, `Box as="svg"`, or `Box as="path"`.
- `asChild` remains the escape hatch for consumer-provided elements or Radix composition, but authored shared markup still starts from `Box`.
- Prefer icon slots as `ReactNode`; if inline SVG is unavoidable, author it with `Box as="svg"` and `Box as="path"`.

---

### Button

```ts
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link' | 'warning'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'  // default: 'md'
  loading?: boolean
  disabled?: boolean
  asChild?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children?: React.ReactNode
  className?: string
}
```

Story group: `Buttons`

---

### Input

```ts
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg'  // default: 'md'
  inputMode?: 'text' | 'email' | 'phone' | 'currency' | 'number' | 'password'
  error?: string | boolean
  loading?: boolean
  disabled?: boolean
  required?: boolean
  label?: string
  placeholder?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  clearable?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onValueChange?: (value: string) => void
  className?: string
}
```

Sizing-family note:
- The shared field-shell size family now covers `Input`, `Select`, `Combobox`, `DatePicker`, `DateRangePicker`, and `MonthPicker` with `xs | sm | md | lg`, default `md`.
- `OtpInput` remains a separate segmented-input size family with `sm | md | lg`, default `md`.
- `Textarea`, `Pagination`, `Dialog`, and `Calendar` remain frozen sizing exceptions in this amendment.

Focus-family note:
- `Input` is part of the `field-shell-composite` focus family.
- The visible focus treatment belongs on the outer shell via `focus-within`.
- The approved recipe is border emphasis plus a subtle near-shell halo. Detached `ring-offset-2` halos are no longer the canonical target for this family.

Story group: `Inputs`

---

### Textarea

```ts
export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  error?: string | boolean
  disabled?: boolean
  required?: boolean
  label?: string
  placeholder?: string
  helperText?: string
  clearable?: boolean
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onValueChange?: (value: string) => void
  className?: string
}
```

Sizing note:
- `Textarea` has no public `size` prop in the shared contract.
- Height remains row-driven through native textarea behavior and consumer-provided `rows`.

Focus note:
- `Textarea` is the direct-element exception inside the field-entry family.
- The visible border and focus treatment stay on the actual `textarea` element, but the visual recipe should still match the calmer field-shell language used by the rest of the family.

Story group: `Inputs`

---

### Focus-family normalization amendment

This amendment opens five canonical focus families for `packages/ui`:

| Family | Components | Canonical rule |
| --- | --- | --- |
| `field-shell-composite` | `Input`, `DatePicker`, `DateRangePicker`, `MonthPicker` | Outer shell owns focus via `focus-within`; use border emphasis plus a near-shell halo with no detached offset halo |
| `field-shell-direct` | `Textarea`, `Select`, `Combobox`, date/time inputs inside date pickers | Direct interactive root owns the same calmer field-shell language via `focus-visible` |
| `segmented-slot` | `OtpInput` | Separate active and focused-slot emphasis so one slot never carries multiple heavy focus cues |
| `compact-control` | `Button`, `Checkbox`, `RadioGroup`, `Switch`, embedded field action buttons, `DateRangePicker` preset buttons | Keep direct focus obvious but tighter than field-shell focus |
| `dense-surface` | `Calendar`, `Tabs`, `Accordion`, `Pagination`, `NavigationMenu`, `Menubar`, `Command` | Keep focus precise and attached to dense targets without detached halos or state stacking |

Global focus rules:

- `focus-visible` remains the default for direct interactive roots.
- `focus-within` remains the default for composite shells that wrap an internal focus target.
- Detached `ring-offset-2` halos are no longer the default enterprise recipe for shared field-entry components.
- Invalid focus may tint toward `destructive`, but it must not introduce a second louder emphasis system by default.
- Open, active, selected, and highlighted states must not stack a second heavy focus ring on the same element.
- The existing internal authority for shared focus recipes is `packages/ui/src/utils/focus-normalization.ts`.

Wave status:

- Approved for implementation now: `field-shell-composite`, `field-shell-direct`, `segmented-slot`, and `compact-control`
- Deferred by default: `dense-surface`
- Existing dense-surface utility adopters are precedent only; this amendment does not reopen a new dense-surface rollout wave

---

### RichTextEditor

```ts
export interface RichTextEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onBlur' | 'onChange' | 'onFocus'> {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  toolbar?: 'default' | 'minimal' | 'none'
  readonly?: boolean
  sanitize?: boolean | ((html: string) => string)
  label?: string
  helperText?: string
  error?: string | boolean
  required?: boolean
  id?: string
}
```

Shared-scope note:
- `RichTextEditor` is the bounded shared rich-text contract for formatted comments, notes, and description fields only.
- The approved engine is headless Tiptap via `@tiptap/react`, `@tiptap/starter-kit`, and `@tiptap/extension-link`, with sanitization enforced at the shared component boundary.
- The delivered shared structure coverage now includes paragraph plus heading levels 1 through 3; deeper heading ladders and document-schema changes still require an explicit amendment.
- Shared toolbar actions may expose keyboard shortcut metadata when the shortcut is actively supported by the delivered editor surface; the current shared contract covers common formatting, structure, list, history, link, body-text reset, and clear-formatting shortcuts only.
- `Mod+K` is part of the shared `RichTextEditor` contract for opening the inline link editor; `Mod+Y` is the canonical shared redo shortcut, and `Shift+Mod+Z` should not be surfaced as shared shortcut copy.
- Uploads, mentions, slash commands, media embeds, viewer-specific rendering, and persistence workflows remain app-local and must not be folded into this API.
- Because the editor depends on browser editing APIs, consuming apps should render it from client components.

Story group: `Inputs`

---

### Select

```ts
export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SelectOptionRenderState {
  selected: boolean
  disabled: boolean
}

export interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string | undefined) => void
  options: SelectOption[]
  placeholder?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'  // default: 'md'
  disabled?: boolean
  loading?: boolean
  required?: boolean
  error?: string | boolean
  label?: string
  clearable?: boolean
  renderOption?: (option: SelectOption, state: SelectOptionRenderState) => React.ReactNode
  className?: string
  open?: boolean
  defaultOpen?: boolean
  onClose?: () => void
  onOpen?: () => void
}
```

Shared-scope note:
- `Select` is the static single-select contract only.
- Search-driven selection belongs to `Combobox`.
- Multi-select and phone-code-specific flows remain separate migration targets and must not be folded back into this API.

Sizing note:
- `Select` now participates in the shared field-shell size family used by `Input`, `DatePicker`, `DateRangePicker`, and `MonthPicker`.
- `Select` uses `xs | sm | md | lg` with default `md`.

Focus note:
- `Select` belongs to the `field-shell-direct` focus family.
- Open state may reinforce border emphasis, but it must not layer a second heavy focus ring on top of the trigger's keyboard focus treatment.

Story group: `Inputs`

---

### Checkbox

```ts
export type CheckboxCheckedState = boolean | 'indeterminate'

export interface CheckboxProps extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'checked' | 'defaultChecked' | 'onCheckedChange'> {
  checked?: CheckboxCheckedState
  defaultChecked?: CheckboxCheckedState
  onCheckedChange?: (checked: CheckboxCheckedState) => void
  disabled?: boolean
  required?: boolean
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'  // default: 'md'
  error?: string | boolean
  className?: string
}
```

Story group: `Inputs`

---

### RadioGroup

```ts
export interface RadioGroupProps {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'  // default: 'md'
  error?: string | boolean
  children: React.ReactNode
  className?: string
}

export interface RadioGroupItemProps {
  value: string
  disabled?: boolean
  label?: string
  description?: string
  className?: string
}
```

Story group: `Inputs`

---

### Switch

```ts
export interface SwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  required?: boolean
  label?: string
  error?: string | boolean
  size?: 'sm' | 'md' | 'lg'  // default: 'md'
  className?: string
}
```

Story group: `Inputs`

---

### Dialog

```ts
export interface DialogProps {
  open?: boolean
  onClose?: () => void
  defaultOpen?: boolean
  children: React.ReactNode
}

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  actions?: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'  // default: 'md'
  className?: string
  children: React.ReactNode
}
```

Sizing note:
- `Dialog` sizing is an overlay-width contract, not a control-density family.
- `Dialog` must not be merged into field, action, or display size normalization.

Story group: `Overlays`

Migration note: `isOpen` + `onClose` -> `open` + `onClose` (canonical per `06-component-standards.md 2`). `bgColor`, `widthClassName`, `heightClassName` -> use `size` + `className`.

---

### Drawer

```ts
export interface DrawerProps {
  open?: boolean
  onClose?: () => void
  direction?: 'bottom' | 'right' | 'left' | 'top'  // default: 'bottom'
  children: React.ReactNode
}

export interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  actions?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  children: React.ReactNode
}
```

Story group: `Overlays`

---

### Popover

```ts
export interface PopoverProps {
  open?: boolean
  onOpen?: () => void
  onClose?: () => void
  defaultOpen?: boolean
  children: React.ReactNode
}

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  className?: string
  children: React.ReactNode
}
```

Story group: `Overlays`

---

### Tooltip

```ts
export interface TooltipProviderProps {
  delayDuration?: number
  skipDelayDuration?: number
  disableHoverableContent?: boolean
  children: React.ReactNode
}

export interface TooltipProps {
  open?: boolean
  defaultOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
  delayDuration?: number
  disableHoverableContent?: boolean
  disabled?: boolean
  children: React.ReactNode
}

export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  className?: string
  children: React.ReactNode
}

// Compound exports: TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, TooltipArrow
```

Standalone `Tooltip` usage auto-installs a local Radix provider. Use `TooltipProvider` only when related tooltips should share delay timing.

Story group: `Overlays`

Migration note: flat `content` wrapper props normalize to `TooltipContent` children; `position` -> `side`; `delay` -> `delayDuration`; app-specific color props collapse into the shared tokenized surface plus `className`; `isShow={false}` maps to `disabled`.
---

### Alert

```ts
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'info' | 'warning' | 'destructive'
  title?: string
  description?: string
  children?: React.ReactNode
  dismissible?: boolean
  onClose?: () => void
  icon?: React.ReactNode
  className?: string
}
```

Story group: `Feedback`

Migration note: `severity="error"` -> `variant="destructive"`. `type` -> `variant`. `autoHideMs` -> `dismissible` + `onClose` caller logic.

---

### Loading Wrappers and Suspense Fallbacks

No canonical shared `ContentLoadingWrapper` API is defined in `@repo/ui`.

Apps should compose `Spinner`, `Skeleton`, and structural primitives such as `Box`, `Card`, or `Table` directly in app code for:

- inline busy states
- suspense fallbacks
- full-page loading swaps
- mounted-content blocking overlays
- retry-aware or error-aware loading shells

Historical note: the earlier `ContentLoadingWrapper` draft API was reversed and must not be used as current shared-package authority.

---

### Skeleton

```ts
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}
```

Story group: `Feedback`

---

### Table (structural primitive)

```ts
// Structural HTML table wrappers - no logic, no data fetching
// Sub-components: TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter
export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string
}
```

Story group: `Data Display`

Normalization notes:

- Keep `Table` structural. `TableCaption` and `TableFooter` remain available composition primitives, but visible captions are optional and should be used only when they add real table context.
- Recommended empty-state composition is a single full-width `TableCell` inside `TableBody`, using a restrained icon, a concise title, and one supporting line rather than a plain sentence block.

---

### DataTable

```ts
export interface DataTablePaginationConfig {
  pageIndex?: number
  pageSize?: number
  pageCount?: number
  rowCount?: number
  onPageChange?: (pageIndex: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

export interface DataTableShellProps<TData extends RowData> {
  loading?: boolean
  renderToolbar?: (table: DataTableInstance<TData>) => React.ReactNode
  renderPagination?: (table: DataTableInstance<TData>) => React.ReactNode
  renderStatus?: (context: DataTableStatusContext<TData>) => React.ReactNode | null
  renderFooter?: (table: DataTableInstance<TData>) => React.ReactNode
  emptyState?: DataTableRenderable<TData>
  loadingState?: DataTableRenderable<TData>
  renderExpandedContent?: (row: Row<TData>, table: DataTableInstance<TData>) => React.ReactNode
  pageSizeOptions?: number[]
  caption?: React.ReactNode
  layout?: DataTableLayoutOptions
}

export type DataTableProps<TData extends RowData, TValue = unknown> =
  | DataTableControlledProps<TData>
  | DataTableManagedProps<TData, TValue>

export interface DataTableVirtualizedProps<TData extends RowData>
  extends Omit<DataTableShellProps<TData>, 'renderExpandedContent'> {
  table: DataTableInstance<TData>
  height: number
  estimateRowHeight?: number
  overscan?: number
}
```

Story group: `Data Display`

Normalization notes:

- Public exports are `DataTable`, `DataTableVirtualized`, `DataTablePagination`, `useDataTable`, `dataTableFacetedFilterFn`, and `dataTableFuzzyFilterFn`.
- Toolbar/search/filter/view/selection helper controls currently remain Storybook-only utilities, not package exports.
- Stories prefer explanatory copy above the table instead of relying on captions, but the semantic `caption` prop remains supported.
- Dependency: `@tanstack/react-table` v8. `DataTableVirtualized` additionally depends on TanStack Virtual through the shared package.
- Internal helper consolidation is now centered in `DataTable.utils.ts`; layout and sticky style helpers are not split into a separate `DataTable.layout.ts` layer anymore.

---

### Pagination

```ts
export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
  className?: string
}
```

Sizing note:
- `Pagination` has no public `size` prop in the shared contract.
- Any internal `default` or `compact` density handling stays private and must not be promoted into public API in this pass.

Story group: `Navigation`

---

### Calendar

```ts
export interface CalendarProps {
  mode?: 'single' | 'multiple' | 'range'
  selected?: Date | Date[] | DateRange
  onSelect?: (date: Date | Date[] | DateRange | undefined) => void
  disabled?: boolean | ((date: Date) => boolean)
  className?: string
}
```

Sizing note:
- `Calendar` remains the shared internal date-family surface.
- It does not establish a standalone public size family in this pass.

Story group: `Data Display`

**Dependency:** `react-day-picker` + `date-fns`

---

### DatePicker

```ts
export interface DatePickerProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  formatDate?: (date: Date) => string
  value?: Date | null
  onChange?: (date: Date | null) => void
  mode?: 'single'  // use DateRangePicker for 'range'
  minDate?: Date
  maxDate?: Date
  withTime?: boolean
  minDateTime?: Date
  maxDateTime?: Date
  timezone?: string
  disabled?: boolean
  clearable?: boolean
  required?: boolean
  label?: string
  placeholder?: string
  error?: string | boolean
  open?: boolean
  onClose?: () => void
  className?: string
}
```

Story group: `Inputs`

Time policy:
- `withTime` enables minute-precision time entry while keeping the emitted value contract as plain `Date | null`.
- `timezone` is a display-context hint only. It must not silently transform the emitted `Date` into a different absolute instant.
- `minDateTime` and `maxDateTime` are enforced in the picker UI across both the date and time portions when `withTime` is enabled.

Surface policy:
- Date-only `DatePicker` usage keeps the popover chrome bare so the shared `Calendar` stays visually aligned to the trigger without an extra decorative frame.
- `DatePicker` with `withTime` upgrades to a framed two-column panel with the compact calendar on the left and the time rail on the right.

Migration note: `initialValue` -> `value`; `minimumDate`/`maximumDate` -> `minDate`/`maxDate`; datetime-specific bounds map to `minDateTime`/`maxDateTime`; `isForceClear` -> `clearable`; `isDisabled` -> `disabled`; `isLongDate` and similar display-format toggles -> `formatDate`.

---

### Combobox

```ts
export interface ComboboxOption {
  label: string
  value: string
  disabled?: boolean
  keywords?: string[]
}

export interface ComboboxOptionRenderState {
  selected: boolean
  disabled: boolean
}

export interface ComboboxProps {
  value?: string
  onValueChange?: (value: string | undefined) => void
  options: ComboboxOption[]
  placeholder?: string
  searchPlaceholder?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'  // default: 'md'
  disabled?: boolean
  loading?: boolean
  required?: boolean
  error?: string | boolean
  label?: string
  clearable?: boolean
  renderOption?: (option: ComboboxOption, state: ComboboxOptionRenderState) => React.ReactNode
  className?: string
  open?: boolean
  onClose?: () => void
}
```

Sizing note:
- `Combobox` now participates in the shared field-shell size family used by `Input`, `DatePicker`, `DateRangePicker`, and `MonthPicker`.
- `Combobox` uses `xs | sm | md | lg` with default `md`.

Focus note:
- `Combobox` belongs to the `field-shell-direct` focus family.
- Open state may not stack a second heavy ring on top of the trigger's keyboard focus treatment.

Story group: `Inputs`

---

### FileUpload

```ts
export interface FileUploadProps {
  value?: File | File[] | null
  onChange?: (file: File | File[] | null) => void
  accept?: string
  multiple?: boolean
  disabled?: boolean
  maxSize?: number
  error?: string | boolean
  clearable?: boolean
  onClear?: () => void
  label?: string
  className?: string
}
```

Story group: `Inputs`

---

### OtpInput

```ts
export interface OtpInputProps {
  value?: string
  onValueChange?: (value: string) => void
  length?: number  // default: 6
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'  // default: 'md'
  disabled?: boolean
  error?: string | boolean
  autoFocus?: boolean
  className?: string
}
```

Sizing note:
- `OtpInput` ships a public segmented-input size contract of `sm | md | lg` with default `md`.

Focus note:
- `OtpInput` belongs to the `segmented-slot` focus family.
- Focused-slot and active-slot emphasis must stay visually separated; one slot must not accumulate a heavy focus ring plus a second active shadow by default.

Story group: `Inputs`

---

### Badge

```ts
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
  size?: 'sm' | 'md' | 'lg'  // default: 'md'
  className?: string
  children: React.ReactNode
}
```

Story group: `Feedback`

---

### Card

```ts
// Compound: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}
```

Story group: `Data Display`

---

### Form (react-hook-form aligned)

```ts
// Compound: Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage
// FormField uses RHF Controller internally - do NOT expose RHF types in prop surface
```

Story group: `Misc`

---

## Roadmap Amendment Contracts

The following sections close the `02 amendment` references used by `10-cross-app-reconciliation.md`, `11-master-component-roadmap.md`, and `13-implementation-batches.md`.
They are locked planning contracts and must stay aligned with those documents before implementation starts.

### Label

```ts
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  disabled?: boolean
  tone?: 'default' | 'muted' | 'destructive'
  className?: string
  children?: React.ReactNode
}
```

Story group: `Inputs`

---

### Spinner

```ts
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'  // default: 'md'
  label?: string
  inline?: boolean
  overlay?: boolean
  className?: string
}
```

Story group: `Feedback`

---

### Tabs

```ts
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  className?: string
  children?: React.ReactNode
}
```

Story group: `Navigation`

---

### Breadcrumb

```ts
export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  currentLabel?: string
  className?: string
}
```

Story group: `Navigation`

---

### DropdownMenu

```ts
export interface DropdownMenuProps {
  open?: boolean
  defaultOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
  onAction?: (value: string) => void
  disabled?: boolean
  modal?: boolean
  children: React.ReactNode
}

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  className?: string
  children: React.ReactNode
}

export interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  icon?: React.ReactNode
  shortcut?: React.ReactNode
  inset?: boolean
  destructive?: boolean
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

// Compound exports: DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
// DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem,
// DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem,
// DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger,
// DropdownMenuSubContent
```

Story group: `Overlays`

---

### Avatar

```ts
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string
  alt?: string
  fallback?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'  // default: 'md'
  className?: string
}
```

Story group: `Data Display`

---

### DateRangePicker

```ts
export interface DateRangeValue {
  from?: Date
  to?: Date
}

export interface DateRangePickerProps {
  value?: DateRangeValue | null
  onChange?: (value: DateRangeValue | null) => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  presets?: Array<{ label: string; value: DateRangeValue }>
  minDate?: Date
  maxDate?: Date
  withTime?: boolean
  minDateTime?: Date
  maxDateTime?: Date
  timezone?: string
  disabled?: boolean
  clearable?: boolean
  error?: string | boolean
  className?: string
}
```

Story group: `Inputs`

Time policy:
- `withTime` enables minute-precision start and end time entry while keeping the public range contract as plain `Date` values.
- `timezone` is a display-context hint only. Any timezone conversion or server-time synchronization remains app-local.
- `minDateTime` and `maxDateTime` are enforced in the picker UI across both the date and time portions when `withTime` is enabled.

Surface policy:
- Trigger styling follows the shared Input family through public `variant` and `size` props.
- Plain date-only `DateRangePicker` usage keeps the shared two-month calendar as the primary bare surface when no preset row or time rail is present.
- `DateRangePicker` with `withTime`, or generic preset chrome, uses the framed composite popover shell.

---

### Image

```ts
export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null
  alt?: string
  fallback?: React.ReactNode
  ratio?: 'square' | 'video' | 'portrait' | 'auto'
  fit?: 'cover' | 'contain' | 'fill'
  className?: string
}
```

Story group: `Data Display`

---

### NavigationMenu

```ts
export interface NavigationMenuProps
  extends Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>, 'children' | 'className'> {
  className?: string
  children: React.ReactNode
}

export interface NavigationMenuListProps
  extends Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>, 'asChild'> {
  className?: string
  children?: React.ReactNode
}

export interface NavigationMenuItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>, 'asChild'> {
  className?: string
  children?: React.ReactNode
}

export interface NavigationMenuTriggerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>, 'asChild'> {
  className?: string
  children?: React.ReactNode
}

export interface NavigationMenuContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>, 'asChild' | 'children'> {
  className?: string
  children: React.ReactNode
}

export interface NavigationMenuLinkProps
  extends Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>, 'asChild' | 'className'> {
  asChild?: boolean
  className?: string
  children?: React.ReactNode
}

export interface NavigationMenuIndicatorProps
  extends Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>, 'asChild' | 'children'> {
  className?: string
}

export interface NavigationMenuViewportProps
  extends Omit<React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>, 'asChild' | 'children'> {
  className?: string
}

// Compound exports: NavigationMenu, NavigationMenuList, NavigationMenuItem,
// NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink,
// NavigationMenuIndicator, NavigationMenuViewport
```

Story group: `Navigation`

Migration note: the earlier flat `items[]` / `collapsed` / `onNavigate` draft was dropped because route trees, auth gating, and information architecture must remain app-local. Apps should map their local route data into the compound shared parts instead.

---

### PageHeader

No shared `PageHeader` contract is approved in this rerun.
Page-level header and title shells remain app-local because breadcrumb, back-navigation,
sticky behavior, action policy, and layout density still diverge across apps.
Apps should compose shared primitives such as `Box`, `Card`, `Breadcrumb`, `Badge`,
and `Button` locally instead of importing a canonical `PageHeader` from `@repo/ui`.

---

### Accordion

```ts
export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple'  // default: 'single'
  collapsible?: boolean
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  className?: string
  children?: React.ReactNode
}
```

Story group: `Data Display`

---

### Command

```ts
export interface CommandProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  label?: string
  className?: string
}

export interface CommandInputProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> {
  className?: string
}

export interface CommandListProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.List> {
  className?: string
}

export interface CommandEmptyProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty> {
  className?: string
}

export interface CommandGroupProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group> {
  className?: string
}

export interface CommandItemProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> {
  className?: string
}

export interface CommandSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator> {
  className?: string
}

export interface CommandShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string
}

// Compound exports: Command, CommandInput, CommandList, CommandEmpty,
// CommandGroup, CommandItem, CommandSeparator, CommandShortcut
```

Story group: `Misc`

Migration note: legacy `CommandDialog` wrappers should compose shared `Dialog` + `Command`
instead of expecting a dedicated second overlay export from `@repo/ui`.

---

### Menubar

```ts
export interface MenubarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>, 'children' | 'className'> {
  disabled?: boolean
  onAction?: (value: string) => void
  className?: string
  children: React.ReactNode
}

export interface MenubarContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>, 'asChild' | 'children' | 'className'> {
  className?: string
  children: React.ReactNode
}

export interface MenubarItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item>, 'asChild' | 'children'> {
  value?: string
  icon?: React.ReactNode
  shortcut?: React.ReactNode
  inset?: boolean
  destructive?: boolean
  className?: string
  children?: React.ReactNode
}

export interface MenubarCheckboxItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>, 'asChild' | 'children'> {
  value?: string
  icon?: React.ReactNode
  shortcut?: React.ReactNode
  destructive?: boolean
  className?: string
  children?: React.ReactNode
}

export interface MenubarRadioItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>, 'asChild' | 'children'> {
  icon?: React.ReactNode
  shortcut?: React.ReactNode
  destructive?: boolean
  className?: string
  children?: React.ReactNode
}

export interface MenubarShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string
}

// Compound exports: Menubar, MenubarMenu, MenubarTrigger, MenubarContent,
// MenubarGroup, MenubarLabel, MenubarItem, MenubarCheckboxItem,
// MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarSub,
// MenubarSubTrigger, MenubarSubContent, MenubarShortcut
```

Story group: `Navigation`

Migration note: the earlier flat `items[]` draft is replaced by a compound command-bar surface so apps can keep local menu shaping, nested export groups, checkbox preferences, radio choices, and shortcut copy in JSX instead of forcing that variation into one shared record schema.

---

### MonthPicker

```ts
export interface MonthPickerProps {
  value?: Date | null
  onChange?: (value: Date | null) => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  minMonth?: Date
  maxMonth?: Date
  disabled?: boolean
  clearable?: boolean
  error?: string | boolean
  className?: string
}
```

Story group: `Inputs`

Interaction note:
- Trigger styling follows the shared Input family through public `variant` and `size` props.
- `MonthPicker` reuses the shared compact date-family header and year-list spacing baseline so the clickable year jump remains visually aligned with `Calendar`, `DatePicker`, and `DateRangePicker`.

---

### Timeline

```ts
export interface TimelineItem {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  statusTone?: 'default' | 'success' | 'warning' | 'destructive' | 'info'
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[]
  orientation?: 'vertical' | 'horizontal'
  statusTone?: 'default' | 'success' | 'warning' | 'destructive' | 'info'
  className?: string
}
```

Story group: `Data Display`

---
## Ref Forwarding Policy

| Tier | Requirement |
|---|---|
| Tier 1 Primitives | **Required** on all |
| Tier 2 Composites | Required when the root element is focusable or needs external measurement (Dialog, Popover, Tooltip, Combobox) |
| Pure structural sub-components | Not required unless independently focusable |

---

## CVA Variant Pattern (canonical)

Source: `06-component-standards.md 4`

```ts
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@repo/helper';

const componentVariants = cva(
  'base-classes-here',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background',
        secondary: 'bg-secondary text-secondary-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',   // DEFAULT
        lg: 'h-12 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);
```

Merge order: `cn(variantClasses, className)` - consumer `className` always wins.

---

## Forbidden in `@repo/ui` API

Source: `06-component-standards.md 2`

```ts
// FORBIDDEN - domain-specific props
apiUrl?: string
fetchData?: () => Promise<T>
policy?: Policy
claim?: Claim
affiliateId?: string

// FORBIDDEN - Next.js specific
href?: import('next/link').LinkProps['href']   // use: href?: string
src?: import('next/image').ImageProps['src']   // use: src?: string

// FORBIDDEN - env vars
process.env.NEXT_PUBLIC_*

// FORBIDDEN - boolean proliferation (> 3 booleans -> use variant or mode)
```
