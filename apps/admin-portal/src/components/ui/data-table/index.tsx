import Image from 'next/image';
import React from 'react';
import { ChevronLeft, ChevronRight, Search } from 'react-feather';

import {
  Box,
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui';

import { cn } from '@/lib/utils';

import { ContentLoadingWrapper } from '../loading';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  classNameHeading?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pagination?: {
    page: number;
    totalPages: number;
    rowsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    rowsPerPageOptions?: number[];
  };
  search?: {
    placeholder?: string;
    onSearch: (value: string) => void;
  };
  noDataImage?: any;
  noDataText?: string;
  className?: string;
  getRowClassName?: (item: T, index: number) => string;
  loading?: boolean;
  density?: 'default' | 'compact';
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pagination,
  search,
  noDataImage,
  noDataText = 'No data available',
  className = '',
  getRowClassName,
  loading = false,
  density = 'default',
}: DataTableProps<T>) {
  const rowsPerPageId = React.useId();
  const isCompact = density === 'compact';

  const renderCell = (item: T, column: Column<T>, index: number) => {
    if (column.render) {
      return column.render(item, index);
    }

    const getValue = (obj: any, path: string) => {
      return path.split('.').reduce((current, key) => current?.[key], obj);
    };

    const value = getValue(item, column.key);
    return value ?? '-';
  };

  const defaultRowsPerPageOptions = [10, 20, 30, 50, 100];
  const totalPages = pagination ? Math.max(pagination.totalPages, 1) : 1;

  const handleRowsPerPageValueChange = (value?: string) => {
    if (!pagination || !value) {
      return;
    }

    pagination.onRowsPerPageChange({
      target: { value },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <Box
      className={cn(
        'w-full rounded-2xl border border-slate-200/80 bg-white',
        isCompact ? 'px-3 pt-3 pb-0 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.55)]' : 'p-4',
      )}
    >
      {search && (
        <Box className={cn('w-full mb-4', isCompact && 'mb-3')}>
          <Input
            type="text"
            placeholder={search.placeholder || 'Search...'}
            aria-label={search.placeholder || 'Search'}
            onChange={(e) => search.onSearch(e.target.value)}
            className={cn(
              'text-sm',
              isCompact
                ? 'h-10 rounded-xl border-slate-200 bg-slate-50/70 shadow-none'
                : 'h-12 shadow-sm',
            )}
            rightIcon={<Search aria-hidden="true" className="h-4 w-4 text-[#016da1]" />}
          />
        </Box>
      )}

      <Table className={cn(isCompact ? 'table-fixed' : 'table-auto', 'w-full', className)}>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  'whitespace-nowrap py-2',
                  isCompact &&
                    'h-10 bg-slate-50/85 px-4 text-sm font-semibold capitalize text-slate-500',
                  column.classNameHeading,
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow className="hover:!bg-white">
              <TableCell colSpan={columns.length}>
                <ContentLoadingWrapper isLoading={loading}>
                  <Box className="h-[300px]" />
                </ContentLoadingWrapper>
              </TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((item, index) => (
              <TableRow
                key={index}
                className={cn(
                  isCompact && 'border-slate-200/80 transition-colors hover:!bg-slate-50/80',
                  getRowClassName ? getRowClassName(item, index) : '',
                )}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      isCompact && 'px-4 py-3 text-[13px] leading-5 text-slate-700',
                      column.className,
                    )}
                  >
                    {renderCell(item, column, index)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:!bg-white">
              <TableCell colSpan={columns.length}>
                <Box className="flex flex-col gap-4 items-center justify-center py-14">
                  {noDataImage && <Image alt="no data" src={noDataImage} width={200} />}
                  {noDataText}
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        {pagination && (
          <TableFooter className="bg-white">
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className={cn(
                  'px-4 pt-4 pb-3',
                  isCompact && 'border-t border-slate-200/80 bg-white pt-4 pb-4',
                )}
              >
                <Box className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <Box className="flex flex-wrap items-center gap-2 text-sm font-normal text-slate-500">
                    <Box as="label" htmlFor={rowsPerPageId} className="font-medium text-slate-600">
                      Showing:
                    </Box>
                    <Select
                      value={pagination.rowsPerPage.toString()}
                      onValueChange={handleRowsPerPageValueChange}
                      size={isCompact ? 'sm' : 'md'}
                      className="w-[5.5rem]"
                    >
                      <SelectTrigger
                        id={rowsPerPageId}
                        className={cn(
                          'w-[5.5rem] rounded-xl border-slate-200 bg-white px-3 shadow-sm hover:border-slate-300',
                          isCompact &&
                            'h-8 min-h-8 rounded-lg bg-slate-50/80 px-2.5 text-xs shadow-none',
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {(pagination.rowsPerPageOptions || defaultRowsPerPageOptions).map(
                            (option) => (
                              <SelectItem key={option} value={option.toString()}>
                                {option}
                              </SelectItem>
                            ),
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Box as="span">
                      of{' '}
                      <Box as="span" className="text-slate-900">
                        {pagination.totalItems}
                      </Box>{' '}
                      items
                    </Box>
                  </Box>

                  <Box className="flex items-center justify-between gap-3 md:justify-end">
                    <Box
                      as="span"
                      className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400"
                    >
                      Page {pagination.page} of {totalPages}
                    </Box>
                    <Box className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => pagination.onPageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        title="Prev"
                        aria-label="Go to previous page"
                        className={cn(
                          'h-9 w-9 rounded-full border-slate-200 p-0 text-slate-600 transition-all enabled:hover:-translate-y-px enabled:hover:border-sky-200 enabled:hover:bg-sky-50 enabled:hover:text-sky-700 enabled:hover:shadow-sm',
                          isCompact && 'h-8 w-8',
                        )}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => pagination.onPageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        title="Next"
                        aria-label="Go to next page"
                        className={cn(
                          'h-9 w-9 rounded-full border-slate-200 p-0 text-slate-600 transition-all enabled:hover:-translate-y-px enabled:hover:border-sky-200 enabled:hover:bg-sky-50 enabled:hover:text-sky-700 enabled:hover:shadow-sm',
                          isCompact && 'h-8 w-8',
                        )}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </Box>
  );
}
