# 02 - API Conventions

> **Batch:** Batch 2 - Design System Foundation
> **Branch:** `feat/ui`
> **Run date:** 2026-03-06
> **Source:** `06-component-standards.md 2 Prop Naming Conventions`
> **Breaking change rule:** After Batch 3 begins, any change to canonical prop names or variant values requires a Foundation Amendment PR.

---

## Global Naming Rules

Source: `06-component-standards.md 2`

| Convention                 | Canonical                                                                                                                               | Forbidden                                                            |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Variant prop               | `variant`                                                                                                                               | `kind`, `type`, `mode`, `color`, `intent`                            |
| Size prop                  | `size`                                                                                                                                  | `width`, `scale`, `height`, small/medium/large literals              |
| Size values                | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` - **default: `'md'`**                                                                            | `'small'`, `'medium'`, `'large'`, `'tiny'`, `'huge'`                 |
| Core variant values        | `'default' \| 'primary' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost' \| 'link'`                                              | ad-hoc aliases such as `'danger'`, `'warning-style'`, `'info-color'` |
| Extended semantic variants | `'success' \| 'warning' \| 'info'` only when the component communicates status/feedback or a Batch 2 parity ruling explicitly allows it | undocumented one-off literals or `'error'` (map to `'destructive'`)  |
| Disabled                   | `disabled`                                                                                                                              | `isDisabled`, `readOnly` (unless semantically distinct)              |
| Loading                    | `loading`                                                                                                                               | `isLoading`, `pending`, `busy`                                       |
| Error                      | `error?: string \| boolean`                                                                                                             | `hasError`, `isError`, `errorMessage` (use `error` for both)         |
| Required                   | `required`                                                                                                                              | `isRequired`                                                         |
| Class override             | `className`                                                                                                                             | `additionalClassName`, `classNames`, `extraClass`                    |
| Open/close trigger         | `open` + `onClose`                                                                                                                      | `isOpen` + `onDismiss`, `show` + `hide`                              |
| Value change               | `onChange` or `onValueChange`                                                                                                           | `onChangeValue`, `handleChange`                                      |
| Close callback             | `onClose`                                                                                                                               | `onDismiss`, `handleClose`                                           |
| Open callback              | `onOpen`                                                                                                                                | `handleOpen`                                                         |
| Select                     | `onSelect`                                                                                                                              | `onPick`, `onChoose`                                                 |
| Slot naming                | `children`, `label`, `description`, `icon`, `leftIcon`, `rightIcon`, `actions`, `footer`, `trigger`                                     | ad-hoc slot names                                                    |

---

## Legacy -> Canonical Prop Mapping

Cross-app conflicts identified across all 27 baselines:

| Legacy pattern                                           | Canonical                                     | Apps affected                                                                       |
| -------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------- |
| `isDisabled`                                             | `disabled`                                    | teman-affiliate-microsite, haruuz-microsite, gelm-xproject-microsite, ticket-portal |
| `isLoading` / `pending` / `filled`                       | `loading`                                     | customer-portal, ticket-portal, teman-affiliate-microsite                           |
| `errorMessage`                                           | `error`                                       | partner-portal, affiliate-admin, affiliate-portal, customer-portal                  |
| `kind="primary"`                                         | `variant="primary"`                           | partner-portal, affiliate-admin                                                     |
| `danger` (variant)                                       | `destructive`                                 | partner-portal, affiliate-admin, affiliate-portal                                   |
| `isOpen` + `onClose`                                     | `open` + `onClose`                            | partner-portal, affiliate-admin, teman-affiliate-admin, claim-portal                |
| `onChangeValue` / `onSelect`                             | `onChange` or `onValueChange`                 | customer-portal, ecommerce-teman                                                    |
| `additionalClassName`                                    | `className`                                   | partner-portal, affiliate-admin                                                     |
| `withBorder` (boolean)                                   | `variant="outline"`                           | affiliate-admin, partner-portal                                                     |
| `isCurrency`, `isFormatNumber`                           | `inputMode="currency"` / `inputMode="number"` | partner-portal, agent-admin                                                         |
| `isForceClear`                                           | `clearable`                                   | partner-portal                                                                      |
| `isWithShadow`                                           | `shadow`                                      | partner-portal (deprecated; use `className` instead)                                |
| `onPress` (NextUI/HeroUI)                                | `onClick`                                     | teman-affiliate-microsite, haruuz-microsite, agent-microsite                        |
| `allOptions` / `options` divergence                      | `options: SelectOption[]`                     | partner-portal, affiliate-admin                                                     |
| `placeholderSelectClassName`, `bgSelect`, `chevronColor` | `className` + `variant`                       | partner-portal (style overrides -> collapse)                                        |
| `isLongDate`                                             | `formatDate`                                  | customer-portal                                                                     |
| `titleModal`                                             | `label`                                       | partner-portal MultipleSelect                                                       |

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
export type BoxPadding = 'none' | 'sm' | 'md' | 'lg';
export type BoxContainer = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface BoxOwnProps {
  asChild?: boolean;
  padding?: BoxPadding;
  container?: BoxContainer;
  centered?: boolean;
  className?: string;
}

export type BoxProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  BoxOwnProps
>;
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
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'outline'
    | 'ghost'
    | 'link'
    | 'warning';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // default: 'md'
  loading?: boolean;
  disabled?: boolean;
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
```

Story group: `Buttons`

Sizing note:

- `Button` keeps the shared action-control size family `xs | sm | md | lg | xl`, default `md`.
- `xs`, `sm`, `md`, and `lg` align by height with the shared field-shell family used by `Input`, `Select`, `Combobox`, `DatePicker`, `DateRangePicker`, and `MonthPicker`, so adjacent action and field controls do not need compensating size overrides.
- `xl` remains the action-only extension for higher-emphasis layouts and does not imply a matching field-shell size.

---

### Shared field-shell variant family

```ts
export type FieldVariant = 'outline' | 'shadow' | 'ghost';
export type FieldVariantAlias = 'default'; // compatibility alias for 'shadow'
export type InputVariant = FieldVariant | FieldVariantAlias;
```

Field-variant note:

- The shared field-shell variant family now covers `Input`, `Textarea`, `Select`, `Combobox`, `DatePicker`, `DateRangePicker`, `MonthPicker`, `FileUpload`, `OtpInput`, and `RichTextEditor`.
- Canonical new usage defaults to `variant='outline'`.
- Legacy `variant='default'` remains a compatibility alias for the elevated `shadow` treatment where the public contract still accepts it.
- `shadow` is the explicit shared replacement for older elevated field shells and one-off `isWithShadow` style toggles.

---

### Input

```ts
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'; // default: 'md'
  inputMode?: 'text' | 'email' | 'phone' | 'currency' | 'number' | 'password';
  error?: string | boolean;
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  placeholder?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  className?: string;
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
export interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange'
> {
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: 'outline'
  error?: string | boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  placeholder?: string;
  helperText?: string;
  clearable?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onValueChange?: (value: string) => void;
  className?: string;
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

| Family                  | Components                                                                                                    | Canonical rule                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `field-shell-composite` | `Input`                                                                                                       | Outer shell owns focus via `focus-within`; use border emphasis plus a near-shell halo with no detached offset halo |
| `field-shell-composite-visible` | `DatePicker`, `DateRangePicker`, `MonthPicker`                                                       | Outer shell reacts to descendant `:focus-visible`, while open state may reinforce border emphasis without leaving a sticky post-close active border |
| `field-shell-direct`    | `Textarea`, `Select`, `Combobox`, date/time inputs inside date pickers                                        | Direct interactive root owns the same calmer field-shell language via `focus-visible`                              |
| `segmented-slot`        | `OtpInput`                                                                                                    | Separate active and focused-slot emphasis so one slot never carries multiple heavy focus cues                      |
| `compact-control`       | `Button`, `Checkbox`, `RadioGroup`, `Switch`, embedded field action buttons, `DateRangePicker` preset buttons | Keep direct focus obvious but tighter than field-shell focus                                                       |
| `dense-surface`         | `Calendar`, `Tabs`, `Accordion`, `Pagination`, `NavigationMenu`, `Menubar`, `Command`                         | Keep focus precise and attached to dense targets without detached halos or state stacking                          |

Global focus rules:

- `focus-visible` remains the default for direct interactive roots.
- `focus-within` remains the default for composite shells that wrap an internal focus target.
- Popover-backed picker shells such as `DatePicker`, `DateRangePicker`, and `MonthPicker` may key shell emphasis from descendant `:focus-visible` plus explicit open-state border emphasis so pointer selection can close cleanly without leaving a sticky active border behind.
- Detached `ring-offset-2` halos are no longer the default enterprise recipe for shared field-entry components.
- Invalid focus may tint toward `destructive`, but it must not introduce a second louder emphasis system by default.
- Open, active, selected, and highlighted states must not stack a second heavy focus ring on the same element.
- The existing internal authority for shared focus recipes is `packages/ui/src/utils/focus-normalization.ts`.

Wave status:

- Approved for implementation now: `field-shell-composite`, `field-shell-direct`, `segmented-slot`, `compact-control`, and `dense-surface`
- Deferred by default: none inside the current focus-family contract
- Dense-surface implementations should keep using the existing internal helper surface instead of reintroducing one-off ring strings

---

### RichTextEditor

```ts
export interface RichTextEditorProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children' | 'onBlur' | 'onChange' | 'onFocus'
> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  toolbar?: 'default' | 'minimal' | 'none';
  readonly?: boolean;
  sanitize?: boolean | ((html: string) => string);
  label?: string;
  helperText?: string;
  error?: string | boolean;
  required?: boolean;
  id?: string;
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
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectOptionRenderState {
  selected: boolean;
  disabled: boolean;
}

export interface SelectBaseProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  placeholder?: string;
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'; // default: 'md'
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  error?: string | boolean;
  label?: string;
  clearable?: boolean;
  renderOption?: (option: SelectOption, state: SelectOptionRenderState) => React.ReactNode;
  className?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

export interface SelectFlatProps extends SelectBaseProps {
  options: SelectOption[];
  children?: never;
}

export interface SelectCompoundProps extends SelectBaseProps {
  children: React.ReactNode;
  options?: never;
}

export type SelectProps = SelectFlatProps | SelectCompoundProps;
```

Shared-scope note:

- `Select` is the static single-select contract only.
- The flat `options` API remains the preferred normalized path for simple static lists.
- Additive compound exports (`SelectTrigger`, `SelectValue`, `SelectContent`, `SelectGroup`, `SelectLabel`, `SelectItem`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton`) remain supported for migration-safe Radix-style composition.
- Search-driven selection belongs to `Combobox`.
- Multi-select and phone-code-specific flows remain separate migration targets and must not be folded back into this API.

Sizing note:

- `Select` now participates in the shared field-shell size family used by `Input`, `DatePicker`, `DateRangePicker`, and `MonthPicker`.
- `Select` uses `xs | sm | md | lg` with default `md`.

Focus note:

- `Select` belongs to the `field-shell-direct` focus family.
- Open state may reinforce border emphasis, but it must not layer a second heavy focus ring on top of the trigger's keyboard focus treatment.

Layout note:

- `SelectTrigger` uses `min-w-0` and `overflow-hidden` to ensure long selected values do not force the component to expand beyond its parent flex/grid container.
- `SelectValue` authors its internal wrapper as `Box as="span"` with `data-slot="select-value-wrapper"` to maintain layout resilience and follow the Box-authored DOM rule.

Story group: `Inputs`

---

### Checkbox

```ts
export type CheckboxCheckedState = boolean | 'indeterminate';

export interface CheckboxProps extends Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  'checked' | 'defaultChecked' | 'onCheckedChange'
> {
  checked?: CheckboxCheckedState;
  defaultChecked?: CheckboxCheckedState;
  onCheckedChange?: (checked: CheckboxCheckedState) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg'; // default: 'md'
  error?: string | boolean;
  className?: string;
}
```

Story group: `Inputs`

---

### RadioGroup

```ts
export interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg'; // default: 'md'
  error?: string | boolean;
  children: React.ReactNode;
  className?: string;
}

export interface RadioGroupItemProps {
  value: string;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}
```

Story group: `Inputs`

---

### Switch

```ts
export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  error?: string | boolean;
  size?: 'sm' | 'md' | 'lg'; // default: 'md'
  className?: string;
}
```

Behavior note:

- Disabled `Switch` states keep explicit checked-vs-unchecked track contrast instead of muting the entire control with shared opacity.

Story group: `Inputs`

---

### Dialog

```ts
export interface DialogProps {
  open?: boolean;
  onClose?: () => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'; // default: 'md'
  className?: string;
  children: React.ReactNode;
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
  open?: boolean;
  onClose?: () => void;
  direction?: 'bottom' | 'right' | 'left' | 'top'; // default: 'bottom'
  handleOnly?: boolean;
  children: React.ReactNode;
}

export interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}
```

Story group: `Overlays`

---

### Popover

```ts
export interface PopoverProps {
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  className?: string;
  children: React.ReactNode;
}
```

Story group: `Overlays`

---

### Tooltip

```ts
export interface TooltipProviderProps {
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
  children: React.ReactNode;
}

export interface TooltipProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  delayDuration?: number;
  disableHoverableContent?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  className?: string;
  children: React.ReactNode;
}

// Compound exports: TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, TooltipArrow
```

Standalone `Tooltip` usage auto-installs a local Radix provider. Use `TooltipProvider` only when related tooltips should share delay timing.

Story group: `Overlays`

## Migration note: flat `content` wrapper props normalize to `TooltipContent` children; `position` -> `side`; `delay` -> `delayDuration`; app-specific color props collapse into the shared tokenized surface plus `className`; `isShow={false}` maps to `disabled`.

### Alert

```ts
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'outline' | 'shadow' | 'default' | 'success' | 'info' | 'warning' | 'destructive';
  tone?: 'default' | 'success' | 'info' | 'warning' | 'destructive';
  title?: string;
  description?: string;
  children?: React.ReactNode;
  dismissible?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
  className?: string;
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
  className?: string;
}
```

Story group: `Feedback`

Normalization notes:

- Keep `Skeleton` decorative by default and shape-only: consumers still own width, height, radius, and composition through `className`.
- The shared visual contract is now a muted surface with layered pulse plus a token-driven shimmer highlight, and this motion is intentionally preserved even when reduced-motion preferences are enabled.

---

### Table (structural primitive)

```ts
// Structural HTML table wrappers - no logic, no data fetching
// Sub-components: TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter
export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string;
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
  pageIndex?: number;
  pageSize?: number;
  pageCount?: number;
  rowCount?: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface DataTableShellProps<TData extends RowData> {
  variant?: 'outline' | 'shadow'; // default: 'outline'
  loading?: boolean;
  enablePagination?: boolean;
  getRowClassName?: DataTableRowClassName<TData>;
  renderToolbar?: (table: DataTableInstance<TData>) => React.ReactNode;
  renderPagination?: (table: DataTableInstance<TData>) => React.ReactNode;
  renderStatus?: (context: DataTableStatusContext<TData>) => React.ReactNode | null;
  renderFooter?: (table: DataTableInstance<TData>) => React.ReactNode;
  emptyState?: DataTableRenderable<TData>;
  loadingState?: DataTableRenderable<TData>;
  renderExpandedContent?: (row: Row<TData>, table: DataTableInstance<TData>) => React.ReactNode;
  pageSizeOptions?: number[];
  caption?: React.ReactNode;
  layout?: DataTableLayoutOptions;
}

export type DataTableProps<TData extends RowData, TValue = unknown> =
  | DataTableControlledProps<TData>
  | DataTableManagedProps<TData, TValue>;

export interface DataTableVirtualizedProps<TData extends RowData> extends Omit<
  DataTableShellProps<TData>,
  'renderExpandedContent'
> {
  table: DataTableInstance<TData>;
  height: number;
  estimateRowHeight?: number;
  overscan?: number;
}

export interface DataTableRowClassNameContext<TData extends RowData> {
  row: Row<TData>;
  rowIndex: number;
  table: DataTableInstance<TData>;
}

export interface DataTableHeaderClassNameContext<TData extends RowData, TValue = unknown> {
  header: Header<TData, TValue>;
  column: Column<TData, TValue>;
  table: DataTableInstance<TData>;
}

export interface DataTableCellClassNameContext<TData extends RowData, TValue = unknown> {
  cell: Cell<TData, TValue>;
  row: Row<TData>;
  rowIndex: number;
  column: Column<TData, TValue>;
  table: DataTableInstance<TData>;
}

export type DataTableRowClassName<TData extends RowData> = (
  context: DataTableRowClassNameContext<TData>,
) => string | undefined;

export type DataTableHeaderClassName<TData extends RowData, TValue = unknown> =
  | string
  | ((context: DataTableHeaderClassNameContext<TData, TValue>) => string | undefined);

export type DataTableCellClassName<TData extends RowData, TValue = unknown> =
  | string
  | ((context: DataTableCellClassNameContext<TData, TValue>) => string | undefined);

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    headerCellClassName?: DataTableHeaderClassName<TData, TValue>;
    headerContentClassName?: DataTableHeaderClassName<TData, TValue>;
    cellClassName?: DataTableCellClassName<TData, TValue>;
    cellContentClassName?: string;
    loadingSkeletonClassName?: string;
    loadingSkeleton?: React.ReactNode;
  }
}
```

Story group: `Data Display`

Normalization notes:

- Public exports are `DataTable`, `DataTableVirtualized`, `DataTablePagination`, `useDataTable`, `dataTableFacetedFilterFn`, and `dataTableFuzzyFilterFn`.
- Toolbar/search/filter/view/selection helper controls currently remain Storybook-only utilities, not package exports.
- Stories prefer explanatory copy above the table instead of relying on captions, but the semantic `caption` prop remains supported.
- The managed `data` + `columns` path now exposes TanStack's global `enableSorting` toggle through `tableOptions`, so consumers can suppress shared sorting behavior without switching to controlled `table` mode.
- Shared styling extensibility is now app-agnostic and explicit: row classes map through `getRowClassName(...)`, header-cell shell classes map through `columnDef.meta.headerCellClassName`, shared header-content wrapper classes map through `columnDef.meta.headerContentClassName`, body-cell shell classes map through `columnDef.meta.cellClassName`, and inner body-content wrapper classes map through `columnDef.meta.cellContentClassName`.
- `meta.headerCellClassName` styles the semantic `<th>` shell, while `meta.headerContentClassName` styles the shared header-content wrapper and sortable trigger content inside it.
- `meta.cellClassName` styles the semantic `<td>` shell, while `meta.cellContentClassName` styles the shared overflow-aware content wrapper inside that cell.
- When `meta.cellClassName` is a string, the default loading-row renderer now reuses it on skeleton `<td>` shells as well. Loading cells also inherit the shared pinned-cell marker and sticky offset styles for pinned columns, so alignment, width, spacing, and pinned positioning stay visually in sync before data hydrates.
- Default loading skeleton rows now follow the table's visible leaf columns. Use `columnDef.meta.loadingSkeletonClassName` for skeleton width/class overrides or `columnDef.meta.loadingSkeleton` for fully custom per-column placeholders before replacing the whole loading surface through `loadingState`.
- Horizontal overflow now mirrors the shared `Tabs` affordance: edge fade cues only appear while more columns remain off-screen, those cues align to the inner edge of any pinned left or right columns, and the custom scrollbar affordance only reveals during hover, thumb drag, or brief shell-level keyboard panning.
- Resizable headers now reserve a narrow trailing gutter for the shared separator control so label content, sort affordances, and resize hit-targets stop competing for the same edge pixels.
- The shared resize affordance is now a focusable separator, not a visually hidden mini-button: drag and touch resizing remain supported, ArrowLeft / ArrowRight provide precise keyboard sizing, Delete resets the active column width, shared tables now default to live `columnResizeMode='onChange'` feedback, and explicit `columnResizeMode='onEnd'` opt-ins keep the full handle aligned to the pending drag offset.
- The shared `DataTableViewport` now includes `[container-type:inline-size]` so internal status content (empty states, loading skeletons, etc.) can use `w-[100cqw]` and `sticky left-0` to remain visually centered during horizontal scrolling, even when the semantic table structure is wider than the viewport.
- Dependency: `@tanstack/react-table` v8. `DataTableVirtualized` additionally depends on TanStack Virtual through the shared package.
- Internal helper consolidation is now split intentionally between `DataTable.utils.ts` for shared table math and sticky styles plus `DataTable.viewport.tsx` for the owned overflow shell; layout concerns are still not split into a separate `DataTable.layout.ts` layer.

---

### Pagination

```ts
export type NavigationSurfaceVariant = 'outline' | 'shadow' | 'ghost';
export type NavigationSurfaceVariantAlias = 'default'; // compatibility alias for 'shadow'
export type NavigationSurfaceVariantProp = NavigationSurfaceVariant | NavigationSurfaceVariantAlias;

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: 'outline'
  className?: string;
}
```

Sizing note:

- `Pagination` has no public `size` prop in the shared contract.
- Any internal `default` or `compact` density handling stays private and must not be promoted into public API in this pass.

Navigation-surface note:

- The shared navigation-surface variant family now covers `Pagination`, `Tabs`, `DropdownMenu`, `NavigationMenu`, and `Menubar`.
- Canonical new usage defaults to `variant='outline'`.
- Legacy `variant='default'` remains a compatibility alias for the elevated `shadow` treatment where the public contract still accepts it.
- `shadow` is the explicit shared replacement for older elevated nav shells and one-off `isWithShadow` style toggles.

Story group: `Navigation`

---

### Calendar

```ts
export interface CalendarProps {
  mode?: 'single' | 'multiple' | 'range';
  selected?: Date | Date[] | DateRange;
  onSelect?: (date: Date | Date[] | DateRange | undefined) => void;
  disabled?: boolean | ((date: Date) => boolean);
  className?: string;
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
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'; // default: 'md'
  formatDate?: (date: Date) => string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  mode?: 'single'; // use DateRangePicker for 'range'
  minDate?: Date;
  maxDate?: Date;
  withTime?: boolean;
  minDateTime?: Date;
  maxDateTime?: Date;
  timezone?: string;
  disabled?: boolean;
  clearable?: boolean;
  required?: boolean;
  presentation?: 'popover' | 'drawer'; // default: 'popover'
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end'; // default: 'start'
  drawerTitle?: string;
  label?: string;
  placeholder?: string;
  error?: string | boolean;
  open?: boolean;
  onClose?: () => void;
  className?: string;
  classNames?: Record<string, string>;
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
- `presentation="drawer"` shifts the floating surface from a `Popover` to a bottom `Drawer`, which is especially useful for mobile viewports, optionally framed by a `drawerTitle`.

Migration note: `initialValue` -> `value`; `minimumDate`/`maximumDate` -> `minDate`/`maxDate`; datetime-specific bounds map to `minDateTime`/`maxDateTime`; `isForceClear` -> `clearable`; `isDisabled` -> `disabled`; `isLongDate` and similar display-format toggles -> `formatDate`.

---

### Combobox

```ts
export interface ComboboxOption {
  label: string;
  value: string;
  disabled?: boolean;
  keywords?: string[];
}

export interface ComboboxOptionRenderState {
  selected: boolean;
  disabled: boolean;
}

export interface ComboboxProps {
  value?: string;
  onValueChange?: (value: string | undefined) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'; // default: 'md'
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  error?: string | boolean;
  label?: string;
  clearable?: boolean;
  createOptionLabel?: string | ((searchValue: string) => string);
  onCreateOption?: (searchValue: string) => void;
  renderOption?: (option: ComboboxOption, state: ComboboxOptionRenderState) => React.ReactNode;
  className?: string;
  open?: boolean;
  onClose?: () => void;
}
```

Sizing note:

- `Combobox` now participates in the shared field-shell size family used by `Input`, `DatePicker`, `DateRangePicker`, and `MonthPicker`.
- `Combobox` uses `xs | sm | md | lg` with default `md`.

Focus note:

- `Combobox` belongs to the `field-shell-direct` focus family.
- Open state may not stack a second heavy ring on top of the trigger's keyboard focus treatment.

Contract note:

- Search text may stay internal or be controlled through `searchValue`; parent-owned async search still flows through `onSearchValueChange`.
- Debounce, fetching, and option refresh remain outside `@repo/ui`.
- A bounded create-on-enter affordance is allowed through `onCreateOption` plus `createOptionLabel`; business-specific creation semantics remain local.

Story group: `Inputs`

---

### FileUpload

```ts
export interface FileUploadProps {
  value?: File | File[] | null;
  onChange?: (file: File | File[] | null) => void;
  displayValue?: string | string[] | null;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  maxSize?: number;
  error?: string | boolean;
  clearable?: boolean;
  onClear?: () => void;
  label?: string;
  className?: string;
}
```

Migration note:

- Persisted filename strings or already-uploaded file labels should map to `displayValue`, while `value` stays on the shared `File | File[] | null` contract.

Story group: `Inputs`

---

### OtpInput

```ts
export interface OtpInputProps {
  value?: string;
  onValueChange?: (value: string) => void;
  length?: number; // default: 6
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: 'outline'
  size?: 'sm' | 'md' | 'lg'; // default: 'md'
  disabled?: boolean;
  error?: string | boolean;
  autoFocus?: boolean;
  className?: string;
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
  variant?: 'outline' | 'solid' | 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info';
  tone?: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg'; // default: 'md'
  className?: string;
  children: React.ReactNode;
}
```

Story group: `Feedback`

## Migration note: legacy semantic variants mapping to `variant` are internally resolved to `tone` with `variant="solid"` as the fallback base. Primary surface variants are `outline` (default) and `solid`.

---

### Card

```ts
// Compound: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'outline' | 'shadow'; // default: 'outline'
  className?: string;
  children?: React.ReactNode;
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
  required?: boolean;
  disabled?: boolean;
  tone?: 'default' | 'muted' | 'destructive';
  className?: string;
  children?: React.ReactNode;
}
```

Story group: `Inputs`

---

### Spinner

```ts
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'; // default: 'md'
  label?: string;
  inline?: boolean;
  overlay?: boolean;
  className?: string;
}
```

Story group: `Feedback`

---

### Tabs

```ts
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'outline' | 'ghost' | 'underline'; // default: 'outline'
  className?: string;
  children?: React.ReactNode;
}

export interface TabsTriggerProps extends Omit<
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
  'asChild' | 'className'
> {
  variant?: 'outline' | 'ghost' | 'underline'; // default: inherits root variant
  className?: string;
}
```

Story group: `Navigation`

Contract note:

- Root `variant` cascades to both `TabsList` spacing and `TabsTrigger`.
- Individual triggers may override `variant` locally without widening the shared tabs layout contract into a public size family.
- Horizontal `TabsList` overflow stays built into the shared shell, including edge fade cues plus a custom track/thumb affordance when the trigger row exceeds the available width.
- The shared overflow shell owns reveal-on-interaction behavior for that scrollbar affordance, including hover, thumb drag, and brief reveal during shell-level horizontal panning keys when the shell itself is focused; apps should not add parallel wrapper DOM just to recreate the same scroll treatment.
- `Tabs` intentionally does not expose the elevated `shadow` or legacy `default` alias used by some other navigation surfaces.

---

### Breadcrumb

```ts
// Flat convenience API plus additive compound exports:
// BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator
export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items?: BreadcrumbItem[];
  separator?: React.ReactNode;
  currentLabel?: string;
  className?: string;
}

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  className?: string;
}
```

Story group: `Navigation`

---

### DropdownMenu

```ts
export interface DropdownMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onAction?: (value: string) => void;
  disabled?: boolean;
  modal?: boolean;
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: 'outline'
  children: React.ReactNode;
}

export interface DropdownMenuContentProps extends Omit<
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>,
  'asChild' | 'children' | 'className'
> {
  className?: string;
  children: React.ReactNode;
}

export interface DropdownMenuItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>,
  'asChild' | 'children'
> {
  value?: string;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  inset?: boolean;
  destructive?: boolean;
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: inherits root variant
  className?: string;
  children?: React.ReactNode;
}

export interface DropdownMenuCheckboxItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  'asChild' | 'children'
> {
  value?: string;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  destructive?: boolean;
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: inherits root variant
  className?: string;
  children?: React.ReactNode;
}

export interface DropdownMenuRadioItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>,
  'asChild' | 'children'
> {
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  destructive?: boolean;
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: inherits root variant
  className?: string;
  children?: React.ReactNode;
}

export interface DropdownMenuSubTriggerProps extends Omit<
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>,
  'asChild' | 'children'
> {
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  inset?: boolean;
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: inherits root variant
  className?: string;
  children?: React.ReactNode;
}

// Compound exports: DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
// DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem,
// DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem,
// DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger,
// DropdownMenuSubContent
```

Story group: `Overlays`

Contract note:

- Root `variant` cascades to interactive menu rows and submenu triggers.
- Explicit item-level `variant` wins locally, so apps can keep mixed elevation inside one menu without widening the shared contract into separate tone families.

---

### Avatar

```ts
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  variant?: 'outline' | 'shadow'; // default: 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'; // default: 'md'
  className?: string;
}
```

Story group: `Data Display`

---

### DateRangePicker

```ts
export interface DateRangeValue {
  from?: Date;
  to?: Date;
}

export interface DateRangePickerProps {
  value?: DateRangeValue | null;
  onChange?: (value: DateRangeValue | null) => void;
  changeBehavior?: 'partial' | 'complete'; // default: 'partial'
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'; // default: 'md'
  presets?: Array<{ label: string; value: DateRangeValue }>;
  minDate?: Date;
  maxDate?: Date;
  withTime?: boolean;
  minDateTime?: Date;
  maxDateTime?: Date;
  timezone?: string;
  disabled?: boolean;
  clearable?: boolean;
  error?: string | boolean;
  className?: string;
}
```

Story group: `Inputs`

Time policy:

- `withTime` enables minute-precision start and end time entry while keeping the public range contract as plain `Date` values.
- `timezone` is a display-context hint only. Any timezone conversion or server-time synchronization remains app-local.
- `minDateTime` and `maxDateTime` are enforced in the picker UI across both the date and time portions when `withTime` is enabled.

Change policy:

- `changeBehavior='partial'` is the default and preserves the current shared behavior of emitting partial selections through `onChange`.
- `changeBehavior='complete'` defers parent `onChange` until both boundaries are selected while the picker still previews the in-progress range internally.

Surface policy:

- Trigger styling follows the shared Input family through public `variant` and `size` props.
- Plain date-only `DateRangePicker` usage keeps the shared two-month calendar as the primary bare surface when no preset row or time rail is present.
- `DateRangePicker` with `withTime`, or generic preset chrome, uses the framed composite popover shell.

---

### Image

```ts
export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt?: string;
  fallback?: React.ReactNode;
  ratio?: 'square' | 'video' | 'portrait' | 'auto';
  fit?: 'cover' | 'contain' | 'fill';
  className?: string;
}
```

Story group: `Data Display`

---

### NavigationMenu

```ts
export interface NavigationMenuProps extends Omit<
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>,
  'children' | 'className'
> {
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: 'outline'
  className?: string;
  children: React.ReactNode;
}

export interface NavigationMenuListProps extends Omit<
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>,
  'asChild'
> {
  className?: string;
  children?: React.ReactNode;
}

export interface NavigationMenuItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>,
  'asChild'
> {
  className?: string;
  children?: React.ReactNode;
}

export interface NavigationMenuTriggerProps extends Omit<
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>,
  'asChild'
> {
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: inherits root variant
  className?: string;
  children?: React.ReactNode;
}

export interface NavigationMenuContentProps extends Omit<
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>,
  'asChild' | 'children'
> {
  className?: string;
  children: React.ReactNode;
}

export interface NavigationMenuLinkProps extends Omit<
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>,
  'asChild' | 'className'
> {
  asChild?: boolean;
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: inherits root variant
  className?: string;
  children?: React.ReactNode;
}

export interface NavigationMenuIndicatorProps extends Omit<
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>,
  'asChild' | 'children'
> {
  className?: string;
}

export interface NavigationMenuViewportProps extends Omit<
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>,
  'asChild' | 'children'
> {
  className?: string;
}

// Compound exports: NavigationMenu, NavigationMenuList, NavigationMenuItem,
// NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink,
// NavigationMenuIndicator, NavigationMenuViewport
```

Story group: `Navigation`

Migration note: the earlier flat `items[]` / `collapsed` / `onNavigate` draft was dropped because route trees, auth gating, and information architecture must remain app-local. Apps should map their local route data into the compound shared parts instead.

Contract note:

- Root `variant` cascades to `NavigationMenuTrigger` and `NavigationMenuLink`.
- Explicit trigger/link `variant` overrides stay allowed for mixed rails and hero-nav treatments without widening the shared API back into route-aware presets.

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
  type?: 'single' | 'multiple'; // default: 'single'
  collapsible?: boolean;
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  variant?: 'outline' | 'shadow'; // default: 'outline'
  className?: string;
  children?: React.ReactNode;
}

export interface AccordionItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>,
  'asChild' | 'className'
> {
  variant?: 'outline' | 'shadow'; // default: inherits root variant
  className?: string;
}
```

Story group: `Data Display`

---

### Command

```ts
export interface CommandProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  label?: string;
  className?: string;
}

export interface CommandInputProps extends React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Input
> {
  className?: string;
}

export interface CommandListProps extends React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.List
> {
  className?: string;
}

export interface CommandEmptyProps extends React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Empty
> {
  className?: string;
}

export interface CommandGroupProps extends React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Group
> {
  className?: string;
}

export interface CommandItemProps extends React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Item
> {
  className?: string;
}

export interface CommandSeparatorProps extends React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Separator
> {
  className?: string;
}

export interface CommandShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
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
export interface MenubarProps extends Omit<
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>,
  'children' | 'className'
> {
  disabled?: boolean;
  onAction?: (value: string) => void;
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: 'outline'
  className?: string;
  children: React.ReactNode;
}

export interface MenubarTriggerProps extends Omit<
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>,
  'asChild'
> {
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: inherits root variant
  className?: string;
  children?: React.ReactNode;
}

export interface MenubarContentProps extends Omit<
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>,
  'asChild' | 'children' | 'className'
> {
  className?: string;
  children: React.ReactNode;
}

export interface MenubarItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item>,
  'asChild' | 'children'
> {
  value?: string;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  inset?: boolean;
  destructive?: boolean;
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: inherits root variant
  className?: string;
  children?: React.ReactNode;
}

export interface MenubarCheckboxItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>,
  'asChild' | 'children'
> {
  value?: string;
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  destructive?: boolean;
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: inherits root variant
  className?: string;
  children?: React.ReactNode;
}

export interface MenubarRadioItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>,
  'asChild' | 'children'
> {
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  destructive?: boolean;
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: inherits root variant
  className?: string;
  children?: React.ReactNode;
}

export interface MenubarSubTriggerProps extends Omit<
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger>,
  'asChild' | 'children'
> {
  icon?: React.ReactNode;
  shortcut?: React.ReactNode;
  inset?: boolean;
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: inherits root variant
  className?: string;
  children?: React.ReactNode;
}

export interface MenubarShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

// Compound exports: Menubar, MenubarMenu, MenubarTrigger, MenubarContent,
// MenubarGroup, MenubarLabel, MenubarItem, MenubarCheckboxItem,
// MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarSub,
// MenubarSubTrigger, MenubarSubContent, MenubarShortcut
```

Story group: `Navigation`

Migration note: the earlier flat `items[]` draft is replaced by a compound command-bar surface so apps can keep local menu shaping, nested export groups, checkbox preferences, radio choices, and shortcut copy in JSX instead of forcing that variation into one shared record schema.

Contract note:

- Root `variant` cascades to top-level triggers, standard items, selection items, and submenu triggers.
- Explicit trigger/item `variant` overrides remain allowed so desktop command bars can mix low-chrome and elevated sections without introducing a second shared menubar family.

---

### MonthPicker

```ts
export interface MonthPickerProps {
  value?: Date | null;
  onChange?: (value: Date | null) => void;
  variant?: 'outline' | 'shadow' | 'ghost' | 'default'; // default: 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg'; // default: 'md'
  minMonth?: Date;
  maxMonth?: Date;
  disabled?: boolean;
  clearable?: boolean;
  placeholder?: string;
  error?: string | boolean;
  className?: string;
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
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: 'outline' | 'shadow';
  statusTone?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
}

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[];
  orientation?: 'vertical' | 'horizontal';
  variant?: 'outline' | 'shadow'; // default: 'outline'
  statusTone?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
  className?: string;
}
```

Story group: `Data Display`

---

## Ref Forwarding Policy

| Tier                           | Requirement                                                                                                    |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Tier 1 Primitives              | **Required** on all                                                                                            |
| Tier 2 Composites              | Required when the root element is focusable or needs external measurement (Dialog, Popover, Tooltip, Combobox) |
| Pure structural sub-components | Not required unless independently focusable                                                                    |

---

## CVA Variant Pattern (canonical)

Source: `06-component-standards.md 4`

```ts
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@repo/helper';

const componentVariants = cva('base-classes-here', {
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
      md: 'h-10 px-4 text-sm', // DEFAULT
      lg: 'h-12 px-8 text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});
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

