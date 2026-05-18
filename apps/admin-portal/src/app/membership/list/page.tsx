'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import React, { useMemo, type ChangeEvent } from 'react';
import { Download, Upload } from 'react-feather';

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
  Tabs,
  TabsList,
  TabsTrigger,
} from '@repo/ui';

import { createMembershipTableColumns } from '@/components/table-config/membership-table-config';
import { CompactTablePagination } from '@/components/ui/compact-table-pagination';
import { DebouncedSearchInput } from '@/components/ui/debounced-search-input';
import { useMembership } from '@/hooks/useMembership.hooks';

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

export default function MembershipPage() {
  const {
    filteredMembership,
    totalData,
    totalItems,
    totalPages,
    channels,

    page,
    rowsPerPage,
    tab,
    channel,
    searchData,

    isLoading,
    isFetching,

    handleSearch,
    handleRowsPerPageChange,
    selectTab,
    handleChannelChange,
    handleExport,
    handleUpload,
    goToDetail,
    getStatusColor,
    setPage,
  } = useMembership();

  const policyNumberColumnSize = useMemo(
    () =>
      Math.max(
        160,
        Math.ceil(
          Math.max(
            measureTextWidth('INS-20250711-0001', '400 12px Montserrat, Arial, sans-serif', 6.1),
            measureTextWidth('Policy Number', '500 14px Montserrat, Arial, sans-serif', 6.8),
            filteredMembership.reduce((widest, item) => {
              const label = item?.number || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '400 12px Montserrat, Arial, sans-serif', 6.1),
              );
            }, 0),
          ) + 52,
        ),
      ),
    [filteredMembership],
  );

  const subsidiaryColumnSize = useMemo(
    () =>
      Math.max(
        180,
        Math.ceil(
          Math.max(
            measureTextWidth('Subsidiary / Entity', '500 14px Montserrat, Arial, sans-serif', 6.8),
            filteredMembership.reduce((widest, item) => {
              const label = item?.profile?.subsidiary || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '400 12px Montserrat, Arial, sans-serif', 6.1),
              );
            }, 0),
          ) + 24,
        ),
      ),
    [filteredMembership],
  );

  const employeeIdColumnSize = useMemo(
    () =>
      Math.max(
        116,
        Math.ceil(
          Math.max(
            measureTextWidth('Employee ID', '500 14px Montserrat, Arial, sans-serif', 6.8),
            filteredMembership.reduce((widest, item) => {
              const label = item?.profile?.employee_id || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '400 12px Montserrat, Arial, sans-serif', 6.1),
              );
            }, 0),
          ) + 24,
        ),
      ),
    [filteredMembership],
  );

  const employeeNameColumnSize = useMemo(
    () =>
      Math.max(
        160,
        Math.ceil(
          Math.max(
            measureTextWidth('Employee Name', '500 14px Montserrat, Arial, sans-serif', 6.8),
            filteredMembership.reduce((widest, item) => {
              const label = item?.profile?.employee_name || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '400 12px Montserrat, Arial, sans-serif', 6.1),
              );
            }, 0),
          ) + 24,
        ),
      ),
    [filteredMembership],
  );

  const memberNameColumnSize = useMemo(
    () =>
      Math.max(
        160,
        Math.ceil(
          Math.max(
            measureTextWidth('Member Name', '500 14px Montserrat, Arial, sans-serif', 6.8),
            filteredMembership.reduce((widest, item) => {
              const label = item?.profile?.member_name || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '400 12px Montserrat, Arial, sans-serif', 6.1),
              );
            }, 0),
          ) + 24,
        ),
      ),
    [filteredMembership],
  );

  const genderColumnSize = useMemo(
    () =>
      Math.max(
        92,
        Math.ceil(
          Math.max(
            measureTextWidth('Gender', '500 14px Montserrat, Arial, sans-serif', 7.2),
            filteredMembership.reduce((widest, item) => {
              const label = item?.profile?.gender || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '600 12px Montserrat, Arial, sans-serif', 6.2),
              );
            }, 0),
          ) + 28,
        ),
      ),
    [filteredMembership],
  );

  const dobColumnSize = useMemo(
    () =>
      Math.max(
        140,
        Math.ceil(
          Math.max(
            measureTextWidth('Date of Birth', '500 14px Montserrat, Arial, sans-serif', 6.8),
            filteredMembership.reduce((widest, item) => {
              const label = item?.profile?.date_of_birth || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '400 12px Montserrat, Arial, sans-serif', 6.1),
              );
            }, 0),
          ) + 24,
        ),
      ),
    [filteredMembership],
  );

  const memberStatusColumnSize = useMemo(
    () =>
      Math.max(
        140,
        Math.ceil(
          Math.max(
            measureTextWidth('Member Status', '500 14px Montserrat, Arial, sans-serif', 7.2),
            filteredMembership.reduce((widest, item) => {
              const label = item?.profile?.member_status || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '600 12px Montserrat, Arial, sans-serif', 6.2),
              );
            }, 0),
          ) + 32,
        ),
      ),
    [filteredMembership],
  );

  const maritalStatusColumnSize = useMemo(
    () =>
      Math.max(
        130,
        Math.ceil(
          Math.max(
            measureTextWidth('Marital Status', '500 14px Montserrat, Arial, sans-serif', 7.2),
            filteredMembership.reduce((widest, item) => {
              const label = item?.profile?.marital_status || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '600 12px Montserrat, Arial, sans-serif', 6.2),
              );
            }, 0),
          ) + 28,
        ),
      ),
    [filteredMembership],
  );

  const planColumnSize = useMemo(
    () =>
      Math.max(
        120,
        Math.ceil(
          Math.max(
            measureTextWidth('Plan', '500 14px Montserrat, Arial, sans-serif', 6.8),
            filteredMembership.reduce((widest, item) => {
              const label = item?.profile?.plan || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '400 13px Montserrat, Arial, sans-serif', 6.6),
              );
            }, 0),
          ) + 28,
        ),
      ),
    [filteredMembership],
  );

  const effectiveDateColumnSize = useMemo(
    () =>
      Math.max(
        140,
        Math.ceil(
          Math.max(
            measureTextWidth('Effective Date', '500 14px Montserrat, Arial, sans-serif', 6.8),
            filteredMembership.reduce((widest, item) => {
              const label = item?.profile?.effective_date || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '400 12px Montserrat, Arial, sans-serif', 6.1),
              );
            }, 0),
          ) + 44,
        ),
      ),
    [filteredMembership],
  );

  const remarksColumnSize = useMemo(
    () =>
      Math.max(
        112,
        Math.ceil(
          Math.max(
            measureTextWidth('Remarks', '500 14px Montserrat, Arial, sans-serif', 7.2),
            filteredMembership.reduce((widest, item) => {
              const label = item?.profile?.remarks || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '600 12px Montserrat, Arial, sans-serif', 6.2),
              );
            }, 0),
          ) + 36,
        ),
      ),
    [filteredMembership],
  );

  const bankNameColumnSize = useMemo(
    () =>
      Math.max(
        160,
        Math.ceil(
          Math.max(
            measureTextWidth('Bank Name', '500 14px Montserrat, Arial, sans-serif', 6.8),
            filteredMembership.reduce((widest, item) => {
              const label = item?.profile?.bank_name || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '400 12px Montserrat, Arial, sans-serif', 6.1),
              );
            }, 0),
          ) + 36,
        ),
      ),
    [filteredMembership],
  );

  const branchColumnSize = useMemo(
    () =>
      Math.max(
        160,
        Math.ceil(
          Math.max(
            measureTextWidth('Branch', '500 14px Montserrat, Arial, sans-serif', 6.8),
            filteredMembership.reduce((widest, item) => {
              const label = item?.profile?.branch || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '400 12px Montserrat, Arial, sans-serif', 6.1),
              );
            }, 0),
          ) + 36,
        ),
      ),
    [filteredMembership],
  );

  const bankNumberColumnSize = useMemo(
    () =>
      Math.max(
        136,
        Math.ceil(
          Math.max(
            measureTextWidth('Bank Number', '500 14px Montserrat, Arial, sans-serif', 6.8),
            filteredMembership.reduce((widest, item) => {
              const label = item?.profile?.bank_account_number || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '400 12px Montserrat, Arial, sans-serif', 6.1),
              );
            }, 0),
          ) + 44,
        ),
      ),
    [filteredMembership],
  );

  const bankAccountNameColumnSize = useMemo(
    () =>
      Math.max(
        180,
        Math.ceil(
          Math.max(
            measureTextWidth('Bank Account Name', '500 14px Montserrat, Arial, sans-serif', 6.8),
            filteredMembership.reduce((widest, item) => {
              const label = item?.profile?.bank_account_name || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '400 12px Montserrat, Arial, sans-serif', 6.1),
              );
            }, 0),
          ) + 36,
        ),
      ),
    [filteredMembership],
  );

  const emailColumnSize = useMemo(
    () =>
      Math.max(
        160,
        Math.ceil(
          Math.max(
            measureTextWidth('Email', '500 14px Montserrat, Arial, sans-serif', 6.8),
            filteredMembership.reduce((widest, item) => {
              const label = item?.profile?.email || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '400 12px Montserrat, Arial, sans-serif', 6.1),
              );
            }, 0),
          ) + 36,
        ),
      ),
    [filteredMembership],
  );

  const membershipIdColumnSize = useMemo(
    () =>
      Math.max(
        136,
        Math.ceil(
          Math.max(
            measureTextWidth('Membership ID', '500 14px Montserrat, Arial, sans-serif', 6.8),
            filteredMembership.reduce((widest, item) => {
              const label = item?.other_info?.tpa_member_id || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '400 12px Montserrat, Arial, sans-serif', 6.1),
              );
            }, 0),
          ) + 44,
        ),
      ),
    [filteredMembership],
  );

  const submissionDateColumnSize = useMemo(
    () =>
      Math.max(
        144,
        Math.ceil(
          Math.max(
            measureTextWidth('Submission Date', '500 14px Montserrat, Arial, sans-serif', 6.8),
            filteredMembership.reduce((widest, item) => {
              const label = item?.created_at
                ? new Date(item.created_at).toISOString().split('T')[0]
                : '-';
              return Math.max(
                widest,
                measureTextWidth(label, '400 12px Montserrat, Arial, sans-serif', 6.1),
              );
            }, 0),
          ) + 44,
        ),
      ),
    [filteredMembership],
  );

  const statusColumnSize = useMemo(
    () =>
      Math.max(
        88,
        Math.ceil(
          Math.max(
            measureTextWidth('Status', '500 14px Montserrat, Arial, sans-serif', 6.8),
            filteredMembership.reduce((widest, item) => {
              const label = item?.status || '-';
              return Math.max(
                widest,
                measureTextWidth(label, '600 11px Montserrat, Arial, sans-serif', 5.9),
              );
            }, 0),
          ) + 18,
        ),
      ),
    [filteredMembership],
  );

  const actionColumnSize = useMemo(
    () =>
      Math.max(
        68,
        Math.ceil(
          Math.max(
            measureTextWidth('Action', '500 14px Montserrat, Arial, sans-serif', 6.8),
            measureTextWidth('View', '600 11px Montserrat, Arial, sans-serif', 5.9) + 18,
          ) + 12,
        ),
      ),
    [],
  );

  const membershipTableColumns = createMembershipTableColumns({
    goToDetail,
    getStatusColor,
    page,
    rowsPerPage,
    genderColumnSize,
    memberStatusColumnSize,
    maritalStatusColumnSize,
    remarksColumnSize,
    planColumnSize,
    statusColumnSize,
    actionColumnSize,
    policyNumberColumnSize,
    subsidiaryColumnSize,
    employeeIdColumnSize,
    employeeNameColumnSize,
    memberNameColumnSize,
    dobColumnSize,
    effectiveDateColumnSize,
    bankNameColumnSize,
    branchColumnSize,
    bankNumberColumnSize,
    bankAccountNameColumnSize,
    emailColumnSize,
    membershipIdColumnSize,
    submissionDateColumnSize,
  });

  const isPaginationBusy = isLoading || isFetching;

  const tabs = [
    { key: 'All', label: 'All Membership' },
    { key: 'Pending', label: 'Pending' },
    { key: 'Active', label: 'Active' },
    { key: 'Inactive', label: 'Inactive' },
  ];

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col gap-4 p-4 md:p-6">
      <Box className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black">
          Membership List
        </Box>
        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          <Box className="w-full sm:min-w-52 sm:flex-1 xl:w-52 xl:flex-none">
            <Select value={channel} onValueChange={handleChannelChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select Channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {channels.map((channelItem, index) => (
                    <SelectItem key={index} value={channelItem.id}>
                      {channelItem.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Box>
          <Button
            onClick={handleUpload}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
            leftIcon={<Upload className="w-5 h-5" />}
          >
            Upload
          </Button>
          <Button
            onClick={handleExport}
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
            aria-label="Membership status tabs"
            className="w-full justify-start rounded-md border-0 bg-transparent p-0 text-inherit"
          >
            {tabs.map((tabItem) => (
              <TabsTrigger
                key={tabItem.key}
                value={tabItem.key}
                variant="underline"
                className="h-12 px-4 py-2.5 text-sm font-normal"
              >
                <Box as="span" className="mr-2.5">
                  {tabItem.label}
                </Box>
                {tab === tabItem.key ? (
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
        data={filteredMembership}
        columns={membershipTableColumns}
        defaultState={{
          columnPinning: {
            left: ['id', 'policyNumber'],
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
          <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Box className="flex flex-col items-center justify-center gap-2">
              <Image alt="No membership data" src={noData} width={128} />
              <Box as="span">No membership data available</Box>
            </Box>
          </Box>
        }
        renderToolbar={() => (
          <Box className="w-full">
            <DebouncedSearchInput
              value={searchData}
              placeholder="Search by Policy Number/Member Name/Email/TPA Member ID"
              ariaLabel="Search by Policy Number/Member Name/Email/TPA Member ID"
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
          getRowId: (row, index) => row?.id || `membership-row-${index}`,
        }}
      />
    </Box>
  );
}
