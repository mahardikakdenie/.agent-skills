import type { RowData } from '@tanstack/react-table';
import * as React from 'react';

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
import type {
  DataTableControlledProps,
  DataTableInstance,
  DataTableManagedProps,
  DataTableProps,
  DataTableShellProps,
} from './DataTable.types';
import {
  getHeaderCellStyles,
  getPinnedColumnOffsetSizes,
  getTableStyle,
  getViewportStyle,
  resolveDataTableClassName,
  resolvePageSizeOptions,
  resolveRenderable,
} from './DataTable.utils';
import {
  dataTablePaginationShellVariants,
  dataTableRootVariants,
  dataTableStatusCellVariants,
} from './DataTable.variants';
import { DataTableResizeHandle } from './DataTable.resize';
import { useDataTable } from './useDataTable';
import { DataTableViewport } from './DataTable.viewport';

type DataTableRenderShellProps<TData extends RowData> = DataTableShellProps<TData> & {
  rootRef?: React.ForwardedRef<HTMLDivElement>;
  table: DataTableInstance<TData>;
};

function DataTableRenderShell<TData extends RowData>({
  rootRef,
  table,
  variant = 'outline',
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
  const { leftPinnedWidth, rightPinnedWidth } = getPinnedColumnOffsetSizes(table);

  return (
    <Box
      ref={rootRef}
      data-slot="data-table"
      aria-busy={loading || undefined}
      className={cn(dataTableRootVariants(), className)}
      {...props}
    >
      {toolbarContent}

      <DataTableViewport
        variant={variant}
        leftCueInset={leftPinnedWidth}
        rightCueInset={rightPinnedWidth}
        style={getViewportStyle(layout)}
      >
        <Table style={getTableStyle(table)}>
          {caption ? <TableCaption>{caption}</TableCaption> : null}

          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const headerCellClassName = resolveDataTableClassName(
                    header.column.columnDef.meta?.headerCellClassName,
                    {
                      header,
                      column: header.column,
                      table,
                    },
                  );
                  const headerContentClassName = resolveDataTableClassName(
                    header.column.columnDef.meta?.headerContentClassName,
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
                        header.column.getCanResize()
                          ? 'group/data-table-resize relative select-none pr-5'
                          : undefined,
                        headerCellClassName,
                      )}
                      colSpan={header.colSpan}
                      scope="col"
                      style={getHeaderCellStyles(header.column, layout)}
                    >
                      {renderDataTableHeader(header, sortingCount, headerContentClassName)}
                      {header.column.getCanResize() ? (
                        <DataTableResizeHandle header={header} table={table} />
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
                <DataTableDefaultLoadingState table={table} rowCount={loadingRowCount} />
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
            ) : resolvedEmptyState ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnCount}
                  className={cn(dataTableStatusCellVariants(), 'p-0')}
                >
                  {resolvedEmptyState}
                </TableCell>
              </TableRow>
            ) : (
              renderDataTableStatusRow(
                <DataTableDefaultEmptyState filtered={renderContext.hasActiveFilters} />,
                visibleColumnCount,
              )
            )}
          </TableBody>

          {footerContent}
        </Table>
      </DataTableViewport>

      {shouldShowPagination
        ? (customPagination ?? (
            <Box className={dataTablePaginationShellVariants()}>
              <DataTablePagination pageSizeOptions={resolvedPageSizeOptions} table={table} />
            </Box>
          ))
        : null}
    </Box>
  );
}

const ManagedDataTable = React.forwardRef<HTMLDivElement, DataTableManagedProps<RowData, unknown>>(
  (
    { data, columns, state, defaultState, onStateChange, pagination, tableOptions, ...props },
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
