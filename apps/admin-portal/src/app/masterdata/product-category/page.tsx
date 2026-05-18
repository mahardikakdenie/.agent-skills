'use client';

import noData from '@public/images/no-data.webp';
import { PlusIcon } from 'lucide-react';
import Image from 'next/image';

import { Box, Button, DataTable } from '@repo/ui';

import { createProductCategoryTableColumns } from '@/components/table-config/product-category-table-config';
import { useProductCategory } from '@/hooks/useProductCategory.hooks';

export default function ProductCategoryPage() {
  const {
    categories,
    hasAccess,
    canEdit,
    canCreate,
    canDelete,
    isLoading,
    handleEdit,
    handleDelete,
    addNewCategory,
  } = useProductCategory();

  if (hasAccess === false) {
    return null;
  }

  const productCategoryTableColumns = createProductCategoryTableColumns({
    handleEdit,
    handleDelete,
    canEdit,
    canDelete,
  });

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black">
          Product Category
        </Box>
        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          <Button
            onClick={addNewCategory}
            disabled={!canCreate}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:ml-auto"
            leftIcon={<PlusIcon className="w-5 h-5" />}
          >
            Add New
          </Button>
        </Box>
      </Box>

      <DataTable
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isLoading}
        data={categories}
        columns={productCategoryTableColumns}
        defaultState={{
          columnPinning: {
            left: ['id', 'name'],
            right: ['action'],
          },
        }}
        enablePagination={false}
        emptyState={
          <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Box className="flex flex-col items-center justify-center gap-2">
              <Image alt="No product category data" src={noData} width={128} />
              <Box as="span">No product category data available</Box>
            </Box>
          </Box>
        }
        tableOptions={{
          manualPagination: true,
          enableColumnPinning: true,
          enableColumnResizing: true,
          defaultColumn: {
            minSize: 48,
            size: 96,
          },
          getRowId: (row, index) => row?.id || `product-category-row-${index}`,
        }}
      />
    </Box>
  );
}
