'use client';

import Image from 'next/image';
import noData from '@public/images/no-data.webp';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { Download, Search, Upload } from 'react-feather';

import {
  Box,
  Button,
  DataTable,
  Input,
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

import { createTransactionTableColumns } from '@/components/tableConfig/transactionTableConfig';
import { CompactTablePagination } from '@/components/ui/compact-table-pagination';
import AppURL from '@/constants/app-url.const';
import { useAuth } from '@/context/auth.context';
import useTransactions from '@/hooks/useTransactions.hooks';
import { formatMoney } from '@/lib/formatter';
import { calculateTotalPremium } from '@/lib/utils';

let amountMeasureContext: CanvasRenderingContext2D | null = null;
const formatCompactCount = (value: number) => new Intl.NumberFormat('id-ID').format(value);

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

export default function TransactionsPage() {
  const router = useRouter();
  const { permissionList } = useAuth();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState('');

  const {
    transactions,
    totalPages,
    totalItems,
    totalData,

    page,
    rowsPerPage,
    tab,
    type,
    searchData,

    isLoading,
    isFetching,
    isLoadingUpdateStatus,

    setPage,
    handleSearch,
    handleRowsPerPageChange,
    selectTab,
    handleChannelChange,
    handleUpdateToPaid,
  } = useTransactions();

  const types = [
    {
      id: 'conventional',
      name: 'Conventional',
    },
    {
      id: 'online',
      name: 'Online',
    },
  ];
  const statusTabs = ['All', 'Declaration', 'Paid', 'Pending'] as const;

  useEffect(() => {
    const checkAccess = async () => {
      const access = permissionList.includes('Transactions.Read');
      const editBtn = permissionList.includes('Transactions.Update');

      setCanEdit(editBtn);
      setHasAccess(access);
      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Declaration':
        return 'text-[#016DA1]';
      case 'Paid':
        return 'text-[#00AB4F]';
      case 'Pending':
        return 'text-[#CC9B36]';
      default:
        return 'text-[#016DA1]';
    }
  };

  const handleUpdateToPaidWithAlert = (id: string) => {
    handleUpdateToPaid(id);
  };

  const handleExport = () => {
    const exportData = {
      page,
      limit: rowsPerPage,
      status: tab === 'All' ? '' : tab,
      search: searchData,
      type: type,
    };

    localStorage.setItem('exportTransactionData', JSON.stringify(exportData));
    router.push(AppURL.transactionExport);
  };

  const currencyColumnSize = useMemo(
    () =>
      Math.max(
        92,
        Math.ceil(
          Math.max(
            measureTextWidth('Currency', '500 14px Arial', 7.2),
            transactions.reduce((widest, transaction) => {
              const label = transaction?.insurance?.currency || 'IDR';

              return Math.max(widest, measureTextWidth(label, '600 12px Arial', 6.2));
            }, 0),
          ) + 28,
        ),
      ),
    [transactions],
  );

  const amountColumnSize = useMemo(
    () =>
      Math.max(
        120,
        Math.ceil(
          Math.max(
            measureTextWidth('Amount', '500 14px Arial', 6.8),
            transactions.reduce((widest, transaction) => {
              const label = formatMoney(Number(calculateTotalPremium(transaction)) || 0, 'IDR');

              return Math.max(widest, measureTextWidth(label, '400 13px Arial', 6.6));
            }, 0),
          ) + 28,
        ),
      ),
    [transactions],
  );

  const statusColumnSize = useMemo(
    () =>
      Math.max(
        88,
        Math.ceil(
          Math.max(
            measureTextWidth('Status', '500 14px Arial', 6.8),
            transactions.reduce((widest, transaction) => {
              const label = transaction?.status || '-';

              return Math.max(widest, measureTextWidth(label, '600 11px Arial', 5.9));
            }, 0),
          ) + 18,
        ),
      ),
    [transactions],
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

  const transactionTableColumns = createTransactionTableColumns({
    page,
    rowsPerPage,
    canEdit,
    currencyColumnSize,
    amountColumnSize,
    statusColumnSize,
    actionColumnSize,
    onUpdateToPaid: handleUpdateToPaidWithAlert,
    isLoadingUpdateStatus,
    getStatusColor,
    calculateTotalPremium,
  });

  if (hasAccess === null) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col gap-4 p-4 md:p-6">
      <Box className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black">
          Transactions
        </Box>
        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          <Box className="w-full sm:min-w-52 sm:flex-1 xl:w-52 xl:flex-none">
            <Select value={type} onValueChange={handleChannelChange}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {types.map((item, index) => (
                    <SelectItem key={index} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Box>
          <Button
            onClick={() => router.push(AppURL.transactionAdd)}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:ml-auto"
            leftIcon={<Upload className="w-5 h-5" />}
          >
            Add Transaction
          </Button>
          <Button
            onClick={handleExport}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d]"
            leftIcon={<Download className="w-5 h-5" />}
          >
            Export
          </Button>
        </Box>
      </Box>

      <Box className="block rounded-xl bg-white">
        <Tabs value={tab} onValueChange={selectTab} className="w-full">
          <TabsList
            aria-label="Transaction status tabs"
            className="w-full justify-start overflow-auto rounded-md border-0 bg-transparent p-0 text-inherit"
          >
            {statusTabs.map((tabName) => (
              <TabsTrigger
                key={tabName}
                value={tabName}
                className="h-[3.25rem] rounded-none border-x-0 border-t-0 border-b-[2px] border-transparent px-5 py-3 text-sm font-normal text-black shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none enabled:data-[state=inactive]:hover:bg-transparent enabled:data-[state=inactive]:hover:text-black"
              >
                <Box as="span" className="mr-2.5">
                  {tabName === 'All' ? 'All Transaction' : tabName}
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
        className="!gap-3 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isLoading || isFetching}
        data={transactions}
        columns={transactionTableColumns}
        defaultState={{
          columnPinning: {
            left: ['id', 'insuranceName'],
            right: ['status', 'action'],
          },
        }}
        pagination={{
          pageIndex: page - 1,
          pageSize: rowsPerPage,
          pageCount: totalPages,
          rowCount: totalItems,
          onPageChange: (pageIndex) => {
            setPage(pageIndex + 1);
          },
          onPageSizeChange: (pageSize) => {
            handleRowsPerPageChange({
              target: { value: String(pageSize) },
            } as ChangeEvent<HTMLSelectElement>);
          },
        }}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        emptyState={
          <Box className="flex flex-col items-center justify-center gap-4 py-10">
            <Image alt="No transaction data" src={noData} width={200} />
            <Box as="span">No transaction data available</Box>
          </Box>
        }
        renderToolbar={() => (
          <Box className="w-full">
            <Input
              type="text"
              value={searchValue}
              placeholder="Search by Insurance Name"
              aria-label="Search by Insurance Name"
              onValueChange={(value) => {
                setSearchValue(value);
                handleSearch(value);
              }}
              className="h-10 rounded-xl border-slate-300 bg-white text-slate-900 shadow-none transition-colors placeholder:text-slate-400 focus-within:ring-0 focus-within:shadow-none"
              rightIcon={<Search aria-hidden="true" className="h-4 w-4 text-[#016da1]" />}
            />
          </Box>
        )}
        renderPagination={(table) => (
          <Box className="-mt-1 pb-4 md:pb-6">
            <CompactTablePagination table={table} pageSizeOptions={[10, 20, 30, 50, 100]} />
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
          getRowId: (row, index) => row?.id || `transaction-row-${index}`,
        }}
      />
    </Box>
  );
}
