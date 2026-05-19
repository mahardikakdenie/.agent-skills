'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import { useMemo, type ChangeEvent } from 'react';
import { Plus } from 'react-feather';

import {
  Box,
  Button,
  DataTable,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';

import { createHolidayTableColumns } from '@/components/table-config/holiday-date-table-config';
import { CompactTablePagination } from '@/components/core/compact-table-pagination';
import { useHolidayDate } from '@/hooks/useHolidayDate.hooks';

let tableMeasureContext: CanvasRenderingContext2D | null = null;

function measureTextWidth(label: string, font: string, fallbackCharWidth: number) {
  if (typeof document === 'undefined') {
    return label.length * fallbackCharWidth;
  }

  if (!tableMeasureContext) {
    tableMeasureContext = document.createElement('canvas').getContext('2d');
  }

  if (!tableMeasureContext) {
    return label.length * fallbackCharWidth;
  }

  tableMeasureContext.font = font;

  return tableMeasureContext.measureText(label).width;
}

export default function HolidayPage() {
  const {
    holidays,
    totalPages,
    totalItems,
    page,
    rowsPerPage,
    searchCountry,
    searchYear,
    searchType,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,
    isLoading,
    types,
    countries,
    years,
    setPage,
    handleRowsPerPageChange,
    handleTypeChange,
    handleYearChange,
    handleCountryChange,
    handleEdit,
    handleDelete,
    addNewHoliday,
  } = useHolidayDate();

  const dateColumnSize = useMemo(
    () =>
      Math.min(
        180,
        Math.ceil(
          Math.max(
            measureTextWidth('Date', '500 14px Arial', 6.8),
            ((holidays as any[]) || []).reduce((widest: number, item: any) => {
              const label = item?.date || '0000-00-00';
              return Math.max(widest, measureTextWidth(label, '400 12px Arial', 6.1));
            }, 0),
          ) + 40,
        ),
      ),
    [holidays],
  );

  const nameColumnSize = useMemo(
    () =>
      Math.max(
        164,
        Math.ceil(
          Math.max(
            measureTextWidth('Holiday Name', '500 14px Arial', 6.8),
            ((holidays as any[]) || []).reduce((widest: number, item: any) => {
              const label = item?.name || '-';
              return Math.max(widest, measureTextWidth(label, '400 13px Arial', 6.6));
            }, 0),
          ) + 28,
        ),
      ),
    [holidays],
  );

  const typeColumnSize = useMemo(
    () =>
      Math.max(
        130,
        Math.ceil(
          Math.max(
            measureTextWidth('Holiday Type', '500 14px Arial', 6.8),
            ((holidays as any[]) || []).reduce((widest: number, item: any) => {
              const label = item?.type || '-';
              return Math.max(widest, measureTextWidth(label, '600 12px Arial', 6.2));
            }, 0),
          ) + 28,
        ),
      ),
    [holidays],
  );

  const actionColumnSize = useMemo(
    () =>
      Math.max(
        120,
        Math.ceil(
          Math.max(
            measureTextWidth('Action', '500 14px Arial', 6.8),
            measureTextWidth('Edit', '500 13px Arial', 6.6) + 72,
          ) + 24,
        ),
      ),
    [],
  );

  const columns = createHolidayTableColumns({
    handleEdit,
    handleDelete,
    canEdit,
    canDelete,
    page,
    rowsPerPage,
    dateColumnSize,
    nameColumnSize,
    typeColumnSize,
    actionColumnSize,
  });

  if (hasAccess === false) {
    return null;
  }

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black">
          Holiday Date
        </Box>

        <Box className="flex w-full flex-col gap-3 xl:w-auto xl:items-end">
          <Box className="flex w-full flex-col gap-3 sm:grid sm:grid-cols-3 xl:w-auto xl:flex xl:flex-row xl:flex-nowrap xl:justify-end xl:gap-4">
            <Box className="w-full sm:col-span-1 xl:w-36 xl:shrink-0">
              <Select value={searchCountry} onValueChange={handleCountryChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {countries.map((item, index) => (
                      <SelectItem key={index} value={item.code}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Box>

            <Box className="w-full sm:col-span-1 xl:w-36 xl:shrink-0">
              <Select value={searchYear} onValueChange={handleYearChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {years.map((item, index) => (
                      <SelectItem key={index} value={item.code}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Box>

            <Box className="w-full sm:col-span-1 xl:w-52 xl:shrink-0">
              <Select value={searchType || 'undefined'} onValueChange={handleTypeChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Holiday Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {types.map((item, index) => (
                      <SelectItem key={index} value={item.code}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Box>
          </Box>

          <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
            <Button
              onClick={addNewHoliday}
              disabled={!canCreate}
              className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:ml-auto xl:ml-0"
              leftIcon={<Plus className="w-5 h-5" />}
            >
              Create Holiday
            </Button>
          </Box>
        </Box>
      </Box>

      <DataTable
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isLoading}
        data={holidays}
        columns={columns}
        defaultState={{
          columnPinning: {
            left: ['index', 'date'],
            right: ['action'],
          },
        }}
        enablePagination={true}
        pagination={{
          pageIndex: page - 1,
          pageSize: rowsPerPage,
          pageCount: totalPages,
          rowCount: totalItems,
          onPageChange: (pageIndex) => {
            if (isLoading) {
              return;
            }
            setPage(pageIndex + 1);
          },
          onPageSizeChange: (pageSize) => {
            if (isLoading) {
              return;
            }
            handleRowsPerPageChange({
              target: { value: String(pageSize) },
            } as ChangeEvent<HTMLSelectElement>);
          },
        }}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        emptyState={
          <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Box className="flex flex-col items-center justify-center gap-2">
              <Image alt="No holiday date data" src={noData} width={128} />
              <Box as="span">No holiday date data available</Box>
            </Box>
          </Box>
        }
        renderPagination={(table) => (
          <Box className="-mt-1">
            <CompactTablePagination
              table={table}
              pageSizeOptions={[10, 20, 30, 50, 100]}
              disabled={isLoading}
            />
          </Box>
        )}
        tableOptions={{
          manualPagination: true,
          enableColumnPinning: true,
          enableColumnResizing: true,
          defaultColumn: {
            minSize: 48,
            size: 96,
          },
          getRowId: (row, index) => (row as any)?.id || `holiday-row-${index}`,
        }}
      />
    </Box>
  );
}
