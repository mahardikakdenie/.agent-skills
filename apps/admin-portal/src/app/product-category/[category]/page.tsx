'use client';

import { PlusIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { type ChangeEvent, useMemo } from 'react';

import { Box, Button, Combobox, DataTable, Input } from '@repo/ui';

import {
  createProductCatalogTableColumns,
  ProductCatalogTableData,
} from '@/components/table-config/product-catalog-table-config';
import { CompactTablePagination } from '@/components/core/compact-table-pagination';
import AppURL from '@/constants/app-url.const';

import { useProducts } from '../hooks';

interface InsuranceListItem {
  id: string;
  name: string;
}

interface CategoryMenuItem {
  id?: string;
  url: string;
  label: string;
  slug?: string;
}

export default function ProductCatalogPage() {
  const { category } = useParams<{ category: string }>();

  return <ProductCatalogContent category={category} />;
}

interface ProductCatalogContentProps {
  category: string;
}

function ProductCatalogContent({ category }: ProductCatalogContentProps) {
  const router = useRouter();

  const {
    catalogPlans,
    totalPages,
    totalItems,
    subMenuItems,
    insurances,
    isLoadingCatalogPlans,
    page,
    rowsPerPage,
    setPage,
    searchPlanName,
    setSearchPlanName,
    searchInsurer,
    canCreate,
    canDelete,
    handleDeletePlan,
    handleViewDetail,
    handleSearchInsurerOnChange,
    handleRowsPerPageChange,
  } = useProducts({ category });

  const productCatalogTableColumns = useMemo(
    () =>
      createProductCatalogTableColumns({
        page,
        rowsPerPage,
        onViewDetail: handleViewDetail,
        onDelete: handleDeletePlan,
        canDelete,
      }),
    [page, rowsPerPage, handleViewDetail, handleDeletePlan, canDelete],
  );

  const insuranceOptions = useMemo(
    () =>
      (insurances as InsuranceListItem[]).map((insurance) => ({
        label: insurance.name,
        value: insurance.id,
      })),
    [insurances],
  );

  const categoryMenuItems = subMenuItems as CategoryMenuItem[];

  const activeCategoryLabel = useMemo(() => {
    const activeItem = categoryMenuItems.find(
      (item) =>
        item.slug === category || item.url === `${AppURL.productCategory}?category=${category}`,
    );

    return activeItem?.label || category.split('-').map(capitalizeCategoryWord).join(' ');
  }, [category, categoryMenuItems]);

  return (
    <Box className="flex w-full flex-col md:flex-row md:items-start">
      <Box className="flex w-full flex-col p-4 md:p-6">
        <Box className="flex gap-2 sm:flex-row flex-col sm:pb-0 pb-4">
          <Box as="h1" className="text-black font-bold sm:text-2xl text-xl mt-2 mb-4">
            Product Catalog - {activeCategoryLabel}
          </Box>
          <Button
            onClick={() => router.push(AppURL.productCatalogAdd(category))}
            disabled={!canCreate}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:ml-auto"
            leftIcon={<PlusIcon className="w-5 h-5" />}
          >
            Add Plan
          </Button>
        </Box>

        <Box className="flex flex-col gap-4 xl:flex-row xl:items-start">
          <ProductCategorySection
            activeCategory={category}
            items={categoryMenuItems}
            onSelectCategory={(url) => router.push(url)}
          />
          <Box className="flex-1 min-w-0">
            <Box className="flex gap-4 items-center sm:flex-row flex-col mb-4">
              <Combobox
                options={insuranceOptions}
                value={searchInsurer}
                onValueChange={(v) => handleSearchInsurerOnChange(v || '')}
                placeholder="Select Insurer"
                searchPlaceholder="Search Insurer..."
                triggerClassName="h-12"
                className="w-full"
                clearable
              />
              <Input
                type="text"
                placeholder="Search by Plan Name"
                className="h-12 rounded border p-2 w-full"
                value={searchPlanName}
                onChange={(e) => setSearchPlanName(e.target.value)}
              />
            </Box>

            <DataTable
              className="!gap-3 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
              loading={isLoadingCatalogPlans}
              data={catalogPlans as ProductCatalogTableData[]}
              columns={productCatalogTableColumns}
              defaultState={{
                columnPinning: {
                  left: ['index', 'insurer'],
                  right: ['actions'],
                },
              }}
              enablePagination={true}
              pagination={{
                pageIndex: page - 1,
                pageSize: rowsPerPage,
                pageCount: totalPages,
                rowCount: totalItems,
                onPageChange: (pageIndex) => {
                  if (isLoadingCatalogPlans) {
                    return;
                  }

                  setPage(pageIndex + 1);
                },
                onPageSizeChange: (pageSize) => {
                  if (isLoadingCatalogPlans) {
                    return;
                  }

                  handleRowsPerPageChange({
                    target: { value: String(pageSize) },
                  } as ChangeEvent<HTMLSelectElement>);
                },
              }}
              pageSizeOptions={[10, 20, 30, 50]}
              emptyState={
                <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center py-4 text-sm text-slate-600 md:min-h-[11rem] md:py-5">
                  No product catalog data available
                </Box>
              }
              renderPagination={(table) => (
                <Box className="-mt-1">
                  <CompactTablePagination
                    table={table}
                    pageSizeOptions={[10, 20, 30, 50]}
                    disabled={isLoadingCatalogPlans}
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
                getRowId: (row, index) => row?.id || `product-catalog-row-${index}`,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function capitalizeCategoryWord(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

interface ProductCategorySectionProps {
  activeCategory: string;
  items: CategoryMenuItem[];
  onSelectCategory: (url: string) => void;
}

function ProductCategorySection({
  activeCategory,
  items,
  onSelectCategory,
}: ProductCategorySectionProps) {
  return (
    <Box
      as="aside"
      aria-label="Product categories"
      className="flex w-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm xl:sticky xl:w-56 xl:flex-shrink-0"
      style={{
        top: '2rem',
        maxHeight: 'calc(100vh - var(--fs-navbar-height, 64px) - 6rem)',
      }}
    >
      <Box className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <Box className="min-w-0">
          <Box as="h2" className="text-sm font-semibold leading-5 text-slate-900">
            Product Categories
          </Box>
        </Box>
      </Box>

      <Box className="max-h-32 min-h-0 overflow-x-auto overflow-y-hidden px-2 pb-4 pt-2 xl:max-h-none xl:flex-1 xl:overflow-y-auto xl:overflow-x-hidden">
        <Box as="nav" className="flex gap-2 xl:flex-col" aria-label="Product category list">
          {items.length > 0 ? (
            items.map((item) => {
              const isActive =
                item.slug === activeCategory ||
                item.url === `${AppURL.productCategory}?category=${activeCategory}`;

              return (
                <Box
                  as="button"
                  key={item.id || item.url}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onSelectCategory(item.url)}
                  className={`group flex min-w-max cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors lg:min-w-0 ${
                    isActive
                      ? 'bg-sky-50 text-[#016DA1] ring-1 ring-sky-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Box as="span" className="min-w-0 truncate font-medium">
                    {item.label}
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box className="flex min-h-20 w-full items-center justify-center px-3 py-4 text-center text-sm text-slate-500">
              No matching categories
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
