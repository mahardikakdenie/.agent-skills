import * as React from 'react';
import type { RowData } from '@tanstack/react-table';

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
import { useDataTable } from './useDataTable';
import {
  dataTablePaginationShellVariants,
  dataTableResizeHandleVariants,
  dataTableRootVariants,
  dataTableStatusCellVariants,
  dataTableViewportVariants,
} from './DataTable.variants';
import type {
  DataTableControlledProps,
  DataTableInstance,
  DataTableManagedProps,
  DataTableProps,
  DataTableShellProps,
} from './DataTable.types';
import {
  getHeaderCellStyles,
  resolveDataTableClassName,
  getTableStyle,
  getViewportStyle,
  resolvePageSizeOptions,
  resolveRenderable,
} from './DataTable.utils';

type DataTableRenderShellProps<TData extends RowData> = DataTableShellProps<TData> & {
  rootRef?: React.ForwardedRef<HTMLDivElement>;
  table: DataTableInstance<TData>;
};

function DataTableRenderShell<TData extends RowData>({
  rootRef,
  table,
  loading = false,
  getRowClassName,
  renderToolbar,
  renderPagination,
  renderStatus,
  emptyState,
  loadingState,
  renderExpandedContent,
  pageSizeOptions,
  caption,
  className,
  layout,
  renderFooter,
  ...props
}: DataTableRenderShellProps<TData>) {
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

  return (
    <Box
      ref={rootRef}
      data-slot='data-table'
      aria-busy={loading || undefined}
      className={cn(dataTableRootVariants(), className)}
      {...props}
    >
      {toolbarContent}

      <Box
        data-slot='data-table-viewport'
        className={dataTableViewportVariants()}
        style={getViewportStyle(layout)}
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
                    renderExpandedContent={renderExpandedContent}
                  />
                ))}
                {centerRows.map((row, rowIndex) => (
                  <DataTableBodyRow
                    key={row.id}
                    getRowClassName={getRowClassName}
                    row={row}
                    rowIndex={topRows.length + rowIndex}
                    table={table}
                    visibleColumnCount={visibleColumnCount}
                    renderExpandedContent={renderExpandedContent}
                  />
                ))}
                {bottomRows.map((row, rowIndex) => (
                  <DataTableBodyRow
                    key={row.id}
                    getRowClassName={getRowClassName}
                    row={row}
                    rowIndex={topRows.length + centerRows.length + rowIndex}
                    table={table}
                    visibleColumnCount={visibleColumnCount}
                    renderExpandedContent={renderExpandedContent}
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

const ManagedDataTable = React.forwardRef<HTMLDivElement, DataTableManagedProps<RowData, unknown>>(
  (
    {
      data,
      columns,
      state,
      defaultState,
      onStateChange,
      pagination,
      tableOptions,
      ...props
    },
    ref,
  ) => {
    const table = useDataTable({
      data,
      columns,
      state,
      defaultState,
      onStateChange,
      pagination,
      tableOptions,
    });

    return <DataTableRenderShell rootRef={ref} table={table} {...props} />;
  },
);

ManagedDataTable.displayName = 'ManagedDataTable';

function isControlledDataTable<TData extends RowData, TValue = unknown>(
  props: DataTableProps<TData, TValue>,
): props is DataTableControlledProps<TData> {
  return 'table' in props;
}

type DataTableComponent = <TData extends RowData, TValue = unknown>(
  props: DataTableProps<TData, TValue> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null;

const DataTableImpl = React.forwardRef<HTMLDivElement, DataTableProps<RowData, unknown>>(
  (props, ref) => {
    if (isControlledDataTable(props)) {
      const { table, ...shellProps } = props;

      return <DataTableRenderShell rootRef={ref} table={table} {...shellProps} />;
    }

    return <ManagedDataTable ref={ref} {...props} />;
  },
);

DataTableImpl.displayName = 'DataTable';

export const DataTable = DataTableImpl as DataTableComponent;
