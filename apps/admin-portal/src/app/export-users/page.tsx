'use client';

import emptyStateSearchPrompt from '@public/images/empty-state-search-prompt.svg';
import { Check, Plus, X, Download } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Trash } from 'react-feather';

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
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Combobox,
} from '@repo/ui';

import { createExportUsersTableColumns } from '@/components/table-config/export-user-table-config';
import { CompactTablePagination } from '@/components/core/compact-table-pagination';
import { useExportUsers } from '@/hooks/useExportUsers.hooks';
import { useHasMounted } from '@/hooks/useHasMounted';
import { cn } from '@/lib/utils';

const ExportUsersPage = () => {
  const hasMounted = useHasMounted();
  const [isFilterDialogOpen, setIsFilterDialogOpen] = React.useState(false);
  const {
    customers,
    totalPages,
    totalItems,
    dataToDownload,

    channelList,
    productList,
    planList,
    monthList,
    filterOptions,

    page,
    limit,

    filteredUsers,
    isFiltered,

    selectedFilter,
    channel,
    product,
    plan,
    frequentBuyersSign,
    frequentBuyersValue,
    birthdayMonth,

    setPage,
    setSelectedFilter,
    setChannel,
    setProduct,
    setPlan,
    setFrequentBuyersSign,
    setFrequentBuyersValue,
    setBirthdayMonth,

    handleAddFilterData,
    handleDeleteSelectedFilter,
    handleGetFilteredData,
    resetAllFilters,
    handleGenerateXlsx,
    handleLimitChange,

    isLoading,
    isLoadingFilters,

    // Plan search
    planSearchQuery,
    handlePlanSearch,
    isSearchingPlans,
  } = useExportUsers();

  const exportUsersTableColumns = React.useMemo(
    () =>
      createExportUsersTableColumns({
        page,
        rowsPerPage: limit,
      }),
    [page, limit],
  );

  const renderEmptyState = () => {
    const isNoResults = isFiltered && customers.length === 0;

    return (
      <Box className="flex min-h-[14rem] items-center justify-center py-12 px-6">
        <Box className="flex flex-col items-center justify-center gap-5 max-w-xs text-center">
          <Image
            alt="no data"
            src={emptyStateSearchPrompt}
            className="opacity-90 transition-all duration-300 w-[160px] sm:w-[200px]"
          />

          <Box className="flex flex-col gap-1.5">
            <Box as="h3" className="text-lg font-bold text-black">
              {isNoResults ? 'No results found' : 'Build your audience'}
            </Box>
            <Box as="p" className="text-[#939597] text-sm leading-relaxed">
              {isNoResults
                ? 'Try adjusting or clearing your filters.'
                : 'Add filters to start narrowing down your list.'}
            </Box>
          </Box>

          {isNoResults && (
            <Button
              variant="outline"
              onClick={resetAllFilters}
              className="h-9 px-6 border-[#016DA1] text-[#016DA1] hover:bg-blue-50 rounded-full text-xs font-semibold transition-all active:scale-95"
            >
              Clear All Filters
            </Button>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box className="flex flex-col w-full p-4 md:p-6 gap-3">
      <Box className="flex flex-wrap justify-start pb-1 items-center">
        <Box as="h1" className="text-black font-bold text-2xl mt-2 sm:w-auto w-full">
          Export Users
        </Box>
        <Box className="flex space-x-4 ml-auto">
          <Button
            disabled={dataToDownload.length < 1}
            onClick={handleGenerateXlsx}
            className="h-10 px-5 bg-[#F5BA41] text-black enabled:hover:bg-[#e6a92d] disabled:bg-[#F2F2F2] disabled:text-[#939597] disabled:opacity-100 rounded-full transition-colors duration-200"
            leftIcon={<Download className="w-5 h-5" />}
          >
            Generate XLSX
          </Button>
        </Box>
      </Box>

      <Box className="flex bg-white rounded-xl gap-4 mb-0.5 p-4">
        <Box className="w-full">
          <Box className="flex items-center justify-between">
            <Box as="p" className="text-sm">
              Selected Filters
            </Box>
            <Box className="flex flex-col items-center justify-center">
              <Box className="flex items-center justify-between">
                <Box
                  onClick={filteredUsers.length > 0 || isFiltered ? resetAllFilters : undefined}
                  className={cn(
                    'text-sm font-bold mr-3 transition-colors',
                    filteredUsers.length > 0 || isFiltered
                      ? 'text-[#016DA1] hover:text-[#2d9ae6] cursor-pointer'
                      : 'text-[#939597] cursor-not-allowed opacity-70',
                  )}
                >
                  Reset Filter
                </Box>
                <Button
                  disabled={filteredUsers.length < 1 || isLoading}
                  onClick={handleGetFilteredData}
                  className="bg-[#016DA1] text-white enabled:hover:bg-[#015a85] disabled:bg-[#F2F2F2] disabled:text-[#939597] disabled:opacity-100 rounded-full transition-colors duration-200"
                >
                  {isLoading ? 'Loading...' : 'Get Users'}
                </Button>
              </Box>
            </Box>
          </Box>

          {filteredUsers.length > 0 && (
            <Box as="ul" className="mt-2 max-h-24 overflow-y-auto">
              {filteredUsers.map((f: any, index: number) => (
                <Box as="li" key={index} className="flex justify-between items-center mb-1.5 gap-2">
                  <Box className="bg-[#F8F8F8] py-2 px-4 w-full text-sm text-[#525252] rounded-md border-transparent">
                    {f.label}: {f.valueView}
                  </Box>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-7 w-7 p-0 rounded-md text-red-600 hover:bg-red-50 hover:!text-red-700"
                    onClick={() => handleDeleteSelectedFilter(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </Box>
              ))}
            </Box>
          )}

          <Dialog open={isFilterDialogOpen} onClose={() => setIsFilterDialogOpen(false)}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsFilterDialogOpen(true)}
                className="h-10 px-5 bg-[#F5BA41] hover:bg-[#e6a92d] rounded-full text-black w-auto mt-2"
                leftIcon={<Plus className="w-5 h-5" />}
              >
                Add Filter
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 w-[600px] max-w-full overflow-hidden rounded-3xl">
              <DialogHeader className="py-4 px-6 border-b border-gray-100">
                <DialogTitle className="text-[#016DA1] text-lg font-bold flex items-center justify-between">
                  Filters
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 text-gray-500"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </DialogClose>
                </DialogTitle>
              </DialogHeader>

              <Box className="p-6 h-full overflow-auto max-h-[70vh] flex flex-col gap-4">
                <Box className="relative">
                  <Box className="w-full">
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="h-11 border-gray-200">
                        <SelectValue placeholder="Select Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {filterOptions.map(
                            (item: any, index: number) =>
                              item.active && (
                                <SelectItem key={index} value={item.id}>
                                  {item.name}
                                </SelectItem>
                              ),
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Box>
                </Box>

                {selectedFilter === 'channel_id' && (
                  <Combobox
                    value={channel}
                    onValueChange={setChannel}
                    options={channelList
                      .filter((item: any) => item?.id)
                      .map((item: any) => ({
                        value: String(item.id),
                        label: String(item.name || 'Unknown Channel'),
                      }))}
                    placeholder="Select Channel"
                    loading={isLoadingFilters}
                    className="w-full"
                    triggerClassName="h-11 border-gray-200"
                  />
                )}

                {selectedFilter === 'product_id' && (
                  <Combobox
                    value={product}
                    onValueChange={setProduct}
                    options={productList
                      .filter((item: any) => item?.id)
                      .map((item: any) => ({
                        value: String(item.id),
                        label: String(item.name || 'Unknown Product'),
                      }))}
                    placeholder="Select Product"
                    loading={isLoadingFilters}
                    className="w-full"
                    triggerClassName="h-11 border-gray-200"
                  />
                )}

                {selectedFilter === 'plan_id' && (
                  <Combobox
                    value={plan}
                    onValueChange={setPlan}
                    options={planList
                      .filter((item: any) => item?.id)
                      .map((item: any) => ({
                        value: String(item.id),
                        label: String(item.name || 'Unknown Plan'),
                      }))}
                    placeholder="Select Plan"
                    searchPlaceholder="Search plans..."
                    onSearchValueChange={handlePlanSearch}
                    searchValue={planSearchQuery}
                    loading={(isLoadingFilters && !planSearchQuery) || isSearchingPlans}
                    className="w-full"
                    triggerClassName="h-11 border-gray-200"
                  />
                )}

                {selectedFilter === 'frequent_buyers' && (
                  <Box className="flex flex-col gap-4">
                    <Box className="relative">
                      <Box className="w-full">
                        <Select value={frequentBuyersSign} onValueChange={setFrequentBuyersSign}>
                          <SelectTrigger className="h-11 border-gray-200">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="<">{`<`}</SelectItem>
                              <SelectItem value=">">{`>`}</SelectItem>
                              <SelectItem value="<=">{`<=`}</SelectItem>
                              <SelectItem value=">=">{`>=`}</SelectItem>
                              <SelectItem value="=">{`=`}</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Box>
                    </Box>
                    <Box>
                      <Input
                        disabled={!frequentBuyersSign}
                        name="frequentBuyersValue"
                        type="number"
                        min={1}
                        value={frequentBuyersValue}
                        onChange={(e) => setFrequentBuyersValue(Number(e.target.value))}
                        className="bg-[#F8F8F8] py-3 px-4 w-full text-sm text-[#525252] rounded-md border-transparent h-11"
                        placeholder="Enter value"
                      />
                    </Box>
                  </Box>
                )}

                {selectedFilter === 'birthday_month' && (
                  <Box className="relative">
                    <Box className="w-full">
                      <Select value={birthdayMonth} onValueChange={setBirthdayMonth}>
                        <SelectTrigger className="h-11 border-gray-200">
                          <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {monthList.map((item: any, index: number) => (
                              <SelectItem key={index} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Box>
                  </Box>
                )}
              </Box>

              <DialogFooter className="justify-center sm:justify-center p-6 border-t border-gray-100">
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="h-10 px-8 bg-[#F5BA41] hover:bg-[#e6a92d] rounded-full text-black font-semibold transition-all duration-200 shadow-sm"
                    onClick={() => {
                      handleAddFilterData();
                      setIsFilterDialogOpen(false);
                    }}
                    leftIcon={<Check className="w-5 h-5" />}
                  >
                    Add
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Box>
      </Box>

      <Box className="w-full bg-white rounded-xl p-4">
        {isFiltered && (customers.length > 0 || isLoading) ? (
          <DataTable
            className="!gap-3 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
            loading={isLoading}
            data={customers}
            columns={exportUsersTableColumns}
            pagination={{
              pageIndex: page - 1,
              pageSize: limit,
              pageCount: totalPages,
              rowCount: totalItems,
              onPageChange: (pageIndex) => {
                if (isLoading) return;
                setPage(pageIndex + 1);
              },
              onPageSizeChange: (pageSize) => {
                if (isLoading) return;
                handleLimitChange({ target: { value: String(pageSize) } } as any);
              },
            }}
            pageSizeOptions={[10, 20, 30, 50, 100]}
            emptyState={renderEmptyState()}
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
              getRowId: (row, index) => row?.id || `export-user-row-${index}`,
            }}
          />
        ) : (
          renderEmptyState()
        )}
      </Box>
    </Box>
  );
};

ExportUsersPage.displayName = 'ExportUsersPage';
export default ExportUsersPage;
