import { ArrowDown, ArrowUp, ArrowUpDown, Inbox, SearchX } from 'lucide-react';
import * as React from 'react';
import {
  flexRender,
  functionalUpdate,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type Updater,
  type VisibilityState,
} from '@tanstack/react-table';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { Input } from '../Input';
import { Pagination } from '../Pagination';
import { Skeleton } from '../Skeleton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../Table';
import {
  dataTableEmptyStateVariants,
  dataTableEmptyTitleVariants,
  dataTablePaginationShellVariants,
  dataTableRootVariants,
  dataTableSkeletonCellVariants,
  dataTableSkeletonRowVariants,
  dataTableSortButtonVariants,
  dataTableSortIconVariants,
  dataTableStatusCellVariants,
  dataTableStatusContentVariants,
  dataTableToolbarActionsVariants,
  dataTableToolbarInputVariants,
  dataTableToolbarVariants,
  dataTableViewportVariants,
} from './DataTable.variants';
import type {
  DataTablePaginationProps,
  DataTableProps,
  DataTableToolbarProps,
} from './DataTable.types';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50];
const DEFAULT_LOADING_ROW_COUNT = 4;
const SKELETON_WIDTHS = ['w-12', 'w-20', 'w-24', 'w-28', 'w-32', 'w-36'];

function resolvePageSizeOptions(pageSizeOptions?: number[]) {
  if (!pageSizeOptions?.length) {
    return DEFAULT_PAGE_SIZE_OPTIONS;
  }

  return pageSizeOptions;
}

function getSortDirectionLabel(sortDirection: false | 'asc' | 'desc') {
  if (sortDirection === 'asc') {
    return 'ascending';
  }

  if (sortDirection === 'desc') {
    return 'descending';
  }

  return 'none';
}

function hasMeaningfulFilterValue(value: unknown) {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value !== null && value !== undefined && value !== false;
}

function getSkeletonWidthClass(rowIndex: number, cellIndex: number) {
  return SKELETON_WIDTHS[(rowIndex + cellIndex) % SKELETON_WIDTHS.length] ?? 'w-24';
}

function DataTableSortIcon({
  sortDirection,
}: {
  sortDirection: false | 'asc' | 'desc';
}) {
  if (sortDirection === 'asc') {
    return <ArrowUp aria-hidden="true" className={dataTableSortIconVariants()} />;
  }

  if (sortDirection === 'desc') {
    return <ArrowDown aria-hidden="true" className={dataTableSortIconVariants()} />;
  }

  return <ArrowUpDown aria-hidden="true" className={dataTableSortIconVariants()} />;
}

function DataTableDefaultEmptyState({
  filtered,
}: {
  filtered: boolean;
}) {
  const EmptyIcon = filtered ? SearchX : Inbox;

  return (
    <Box data-slot="data-table-empty-state" className={dataTableEmptyStateVariants()}>
      <Box
        data-slot="data-table-empty-icon-shell"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted/45 text-muted-foreground"
      >
        <EmptyIcon aria-hidden="true" className="h-4.5 w-4.5" />
      </Box>
      <Box as="span" className={dataTableEmptyTitleVariants()}>
        {filtered ? 'No matching rows' : 'No records yet'}
      </Box>
      <Box as="span" className="max-w-[26rem] text-sm leading-6 text-muted-foreground text-pretty">
        {filtered
          ? 'Adjust or clear filters to see results.'
          : 'Records will appear here when available.'}
      </Box>
    </Box>
  );
}

function DataTableDefaultLoadingState({
  columnCount,
  rowCount,
}: {
  columnCount: number;
  rowCount: number;
}) {
  return (
    <>
      {Array.from({ length: rowCount }, (_, rowIndex) => (
        <TableRow key={`loading-row-${rowIndex}`} data-slot="data-table-loading-row">
          {Array.from({ length: columnCount }, (_, cellIndex) => (
            <TableCell
              key={`loading-cell-${rowIndex}-${cellIndex}`}
              className={dataTableSkeletonCellVariants()}
            >
              <Box className={dataTableSkeletonRowVariants()}>
                {rowIndex === 0 && cellIndex === 0 ? (
                  <Box as="span" className="sr-only">
                    Loading table rows
                  </Box>
                ) : null}
                <Skeleton className={cn('h-4 max-w-full rounded-full', getSkeletonWidthClass(rowIndex, cellIndex))} />
              </Box>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

/**
 * Shared toolbar helper for the common "filter one column plus actions" data-table pattern.
 */
export function DataTableToolbar<TData>({
  table,
  filterColumnId,
  filterPlaceholder = 'Filter rows...',
  actions,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const filterColumn = table.getColumn(filterColumnId);
  const canFilter = Boolean(filterColumn?.getCanFilter());
  const rawFilterValue = filterColumn?.getFilterValue();
  const filterValue = typeof rawFilterValue === 'string' ? rawFilterValue : '';

  if (!canFilter && !actions) {
    return null;
  }

  return (
    <Box className={cn(dataTableToolbarVariants(), className)} {...props}>
      {canFilter ? (
        <Input
          aria-label={filterPlaceholder}
          className={dataTableToolbarInputVariants()}
          clearable
          placeholder={filterPlaceholder}
          value={filterValue}
          onValueChange={(nextValue) => {
            filterColumn?.setFilterValue(nextValue || undefined);
          }}
        />
      ) : null}

      {actions ? <Box className={dataTableToolbarActionsVariants()}>{actions}</Box> : null}
    </Box>
  );
}

/**
 * Shared pagination helper that adapts a TanStack table instance onto the shared Pagination primitive.
 */
export function DataTablePagination<TData>({
  table,
  pageSizeOptions,
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const resolvedPageSizeOptions = resolvePageSizeOptions(pageSizeOptions);
  const pageCount = Math.max(table.getPageCount(), 1);
  const pageSize = table.getState().pagination.pageSize;
  const canChangePageSize = resolvedPageSizeOptions.length > 1;

  if (pageCount <= 1 && !canChangePageSize) {
    return null;
  }

  return (
    <Box
      as="section"
      data-slot="data-table-pagination"
      className={cn(dataTablePaginationShellVariants(), className)}
      {...props}
    >
      <Pagination
        currentPage={table.getState().pagination.pageIndex + 1}
        pageSize={pageSize}
        pageSizeOptions={resolvedPageSizeOptions}
        totalPages={pageCount}
        onPageChange={(page) => {
          table.setPageIndex(page - 1);
        }}
        onPageSizeChange={
          canChangePageSize
            ? (nextPageSize) => {
                table.setPageSize(nextPageSize);
              }
            : undefined
        }
      />
    </Box>
  );
}

type DataTableComponent = <TData, TValue = unknown>(
  props: DataTableProps<TData, TValue> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null;

const DataTableImpl = React.forwardRef<HTMLDivElement, DataTableProps<unknown, unknown>>(
  (
    {
      data,
      columns,
      loading = false,
      renderToolbar,
      emptyState,
      loadingState,
      pagination,
      pageSizeOptions,
      caption,
      className,
      ...props
    },
    ref,
  ) => {
    const isControlledPagination =
      typeof pagination?.onPageChange === 'function' && typeof pagination?.pageCount === 'number';
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [internalPagination, setInternalPagination] = React.useState<PaginationState>(() => ({
      pageIndex: pagination?.pageIndex ?? 0,
      pageSize: pagination?.pageSize ?? DEFAULT_PAGE_SIZE,
    }));
    const resolvedPagination = React.useMemo<PaginationState>(
      () =>
        isControlledPagination
          ? {
              pageIndex: pagination?.pageIndex ?? 0,
              pageSize: pagination?.pageSize ?? DEFAULT_PAGE_SIZE,
            }
          : internalPagination,
      [internalPagination, isControlledPagination, pagination?.pageIndex, pagination?.pageSize],
    );
    const resolvedPageSizeOptions = resolvePageSizeOptions(pageSizeOptions);

    const handlePaginationChange = React.useCallback(
      (updater: Updater<PaginationState>) => {
        const nextPagination = functionalUpdate(updater, resolvedPagination);

        if (isControlledPagination) {
          if (nextPagination.pageIndex !== resolvedPagination.pageIndex) {
            pagination?.onPageChange?.(nextPagination.pageIndex);
          }

          if (nextPagination.pageSize !== resolvedPagination.pageSize) {
            pagination?.onPageSizeChange?.(nextPagination.pageSize);
          }

          return;
        }

        setInternalPagination(nextPagination);

        if (nextPagination.pageSize !== resolvedPagination.pageSize) {
          pagination?.onPageSizeChange?.(nextPagination.pageSize);
        }
      },
      [isControlledPagination, pagination, resolvedPagination],
    );

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: isControlledPagination ? undefined : getPaginationRowModel(),
      manualPagination: isControlledPagination,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onPaginationChange: handlePaginationChange,
      onSortingChange: setSorting,
      pageCount: isControlledPagination ? pagination?.pageCount : undefined,
      state: {
        columnFilters,
        columnVisibility,
        pagination: resolvedPagination,
        sorting,
      },
    });

    const visibleColumnCount = Math.max(table.getVisibleLeafColumns().length, 1);
    const rowModel = table.getRowModel().rows;
    const toolbarContent = renderToolbar?.(table);
    const hasActiveFilters = table.getState().columnFilters.some((filter) =>
      hasMeaningfulFilterValue(filter.value),
    );
    const loadingRowCount = Math.min(
      Math.max(resolvedPagination.pageSize, DEFAULT_LOADING_ROW_COUNT),
      5,
    );
    const shouldShowPagination = !loading && rowModel.length > 0;

    return (
      <Box
        ref={ref}
        data-slot="data-table"
        aria-busy={loading || undefined}
        className={cn(dataTableRootVariants(), className)}
        {...props}
      >
        {toolbarContent}

        <Box data-slot="data-table-viewport" className={dataTableViewportVariants()}>
          <Table>
            {caption ? <TableCaption>{caption}</TableCaption> : null}

            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const sortDirection = header.column.getIsSorted();
                    const canSort = header.column.getCanSort();

                    return (
                      <TableHead
                        key={header.id}
                        aria-sort={canSort ? getSortDirectionLabel(sortDirection) : undefined}
                        colSpan={header.colSpan}
                        scope="col"
                      >
                        {header.isPlaceholder ? null : canSort ? (
                          <Box
                            as="button"
                            type="button"
                            className={dataTableSortButtonVariants({
                              sortable: canSort,
                              sorted: Boolean(sortDirection),
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <Box as="span" className="min-w-0 flex-1 truncate">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </Box>
                            <DataTableSortIcon sortDirection={sortDirection} />
                          </Box>
                        ) : (
                          <Box as="span" className="flex min-w-0 items-center gap-2">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </Box>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading ? (
                loadingState ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumnCount} className={dataTableStatusCellVariants()}>
                      <Box data-slot="data-table-loading" className={dataTableStatusContentVariants()}>
                        {loadingState}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  <DataTableDefaultLoadingState
                    columnCount={visibleColumnCount}
                    rowCount={loadingRowCount}
                  />
                )
              ) : rowModel.length ? (
                rowModel.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={visibleColumnCount} className={dataTableStatusCellVariants()}>
                    {emptyState ?? <DataTableDefaultEmptyState filtered={hasActiveFilters} />}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {shouldShowPagination ? (
          <DataTablePagination pageSizeOptions={resolvedPageSizeOptions} table={table} />
        ) : null}
      </Box>
    );
  },
);

DataTableImpl.displayName = 'DataTable';

/**
 * Headless data-table wrapper composed from TanStack Table plus the shared Table and Pagination primitives.
 */
export const DataTable = DataTableImpl as DataTableComponent;
