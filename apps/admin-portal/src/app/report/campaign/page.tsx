'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import { type ChangeEvent, useMemo } from 'react';
import { Download } from 'react-feather';

import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Combobox,
  DataTable,
  DateRangePicker,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';

import { createCampaignReportTableColumns } from '@/components/tableConfig/campaignReportTableConfig';
import { CompactTablePagination } from '@/components/ui/compact-table-pagination';
import { useCampaignReport } from '@/hooks/useCampaignReport.hooks';
import { formatMoney } from '@/lib/formatter';

let amountMeasureContext: CanvasRenderingContext2D | null = null;

function measureTextWidth(label: string, font: string, fallbackCharWidth: number) {
  if (typeof document === 'undefined') {
    return label.length * fallbackCharWidth;
  }

  if (!amountMeasureContext) {
    amountMeasureContext = document.createElement('canvas').getContext('2d');
  }

  if (!amountMeasureContext) {
    return label.length * fallbackCharWidth;
  }

  amountMeasureContext.font = font;

  return amountMeasureContext.measureText(label).width;
}

function getMeasuredColumnSize(
  headerLabel: string,
  values: string[],
  {
    minSize,
    maxSize,
    headerFont = '500 14px Arial',
    headerFallbackCharWidth = 6.8,
    valueFont = '400 13px Arial',
    valueFallbackCharWidth = 6.6,
    padding = 28,
  }: {
    minSize: number;
    maxSize: number;
    headerFont?: string;
    headerFallbackCharWidth?: number;
    valueFont?: string;
    valueFallbackCharWidth?: number;
    padding?: number;
  },
) {
  const widestValue = values.reduce(
    (widest, value) => Math.max(widest, measureTextWidth(value, valueFont, valueFallbackCharWidth)),
    0,
  );

  return Math.min(
    maxSize,
    Math.ceil(
      Math.max(
        minSize,
        measureTextWidth(headerLabel, headerFont, headerFallbackCharWidth),
        widestValue,
      ) + padding,
    ),
  );
}

export default function ReportCampaignPage() {
  const {
    promotions,
    insuranceOptions,
    totalItems,
    totalPages,
    page,
    rowsPerPage,
    date,
    sortBy,
    filterBy,
    selectedInsurance,
    hasAccess,
    isLoadingReports,
    setPage,
    handleSortChange,
    handleFilterChange,
    handleInsuranceChange,
    handleDateChange,
    handleRowsPerPageChange,
    handleDownloadReport,
  } = useCampaignReport();

  const transactionAmountColumnSize = useMemo(
    () =>
      getMeasuredColumnSize(
        'Transaction Amount',
        promotions.map((promotion) =>
          formatMoney(Number(promotion?.total_transaction_amount || 0), promotion?.currency || ''),
        ),
        {
          minSize: 162,
          maxSize: 220,
        },
      ),
    [promotions],
  );

  const discountAmountColumnSize = useMemo(
    () =>
      getMeasuredColumnSize(
        'Discount Amount',
        promotions.map((promotion) => {
          const discountAmount =
            Number(promotion?.total_transaction_amount || 0) -
            Number(promotion?.total_discount_amount || 0);

          return formatMoney(discountAmount, promotion?.currency || '');
        }),
        {
          minSize: 152,
          maxSize: 210,
        },
      ),
    [promotions],
  );

  const transactionAmountAfterDiscountColumnSize = useMemo(
    () =>
      getMeasuredColumnSize(
        'Transaction Amount after Discount',
        promotions.map((promotion) =>
          formatMoney(Number(promotion?.total_discount_amount || 0), promotion?.currency || ''),
        ),
        {
          minSize: 252,
          maxSize: 340,
        },
      ),
    [promotions],
  );

  const campaignReportTableColumns = useMemo(
    () =>
      createCampaignReportTableColumns({
        page,
        rowsPerPage,
        transactionAmountColumnSize,
        discountAmountColumnSize,
        transactionAmountAfterDiscountColumnSize,
      }),
    [
      discountAmountColumnSize,
      page,
      rowsPerPage,
      transactionAmountAfterDiscountColumnSize,
      transactionAmountColumnSize,
    ],
  );

  const insuranceComboboxOptions = useMemo(
    () =>
      insuranceOptions.map((insurance) => ({
        label: insurance.name,
        value: insurance.id,
      })),
    [insuranceOptions],
  );

  if (hasAccess !== true) {
    return null;
  }

  return (
    <Box className="flex min-h-0 w-full flex-1 flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Report</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Campaign Report</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Box as="h1" className="mt-2 text-lg font-bold text-black sm:text-2xl">
            Promotions Campaign Report
          </Box>
        </Box>

        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          <Box className="w-full sm:w-[280px]">
            <DateRangePicker
              value={date ?? null}
              changeBehavior="complete"
              onChange={(range) =>
                handleDateChange(range?.from ? { from: range.from, to: range.to } : undefined)
              }
              clearable
              variant="outline"
              className="w-full"
            />
          </Box>

          <Button
            onClick={handleDownloadReport}
            disabled={isLoadingReports}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
            leftIcon={<Download className="h-5 w-5" />}
          >
            Download Report
          </Button>
        </Box>
      </Box>

      <Box className="flex flex-col gap-3 rounded-xl bg-white p-4 md:flex-row md:items-end md:gap-4">
        <Box className="w-full">
          <Box
            as="label"
            htmlFor="sort"
            className="mb-1 block text-sm font-medium leading-5 text-gray-700"
          >
            Sort By
          </Box>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger id="sort" className="h-10 w-full border-gray-300 bg-transparent py-2">
              <SelectValue placeholder="Select a Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Box>

        <Box className="w-full">
          <Box
            as="label"
            htmlFor="filter"
            className="mb-1 block text-sm font-medium leading-5 text-gray-700"
          >
            Filter By
          </Box>
          <Select value={filterBy} onValueChange={handleFilterChange}>
            <SelectTrigger id="filter" className="h-10 w-full border-gray-300 bg-transparent py-2">
              <SelectValue placeholder="Select a Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="embedded">Embedded</SelectItem>
                <SelectItem value="voucher">Voucher</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Box>

        {filterBy === 'insurance' && (
          <Box className="w-full">
            <Box
              as="label"
              htmlFor="insurance"
              className="mb-1 block text-sm font-medium leading-5 text-gray-700"
            >
              Select Insurance
            </Box>
            <Combobox
              id="insurance"
              value={selectedInsurance}
              onValueChange={handleInsuranceChange}
              options={insuranceComboboxOptions}
              placeholder="Select an Insurance"
              className="w-full"
            />
          </Box>
        )}
      </Box>

      <DataTable
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isLoadingReports}
        data={promotions}
        columns={campaignReportTableColumns}
        defaultState={{
          columnPinning: {
            left: ['id', 'campaignName'],
          },
        }}
        pagination={{
          pageIndex: page - 1,
          pageSize: rowsPerPage,
          pageCount: totalPages,
          rowCount: totalItems,
          onPageChange: (pageIndex) => {
            if (isLoadingReports) {
              return;
            }

            setPage(pageIndex + 1);
          },
          onPageSizeChange: (pageSize) => {
            if (isLoadingReports) {
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
              <Image alt="No campaign report data" src={noData} width={128} />
              <Box as="span">No campaign report data available</Box>
            </Box>
          </Box>
        }
        renderPagination={(table) => (
          <Box className="-mt-1">
            <CompactTablePagination
              table={table}
              pageSizeOptions={[10, 20, 30, 50, 100]}
              disabled={isLoadingReports}
            />
          </Box>
        )}
        tableOptions={{
          manualPagination: true,
          enableColumnPinning: true,
          enableColumnResizing: true,
          defaultColumn: {
            minSize: 48,
            size: 120,
          },
          getRowId: (row, index) =>
            row?.id || `${row?.campaign_name || 'campaign-report-row'}-${page}-${index}`,
        }}
      />
    </Box>
  );
}
