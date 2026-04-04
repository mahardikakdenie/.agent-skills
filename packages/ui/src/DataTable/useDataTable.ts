import * as React from 'react';
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import type {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  GroupingState,
  OnChangeFn,
  PaginationState,
  RowData,
  RowPinningState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';

import type { DataTableState, UseDataTableProps } from './DataTable.types';
import {
  applyUpdater,
  createDataTableState,
  dataTableFacetedFilterFn,
  dataTableFuzzyFilterFn,
} from './DataTable.utils';

export function useDataTable<TData extends RowData, TValue = unknown>({
  data,
  columns,
  state,
  defaultState,
  onStateChange,
  pagination,
  tableOptions,
}: UseDataTableProps<TData, TValue>) {
  const [uncontrolledState, setUncontrolledState] = React.useState(() =>
    createDataTableState(defaultState, pagination),
  );

  const tablePageCount = tableOptions?.pageCount ?? pagination?.pageCount;
  const tableRowCount = tableOptions?.rowCount ?? pagination?.rowCount;
  const legacyManualPagination =
    tablePageCount !== undefined || tableRowCount !== undefined || pagination?.onPageChange !== undefined;
  const manualPagination = tableOptions?.manualPagination ?? legacyManualPagination;
  const manualSorting = tableOptions?.manualSorting ?? false;
  const manualFiltering = tableOptions?.manualFiltering ?? false;
  const manualGrouping = tableOptions?.manualGrouping ?? false;
  const manualExpanding = tableOptions?.manualExpanding ?? false;
  const legacyControlledPagination =
    state?.pagination === undefined &&
    manualPagination &&
    (pagination?.pageIndex !== undefined || pagination?.pageSize !== undefined);

  const resolvedPagination = React.useMemo<PaginationState>(() => {
    if (state?.pagination) {
      return state.pagination;
    }

    if (legacyControlledPagination) {
      return {
        pageIndex: pagination?.pageIndex ?? uncontrolledState.pagination.pageIndex,
        pageSize: pagination?.pageSize ?? uncontrolledState.pagination.pageSize,
      };
    }

    return uncontrolledState.pagination;
  }, [
    legacyControlledPagination,
    pagination?.pageIndex,
    pagination?.pageSize,
    state?.pagination,
    uncontrolledState.pagination,
  ]);

  const resolvedState = React.useMemo<DataTableState>(
    () => ({
      sorting: state?.sorting ?? uncontrolledState.sorting,
      columnFilters: state?.columnFilters ?? uncontrolledState.columnFilters,
      globalFilter: state?.globalFilter ?? uncontrolledState.globalFilter,
      columnVisibility: state?.columnVisibility ?? uncontrolledState.columnVisibility,
      rowSelection: state?.rowSelection ?? uncontrolledState.rowSelection,
      rowPinning: state?.rowPinning ?? uncontrolledState.rowPinning,
      expanded: state?.expanded ?? uncontrolledState.expanded,
      grouping: state?.grouping ?? uncontrolledState.grouping,
      columnPinning: state?.columnPinning ?? uncontrolledState.columnPinning,
      columnOrder: state?.columnOrder ?? uncontrolledState.columnOrder,
      columnSizing: state?.columnSizing ?? uncontrolledState.columnSizing,
      pagination: resolvedPagination,
    }),
    [
      resolvedPagination,
      state?.columnFilters,
      state?.columnOrder,
      state?.columnPinning,
      state?.columnSizing,
      state?.columnVisibility,
      state?.expanded,
      state?.globalFilter,
      state?.grouping,
      state?.rowPinning,
      state?.rowSelection,
      state?.sorting,
      uncontrolledState.columnFilters,
      uncontrolledState.columnOrder,
      uncontrolledState.columnPinning,
      uncontrolledState.columnSizing,
      uncontrolledState.columnVisibility,
      uncontrolledState.expanded,
      uncontrolledState.globalFilter,
      uncontrolledState.grouping,
      uncontrolledState.rowPinning,
      uncontrolledState.rowSelection,
      uncontrolledState.sorting,
    ],
  );

  const updateSlice = React.useCallback(
    <TValueSlice,>(
      key: Exclude<keyof DataTableState, 'pagination'>,
      updater: TValueSlice | ((old: TValueSlice) => TValueSlice),
      callback?: OnChangeFn<TValueSlice>,
    ) => {
      if (state?.[key] === undefined) {
        setUncontrolledState((current) => ({
          ...current,
          [key]: applyUpdater(updater, current[key] as TValueSlice),
        }));
      }

      callback?.(updater);
    },
    [state],
  );

  const handleSortingChange = React.useCallback<OnChangeFn<SortingState>>(
    (updater) => {
      updateSlice('sorting', updater, onStateChange?.onSortingChange);
    },
    [onStateChange?.onSortingChange, updateSlice],
  );

  const handleColumnFiltersChange = React.useCallback<OnChangeFn<ColumnFiltersState>>(
    (updater) => {
      updateSlice('columnFilters', updater, onStateChange?.onColumnFiltersChange);
    },
    [onStateChange?.onColumnFiltersChange, updateSlice],
  );

  const handleGlobalFilterChange = React.useCallback<OnChangeFn<unknown>>(
    (updater) => {
      updateSlice('globalFilter', updater, onStateChange?.onGlobalFilterChange);
    },
    [onStateChange?.onGlobalFilterChange, updateSlice],
  );

  const handleColumnVisibilityChange = React.useCallback<OnChangeFn<VisibilityState>>(
    (updater) => {
      updateSlice('columnVisibility', updater, onStateChange?.onColumnVisibilityChange);
    },
    [onStateChange?.onColumnVisibilityChange, updateSlice],
  );

  const handleRowSelectionChange = React.useCallback<OnChangeFn<RowSelectionState>>(
    (updater) => {
      updateSlice('rowSelection', updater, onStateChange?.onRowSelectionChange);
    },
    [onStateChange?.onRowSelectionChange, updateSlice],
  );

  const handleRowPinningChange = React.useCallback<OnChangeFn<RowPinningState>>(
    (updater) => {
      updateSlice('rowPinning', updater, onStateChange?.onRowPinningChange);
    },
    [onStateChange?.onRowPinningChange, updateSlice],
  );

  const handleExpandedChange = React.useCallback<OnChangeFn<ExpandedState>>(
    (updater) => {
      updateSlice('expanded', updater, onStateChange?.onExpandedChange);
    },
    [onStateChange?.onExpandedChange, updateSlice],
  );

  const handleGroupingChange = React.useCallback<OnChangeFn<GroupingState>>(
    (updater) => {
      updateSlice('grouping', updater, onStateChange?.onGroupingChange);
    },
    [onStateChange?.onGroupingChange, updateSlice],
  );

  const handleColumnPinningChange = React.useCallback<OnChangeFn<ColumnPinningState>>(
    (updater) => {
      updateSlice('columnPinning', updater, onStateChange?.onColumnPinningChange);
    },
    [onStateChange?.onColumnPinningChange, updateSlice],
  );

  const handleColumnOrderChange = React.useCallback<OnChangeFn<ColumnOrderState>>(
    (updater) => {
      updateSlice('columnOrder', updater, onStateChange?.onColumnOrderChange);
    },
    [onStateChange?.onColumnOrderChange, updateSlice],
  );

  const handleColumnSizingChange = React.useCallback<OnChangeFn<ColumnSizingState>>(
    (updater) => {
      updateSlice('columnSizing', updater, onStateChange?.onColumnSizingChange);
    },
    [onStateChange?.onColumnSizingChange, updateSlice],
  );

  const handlePaginationChange = React.useCallback<OnChangeFn<PaginationState>>(
    (updater) => {
      const nextPagination = applyUpdater(updater, resolvedPagination);

      if (!state?.pagination && !legacyControlledPagination) {
        setUncontrolledState((current) => ({
          ...current,
          pagination: nextPagination,
        }));
      }

      onStateChange?.onPaginationChange?.(updater);

      if (nextPagination.pageIndex !== resolvedPagination.pageIndex) {
        pagination?.onPageChange?.(nextPagination.pageIndex);
      }

      if (nextPagination.pageSize !== resolvedPagination.pageSize) {
        pagination?.onPageSizeChange?.(nextPagination.pageSize);
      }
    },
    [legacyControlledPagination, onStateChange, pagination, resolvedPagination, state?.pagination],
  );

  const mergedFilterFns = React.useMemo(
    () => ({
      dataTableFaceted: dataTableFacetedFilterFn,
      dataTableFuzzy: dataTableFuzzyFilterFn,
      ...tableOptions?.filterFns,
    }),
    [tableOptions?.filterFns],
  );

  return useReactTable({
    data,
    columns,
    state: resolvedState,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onGlobalFilterChange: handleGlobalFilterChange,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onRowSelectionChange: handleRowSelectionChange,
    onRowPinningChange: handleRowPinningChange,
    onExpandedChange: handleExpandedChange,
    onGroupingChange: handleGroupingChange,
    onColumnPinningChange: handleColumnPinningChange,
    onColumnOrderChange: handleColumnOrderChange,
    onColumnSizingChange: handleColumnSizingChange,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    getExpandedRowModel: manualExpanding ? undefined : getExpandedRowModel(),
    getGroupedRowModel: manualGrouping ? undefined : getGroupedRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    autoResetPageIndex: tableOptions?.autoResetPageIndex,
    columnResizeMode: tableOptions?.columnResizeMode ?? 'onChange',
    defaultColumn: tableOptions?.defaultColumn,
    debugAll: tableOptions?.debugAll,
    debugColumns: tableOptions?.debugColumns,
    debugHeaders: tableOptions?.debugHeaders,
    debugRows: tableOptions?.debugRows,
    debugTable: tableOptions?.debugTable,
    enableColumnFilters: tableOptions?.enableColumnFilters,
    enableColumnPinning: tableOptions?.enableColumnPinning,
    enableColumnResizing: tableOptions?.enableColumnResizing,
    enableExpanding: tableOptions?.enableExpanding,
    enableFilters: tableOptions?.enableFilters,
    enableGlobalFilter: tableOptions?.enableGlobalFilter,
    enableGrouping: tableOptions?.enableGrouping,
    enableMultiRowSelection: tableOptions?.enableMultiRowSelection,
    enableMultiSort: tableOptions?.enableMultiSort,
    enablePinning: tableOptions?.enablePinning,
    enableRowPinning: tableOptions?.enableRowPinning,
    enableRowSelection: tableOptions?.enableRowSelection,
    enableSubRowSelection: tableOptions?.enableSubRowSelection,
    filterFns: mergedFilterFns,
    getRowCanExpand: tableOptions?.getRowCanExpand,
    getRowId: tableOptions?.getRowId,
    getSubRows: tableOptions?.getSubRows,
    globalFilterFn: tableOptions?.globalFilterFn ?? 'includesString',
    keepPinnedRows: tableOptions?.keepPinnedRows,
    manualExpanding,
    manualFiltering,
    manualGrouping,
    manualPagination,
    manualSorting,
    meta: tableOptions?.meta,
    pageCount: manualPagination ? tablePageCount : undefined,
    rowCount: manualPagination ? tableRowCount : undefined,
    paginateExpandedRows: tableOptions?.paginateExpandedRows,
  });
}

