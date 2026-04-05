'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, type ChangeEvent } from 'react';
import { Download, Upload } from 'react-feather';

import { Box, Button, DataTable, Tabs, TabsList, TabsTrigger } from '@repo/ui';

import { createEndorsementTableColumns } from '@/components/tableConfig/endorsementTableConfig';
import { CompactTablePagination } from '@/components/ui/compact-table-pagination';
import { DebouncedSearchInput } from '@/components/ui/debounced-search-input';
import AppURL from '@/constants/app-url.const';
import useEndorsements from '@/hooks/useEndorsements.hooks';

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

export default function EndorsementPage() {
  const router = useRouter();

  const {
    endorsements,
    totalPages,
    totalItems,
    totalData,

    page,
    rowsPerPage,
    tab,
    searchData,

    isLoading,
    isFetching,

    setPage,
    handleSearch,
    handleRowsPerPageChange,
    selectTab,
  } = useEndorsements();

  const statusTabs = ['All', 'Pending', 'Approved', 'Rejected'] as const;

  const goToDetail = (endorsementId: string) => {
    router.push(`${AppURL.endorsementDetail}/${endorsementId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'text-[#CC9B36]';
      case 'Approved':
        return 'text-[#00AB4F]';
      case 'Rejected':
        return 'text-[#E83F3F]';
      default:
        return 'text-[#CC9B36]';
    }
  };

  const requestIdColumnSize = useMemo(
    () =>
      Math.min(
        240,
        Math.max(
          160,
          Math.ceil(
            Math.max(
              measureTextWidth('EDS-20260325-0001', '400 12px Arial', 6.1),
              measureTextWidth('Request ID', '500 14px Arial', 6.8),
              endorsements.reduce((widest, endorsement) => {
                const label = endorsement?.number || '-';
                return Math.max(widest, measureTextWidth(label, '400 12px Arial', 6.1));
              }, 0),
            ) + 52,
          ),
        ),
      ),
    [endorsements],
  );

  const insuredNameColumnSize = useMemo(
    () =>
      Math.min(
        240,
        Math.max(
          180,
          Math.ceil(
            Math.max(
              measureTextWidth('Insured Name', '500 14px Arial', 6.8),
              endorsements.reduce((widest, endorsement) => {
                const label =
                  endorsement?.insured_parties?.profile?.name ||
                  endorsement?.policies?.policy_holders?.name ||
                  endorsement?.participants?.profile?.name ||
                  '-';
                if (label.startsWith('vault:')) return widest;
                return Math.max(widest, measureTextWidth(label, '400 12px Arial', 6.1));
              }, 0),
            ) + 24,
          ),
        ),
      ),
    [endorsements],
  );

  const policyNumberColumnSize = useMemo(
    () =>
      Math.min(
        220,
        Math.max(
          160,
          Math.ceil(
            Math.max(
              measureTextWidth('2026MSH000160', '400 12px Arial', 6.1),
              measureTextWidth('Policy Number', '500 14px Arial', 6.8),
              endorsements.reduce((widest, endorsement) => {
                const label = endorsement?.policies?.number || '-';
                return Math.max(widest, measureTextWidth(label, '400 12px Arial', 6.1));
              }, 0),
            ) + 52,
          ),
        ),
      ),
    [endorsements],
  );

  const requestDateColumnSize = useMemo(
    () =>
      Math.max(
        110,
        Math.ceil(
          Math.max(
            measureTextWidth('Request Date', '500 14px Arial', 6.8),
            endorsements.reduce((widest, endorsement) => {
              const reqDate = endorsement?.created_at
                ? new Date(endorsement.created_at).toLocaleDateString('en-GB')
                : '-';
              return Math.max(widest, measureTextWidth(reqDate, '400 12px Arial', 6.1));
            }, 0),
          ) + 24,
        ),
      ),
    [endorsements],
  );

  const approveRejectedDateColumnSize = useMemo(
    () =>
      Math.max(
        160,
        Math.ceil(
          Math.max(
            measureTextWidth('Approve/Rejected Date', '500 14px Arial', 6.8),
            endorsements.reduce((widest, endorsement) => {
              const modDate =
                endorsement?.status !== 'Pending' && endorsement?.updated_at
                  ? new Date(endorsement.updated_at).toLocaleDateString('en-GB')
                  : '-';
              return Math.max(widest, measureTextWidth(modDate, '400 12px Arial', 6.1));
            }, 0),
          ) + 40,
        ),
      ),
    [endorsements],
  );

  const typeColumnSize = useMemo(
    () =>
      Math.max(
        120,
        Math.ceil(
          Math.max(
            measureTextWidth('Type', '500 14px Arial', 7.2),
            endorsements.reduce((widest, endorsement) => {
              const label = endorsement?.type || '-';
              return Math.max(widest, measureTextWidth(label, '600 12px Arial', 6.2));
            }, 0),
          ) + 28,
        ),
      ),
    [endorsements],
  );

  const statusColumnSize = useMemo(
    () =>
      Math.max(
        100,
        Math.ceil(
          Math.max(
            measureTextWidth('Status', '500 14px Arial', 6.8),
            endorsements.reduce((widest, endorsement) => {
              const label = endorsement?.status || '-';
              return Math.max(widest, measureTextWidth(label, '600 11px Arial', 5.9));
            }, 0),
          ) + 32,
        ),
      ),
    [endorsements],
  );

  const verifiedByColumnSize = useMemo(
    () =>
      Math.min(
        240,
        Math.max(
          164,
          Math.ceil(
            Math.max(
              measureTextWidth('Verified By', '500 14px Arial', 6.8),
              endorsements.reduce((widest, endorsement) => {
                const label = (endorsement?.status_description?.split(' by ')[1] || '-').replace(
                  /\b\w/g,
                  (c: string) => c.toUpperCase(),
                );
                if (label.startsWith('vault:')) return widest;
                return Math.max(widest, measureTextWidth(label, '400 12px Arial', 6.1));
              }, 0),
            ) + 24,
          ),
        ),
      ),
    [endorsements],
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

  const endorsementTableColumns = createEndorsementTableColumns({
    page,
    rowsPerPage,
    onGoToDetail: goToDetail,
    getStatusColor,
    requestIdColumnSize,
    insuredNameColumnSize,
    policyNumberColumnSize,
    requestDateColumnSize,
    approveRejectedDateColumnSize,
    typeColumnSize,
    statusColumnSize,
    verifiedByColumnSize,
    actionColumnSize,
  });

  const isPaginationBusy = isLoading || isFetching;

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black">
          Endorsement List
        </Box>
        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          <Button
            onClick={() => router.push(AppURL.endorsementUpload)}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:ml-auto"
            leftIcon={<Upload className="w-5 h-5" />}
          >
            Upload
          </Button>
          <Button
            onClick={() => router.push(AppURL.endorsementExport)}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
            leftIcon={<Download className="w-5 h-5" />}
          >
            Download
          </Button>
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
            aria-label="Endorsement status tabs"
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
                  {tabName === 'All'
                    ? 'All Endorsement'
                    : tabName === 'Pending'
                      ? 'Waiting'
                      : tabName === 'Rejected'
                        ? 'Reject'
                        : tabName}
                </Box>
                {tab === tabName ? (
                  <Box
                    as="span"
                    className={`inline-flex h-5 min-w-6 items-center justify-center rounded-full bg-red-600 px-1.5 text-center text-[11px] leading-none text-white ${
                      totalData > 99 ? 'min-w-8' : ''
                    }`}
                  >
                    {formatCompactCount(totalData)}
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
        data={endorsements}
        columns={endorsementTableColumns}
        defaultState={{
          columnPinning: {
            left: ['id', 'requestId'],
            right: ['status', 'action'],
          },
        }}
        pagination={{
          pageIndex: page - 1,
          pageSize: rowsPerPage,
          pageCount: totalPages,
          rowCount: totalData,
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
          <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Box className="flex flex-col items-center justify-center gap-2">
              <Image alt="No endorsement data" src={noData} width={128} />
              <Box as="span">No endorsement data available</Box>
            </Box>
          </Box>
        }
        renderToolbar={() => (
          <Box className="w-full">
            <DebouncedSearchInput
              value={searchData}
              placeholder="Search by Insured Name"
              ariaLabel="Search by Insured Name"
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
          getRowId: (row, index) => row?.id || `endorsement-row-${index}`,
        }}
      />
    </Box>
  );
}
