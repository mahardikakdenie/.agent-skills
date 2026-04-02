'use client';

import noData from '@public/images/no-data.webp';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Download, Upload } from 'react-feather';

import {
  Box,
  Button,
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
import { DataTable } from '@/components/ui/DataTable';
import AppURL from '@/constants/app-url.const';
import { useAuth } from '@/context/auth.context';
import useTransactions from '@/hooks/useTransactions.hooks';
import { calculateTotalPremium } from '@/lib/utils';

export default function TransactionsPage() {
  const router = useRouter();
  const { permissionList } = useAuth();

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);

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

  const transactionTableColumns = createTransactionTableColumns({
    page,
    rowsPerPage,
    canEdit,
    onUpdateToPaid: handleUpdateToPaidWithAlert,
    isLoadingUpdateStatus,
    getStatusColor,
    calculateTotalPremium,
  });

  if (hasAccess === null) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box className="flex flex-col w-full p-4 md:p-6">
      <Box className="flex pb-4 items-center justify-between">
        <Box as="h1" className="text-black font-bold text-2xl mt-2">
          Transactions
        </Box>
        <Box className="flex gap-4">
          <Box className="min-w-48">
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
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] ml-auto rounded-full"
            leftIcon={<Upload className="w-5 h-5" />}
          >
            Add Transaction
          </Button>
          <Button
            onClick={handleExport}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full"
            leftIcon={<Download className="w-5 h-5" />}
          >
            Export
          </Button>
        </Box>
      </Box>

      <Box className="mb-3 block rounded-md bg-white">
        <Tabs value={tab} onValueChange={selectTab} className="w-full">
          <TabsList
            aria-label="Transaction status tabs"
            className="w-full justify-start overflow-auto rounded-md border-0 bg-transparent p-0 text-inherit"
          >
            {statusTabs.map((tabName) => (
              <TabsTrigger
                key={tabName}
                value={tabName}
                className="h-[3.25rem] rounded-none border-b-[2px] border-transparent px-5 py-3 text-sm font-normal text-black shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none enabled:data-[state=inactive]:hover:bg-transparent enabled:data-[state=inactive]:hover:text-black"
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
                    {totalData}
                  </Box>
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Box>

      <DataTable
        loading={isLoading || isFetching}
        data={transactions}
        columns={transactionTableColumns}
        density="compact"
        search={{
          placeholder: 'Search by Insurance Name',
          onSearch: (value: string) => {
            handleSearch(value);
          },
        }}
        pagination={{
          page,
          totalPages,
          rowsPerPage,
          totalItems,
          onPageChange: setPage,
          onRowsPerPageChange: handleRowsPerPageChange,
        }}
        noDataImage={noData}
        noDataText="No transaction data available"
        className="table-transactions"
      />
    </Box>
  );
}
