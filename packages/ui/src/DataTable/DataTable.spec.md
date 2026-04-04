# DataTable Spec

## Metadata

| Field           | Value                                |
| --------------- | ------------------------------------ |
| Storybook Group | `Data Display`                       |
| Component Tier  | `Tier 2 (Composite)`                 |
| Structure Tier  | `Complex`                            |
| Based on        | `Table` + `@tanstack/react-table` v8 |

---

## Overview

`DataTable` is the shared advanced table foundation in `@repo/ui`. It preserves the low-level semantic `Table` primitive, then layers TanStack Table state orchestration, render helpers, and reusable shell behavior on top without absorbing domain schemas, route state, or fetch logic.

The implementation supports two real usage modes:

- Managed mode: pass `data`, `columns`, optional `state` / `defaultState`, and generic `tableOptions`.
- Controlled mode: build a table instance with `useDataTable(...)`, then render it through `DataTable` or `DataTableVirtualized`.

Stories intentionally prefer short description blocks above the table instead of semantic captions. The `caption` prop is still supported for consumers that need semantic table captions.

---

## Public Exports

### Components

- `DataTable`
- `DataTableVirtualized`
- `DataTablePagination`

### Hooks

- `useDataTable(...)`

### Utilities

- `dataTableFacetedFilterFn`
- `dataTableFuzzyFilterFn`

### Public Types

- `DataTableProps`
- `DataTableManagedProps`
- `DataTableControlledProps`
- `DataTableVirtualizedProps`
- `DataTableOptions`
- `DataTableState`
- `DataTableStateChangeHandlers`
- `DataTablePaginationConfig`
- `DataTablePaginationProps`
- `DataTableLayoutOptions`
- `DataTableRowClassName`
- `DataTableRowClassNameContext`
- `DataTableHeaderClassName`
- `DataTableHeaderClassNameContext`
- `DataTableCellClassName`
- `DataTableCellClassNameContext`
- `DataTableRenderContext`
- `DataTableStatusContext`
- `DataTableRenderable`
- `DataTableInstance`
- TanStack re-exported state and row types documented in `index.ts`

### Internal-only Storybook Utilities

The following controls exist only for Storybook demos and are not part of the public `DataTable` package surface:

- `DataTableToolbar`
- `DataTableSearch`
- `DataTableColumnFilter`
- `DataTableFacetedFilter`
- `DataTableViewOptions`
- `DataTableSelectionSummary`

They currently live in `DataTable.story-helpers.tsx`.

---

## Architecture

| Layer                     | Responsibility                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `Table`                   | Semantic table structure only                                                                                |
| `useDataTable(...)`       | State orchestration, row models, filter function registration, controlled/uncontrolled slice handling        |
| `DataTable`               | Shared render shell for standard tabular rendering                                                           |
| `DataTableVirtualized`    | Shared virtualization shell using TanStack Virtual                                                           |
| `DataTable.renderers.tsx` | Shared row/header/footer/status/pagination rendering logic                                                   |
| `DataTable.utils.ts`      | Shared table state defaults, filter helpers, layout/style helpers, sizing helpers, and renderable resolution |

The shell remains composition-first: toolbar UI, filter UI, and app workflows stay consumer-owned unless promoted deliberately into the public API.

---

## Supported Capability Scope

| Capability                                | Support | Notes                                                                                                                 |
| ----------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| Controlled and uncontrolled state slices  | Yes     | Via `state`, `defaultState`, `onStateChange`, and legacy `pagination` shorthand                                       |
| Client pagination                         | Yes     | Shared pagination UI is rendered via `DataTablePagination`                                                            |
| Manual pagination                         | Yes     | Via `tableOptions.manualPagination` and `pageCount` / `rowCount`                                                      |
| Sorting / multi-sorting                   | Yes     | Shared sort buttons and sort-order badges                                                                             |
| Column filtering                          | Yes     | State support plus story-only demo controls                                                                           |
| Global filtering                          | Yes     | State support plus story-only demo controls                                                                           |
| Fuzzy filtering                           | Yes     | Via `dataTableFuzzyFilterFn`                                                                                          |
| Column faceting                           | Yes     | Via TanStack faceting row models and `dataTableFacetedFilterFn`                                                       |
| Global faceting                           | Yes     | Exposed through the table instance                                                                                    |
| Column visibility                         | Yes     | State support; shared UI remains story-only for now                                                                   |
| Grouping                                  | Yes     | Grouped rows, aggregated cells, expand/collapse controls                                                              |
| Expansion                                 | Yes     | `renderExpandedContent` slot                                                                                          |
| Column ordering                           | Yes     | State support; UI remains consumer-owned                                                                              |
| Column pinning                            | Yes     | Sticky left/right pinned columns                                                                                      |
| Row pinning                               | Yes     | Top / center / bottom row sections                                                                                    |
| Column sizing / resizing                  | Yes     | Resize handles and state support                                                                                      |
| Row, cell, and cell-content styling hooks | Yes     | Via `getRowClassName(...)` and column `meta.headerCellClassName` / `meta.cellClassName` / `meta.cellContentClassName` |
| Sticky header / sticky footer             | Yes     | Via `layout.stickyHeader`, `layout.stickyFooter`, and `layout.maxBodyHeight`                                          |
| Virtualization                            | Yes     | Via dedicated `DataTableVirtualized` companion                                                                        |

### Intentionally Not in the Public Root API

- Shared toolbar controls are not exported.
- Route/query synchronization stays app-local.
- Fetch logic stays app-local.
- Domain-specific column factories stay app-local.
- Inline editing workflows stay app-local.

---

## Core Props

### Managed mode

```tsx
<DataTable
  data={rows}
  columns={columns}
  defaultState={{
    pagination: { pageIndex: 0, pageSize: 10 },
    sorting: [{ id: 'customer', desc: false }],
  }}
  tableOptions={{
    enableGlobalFilter: true,
    enableMultiSort: true,
    enableColumnResizing: true,
    enableRowPinning: true,
  }}
/>
```

### Controlled mode

```tsx
const table = useDataTable({
  data: rows,
  columns,
  state,
  onStateChange,
  tableOptions: {
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  },
});

<DataTable
  table={table}
  renderToolbar={(currentTable) => <MyToolbar table={currentTable} />}
  renderFooter={(currentTable) => <MyFooter table={currentTable} />}
/>;
```

### Virtualized mode

```tsx
const table = useDataTable({
  data,
  columns,
  tableOptions: { enableGlobalFilter: true },
});

<DataTableVirtualized
  table={table}
  height={420}
  estimateRowHeight={52}
  variant="shadow"
  layout={{ stickyHeader: true }}
/>;
```

### Surface variant

`DataTable` and `DataTableVirtualized` both expose `variant?: 'outline' | 'shadow'` on their shared shell props.

- `outline`: bordered viewport with no resting shadow. This is the default and the fallback when `variant` is omitted.
- `shadow`: bordered viewport with `shadow-sm` on the actual scrolling viewport container.

### Styling extensibility

```tsx
const columns: ColumnDef<InvoiceRow>[] = [
  {
    accessorKey: 'premium',
    header: 'Premium',
    meta: {
      headerCellClassName: 'text-right',
      cellClassName: 'text-right',
      cellContentClassName: 'truncate text-right',
    },
  },
];

<DataTable
  columns={columns}
  data={rows}
  getRowClassName={({ row, rowIndex }) =>
    row.original.status === 'Pending' && rowIndex % 2 === 0 ? 'bg-muted/30' : undefined
  }
/>;
```

Adapter note:

- Legacy row hooks such as `getRowClassName(item, index)` should map through `getRowClassName={({ row, rowIndex }) => legacyGetRowClassName?.(row.original, rowIndex)}`.
- Legacy column props such as `classNameHeading` and `className` should map into `columnDef.meta.headerCellClassName` and `columnDef.meta.cellClassName`.
- When the legacy styling target belongs on the overflow-aware inner content wrapper instead of the `<td>` shell, map it into `columnDef.meta.cellContentClassName`.

---

## Shared Behavior Notes

- Textual overflow in headers and primitive body-cell content uses tooltip-on-overflow behavior when the rendered output resolves to a string or number.
- Grouped rows and aggregated cells use the underlying table value for tooltip labels when the rendered cell content is wrapped in React nodes.
- `meta.headerCellClassName` styles the semantic header cell shell and the shared sortable header button so common alignment utilities keep working for sortable and non-sortable columns.
- `meta.cellClassName` styles the semantic `<td>` shell, while `meta.cellContentClassName` styles the shared inner content wrapper that owns truncation and overflow measurement.
- Row styling hooks apply to the primary rendered body row. Expanded content rows keep the shared default shell unless the consumer styles the expanded content directly.
- Sticky footer stories should avoid unnecessary horizontal overflow when the goal is to demonstrate vertical footer pinning behavior only.
- `renderStatus`, `emptyState`, and `loadingState` are separate surfaces. `renderStatus` has highest priority.
- Horizontal overflow now mirrors the shared `Tabs` affordance: edge fade cues only appear when more columns remain off-screen, align to the inner edge of any pinned left/right columns, and the custom scrollbar affordance only reveals during hover, thumb drag, or brief keyboard panning.
- Column resizing now defaults to live `onChange` feedback so width changes track the drag gesture directly. Consumers can still opt into `columnResizeMode='onEnd'` for heavier tables, and that pending-state preview keeps the full handle aligned to the drag offset instead of separating the grip from its hit area.
- Column resize handles reserve a small trailing header gutter, reveal a clearer grip on hover or focus, support drag and touch resizing, and expose keyboard resizing via Left / Right Arrow plus Delete reset on the focused separator.

---

## Accessibility

- Semantic `table`, `thead`, `tbody`, `tfoot`, `tr`, `th`, and `td` output is preserved.
- Sortable headers expose `aria-sort`.
- Loading state sets `aria-busy` on the root shell.
- Resize handles are keyboard-focusable separator controls with explicit labels, current width value semantics, and Arrow-key resizing support.
- Sticky headers, sticky footers, and pinned columns remain semantic table cells rather than div-based faux grids.
- Overflow tooltips only activate when the rendered text is actually truncated.

---

## Storybook Taxonomy

Story file title: `Data Display/DataTable`

- `Sorting`
- `ColumnOrdering`
- `ColumnPinning`
- `ColumnSizing`
- `ColumnVisibility`
- `ColumnFiltering`
- `GlobalFiltering`
- `FuzzyFiltering`
- `ColumnFaceting`
- `GlobalFaceting`
- `Grouping`
- `Expanding`
- `Pagination`
- `RowSelection`
- `RowPinning`
- `StylingHooks`
- `StickyHeader`
- `StickyFooter`
- `Virtualization`
- `SurfaceVariants`

Notes:

- `StickyHeader` stays full-width and keeps horizontal overflow where useful.
- `StickyFooter` uses the base column set so the story isolates vertical sticky-footer behavior without a horizontal scrollbar gutter.
- Storybook-only control helpers are imported from `DataTable.story-helpers.tsx`, not from the package public index.

---

## Do / Don't

| Do                                                                    | Don't                                                                          |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Use `useDataTable(...)` when advanced state ownership is needed.      | Add more public booleans for filtering, visibility, grouping, or selection UI. |
| Keep shared exports limited to the real stable API.                   | Document Storybook-only helpers as if they were package exports.               |
| Compose app-specific toolbar and footer UI through render props.      | Move route state, service hooks, or product workflow logic into `DataTable`.   |
| Use `DataTableVirtualized` when virtualization is genuinely required. | Inflate the base `DataTable` API with speculative virtualization props.        |
| Prefer external explanatory copy above the table in demos.            | Depend on story captions for behavior documentation.                           |

---

## Changelog

| Date       | Change                                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-03-13 | Initial DataTable spec                                                                                                                                                                            |
| 2026-03-14 | Expanded the shared foundation into managed + controlled shells, added virtualization companion coverage, and documented current story taxonomy                                                   |
| 2026-03-14 | Aligned the spec with the current public exports, marked toolbar/filter controls as Storybook-only utilities, documented overflow-to-tooltip behavior, and clarified sticky footer story behavior |
| 2026-03-28 | Added app-agnostic styling extensibility through `getRowClassName(...)` and column `meta.headerCellClassName` / `meta.cellClassName`, then documented the thin-adapter mapping path               |
| 2026-04-03 | Added normalized `outline` / `shadow` viewport variants with `outline` as the default shell treatment                                                                                             |
| 2026-04-03 | Added `meta.cellContentClassName` for inner body-content styling and clarified that automatic overflow tooltips on standard cells only bind to primitive rendered content                         |
| 2026-04-04 | Added pinned-aware horizontal overflow cues plus Tabs-aligned custom scrollbar affordances for both standard and virtualized DataTable viewports                                                  |
| 2026-04-04 | Improved column resizing UX with clearer handle affordance, reserved header gutter, keyboard resizing, and `onEnd` drag-preview alignment                                                         |
| 2026-04-04 | Defaulted shared DataTable resizing to live `columnResizeMode='onChange'` for more intuitive drag feedback while keeping `onEnd` as an explicit opt-in                                            |
