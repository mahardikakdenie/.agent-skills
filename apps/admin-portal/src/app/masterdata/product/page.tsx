'use client';

import noData from '@public/images/no-data.webp';
import Image from 'next/image';
import { Plus } from 'react-feather';

import { Box, Button, DataTable, Tabs, TabsList, TabsTrigger } from '@repo/ui';

import { createProductTableColumns } from '@/components/table-config/product-table-config';
import { CompactTablePagination } from '@/components/ui/compact-table-pagination';
import { useProduct } from '@/hooks/useProduct.hooks';

export default function Product() {
  const {
    insurances,
    categories,
    totalPages,
    totalItems,
    page,
    rowsPerPage,
    selectedTab,
    hasAccess,
    canEdit,
    canCreate,
    isLoading,
    setPage,
    setRowsPerPage,
    selectTab,
    handleEdit,
    addNewProduct,
  } = useProduct();

  if (hasAccess === false) {
    return null;
  }

  const productTableColumns = createProductTableColumns({
    page,
    rowsPerPage,
    handleEdit,
    canEdit,
  });

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black">
          Product
        </Box>
        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          <Button
            onClick={addNewProduct}
            disabled={!canCreate}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:ml-auto"
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Add New
          </Button>
        </Box>
      </Box>

      <Box className="block rounded-xl bg-white">
        <Tabs
          value={selectedTab}
          onValueChange={selectTab}
          variant="underline"
          className="w-full [&_[data-slot=tabs-list-shell]]:rounded-md"
        >
          <TabsList
            aria-label="Product categories tabs"
            className="w-full justify-start rounded-md border-0 bg-transparent p-0 text-inherit overflow-auto"
          >
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                variant="underline"
                className="h-12 px-4 py-2.5 text-sm font-normal whitespace-nowrap"
              >
                <Box as="span" className="mr-2.5">
                  {category.name
                    .split('-')
                    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </Box>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Box>

      <DataTable
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isLoading}
        data={insurances}
        columns={productTableColumns}
        defaultState={{
          columnPinning: {
            left: ['id', 'name'],
            right: ['action'],
          },
        }}
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

            setRowsPerPage(pageSize);
          },
        }}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        emptyState={
          <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Box className="flex flex-col items-center justify-center gap-2">
              <Image alt="No product data" src={noData} width={128} />
              <Box as="span">No product data available</Box>
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
          getRowId: (row, index) => row?.id || `product-row-${index}`,
        }}
      />
    </Box>
  );
}
