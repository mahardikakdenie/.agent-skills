'use client';

import noData from '@public/images/no-data.webp';
import { format } from 'date-fns';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, type ChangeEvent } from 'react';
import { Download, Upload } from 'react-feather';

import {
  Box,
  Button,
  DataTable,
  DateRangePicker,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@repo/ui';

import { createPolicyTableColumns } from '@/components/tableConfig/policyTableConfig';
import { DebouncedSearchInput } from '@/components/ui/debounced-search-input';
import { CompactTablePagination } from '@/components/ui/compact-table-pagination';
import { toastNotification } from '@/helpers/app.helper';
import usePolicies from '@/hooks/usePolicies.hooks';
import { helperService } from '@/services/api.service';

let tableMeasureContext: CanvasRenderingContext2D | null = null;
const formatCompactCount = (value: number) => new Intl.NumberFormat('id-ID').format(value);

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

export default function PolicyPage() {
  const path = usePathname();
  const router = useRouter();
  const statusTabs = ['All', 'In Force', 'Grace Period', 'Expired'] as const;

  const {
    policies,
    channels,
    categories,
    totalPages,
    totalItems,
    totalData,

    page,
    rowsPerPage,
    tab,
    searchData,
    searchChannel,
    searchCategory,
    date,

    isLoading,
    isFetching,
    exporting,

    setPage,
    setDate,
    setExporting,
    handleSearch,
    handleRowsPerPageChange,
    selectTab,
    handleChannelChange,
    handleCategoryChange,
  } = usePolicies();
  const formattedTotalData = formatCompactCount(Number(totalData) || 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Declaration':
        return 'text-[#016DA1]';
      case 'Grace Period':
        return 'text-orange-500';
      case 'Expired':
        return 'text-gray-400';
      default:
        return 'text-[#016DA1]';
    }
  };

  const goToDetail = (policyId: string) => {
    router.push(`${path}/detail/${policyId}`);
  };

  const handleDownloadTemplate = () => {
    const c = channels.find((channel) => channel.id === searchChannel);

    if (c?.name) {
      window.open(`/policy_templates/${c.name}.xlsx`, '_blank');
    }
  };

  const handleImport = () => {
    router.push(`${path}/import`);
  };

  const handleExport = async () => {
    try {
      setExporting(true);

      const response = await helperService.get('/v1/export-data', {
        params: {
          startDate: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
          endDate: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
          type: 'Export.PolicyList.XSLX',
          channel: searchChannel,
          category: searchCategory !== 'All' ? searchCategory : undefined,
        },
        responseType: 'blob',
      });

      const contentDisposition = response.headers['content-disposition'] as string | undefined;
      const filenameMatch = contentDisposition?.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
      const filename = filenameMatch?.[1]
        ? decodeURIComponent(filenameMatch[1])
        : `policy-list-${Date.now()}.xlsx`;
      const contentType =
        (response.headers['content-type'] as string | undefined) ||
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      const blob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data], { type: contentType });
      const downloadUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(downloadUrl);
    } catch {
      toastNotification('Gagal mengunduh file export', 'error');
    } finally {
      setExporting(false);
    }
  };

  const effectiveDateColumnSize = useMemo(
    () =>
      Math.max(
        116,
        Math.ceil(
          Math.max(
            measureTextWidth('Effective Date', '500 14px Arial', 6.8),
            policies.reduce((widest, policy) => {
              const label = policy?.start_date || '0000-00-00';

              return Math.max(widest, measureTextWidth(label, '400 12px Arial', 6.1));
            }, 0),
          ) + 24,
        ),
      ),
    [policies],
  );

  const expiryDateColumnSize = useMemo(
    () =>
      Math.max(
        116,
        Math.ceil(
          Math.max(
            measureTextWidth('Expiry Date', '500 14px Arial', 6.8),
            policies.reduce((widest, policy) => {
              const label = policy?.end_date || '0000-00-00';

              return Math.max(widest, measureTextWidth(label, '400 12px Arial', 6.1));
            }, 0),
          ) + 24,
        ),
      ),
    [policies],
  );

  const statusColumnSize = useMemo(
    () =>
      Math.max(
        84,
        Math.ceil(
          Math.max(
            measureTextWidth('Status', '500 14px Arial', 6.8),
            policies.reduce((widest, policy) => {
              const label = policy?.status || '-';

              return Math.max(widest, measureTextWidth(label, '600 11px Arial', 5.9));
            }, 0),
          ) + 14,
        ),
      ),
    [policies],
  );

  const actionColumnSize = useMemo(
    () =>
      Math.max(
        68,
        Math.ceil(
          Math.max(
            measureTextWidth('Action', '500 14px Arial', 6.8),
            measureTextWidth('View', '600 11px Arial', 5.9) + 18,
          ) + 12,
        ),
      ),
    [],
  );

  const policyTableColumns = createPolicyTableColumns({
    page,
    rowsPerPage,
    effectiveDateColumnSize,
    expiryDateColumnSize,
    statusColumnSize,
    actionColumnSize,
    onGoToDetail: goToDetail,
    getStatusColor,
  });
  const isPaginationBusy = isLoading || isFetching;

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col gap-4 p-4 md:p-6">
      <Box className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black">
          Policy List
        </Box>

        <Box className="flex w-full flex-col gap-2.5 xl:w-auto xl:items-end">
          <Box className="flex w-full flex-col gap-2.5 sm:grid sm:grid-cols-2 sm:gap-3 xl:w-auto xl:flex xl:flex-row xl:flex-nowrap xl:justify-end">
            <DateRangePicker
              value={date ?? null}
              changeBehavior="complete"
              onChange={(range) =>
                setDate(range?.from ? { from: range.from, to: range.to } : undefined)
              }
              clearable
              variant="outline"
              className="w-full sm:col-span-2 xl:w-[280px] xl:shrink-0"
            />

            <Box className="w-full xl:w-48 xl:shrink-0">
              <Select value={searchChannel} onValueChange={handleChannelChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {/* <SelectItem value={'All'}>All Channel</SelectItem> */}
                    {channels.map((item, index) => (
                      <SelectItem key={index} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Box>

            <Box className="w-full xl:w-48 xl:shrink-0">
              <Select
                disabled={!searchChannel}
                value={searchCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={'All'} key={-1}>
                      All Category
                    </SelectItem>
                    {categories.map((item, index) => (
                      <SelectItem key={index} value={item.id}>
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
              onClick={handleDownloadTemplate}
              className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:ml-auto xl:ml-0"
              leftIcon={<Download className="w-5 h-5" />}
            >
              Import Template
            </Button>
            <Button
              onClick={handleImport}
              className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
              leftIcon={<Upload className="w-5 h-5" />}
            >
              Import
            </Button>
            <Button
              onClick={handleExport}
              className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
              loading={exporting}
              leftIcon={<Download className="w-5 h-5" />}
            >
              {exporting ? 'Exporting...' : 'Export'}
            </Button>
          </Box>
        </Box>
      </Box>

      <Box className="block rounded-xl bg-white">
        <Tabs
          value={tab}
          onValueChange={selectTab}
          variant="underline"
          className="w-full [&_[data-slot=tabs-list-shell]]:rounded-md"
        >
          <TabsList
            aria-label="Policy status tabs"
            className="w-full justify-start rounded-md border-0 bg-transparent p-0 text-inherit"
          >
            {statusTabs.map((tabName) => (
              <TabsTrigger
                key={tabName}
                value={tabName}
                variant="underline"
                className="h-12 px-4 py-2.5 text-sm font-normal"
              >
                <Box as="span" className="mr-2.5">
                  {tabName === 'All' ? 'All Policy' : tabName}
                </Box>
                {tab === tabName ? (
                  <Box
                    as="span"
                    className={`inline-flex h-5 min-w-6 items-center justify-center rounded-full bg-red-600 px-1.5 text-center text-[11px] leading-none text-white ${
                      formattedTotalData.length > 2 ? 'min-w-8' : ''
                    }`}
                  >
                    {formattedTotalData}
                  </Box>
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Box>

      <DataTable
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isPaginationBusy}
        data={policies}
        columns={policyTableColumns}
        defaultState={{
          columnPinning: {
            left: ['id', 'planName'],
            right: ['status', 'action'],
          },
        }}
        pagination={{
          pageIndex: page - 1,
          pageSize: rowsPerPage,
          pageCount: totalPages,
          rowCount: totalItems,
          onPageChange: (pageIndex) => {
            if (isPaginationBusy) {
              return;
            }

            setPage(pageIndex + 1);
          },
          onPageSizeChange: (pageSize) => {
            if (isPaginationBusy) {
              return;
            }

            handleRowsPerPageChange({
              target: { value: String(pageSize) },
            } as ChangeEvent<HTMLSelectElement>);
          },
        }}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        emptyState={
          <Box className="flex min-h-[10rem] flex-col items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Image alt="No policy data" src={noData} width={128} />
            <Box as="span">No policy data available</Box>
          </Box>
        }
        renderToolbar={() => (
          <Box className="w-full">
            <DebouncedSearchInput
              value={searchData}
              placeholder="Search by Plan Name"
              ariaLabel="Search by Plan Name"
              onDebouncedChange={handleSearch}
              className="h-10 rounded-xl border-slate-300 bg-white text-slate-900 shadow-none transition-colors placeholder:text-slate-400 focus-within:ring-0 focus-within:shadow-none"
            />
          </Box>
        )}
        renderPagination={(table) => (
          <Box className="-mt-1">
            <CompactTablePagination
              table={table}
              pageSizeOptions={[10, 20, 30, 50, 100]}
              disabled={isPaginationBusy}
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
          getRowId: (row, index) => row?.id || `policy-row-${index}`,
        }}
      />
    </Box>
  );
}
