import * as React from 'react';
import { type RowData } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

import { cn } from '@repo/helper';

import { Box } from '../Box';
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
  createDataTableRenderContext,
  createDataTableStatusContext,
  DataTableBodyRow,
  DataTableDefaultEmptyState,
  DataTableDefaultLoadingState,
  DataTablePagination,
  getDefaultLoadingRowCount,
  getSortDirectionLabel,
  renderDataTableFooters,
  renderDataTableHeader,
  renderDataTableStatusRow,
} from './DataTable.renderers';
import {
  dataTablePaginationShellVariants,
  dataTableResizeHandleVariants,
  dataTableRootVariants,
  dataTableStatusCellVariants,
  dataTableViewportVariants,
} from './DataTable.variants';
import type { DataTableVirtualizedProps } from './DataTable.types';
import {
  getHeaderCellStyles,
  resolveDataTableClassName,
  getTableStyle,
  getViewportStyle,
  resolvePageSizeOptions,
  resolveRenderable,
  toCssDimension,
} from './DataTable.utils';

type DataTableVirtualizedRenderShellProps<TData extends RowData> = DataTableVirtualizedProps<TData> & {
  rootRef?: React.ForwardedRef<HTMLDivElement>;
};

function DataTableVirtualizedRenderShell<TData extends RowData>({
  rootRef,
  table,
  height,
  estimateRowHeight = 52,
  overscan = 8,
  loading = false,
  getRowClassName,
  renderToolbar,
  renderPagination,
  renderStatus,
  emptyState,
  loadingState,
  pageSizeOptions,
  caption,
  className,
  layout,
  renderFooter,
  ...props
}: DataTableVirtualizedRenderShellProps<TData>) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const toolbarContent = renderToolbar?.(table);
  const customPagination = renderPagination?.(table);
  const resolvedPageSizeOptions = resolvePageSizeOptions(pageSizeOptions);
  const renderContext = createDataTableRenderContext(table, resolvedPageSizeOptions);
  const visibleColumnCount = renderContext.visibleColumnCount;
  const sortingCount = table.getState().sorting.length;
  const loadingRowCount = getDefaultLoadingRowCount(table);
  const topRows = table.getTopRows();
  const centerRows = table.getCenterRows();
  const bottomRows = table.getBottomRows();
  const displayedRowCount = topRows.length + centerRows.length + bottomRows.length;
  const statusContext = createDataTableStatusContext({
    renderContext,
    loading,
    isEmpty: displayedRowCount === 0,
  });
  const customStatus = renderStatus?.(statusContext);
  const resolvedLoadingState = resolveRenderable(loadingState, renderContext);
  const resolvedEmptyState = resolveRenderable(emptyState, renderContext);
  const footerContent = renderDataTableFooters({
    table,
    layout,
    renderFooter,
  });
  const shouldShowPagination = !loading && table.getRowCount() > 0;
  const rowVirtualizer = useVirtualizer({
    count: centerRows.length,
    getScrollElement: () => viewportRef.current,
    estimateSize: () => estimateRowHeight,
    overscan,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();
  const topPaddingHeight = virtualRows[0]?.start ?? 0;
  const bottomPaddingHeight = virtualRows.length
    ? rowVirtualizer.getTotalSize() - (virtualRows[virtualRows.length - 1]?.end ?? 0)
    : 0;

  return (
    <Box
      ref={rootRef}
      data-slot='data-table-virtualized'
      aria-busy={loading || undefined}
      className={cn(dataTableRootVariants(), className)}
      {...props}
    >
      {toolbarContent}

      <Box
        ref={viewportRef}
        data-slot='data-table-viewport'
        className={dataTableViewportVariants()}
        style={{
          ...getViewportStyle(layout),
          height: toCssDimension(height),
        }}
      >
        <Table style={getTableStyle(table)}>
          {caption ? <TableCaption>{caption}</TableCaption> : null}

          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const resizeHandler = header.getResizeHandler();
                  const headerCellClassName = resolveDataTableClassName(
                    header.column.columnDef.meta?.headerCellClassName,
                    {
                      header,
                      column: header.column,
                      table,
                    },
                  );

                  return (
                    <TableHead
                      key={header.id}
                      aria-sort={
                        header.column.getCanSort()
                          ? getSortDirectionLabel(header.column.getIsSorted())
                          : undefined
                      }
                      className={cn(
                        header.column.getIsPinned() ? 'bg-background' : undefined,
                        header.column.getCanResize() ? 'relative' : undefined,
                        headerCellClassName,
                      )}
                      colSpan={header.colSpan}
                      scope='col'
                      style={getHeaderCellStyles(header.column, layout)}
                    >
                      {renderDataTableHeader(header, sortingCount, headerCellClassName)}
                      {header.column.getCanResize() ? (
                        <Box
                          as='button'
                          type='button'
                          aria-label={`Resize ${header.column.id} column`}
                          className={dataTableResizeHandleVariants({
                            resizing: header.column.getIsResizing(),
                          })}
                          onDoubleClick={() => {
                            header.column.resetSize();
                          }}
                          onMouseDown={resizeHandler}
                          onTouchStart={resizeHandler}
                        />
                      ) : null}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {customStatus ? (
              renderDataTableStatusRow(customStatus, visibleColumnCount)
            ) : loading ? (
              resolvedLoadingState ? (
                renderDataTableStatusRow(resolvedLoadingState, visibleColumnCount)
              ) : (
                <DataTableDefaultLoadingState
                  columnCount={visibleColumnCount}
                  rowCount={loadingRowCount}
                />
              )
            ) : displayedRowCount ? (
              <>
                {topRows.map((row, rowIndex) => (
                  <DataTableBodyRow
                    key={row.id}
                    getRowClassName={getRowClassName}
                    row={row}
                    rowIndex={rowIndex}
                    table={table}
                    visibleColumnCount={visibleColumnCount}
                  />
                ))}
                {topPaddingHeight > 0 ? (
                  <TableRow aria-hidden='true'>
                    <TableCell
                      colSpan={visibleColumnCount}
                      className='h-0 border-0 p-0'
                      style={{ height: `${topPaddingHeight}px` }}
                    />
                  </TableRow>
                ) : null}
                {virtualRows.map((virtualRow) => {
                  const row = centerRows[virtualRow.index];

                  if (!row) {
                    return null;
                  }

                  return (
                    <DataTableBodyRow
                      key={row.id}
                      getRowClassName={getRowClassName}
                      row={row}
                      rowIndex={topRows.length + virtualRow.index}
                      table={table}
                      visibleColumnCount={visibleColumnCount}
                    />
                  );
                })}
                {bottomPaddingHeight > 0 ? (
                  <TableRow aria-hidden='true'>
                    <TableCell
                      colSpan={visibleColumnCount}
                      className='h-0 border-0 p-0'
                      style={{ height: `${bottomPaddingHeight}px` }}
                    />
                  </TableRow>
                ) : null}
                {bottomRows.map((row, rowIndex) => (
                  <DataTableBodyRow
                    key={row.id}
                    getRowClassName={getRowClassName}
                    row={row}
                    rowIndex={topRows.length + centerRows.length + rowIndex}
                    table={table}
                    visibleColumnCount={visibleColumnCount}
                  />
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumnCount} className={dataTableStatusCellVariants()}>
                  {resolvedEmptyState ?? (
                    <DataTableDefaultEmptyState filtered={renderContext.hasActiveFilters} />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {footerContent}
        </Table>
      </Box>

      {shouldShowPagination ? (
        customPagination ?? (
          <Box className={dataTablePaginationShellVariants()}>
            <DataTablePagination pageSizeOptions={resolvedPageSizeOptions} table={table} />
          </Box>
        )
      ) : null}
    </Box>
  );
}

type DataTableVirtualizedComponent = <TData extends RowData>(
  props: DataTableVirtualizedProps<TData> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null;

const DataTableVirtualizedImpl = React.forwardRef<
  HTMLDivElement,
  DataTableVirtualizedProps<RowData>
>((props, ref) => <DataTableVirtualizedRenderShell {...props} rootRef={ref} />);

DataTableVirtualizedImpl.displayName = 'DataTableVirtualized';

export const DataTableVirtualized = DataTableVirtualizedImpl as DataTableVirtualizedComponent;
