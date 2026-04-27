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
  DataTable,
  DateRangePicker,
} from '@repo/ui';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';

import { createClaimReportTableColumns } from '@/components/tableConfig/claimReportTableConfig';
import { CompactTablePagination } from '@/components/ui/compact-table-pagination';
import { useClaimReport } from '@/hooks/useClaimReport.hooks';

type ClaimReportChannelOption = {
  id: string;
  name: string;
};

const ReportClaimPage = () => {
  const {
    claims,
    headers,
    channels,
    totalItems,
    totalPages,
    page,
    rowsPerPage,
    date,
    searchChannel,
    hasAccess,
    isLoadingClaims,
    isLoadingChannels,
    setPage,
    handleChannelChange,
    handleDateChange,
    handleRowsPerPageChange,
    handleDownloadReport,
  } = useClaimReport();

  const hasSelectedDateRange = Boolean(date?.from && date?.to);
  const claimReportTableColumns = useMemo(() => createClaimReportTableColumns(headers), [headers]);
  const channelOptions = channels as ClaimReportChannelOption[];

  if (hasAccess !== true) {
    return null;
  }

  return (
    <Box className="flex min-h-0 w-full flex-1 flex-col">
      <Box className="flex flex-col gap-3 bg-white p-4 md:px-6 xl:flex-row xl:items-center xl:justify-between">
        <Box className="flex-1">
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>Report</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Claim Report</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Box as="h2" className="text-lg font-bold text-black sm:mt-2 sm:text-2xl">
            Claim Report
          </Box>
        </Box>

        <Box className="flex w-full flex-col gap-3 sm:grid sm:grid-cols-2 xl:w-auto xl:flex xl:flex-row xl:flex-nowrap xl:justify-end xl:gap-4">
          <Box className="w-full xl:w-52 xl:shrink-0">
            <Select
              disabled={isLoadingChannels}
              value={searchChannel}
              onValueChange={handleChannelChange}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {channelOptions.map((item, index) => (
                    <SelectItem key={item.id ?? index} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Box>

          <Box className="w-full sm:col-span-2 xl:w-[260px] xl:shrink-0">
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
            disabled={!hasSelectedDateRange || isLoadingClaims}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:col-span-2 xl:col-span-1"
            leftIcon={<Download className="h-5 w-5" />}
          >
            Download Report
          </Button>
        </Box>
      </Box>

      <Box className="flex flex-col gap-3 p-4 md:p-6">
        {hasSelectedDateRange ? (
          <DataTable
            className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
            loading={isLoadingClaims}
            data={claims}
            columns={claimReportTableColumns}
            pagination={{
              pageIndex: page - 1,
              pageSize: rowsPerPage,
              pageCount: totalPages,
              rowCount: totalItems,
              onPageChange: (pageIndex) => {
                if (isLoadingClaims) {
                  return;
                }

                setPage(pageIndex + 1);
              },
              onPageSizeChange: (pageSize) => {
                if (isLoadingClaims) {
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
                <Box className="flex flex-col items-center justify-center gap-2 text-slate-500">
                  <Image alt="No claim report data" src={noData} width={128} />
                  <Box as="span">No claim report data available for the selected date range</Box>
                </Box>
              </Box>
            }
            renderPagination={(table) => (
              <Box className="-mt-1">
                <CompactTablePagination
                  table={table}
                  pageSizeOptions={[10, 20, 30, 50, 100]}
                  disabled={isLoadingClaims}
                />
              </Box>
            )}
            tableOptions={{
              manualPagination: true,
              enableColumnResizing: true,
              defaultColumn: {
                minSize: 80,
                size: 180,
              },
              getRowId: (row, index) => row?.id || `claim-report-row-${page}-${index}`,
            }}
          />
        ) : (
          <Box className="rounded-xl bg-white p-4 sm:p-6">
            <Box className="py-10 text-center text-slate-500">
              Please select a date range to view the report
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReportClaimPage;
