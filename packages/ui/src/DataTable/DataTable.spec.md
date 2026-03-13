# DataTable Spec

## Metadata

| Field | Value |
| --- | --- |
| Storybook Group | `Data Display` |
| Component Tier | `Tier 2 (Composite)` |
| Structure Tier | `Complex` |
| Based on | `Table` + `@tanstack/react-table` v8 |

---

## Overview

`DataTable` is the shared headless data-display layer that sits on top of the shipped `Table` primitive in `@repo/ui`. It owns generic TanStack Table state for client-side sorting, column filtering, and pagination, then renders those states through the shared `Table` and `Pagination` surfaces so downstream apps can converge on one structural table contract without pushing domain schemas, fetch logic, or route behavior into the shared package.

The contract is intentionally narrower than several app-local baselines. It covers typed `ColumnDef` columns, loading and empty states, optional toolbar composition, and shared pagination behavior. It does not absorb domain column factories, remote fetching, expandable workflow rows, retry logic, bulk actions, or route-linked table state. Those stay local and compose on top of the shared table shell.

**When to use:**

- Use it for generic list, report, and admin tables where rows and columns can be expressed through plain data plus TanStack `ColumnDef`s.
- Use `renderToolbar` when the table needs shared filtering or column-visibility controls without widening the root API with dedicated booleans.
- Use `pagination` when the parent owns server-side paging state but still wants the shared footer controls.

**When NOT to use:**

- Do not move domain-specific column factories, service hooks, or route/query synchronization into `DataTable`.
- Keep row expansion, nested trees, bulk workflow actions, and domain retry/error shells local unless a later contract amendment promotes them.
- Do not use `DataTable` when a semantic `Table` plus fully consumer-owned markup is sufficient.

---

## Design Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Primitive stack | `@tanstack/react-table` v8 + shared `Table` + shared `Pagination` | Meets the mandated library choice while preserving the shared semantic table surface already delivered in Wave B4. |
| Public API shape | Flat root props plus helper sub-components | Keeps the root contract small while exposing optional composition points for filtering and pagination without turning empty states into a second action API. |
| Sorting model | Internal client-side sorting | Covers the roadmap sorting requirement without forcing apps to wire state for the common case. |
| Filtering model | Internal column-filter state + consumer-composed toolbar | Avoids a dedicated `searchable` or `filterable` boolean while still letting stories and apps compose shared filter controls. |
| Pagination model | Controlled or uncontrolled | Supports both local page state and parent-owned server paging without two separate components. |
| Sub-components | `DataTableToolbar`, `DataTablePagination` | Follows the taxonomy guidance for common table shell helpers without turning the whole contract into a large namespace API. |
| Loading state | skeleton rows by default + optional `loadingState` slot | Keeps table structure stable during refreshes while still allowing apps to override the visible loading treatment when needed. |
| Box-only DOM rule | explicit | All authored wrappers, buttons, status rows, and stories must render through `Box`; TanStack itself is headless, so there is no third-party DOM boundary. |

---

## Props Interface

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `data` | `TData[]` | - | Yes | Current row data for the table. In controlled pagination mode this should already be the current page slice. |
| `columns` | `ColumnDef<TData, TValue>[]` | - | Yes | Typed TanStack column definitions that control headers, cells, and sorting/filter behavior. |
| `loading` | `boolean` | `false` | No | Shows the shared loading row and marks the table busy. |
| `renderToolbar` | `(table: DataTableInstance<TData>) => React.ReactNode` | `undefined` | No | Optional composition hook for filters, column toggles, and actions. |
| `emptyState` | `React.ReactNode` | icon + title + supporting line empty state | No | Replaces the default empty-state row content entirely. Use this only when the shared default empty shell is not sufficient. |
| `loadingState` | `React.ReactNode` | shared skeleton table rows | No | Replaces the default loading treatment when a custom row state is needed. |
| `pagination` | `DataTablePaginationConfig` | uncontrolled internal pagination | No | Optional pagination config for controlled or uncontrolled paging. |
| `pageSizeOptions` | `number[]` | `[10, 20, 50]` | No | Shared page-size options used by the footer controls. |
| `caption` | `React.ReactNode` | `undefined` | No | Optional semantic table caption rendered through the shared `TableCaption`. |
| `className` | `string` | `undefined` | No | Consumer override merged last on the outer wrapper through `cn()`. |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | - | No | Extra wrapper attributes such as `id`, `data-*`, and `aria-*`. |

### Complex Prop Shapes

```ts
export interface DataTablePaginationConfig {
  pageIndex?: number;
  pageSize?: number;
  pageCount?: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface DataTableToolbarProps<TData> {
  table: DataTableInstance<TData>;
  filterColumnId: string;
  filterPlaceholder?: string;
  actions?: React.ReactNode;
}
```

---

## Variants

`DataTable` deliberately has no public `variant`, `size`, or `dense` props. Baseline review and composition-pattern evaluation showed that those needs are better expressed through column definitions, `className`, helper slots, and the already-shared `Table` structure.

| Composition path | Description | When to use |
| --- | --- | --- |
| Default | Shared headless sorting/filtering/pagination on top of tokenized table structure | General admin and reporting tables |
| Loading | Default skeleton rows preserve the table grid while data is refreshing | Row sets that are refreshing in place without collapsing the layout |
| Empty | Shared full-width row with a restrained icon, concise heading, supporting line, or consumer-supplied `emptyState` | No-result filter states and first-load empty data |
| Toolbar | Optional filter/action row via `renderToolbar` | Search, column toggles, and inline table actions |
| Controlled pagination | Parent-owned `pageIndex` / `pageCount` | Server-side or route-synchronized page state |
| Uncontrolled pagination | Internal TanStack pagination | Small and medium client-side table shells |

---

## States

| State | Visual Behavior | Accessibility |
| --- | --- | --- |
| Default | Shared table shell with header rows, body rows, and footer controls when pagination is needed | Native table semantics remain intact |
| Sorting | Sortable headers render an inline button and indicator icon | Header cells expose `aria-sort` and keyboard-reachable sort buttons |
| Filtering | Consumer toolbar drives column filter state through the table instance | Filter controls stay labelled and keyboard reachable |
| Loading | Skeleton rows keep headers and cell rhythm visible during refresh | Wrapper exposes `aria-busy="true"` while decorative skeletons stay inside semantic table rows |
| Empty | One full-width body row shows an icon-led empty-state message with one supporting line | Empty content stays inside semantic rows/cells and remains easy to scan |
| Pagination | Shared footer pager appears only when rows are visible and paging controls are relevant | Footer buttons keep visible labels and keyboard semantics through `Pagination` without conflicting with empty states |

---

## Compound Sub-components

| Sub-component | Purpose | Key props |
| --- | --- | --- |
| `DataTableToolbar` | Shared helper for one-column filtering plus toolbar actions | `table`, `filterColumnId`, `filterPlaceholder`, `actions` |
| `DataTablePagination` | Shared helper that adapts a TanStack table instance to the `Pagination` primitive | `table`, `pageSizeOptions` |

---

## Accessibility

- `DataTable` preserves the semantic `table`, `thead`, `tbody`, `tr`, `th`, and `td` structure by composing the shared `Table` primitive rather than replacing it with div-based grids.
- Sortable headers expose `aria-sort` on the semantic header cell and keep the interactive toggle inside a keyboard-focusable button.
- Loading and empty states stay inside semantic body rows and cells instead of swapping the table out for non-tabular fallback markup, with default skeleton rows preserving column rhythm during busy states and a compact empty-state icon improving scanability without introducing app-specific art direction or excess copy.
- The root wrapper exposes `aria-busy="true"` while loading so assistive technology receives a clear busy signal.
- Toolbar controls remain consumer-composed, but the shared `DataTableToolbar` helper labels its filter input and keeps clear/search interactions keyboard reachable.
- The footer pager hides automatically when no rows are visible, preventing pagination chrome from competing with empty-state messaging.

### Keyboard Map

| Key | Behavior |
| --- | --- |
| `Tab` | Moves between sortable header buttons, toolbar controls, and pagination controls |
| `Enter` / `Space` | Activates a sortable header button or footer control |
| `Shift+Tab` | Moves focus backwards through toolbar, header, and footer controls |

---

## Box-only DOM Policy

- All authored DOM in `DataTable`, `DataTableToolbar`, `DataTablePagination`, and the Storybook stories must render through `Box`.
- Semantic table output is delegated to the shared `Table` primitive, which already authors native table elements through `Box as="..."`.
- Do not hand-write native JSX tags such as `div`, `button`, `input`, `table`, `tr`, `th`, or `td` in the shared implementation or authored stories for this component.

---

## Usage Examples

### 1. Basic usage

```tsx
<DataTable columns={columns} data={rows} caption="Recent invoices" />
```

### 2. With shared filter toolbar

```tsx
<DataTable
  columns={columns}
  data={rows}
  renderToolbar={(table) => (
    <DataTableToolbar
      table={table}
      filterColumnId="customer"
      filterPlaceholder="Filter customers..."
    />
  )}
/>
```

### 3. Controlled pagination

```tsx
<DataTable
  columns={columns}
  data={pageRows}
  pagination={{
    pageIndex,
    pageSize,
    pageCount,
    onPageChange: setPageIndex,
    onPageSizeChange: setPageSize,
  }}
/>
```

### 4. Loading state

```tsx
<DataTable columns={columns} data={[]} loading />
```\n\nThe default busy state renders shared skeleton rows. Pass `loadingState` only when a custom full-width table state is genuinely needed.

---

## Do / Don't

| Do | Don't |
| --- | --- |
| Re-export TanStack table types from `@repo/ui` so apps do not import `@tanstack/react-table` directly for common types. | Make apps depend on direct TanStack imports for ordinary DataTable usage. |
| Compose filtering and actions through `renderToolbar` instead of widening the root API with multiple booleans. | Add `searchable`, `filterable`, `showToolbar`, or `showPagination` booleans to the shared root contract. |
| Keep domain column definitions and data fetching in the consuming app. | Move service hooks, route state, or business-specific cells into `packages/ui`. |
| Keep empty and loading treatment inside semantic table rows, and hide irrelevant footer chrome while empty. | Replace the whole table with non-tabular fallback markup or leave pagination visible in obviously empty states. |
| Use the shared `Pagination` primitive for page navigation. | Hand-roll a second pager UI inside `DataTable`. |
| Keep authored JSX Box-only. | Introduce direct native tags in the shared source or stories. |

---

## Storybook Stories Required

**Story file title:** `'Data Display/DataTable'`

- [x] `Basic`
- [x] `Sorting`
- [x] `Filtering`
- [x] `Empty`
- [x] `Pagination`
- [x] `LoadingState`

Roadmap alignment:

- `DataTable.Basic` -> `Basic`
- `DataTable.Sorting` -> `Sorting`
- `DataTable.Filtering` -> `Filtering`
- `DataTable.Empty` -> `Empty`
- `DataTable.Pagination` -> `Pagination`

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-03-13 | Initial DataTable spec |
