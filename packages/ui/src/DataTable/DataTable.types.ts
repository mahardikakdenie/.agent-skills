import type {
  Cell,
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  FilterFn,
  FilterFnOption,
  GroupingState,
  Header,
  OnChangeFn,
  PaginationState,
  Row,
  RowData,
  RowPinningState,
  RowSelectionState,
  SortingState,
  Table as TanStackTable,
  TableOptions,
  VisibilityState,
} from '@tanstack/react-table';
import type * as React from 'react';

import type { InputProps } from '../Input';
import type { DisplaySurfaceVariant } from '../utils/display-surface-variants';

export type DataTableInstance<TData> = TanStackTable<TData>;

export interface DataTableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: unknown;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
  rowPinning: RowPinningState;
  expanded: ExpandedState;
  grouping: GroupingState;
  columnPinning: ColumnPinningState;
  columnOrder: ColumnOrderState;
  columnSizing: ColumnSizingState;
  pagination: PaginationState;
}

export interface DataTableStateChangeHandlers {
  onSortingChange?: OnChangeFn<SortingState>;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  onGlobalFilterChange?: OnChangeFn<unknown>;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onRowPinningChange?: OnChangeFn<RowPinningState>;
  onExpandedChange?: OnChangeFn<ExpandedState>;
  onGroupingChange?: OnChangeFn<GroupingState>;
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>;
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>;
  onColumnSizingChange?: OnChangeFn<ColumnSizingState>;
  onPaginationChange?: OnChangeFn<PaginationState>;
}

export interface DataTablePaginationConfig {
  pageIndex?: number;
  pageSize?: number;
  pageCount?: number;
  rowCount?: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface DataTableOptions<TData extends RowData> extends Pick<
  TableOptions<TData>,
  | 'autoResetPageIndex'
  | 'columnResizeMode'
  | 'defaultColumn'
  | 'debugAll'
  | 'debugColumns'
  | 'debugHeaders'
  | 'debugRows'
  | 'debugTable'
  | 'enableColumnFilters'
  | 'enableColumnPinning'
  | 'enableColumnResizing'
  | 'enableExpanding'
  | 'enableFilters'
  | 'enableGlobalFilter'
  | 'enableGrouping'
  | 'enableMultiRowSelection'
  | 'enableMultiSort'
  | 'enablePinning'
  | 'enableRowPinning'
  | 'enableRowSelection'
  | 'enableSorting'
  | 'enableSubRowSelection'
  | 'filterFns'
  | 'getRowCanExpand'
  | 'getRowId'
  | 'getSubRows'
  | 'globalFilterFn'
  | 'keepPinnedRows'
  | 'manualExpanding'
  | 'manualGrouping'
  | 'meta'
  | 'paginateExpandedRows'
> {
  manualFiltering?: boolean;
  manualPagination?: boolean;
  manualSorting?: boolean;
  pageCount?: number;
  rowCount?: number;
}

export interface DataTableLayoutOptions {
  maxBodyHeight?: number | string;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
}

export interface DataTableRenderContext<TData extends RowData> {
  table: DataTableInstance<TData>;
  visibleColumnCount: number;
  hasActiveFilters: boolean;
  pageSizeOptions: number[];
}

export interface DataTableStatusContext<
  TData extends RowData,
> extends DataTableRenderContext<TData> {
  loading: boolean;
  isEmpty: boolean;
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

export type DataTableRenderable<TData extends RowData> =
  | React.ReactNode
  | ((context: DataTableRenderContext<TData>) => React.ReactNode);

export interface DataTableShellProps<
  TData extends RowData,
> extends React.HTMLAttributes<HTMLDivElement> {
  variant?: DisplaySurfaceVariant;
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

export interface UseDataTableProps<TData extends RowData, TValue = unknown> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  state?: Partial<DataTableState>;
  defaultState?: Partial<DataTableState>;
  onStateChange?: DataTableStateChangeHandlers;
  pagination?: DataTablePaginationConfig;
  tableOptions?: DataTableOptions<TData>;
}

export interface DataTableManagedProps<TData extends RowData, TValue = unknown>
  extends DataTableShellProps<TData>, UseDataTableProps<TData, TValue> {
  table?: never;
}

export interface DataTableControlledProps<
  TData extends RowData,
> extends DataTableShellProps<TData> {
  table: DataTableInstance<TData>;
  data?: never;
  columns?: never;
  state?: never;
  defaultState?: never;
  onStateChange?: never;
  pagination?: never;
  tableOptions?: never;
}

export interface DataTableVirtualizedProps<TData extends RowData> extends Omit<
  DataTableShellProps<TData>,
  'renderExpandedContent'
> {
  table: DataTableInstance<TData>;
  height: number;
  estimateRowHeight?: number;
  overscan?: number;
}

export type DataTableProps<TData extends RowData, TValue = unknown> =
  | DataTableControlledProps<TData>
  | DataTableManagedProps<TData, TValue>;

export interface DataTableToolbarProps<
  TData extends RowData,
> extends React.HTMLAttributes<HTMLDivElement> {
  table?: DataTableInstance<TData>;
  filterColumnId?: string;
  filterPlaceholder?: string;
  actions?: React.ReactNode;
}

export interface DataTableSearchProps<TData extends RowData> extends Omit<
  InputProps,
  'value' | 'defaultValue' | 'onChange' | 'onValueChange' | 'label' | 'helperText' | 'error'
> {
  table: DataTableInstance<TData>;
}

export interface DataTableColumnFilterProps<TData extends RowData> extends Omit<
  InputProps,
  'value' | 'defaultValue' | 'onChange' | 'onValueChange' | 'label' | 'helperText' | 'error'
> {
  table: DataTableInstance<TData>;
  columnId: string;
}

export interface DataTableFacetedFilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface DataTableFacetedFilterProps<
  TData extends RowData,
> extends React.HTMLAttributes<HTMLDivElement> {
  table: DataTableInstance<TData>;
  columnId: string;
  title: string;
  options?: DataTableFacetedFilterOption[];
  emptyLabel?: string;
}

export interface DataTableViewOptionsProps<
  TData extends RowData,
> extends React.HTMLAttributes<HTMLDivElement> {
  table: DataTableInstance<TData>;
  label?: string;
}

export interface DataTableSelectionSummaryProps<
  TData extends RowData,
> extends React.HTMLAttributes<HTMLDivElement> {
  table: DataTableInstance<TData>;
  singularLabel?: string;
  pluralLabel?: string;
  clearLabel?: string;
}

export interface DataTablePaginationProps<
  TData extends RowData,
> extends React.HTMLAttributes<HTMLElement> {
  table: DataTableInstance<TData>;
  pageSizeOptions?: number[];
}

export type DataTableFilterFn<TData extends RowData> = FilterFn<TData>;
export type DataTableFilterFnOption<TData extends RowData> = FilterFnOption<TData>;

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

export type {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  FilterFn,
  FilterFnOption,
  GroupingState,
  OnChangeFn,
  PaginationState,
  Row,
  RowData,
  RowPinningState,
  RowSelectionState,
  SortingState,
  VisibilityState,
};
