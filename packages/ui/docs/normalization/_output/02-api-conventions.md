# API Conventions

## Global Naming Rules (Mandatory)

### Canonical prop names
- `variant` (not `kind`, not `type` for visual intent)
- `size` with allowed set: `xs | sm | md | lg | xl` (default `md`)
- `disabled` (not `isDisabled`)
- `loading` (not `isLoading`, `pending`)
- `error` (string or boolean; replaces fragmented `errorMessage` only APIs)
- `open` + `onOpenChange` for open-state components
- `value` + `onValueChange` for controlled value components
- `className` for style extension

### Canonical variant values
- `default | primary | secondary | destructive | outline | ghost | link`

### Canonical event handler names
- `onClick`, `onChange`, `onValueChange`, `onOpenChange`, `onSelect`, `onSubmit`, `onClose`

### Canonical slot names
- `children`, `label`, `description`, `icon`, `leftIcon`, `rightIcon`, `actions`, `footer`

### Ref policy
- Tier 1 primitives: ref forwarding is required.
- Tier 2 composites: forward ref on root interactive/content element where meaningful.

## Legacy-to-Canonical Mapping (Adapter Inputs)

| Legacy names seen in app baselines | Canonical name |
| --- | --- |
| `isDisabled` | `disabled` |
| `isLoading`, `pending` | `loading` |
| `kind`, `type` (visual intent) | `variant` |
| `onChangeValue` | `onValueChange` |
| `isOpen` / `onClose`-only | `open` + `onOpenChange` (+ optional `onClose`) |
| `additionalClassName` | `className` |
| `withIcon` | `leftIcon` / `rightIcon` |

## Per-Component Canonical Contracts

| Component | Canonical prop interface focus | Variant names | Size names | Event signatures | Slot names | Ref |
| --- | --- | --- | --- | --- | --- | --- |
| Box | `as`, `asChild`, `className`, native passthrough | n/a | n/a | native | `children` | Required |
| Button | `variant`, `size`, `loading`, `disabled`, `asChild` | standard set | standard set | `onClick(e)` | `children`, `leftIcon`, `rightIcon` | Required |
| Input | `type`, `value`, `onValueChange`, `placeholder`, `error`, `disabled` | `default`, `outline` | standard set | `onValueChange(value)` | `icon` | Required |
| Textarea | `value`, `onValueChange`, `rows`, `error`, `disabled` | `default`, `outline` | standard set | `onValueChange(value)` | n/a | Required |
| Label | `htmlFor`, `required`, `disabled` | `default` | `sm`, `md`, `lg` | n/a | `children` | Required |
| Checkbox | `checked`, `onCheckedChange`, `disabled`, `error` | `default` | `sm`, `md`, `lg` | `onCheckedChange(checked)` | `label`, `description` | Required |
| RadioGroup | `value`, `onValueChange`, `disabled`, `options` | `default`, `card` | `sm`, `md`, `lg` | `onValueChange(value)` | `label`, `description` | Required |
| Switch | `checked`, `onCheckedChange`, `disabled` | `default` | `sm`, `md`, `lg` | `onCheckedChange(checked)` | `label`, `description` | Required |
| Select | `value`, `onValueChange`, `options`, `multiple`, `searchable`, `disabled`, `error` | `default`, `outline` | standard set | `onValueChange(value \| value[])` | `placeholder`, `icon` | Required |
| Badge | `variant`, `size` | `default`, `secondary`, `destructive`, `outline` | `sm`, `md`, `lg` | n/a | `children` | Optional |
| Avatar | `src`, `alt`, `fallback`, `size` | `default` | `sm`, `md`, `lg`, `xl` | `onError` | `fallback` | Optional |
| Skeleton | `shape`, `animated` | `default` | `sm`, `md`, `lg` | n/a | n/a | Optional |
| Spinner | `variant`, `size` | `default`, `primary`, `muted` | `xs`, `sm`, `md`, `lg` | n/a | n/a | Optional |
| Alert | `variant`, `title`, `description`, `dismissible`, `open`, `onOpenChange` | `default`, `destructive`, `warning`, `success`, `info` | n/a | `onOpenChange(open)` | `icon`, `actions` | Optional |
| LoadingWrapper | `loading`, `delayMs`, `fallback` | `default` | n/a | n/a | `children`, `fallback` | Optional |
| Card | `variant`, `interactive` | `default`, `outlined`, `elevated` | n/a | `onClick(e)` | `header`, `actions`, `footer`, `children` | Optional |
| Form | `form`, `onSubmit`, `disabled`, field context props | `default` | n/a | `onSubmit(data)` | `children`, `actions` | Optional |
| Table | `columns`, `rows`, `dense`, `striped`, `emptyState` | `default`, `compact` | `sm`, `md` | sort/paging callbacks | `emptyState` | Optional |
| DataTable | `columns`, `rows`, `sorting`, `filtering`, `pagination` | `default` | n/a | table behavior callbacks | `toolbar`, `emptyState` | Optional |
| Pagination | `page`, `pageSize`, `totalItems`, `onPageChange` | `default` | `sm`, `md`, `lg` | `onPageChange(page)` | n/a | Optional |
| Breadcrumb | `items`, `separator` | `default`, `compact` | n/a | `onSelect(item)` | `separator` | Optional |
| Tabs | `value`, `onValueChange`, `orientation` | `default`, `pill`, `underline` | `sm`, `md`, `lg` | `onValueChange(value)` | `tabs`, `panels` | Optional |
| NavigationMenu | `items`, `value`, `onValueChange` | `default` | n/a | `onValueChange(value)` | `itemIcon`, `itemSuffix` | Optional |
| Menubar | `items`, `disabledItems` | `default` | n/a | `onSelect(value)` | `itemIcon`, `shortcut` | Optional |
| DropdownMenu | `items`, `open`, `onOpenChange`, `side` | `default` | n/a | `onOpenChange(open)`, `onSelect(value)` | `trigger`, `itemIcon` | Optional |
| Dialog | `open`, `onOpenChange`, `modal`, `size` | `default`, `destructive` | `sm`, `md`, `lg`, `xl` | `onOpenChange(open)` | `title`, `description`, `footer`, `actions` | Optional |
| Drawer | `open`, `onOpenChange`, `side`, `size` | `default` | `sm`, `md`, `lg` | `onOpenChange(open)` | `title`, `description`, `footer`, `actions` | Optional |
| Popover | `open`, `onOpenChange`, `side`, `align` | `default` | n/a | `onOpenChange(open)` | `trigger`, `content` | Optional |
| Tooltip | `content`, `side`, `align`, `delayDuration` | `default` | n/a | `onOpenChange(open)` | `trigger` | Optional |
| Calendar | `value`, `onValueChange`, `disabledDates`, `locale` | `default` | n/a | `onValueChange(date)` | n/a | Optional |
| DatePicker | `value`, `onValueChange`, `minDate`, `maxDate`, `disabled` | `default` | `sm`, `md`, `lg` | `onValueChange(date)` | `trigger`, `footer` | Optional |
| DateRangePicker | `value`, `onValueChange`, `minDate`, `maxDate`, `disabled` | `default` | `sm`, `md`, `lg` | `onValueChange({ from, to })` | `trigger`, `footer` | Optional |
| DateTimePicker | `value`, `onValueChange`, `minDateTime`, `maxDateTime` | `default` | `sm`, `md`, `lg` | `onValueChange(dateTime)` | `trigger`, `footer` | Optional |
| Command | `value`, `onValueChange`, `items`, `emptyState` | `default` | n/a | `onValueChange(value)`, `onSelect(value)` | `emptyState`, `itemIcon` | Optional |
| Combobox | `value`, `onValueChange`, `items`, `searchPlaceholder` | `default`, `outline` | standard set | `onValueChange(value)` | `trigger`, `emptyState` | Optional |
| PageHeader | `title`, `description`, `breadcrumbs`, `actions` | `default`, `compact` | n/a | n/a | `actions` | Optional |
| Image | `src`, `alt`, `fallback`, `fit`, `ratio` | `default` | `sm`, `md`, `lg`, `xl` | `onLoad`, `onError` | `fallback` | Optional |
| Accordion | `type`, `value`, `onValueChange`, `collapsible` | `default` | n/a | `onValueChange(value)` | `trigger`, `content` | Optional |

## Ref-Forwarding Enforcement

- Required by default for all Tier 1 components listed above.
- For Tier 2 components, forward root ref where:
  - focus management is needed (`Dialog`, `Popover`, `Command`, `Combobox`)
  - measurements/scroll anchoring are common (`Table`, `DataTable`, `NavigationMenu`)

## Migration Outcome Expectation

After this API lock:
- Apps with non-canonical prop names must migrate through adapters.
- New shared components in Batch 3 must implement this contract without introducing alternate names.
