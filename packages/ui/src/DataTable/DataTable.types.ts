import type * as React from 'react';
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Table as TanStackTable,
  VisibilityState,
} from '@tanstack/react-table';

export type DataTableInstance<TData> = TanStackTable<TData>;

export interface DataTablePaginationConfig {
  pageIndex?: number;
  pageSize?: number;
  pageCount?: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface DataTableProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  loading?: boolean;
  renderToolbar?: (table: DataTableInstance<TData>) => React.ReactNode;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
  pagination?: DataTablePaginationConfig;
  pageSizeOptions?: number[];
  caption?: React.ReactNode;
}

export interface DataTableToolbarProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: DataTableInstance<TData>;
  filterColumnId: string;
  filterPlaceholder?: string;
  actions?: React.ReactNode;
}

export interface DataTablePaginationProps<TData> extends React.HTMLAttributes<HTMLElement> {
  table: DataTableInstance<TData>;
  pageSizeOptions?: number[];
}

export type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
};
