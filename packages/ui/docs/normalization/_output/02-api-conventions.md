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

Story group: `Layout`

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

Story group: `Inputs`

---

### Select

```ts
export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string | undefined) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  required?: boolean
  error?: string | boolean
  label?: string
  clearable?: boolean
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

---

### DataTable

```ts
export interface DataTablePaginationConfig {
  pageIndex?: number
  pageSize?: number
  pageCount?: number
  onPageChange?: (pageIndex: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

export interface DataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  loading?: boolean
  renderToolbar?: (table: DataTableInstance<TData>) => React.ReactNode
  emptyState?: React.ReactNode
  loadingState?: React.ReactNode
  pagination?: DataTablePaginationConfig
  pageSizeOptions?: number[]
  caption?: React.ReactNode
  className?: string
}
```

Story group: `Data Display`

**Dependency:** `@tanstack/react-table` v8. Apps using react-table v7 must upgrade before adopting `DataTable`.

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
  mode?: 'single'  // use DateRangePicker for 'range', DateTimePicker for 'datetime'
  minDate?: Date
  maxDate?: Date
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

Migration note: `initialValue` -> `value`; `minimumDate`/`maximumDate` -> `minDate`/`maxDate`; `isForceClear` -> `clearable`; `isDisabled` -> `disabled`; `isLongDate` and similar display-format toggles -> `formatDate`.

---

### Combobox

```ts
export interface ComboboxOption {
  label: string
  value: string
  disabled?: boolean
}

export interface ComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  options: ComboboxOption[]
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  loading?: boolean
  required?: boolean
  error?: string | boolean
  label?: string
  className?: string
  open?: boolean
  onClose?: () => void
}
```

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
  disabled?: boolean
  error?: string | boolean
  autoFocus?: boolean
  className?: string
}
```

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

Story group: `Layout`

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
  presets?: Array<{ label: string; value: DateRangeValue }>
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  clearable?: boolean
  error?: string | boolean
  className?: string
}
```

Story group: `Inputs`

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

Story group: `Layout`

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

### DateTimePicker

```ts
export interface DateTimePickerProps {
  value?: Date | null
  onChange?: (value: Date | null) => void
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
  minMonth?: Date
  maxMonth?: Date
  disabled?: boolean
  clearable?: boolean
  error?: string | boolean
  className?: string
}
```

Story group: `Inputs`

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
