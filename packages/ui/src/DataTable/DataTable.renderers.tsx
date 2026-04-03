import { flexRender, type Cell, type Header, type Row, type RowData } from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Inbox,
  SearchX,
} from 'lucide-react';
import * as React from 'react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { Pagination } from '../Pagination';
import { Skeleton } from '../Skeleton';
import { TableCell, TableFooter, TableRow } from '../Table';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';
import type {
  DataTableInstance,
  DataTableLayoutOptions,
  DataTablePaginationProps,
  DataTableRenderContext,
  DataTableRowClassName,
  DataTableStatusContext,
} from './DataTable.types';
import {
  DEFAULT_LOADING_ROW_COUNT,
  getFooterCellStyles,
  getPinnedColumnStyles,
  getSkeletonWidthClass,
  getSortDirectionLabel,
  hasMeaningfulFilterValue,
  resolveDataTableClassName,
  resolvePageSizeOptions,
} from './DataTable.utils';
import {
  dataTableEmptyStateVariants,
  dataTableEmptyTitleVariants,
  dataTableExpandedContentCellVariants,
  dataTableGroupedCellCountVariants,
  dataTableGroupedCellVariants,
  dataTableGroupedToggleVariants,
  dataTableHeaderContentVariants,
  dataTablePaginationMetaVariants,
  dataTableSkeletonCellVariants,
  dataTableSkeletonRowVariants,
  dataTableSortButtonVariants,
  dataTableSortIconVariants,
  dataTableSortIndexVariants,
  dataTableStatusCellVariants,
  dataTableStatusContentVariants,
} from './DataTable.variants';

function DataTableSortIcon({ sortDirection }: { sortDirection: false | 'asc' | 'desc' }) {
  if (sortDirection === 'asc') {
    return <ArrowUp aria-hidden="true" className={dataTableSortIconVariants()} />;
  }

  if (sortDirection === 'desc') {
    return <ArrowDown aria-hidden="true" className={dataTableSortIconVariants()} />;
  }

  return <ArrowUpDown aria-hidden="true" className={dataTableSortIconVariants()} />;
}

export function DataTableDefaultEmptyState({ filtered }: { filtered: boolean }) {
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

export function DataTableDefaultLoadingState<TData extends RowData>({
  table,
  rowCount,
}: {
  table: DataTableInstance<TData>;
  rowCount: number;
}) {
  const visibleColumns = table.getVisibleLeafColumns();

  return (
    <>
      {Array.from({ length: rowCount }, (_, rowIndex) => (
        <TableRow key={`loading-row-${rowIndex}`} data-slot="data-table-loading-row">
          {visibleColumns.map((column, cellIndex) => (
            <TableCell
              key={`loading-cell-${rowIndex}-${column.id}`}
              className={cn(
                dataTableSkeletonCellVariants(),
                typeof column.columnDef.meta?.cellClassName === 'string'
                  ? column.columnDef.meta.cellClassName
                  : undefined,
              )}
            >
              {rowIndex === 0 && cellIndex === 0 ? (
                <Box as="span" className="sr-only">
                  Loading table rows
                </Box>
              ) : null}
              {column.columnDef.meta?.loadingSkeleton ? (
                <Box className="min-w-0 max-w-full">{column.columnDef.meta.loadingSkeleton}</Box>
              ) : (
                <Box className={dataTableSkeletonRowVariants()}>
                  <Skeleton
                    className={cn(
                      'h-4 max-w-full rounded-full',
                      column.columnDef.meta?.loadingSkeletonClassName ??
                        getSkeletonWidthClass(rowIndex, cellIndex),
                    )}
                  />
                </Box>
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function withOverflowTooltip(content: React.ReactNode, className: string) {
  const resolvedClassName = cn('block min-w-0 max-w-full', className);

  if (typeof content !== 'string' && typeof content !== 'number') {
    return (
      <Box as="div" className={resolvedClassName}>
        {content}
      </Box>
    );
  }

  return (
    <DataTableOverflowTooltip className={resolvedClassName} label={String(content)}>
      {content}
    </DataTableOverflowTooltip>
  );
}

function withInlineOverflowTooltip(content: React.ReactNode, className: string) {
  const resolvedClassName = cn('block min-w-0 max-w-full', className);

  if (typeof content !== 'string' && typeof content !== 'number') {
    return (
      <Box as="span" className={resolvedClassName}>
        {content}
      </Box>
    );
  }

  return (
    <DataTableInlineOverflowTooltip className={resolvedClassName} label={String(content)}>
      {content}
    </DataTableInlineOverflowTooltip>
  );
}

function DataTableOverflowTooltip({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = React.useState(false);

  React.useEffect(() => {
    const element = contentRef.current;

    if (!element) {
      return undefined;
    }

    const updateOverflowState = () => {
      setIsOverflowing(
        element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight,
      );
    };

    const animationFrameId = window.requestAnimationFrame(updateOverflowState);

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateOverflowState);

      return () => {
        window.cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', updateOverflowState);
      };
    }

    const resizeObserver = new ResizeObserver(() => {
      updateOverflowState();
    });

    resizeObserver.observe(element);

    if (element.parentElement) {
      resizeObserver.observe(element.parentElement);
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [label]);

  return (
    <Tooltip disabled={!isOverflowing}>
      <TooltipTrigger asChild>
        <Box ref={contentRef} as="div" className={className}>
          {children}
        </Box>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function DataTableInlineOverflowTooltip({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  const contentRef = React.useRef<HTMLSpanElement | null>(null);
  const [isOverflowing, setIsOverflowing] = React.useState(false);

  React.useEffect(() => {
    const element = contentRef.current;

    if (!element) {
      return undefined;
    }

    const updateOverflowState = () => {
      setIsOverflowing(
        element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight,
      );
    };

    const animationFrameId = window.requestAnimationFrame(updateOverflowState);

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateOverflowState);

      return () => {
        window.cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', updateOverflowState);
      };
    }

    const resizeObserver = new ResizeObserver(() => {
      updateOverflowState();
    });

    resizeObserver.observe(element);

    if (element.parentElement) {
      resizeObserver.observe(element.parentElement);
    }

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [label]);

  return (
    <Tooltip disabled={!isOverflowing}>
      <TooltipTrigger asChild>
        <Box ref={contentRef} as="span" className={className}>
          {children}
        </Box>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function getOverflowTooltipLabel(value: unknown) {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return null;
}

export function createDataTableRenderContext<TData extends RowData>(
  table: DataTableInstance<TData>,
  pageSizeOptions: number[],
): DataTableRenderContext<TData> {
  return {
    table,
    visibleColumnCount: Math.max(table.getVisibleLeafColumns().length, 1),
    hasActiveFilters:
      table.getState().columnFilters.some((filter) => hasMeaningfulFilterValue(filter.value)) ||
      hasMeaningfulFilterValue(table.getState().globalFilter),
    pageSizeOptions,
  };
}

export function createDataTableStatusContext<TData extends RowData>({
  renderContext,
  loading,
  isEmpty,
}: {
  renderContext: DataTableRenderContext<TData>;
  loading: boolean;
  isEmpty: boolean;
}): DataTableStatusContext<TData> {
  return {
    ...renderContext,
    loading,
    isEmpty,
  };
}

export function renderDataTableHeader<TData extends RowData>(
  header: Header<TData, unknown>,
  sortingCount: number,
  headerContentClassName?: string,
) {
  const sortDirection = header.column.getIsSorted();
  const canSort = header.column.getCanSort();
  const sortIndex = sortingCount > 1 ? header.column.getSortIndex() : -1;

  if (header.isPlaceholder) {
    return null;
  }

  const renderedHeader = flexRender(header.column.columnDef.header, header.getContext());

  if (!canSort) {
    return withInlineOverflowTooltip(
      renderedHeader,
      cn(dataTableHeaderContentVariants(), headerContentClassName),
    );
  }

  return (
    <Box
      as="button"
      type="button"
      className={cn(
        dataTableSortButtonVariants({
          sortable: canSort,
          sorted: Boolean(sortDirection),
        }),
        headerContentClassName,
      )}
      onClick={header.column.getToggleSortingHandler()}
    >
      {withInlineOverflowTooltip(renderedHeader, 'min-w-0 flex-1 truncate')}
      {sortIndex > -1 ? (
        <Box as="span" className={dataTableSortIndexVariants()}>
          {sortIndex + 1}
        </Box>
      ) : null}
      <DataTableSortIcon sortDirection={sortDirection} />
    </Box>
  );
}

export function renderDataTableCellContent<TData extends RowData>(
  row: Row<TData>,
  cell: Cell<TData, unknown>,
) {
  const cellContentClassName = cell.column.columnDef.meta?.cellContentClassName ?? 'truncate';

  if (cell.getIsGrouped()) {
    const groupedContent = flexRender(cell.column.columnDef.cell, cell.getContext());
    const groupedTooltipLabel = getOverflowTooltipLabel(cell.getValue());

    return (
      <Box className={dataTableGroupedCellVariants()}>
        {row.getCanExpand() ? (
          <Box
            as="button"
            type="button"
            aria-label={row.getIsExpanded() ? 'Collapse grouped row' : 'Expand grouped row'}
            className={dataTableGroupedToggleVariants()}
            onClick={row.getToggleExpandedHandler()}
          >
            {row.getIsExpanded() ? (
              <ChevronDown aria-hidden="true" className="h-4 w-4" />
            ) : (
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            )}
          </Box>
        ) : null}
        {groupedTooltipLabel ? (
          <DataTableOverflowTooltip
            className={cn('block min-w-0 flex-1', cellContentClassName)}
            label={groupedTooltipLabel}
          >
            {groupedContent}
          </DataTableOverflowTooltip>
        ) : (
          <Box as="div" className={cn('block min-w-0 flex-1', cellContentClassName)}>
            {groupedContent}
          </Box>
        )}
        <Box as="span" className={dataTableGroupedCellCountVariants()}>
          {row.subRows.length}
        </Box>
      </Box>
    );
  }

  if (cell.getIsAggregated()) {
    const aggregatedContent = flexRender(
      cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
      cell.getContext(),
    );
    const aggregatedTooltipLabel = getOverflowTooltipLabel(cell.getValue());

    if (aggregatedTooltipLabel) {
      return (
        <DataTableOverflowTooltip className={cellContentClassName} label={aggregatedTooltipLabel}>
          {aggregatedContent}
        </DataTableOverflowTooltip>
      );
    }

    return withOverflowTooltip(aggregatedContent, cellContentClassName);
  }

  if (cell.getIsPlaceholder()) {
    return null;
  }

  const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext());
  const cellTooltipLabel = getOverflowTooltipLabel(cell.getValue());
  const isPrimitiveCellContent = typeof cellContent === 'string' || typeof cellContent === 'number';

  if (cellTooltipLabel && isPrimitiveCellContent) {
    return (
      <DataTableOverflowTooltip className={cellContentClassName} label={cellTooltipLabel}>
        {cellContent}
      </DataTableOverflowTooltip>
    );
  }

  return withOverflowTooltip(cellContent, cellContentClassName);
}

export function DataTableBodyRow<TData extends RowData>({
  getRowClassName,
  row,
  rowIndex,
  table,
  visibleColumnCount,
  renderExpandedContent,
}: {
  getRowClassName?: DataTableRowClassName<TData>;
  row: Row<TData>;
  rowIndex: number;
  table: DataTableInstance<TData>;
  visibleColumnCount: number;
  renderExpandedContent?: (row: Row<TData>, table: DataTableInstance<TData>) => React.ReactNode;
}) {
  const isPinnedRow = row.getIsPinned();
  const isSelectedRow = row.getIsSelected();
  const resolvedRowClassName = getRowClassName?.({
    row,
    rowIndex,
    table,
  });

  return (
    <React.Fragment key={row.id}>
      <TableRow
        data-pinned-row={isPinnedRow ? 'true' : undefined}
        data-state={isSelectedRow ? 'selected' : undefined}
        className={cn(
          '[--data-table-pinned-bg-base:hsl(var(--background))] [--data-table-pinned-bg-overlay:none] hover:[--data-table-pinned-bg-overlay:linear-gradient(0deg,_hsl(var(--muted)/0.5),_hsl(var(--muted)/0.5))] data-[state=selected]:[--data-table-pinned-bg-base:hsl(var(--muted))] data-[state=selected]:[--data-table-pinned-bg-overlay:none] data-[state=selected]:hover:[--data-table-pinned-bg-base:hsl(var(--muted))] data-[state=selected]:hover:[--data-table-pinned-bg-overlay:none] data-[pinned-row=true]:[--data-table-pinned-bg-base:hsl(var(--muted))] data-[pinned-row=true]:[--data-table-pinned-bg-overlay:none] bg-background',
          isPinnedRow ? 'bg-muted/20' : undefined,
          resolvedRowClassName,
        )}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            data-pinned-cell={cell.column.getIsPinned() ? 'true' : undefined}
            className={cn(
              cell.column.getIsPinned() ? 'relative overflow-hidden bg-background' : undefined,
              resolveDataTableClassName(cell.column.columnDef.meta?.cellClassName, {
                cell,
                row,
                rowIndex,
                column: cell.column,
                table,
              }),
            )}
            style={getPinnedColumnStyles(cell.column)}
          >
            {renderDataTableCellContent(row, cell)}
          </TableCell>
        ))}
      </TableRow>

      {renderExpandedContent && row.getIsExpanded() ? (
        <TableRow data-state={row.getIsSelected() ? 'selected' : undefined}>
          <TableCell
            colSpan={visibleColumnCount}
            className={dataTableExpandedContentCellVariants()}
          >
            {renderExpandedContent(row, table)}
          </TableCell>
        </TableRow>
      ) : null}
    </React.Fragment>
  );
}

export function renderDataTableStatusRow(content: React.ReactNode, visibleColumnCount: number) {
  return (
    <TableRow>
      <TableCell colSpan={visibleColumnCount} className={dataTableStatusCellVariants()}>
        <Box data-slot="data-table-status" className={dataTableStatusContentVariants()}>
          {content}
        </Box>
      </TableCell>
    </TableRow>
  );
}

export function getDefaultLoadingRowCount<TData extends RowData>(table: DataTableInstance<TData>) {
  return Math.min(Math.max(table.getState().pagination.pageSize, DEFAULT_LOADING_ROW_COUNT), 6);
}

export function renderDataTableFooters<TData extends RowData>({
  table,
  layout,
  renderFooter,
}: {
  table: DataTableInstance<TData>;
  layout?: DataTableLayoutOptions;
  renderFooter?: (table: DataTableInstance<TData>) => React.ReactNode;
}) {
  const footerGroups = table.getFooterGroups();
  const hasColumnFooters = footerGroups.some((group) =>
    group.headers.some(
      (header) => !header.isPlaceholder && header.column.columnDef.footer !== undefined,
    ),
  );
  const customFooter = renderFooter?.(table);

  if (!hasColumnFooters && !customFooter) {
    return null;
  }

  return (
    <TableFooter
      className={cn(
        layout?.stickyFooter
          ? 'sticky -bottom-px translate-y-px z-10 bg-background shadow-[0_-1px_0_hsl(var(--border)),0_1px_0_hsl(var(--background))]'
          : undefined,
      )}
    >
      {hasColumnFooters
        ? footerGroups.map((footerGroup) => (
            <TableRow key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  colSpan={header.colSpan}
                  className={cn(header.column.getIsPinned() ? 'bg-background' : undefined)}
                  style={getFooterCellStyles(header.column, layout)}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.footer, header.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        : null}
      {customFooter}
    </TableFooter>
  );
}

export function DataTablePagination<TData extends RowData>({
  table,
  pageSizeOptions,
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const resolvedPageSizeOptions = resolvePageSizeOptions(pageSizeOptions);
  const pageCount = Math.max(table.getPageCount(), 1);
  const pageSize = table.getState().pagination.pageSize;
  const pageIndex = table.getState().pagination.pageIndex;
  const rowCount = table.getRowCount();
  const pageStart = rowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const pageEnd = Math.min((pageIndex + 1) * pageSize, rowCount);
  const canChangePageSize = resolvedPageSizeOptions.length > 1;

  if (pageCount <= 1 && !canChangePageSize) {
    return null;
  }

  return (
    <Box
      as="section"
      data-slot="data-table-pagination"
      className={cn('pt-1', className)}
      {...props}
    >
      <Box className={dataTablePaginationMetaVariants()}>
        <Box as="p" className="text-sm text-muted-foreground">
          Showing{' '}
          <Box as="span" className="font-medium text-foreground tabular-nums">
            {pageStart}
          </Box>
          -
          <Box as="span" className="font-medium text-foreground tabular-nums">
            {pageEnd}
          </Box>{' '}
          of{' '}
          <Box as="span" className="font-medium text-foreground tabular-nums">
            {rowCount}
          </Box>
        </Box>
      </Box>
      <Pagination
        currentPage={pageIndex + 1}
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

export { getSortDirectionLabel };
