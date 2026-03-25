import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@repo/helper';

import { Box } from '../Box';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../DropdownMenu';
import { Input } from '../Input';
import type {
  DataTableColumnFilterProps,
  DataTableFacetedFilterProps,
  DataTableSearchProps,
  DataTableSelectionSummaryProps,
  DataTableToolbarProps,
  DataTableViewOptionsProps,
  RowData,
} from './DataTable.types';
import {
  getColumnFilterValueAsArray,
  getColumnFilterValueAsString,
  getFacetedFilterOptions,
  updateArrayFilterValue,
} from './DataTable.utils';
import {
  dataTableFacetCountVariants,
  dataTableFacetOptionCountVariants,
  dataTableFacetTriggerVariants,
  dataTableSelectionSummaryVariants,
  dataTableToolbarActionsVariants,
  dataTableToolbarGroupVariants,
  dataTableToolbarInputVariants,
  dataTableToolbarVariants,
  dataTableViewOptionsButtonVariants,
} from './DataTable.variants';

export function DataTableToolbar<TData extends RowData>({
  table,
  filterColumnId,
  filterPlaceholder = 'Filter rows...',
  actions,
  className,
  children,
  ...props
}: DataTableToolbarProps<TData>) {
  const hasLegacyFilter = Boolean(table && filterColumnId);

  if (!hasLegacyFilter && !children && !actions) {
    return null;
  }

  return (
    <Box className={cn(dataTableToolbarVariants(), className)} {...props}>
      <Box className={dataTableToolbarGroupVariants()}>
        {hasLegacyFilter ? (
          <DataTableColumnFilter
            table={table as NonNullable<typeof table>}
            columnId={filterColumnId as string}
            className={dataTableToolbarInputVariants()}
            placeholder={filterPlaceholder}
          />
        ) : null}
        {children}
      </Box>

      {actions ? <Box className={dataTableToolbarActionsVariants()}>{actions}</Box> : null}
    </Box>
  );
}

export function DataTableSearch<TData extends RowData>({
  table,
  placeholder = 'Search all columns...',
  className,
  ...props
}: DataTableSearchProps<TData>) {
  const globalFilter = table.getState().globalFilter;

  return (
    <Input
      aria-label={placeholder}
      className={cn(dataTableToolbarInputVariants(), className)}
      clearable
      placeholder={placeholder}
      value={typeof globalFilter === 'string' ? globalFilter : ''}
      onValueChange={(nextValue) => {
        table.setGlobalFilter(nextValue || undefined);
      }}
      {...props}
    />
  );
}

export function DataTableColumnFilter<TData extends RowData>({
  table,
  columnId,
  placeholder = 'Filter rows...',
  className,
  ...props
}: DataTableColumnFilterProps<TData>) {
  const column = table.getColumn(columnId);

  if (!column?.getCanFilter()) {
    return null;
  }

  return (
    <Input
      aria-label={placeholder}
      className={cn(dataTableToolbarInputVariants(), className)}
      clearable
      placeholder={placeholder}
      value={getColumnFilterValueAsString(column)}
      onValueChange={(nextValue) => {
        column.setFilterValue(nextValue || undefined);
      }}
      {...props}
    />
  );
}

export function DataTableFacetedFilter<TData extends RowData>({
  table,
  columnId,
  title,
  options,
  emptyLabel = 'No filter values',
  className,
  ...props
}: DataTableFacetedFilterProps<TData>) {
  const column = table.getColumn(columnId);
  const selectedValues = getColumnFilterValueAsArray(column);
  const resolvedOptions = options ?? getFacetedFilterOptions(column);

  if (!column?.getCanFilter()) {
    return null;
  }

  return (
    <Box className={className} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={dataTableFacetTriggerVariants()}
            rightIcon={<ChevronDown aria-hidden='true' className='h-4 w-4' />}
            variant='outline'
          >
            {title}
            {selectedValues.length ? (
              <Box as='span' className={dataTableFacetCountVariants()}>
                {selectedValues.length}
              </Box>
            ) : null}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start'>
          {resolvedOptions.length ? (
            resolvedOptions.map((option) => {
              const checked = selectedValues.includes(option.value);

              return (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={checked}
                  onCheckedChange={() => {
                    const nextValue = updateArrayFilterValue(selectedValues, option.value);
                    column.setFilterValue(nextValue.length ? nextValue : undefined);
                  }}
                >
                  <Box as='span' className='flex min-w-0 flex-1 items-center justify-between gap-3'>
                    <Box as='span' className='truncate'>
                      {option.label}
                    </Box>
                    {typeof option.count === 'number' ? (
                      <Box as='span' className={dataTableFacetOptionCountVariants()}>
                        {option.count}
                      </Box>
                    ) : null}
                  </Box>
                </DropdownMenuCheckboxItem>
              );
            })
          ) : (
            <Box as='span' className='px-2 py-1.5 text-sm text-muted-foreground'>
              {emptyLabel}
            </Box>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Box>
  );
}

export function DataTableViewOptions<TData extends RowData>({
  table,
  label = 'Columns',
  className,
  ...props
}: DataTableViewOptionsProps<TData>) {
  const hideableColumns = table.getAllLeafColumns().filter((column) => column.getCanHide());

  if (!hideableColumns.length) {
    return null;
  }

  return (
    <Box className={className} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={dataTableViewOptionsButtonVariants()}
            rightIcon={<ChevronDown aria-hidden='true' className='h-4 w-4' />}
            variant='outline'
          >
            {label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {hideableColumns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(checked) => {
                column.toggleVisibility(Boolean(checked));
              }}
            >
              {column.columnDef.header && typeof column.columnDef.header === 'string'
                ? column.columnDef.header
                : column.id}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Box>
  );
}

export function DataTableSelectionSummary<TData extends RowData>({
  table,
  singularLabel = 'row',
  pluralLabel = 'rows',
  clearLabel = 'Clear selection',
  className,
  ...props
}: DataTableSelectionSummaryProps<TData>) {
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;
  const totalVisibleRowCount = table.getFilteredRowModel().rows.length;

  if (!selectedRowCount) {
    return null;
  }

  const label = selectedRowCount === 1 ? singularLabel : pluralLabel;

  return (
    <Box className={cn(dataTableSelectionSummaryVariants(), className)} {...props}>
      <Box as='span'>
        {selectedRowCount} of {totalVisibleRowCount} visible {label} selected
      </Box>
      <Button
        size='sm'
        variant='ghost'
        onClick={() => {
          table.resetRowSelection();
        }}
      >
        {clearLabel}
      </Button>
    </Box>
  );
}

