'use client';

import noData from '@public/images/no-data.webp';
import { format } from 'date-fns';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { Plus, X } from 'react-feather';

import {
  Box,
  Button,
  DataTable,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@repo/ui';

import { createCampaignTableColumns } from '@/components/table-config/campaign-table-config';
import { CompactTablePagination } from '@/components/core/compact-table-pagination';
import { DebouncedSearchInput } from '@/components/core/debounced-search-input';
import { useCampaign } from '@/hooks/useCampaign.hooks';
import { cn } from '@/lib/utils';

let tableMeasureContext: CanvasRenderingContext2D | null = null;
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

export default function PromotionPage() {
  const {
    promotions,
    totalItems,
    totalPages,
    selectedPromotion,

    page,
    rowsPerPage,

    drawerOpen,
    hasAccess,
    canEdit,
    canDelete,

    channelNames,
    insuranceNames,
    productNames,
    planNames,
    vouchers,
    embeddedDiscount,

    setPage,
    setRowsPerPage,
    setDrawerOpen,

    isLoading,
    isDetailLoading,
    detailError,

    handleViewDetail,
    handleEditCampaign,
    handleDelete,
    addNewCampaign,
    handleSearch,
    getStatusColor,
    renderStatus,
  } = useCampaign();

  const nameColumnSize = useMemo(
    () =>
      Math.max(
        164,
        Math.ceil(
          Math.max(
            measureTextWidth('Campaign Name', '500 14px Arial', 6.8),
            (promotions || []).reduce((widest: number, item: any) => {
              const label = item?.name || '-';
              return Math.max(widest, measureTextWidth(label, '400 13px Arial', 6.6));
            }, 0),
          ) + 28,
        ),
      ),
    [promotions],
  );

  const campaignTableColumns = createCampaignTableColumns({
    page,
    rowsPerPage,
    handleViewDetail,
    handleDelete,
    canDelete,
    renderStatus,
    nameColumnSize,
  });

  if (hasAccess === null) {
    return null;
  }

  return (
    <Box className="flex min-h-0 flex-1 w-full flex-col gap-3 p-4 md:p-6">
      <Box className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between 2xl:items-center">
        <Box as="h1" className="text-2xl font-bold text-black">
          Promotions Campaign
        </Box>
        <Box className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 xl:w-auto 2xl:flex-nowrap">
          <Button
            onClick={addNewCampaign}
            className="h-10 rounded-full bg-[#F5BA41] px-5 text-black hover:bg-[#e6a92d] sm:ml-auto xl:ml-0"
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Add Campaign
          </Button>
        </Box>
      </Box>

      <DataTable
        className="!gap-3 pb-4 md:pb-6 [&_th]:px-2.5 [&_th]:py-2.5 [&_td]:px-2.5 [&_td]:py-3"
        loading={isLoading}
        data={promotions || []}
        columns={campaignTableColumns}
        defaultState={{
          columnPinning: {
            left: ['index', 'name'],
            right: ['action'],
          },
        }}
        pagination={{
          pageIndex: page - 1,
          pageSize: rowsPerPage,
          pageCount: totalPages,
          rowCount: totalItems,
          onPageChange: (pageIndex) => {
            if (isLoading) return;
            setPage(pageIndex + 1);
          },
          onPageSizeChange: (pageSize) => {
            if (isLoading) return;
            setRowsPerPage(pageSize);
          },
        }}
        pageSizeOptions={[10, 20, 30, 50, 100]}
        emptyState={
          <Box className="sticky left-0 flex min-h-[10rem] w-[100cqw] items-center justify-center gap-2 py-4 md:min-h-[11rem] md:py-5">
            <Box className="flex flex-col items-center justify-center gap-2">
              <Image alt="No campaign data" src={noData} width={128} />
              <Box as="span">No campaign data available</Box>
            </Box>
          </Box>
        }
        renderToolbar={() => (
          <Box className="w-full">
            <DebouncedSearchInput
              value=""
              placeholder="Search by Campaign Name"
              ariaLabel="Search by Campaign Name"
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
          getRowId: (row, index) => row?.campaign_id || `campaign-row-${index}`,
        }}
      />

      <Drawer direction="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <DrawerContent className="max-w-[30rem]">
          <DrawerHeader className="gap-0 pb-0">
            <DrawerClose className="absolute right-3 top-3">
              <Button
                variant="ghost"
                className="h-8 w-8 rounded-full p-0 shadow-none"
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </DrawerClose>
            <DrawerTitle className="pr-10 text-2xl font-bold tracking-tight text-black">
              Campaign Details
            </DrawerTitle>
          </DrawerHeader>
          <Box className="mt-4 flex-1 overflow-y-auto px-6 pt-1 pb-6 md:pb-8">
            <DrawerDescription className="block text-inherit">
              <Box className="flex w-full flex-col">
                {isDetailLoading ? (
                  <Box className="flex flex-1 items-center justify-center py-10 text-sm font-medium text-black">
                    Loading campaign details...
                  </Box>
                ) : detailError ? (
                  <Box className="flex flex-1 items-center justify-center py-10 text-sm font-medium text-red-600">
                    {detailError}
                  </Box>
                ) : !selectedPromotion ? (
                  <Box className="flex flex-1 items-center justify-center py-10 text-sm font-medium text-black">
                    No campaign details available.
                  </Box>
                ) : (
                  <React.Fragment>
                    <Box className="flex flex-col gap-4">
                      <Box className="w-full rounded-2xl bg-slate-50/80 p-4 ring-1 ring-slate-200/70 md:p-5">
                        <Box className="flex flex-col gap-3.5 text-black">
                          <Box className="grid gap-3">
                            <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                              <Box className="font-medium text-slate-700">Campaign Name</Box>
                              <Box className="text-slate-400">:</Box>
                              <Box className="min-w-0 break-words text-slate-900">
                                {selectedPromotion?.name}
                              </Box>
                            </Box>
                            <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                              <Box className="font-medium text-slate-700">Promotion Type</Box>
                              <Box className="text-slate-400">:</Box>
                              <Box className="min-w-0 break-words text-slate-900">
                                {selectedPromotion?.type}
                              </Box>
                            </Box>
                            <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                              <Box className="font-medium text-slate-700">Start Date</Box>
                              <Box className="text-slate-400">:</Box>
                              <Box className="min-w-0 break-words text-slate-900 tabular-nums">
                                {selectedPromotion?.start_date
                                  ? format(new Date(selectedPromotion.start_date), 'dd-MM-yyyy')
                                  : 'N/A'}
                              </Box>
                            </Box>
                            <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                              <Box className="font-medium text-slate-700">End Date</Box>
                              <Box className="text-slate-400">:</Box>
                              <Box className="min-w-0 break-words text-slate-900 tabular-nums">
                                {selectedPromotion?.end_date
                                  ? format(new Date(selectedPromotion.end_date), 'dd-MM-yyyy')
                                  : 'N/A'}
                              </Box>
                            </Box>
                            <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                              <Box className="font-medium text-slate-700">Value</Box>
                              <Box className="text-slate-400">:</Box>
                              <Box className="min-w-0 break-words text-slate-900 tabular-nums">
                                {selectedPromotion?.value_type === 'percentage'
                                  ? `${selectedPromotion?.value}%`
                                  : `${selectedPromotion?.value_currency} ${Number(
                                      selectedPromotion?.value,
                                    ).toLocaleString()}`}
                              </Box>
                            </Box>
                            <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                              <Box className="font-medium text-slate-700">Status</Box>
                              <Box className="text-slate-400">:</Box>
                              <Box className="min-w-0 break-words font-semibold text-warning">
                                <Box
                                  as="span"
                                  className={getStatusColor(selectedPromotion?.active ?? false)}
                                >
                                  {selectedPromotion?.active ? 'Active' : 'Inactive'}
                                </Box>
                              </Box>
                            </Box>
                            <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                              <Box className="font-medium text-slate-700">
                                Minimum Transaction Amount
                              </Box>
                              <Box className="text-slate-400">:</Box>
                              <Box className="min-w-0 break-words text-slate-900">
                                {selectedPromotion?.minimum_amount}
                              </Box>
                            </Box>
                            <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                              <Box className="font-medium text-slate-700">
                                Maximum Discount Amount
                              </Box>
                              <Box className="text-slate-400">:</Box>
                              <Box className="min-w-0 break-words text-slate-900">
                                {selectedPromotion?.maximum_amount}
                              </Box>
                            </Box>
                            <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                              <Box className="font-medium text-slate-700">Channels</Box>
                              <Box className="text-slate-400">:</Box>
                              <Box className="min-w-0 break-words text-slate-900">
                                {selectedPromotion?.embedded_discount_channels &&
                                selectedPromotion.embedded_discount_channels.length > 0 ? (
                                  selectedPromotion.embedded_discount_channels.map(
                                    (channel: { channel_id: string }) => (
                                      <Box as="p" key={channel.channel_id}>
                                        • {channelNames.get(channel.channel_id) || 'Unknown'}
                                      </Box>
                                    ),
                                  )
                                ) : (
                                  <Box as="p">No channels</Box>
                                )}
                              </Box>
                            </Box>
                            <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                              <Box className="font-medium text-slate-700">Insurances</Box>
                              <Box className="text-slate-400">:</Box>
                              <Box className="min-w-0 break-words text-slate-900">
                                {selectedPromotion?.embedded_discount_insurances &&
                                selectedPromotion.embedded_discount_insurances.length > 0 ? (
                                  selectedPromotion.embedded_discount_insurances.map(
                                    (insurance: { insurance_id: string }) => (
                                      <Box as="p" key={insurance.insurance_id}>
                                        • {insuranceNames.get(insurance.insurance_id) || 'Unknown'}
                                      </Box>
                                    ),
                                  )
                                ) : (
                                  <Box as="p">No insurances</Box>
                                )}
                              </Box>
                            </Box>
                            <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                              <Box className="font-medium text-slate-700">Products</Box>
                              <Box className="text-slate-400">:</Box>
                              <Box className="min-w-0 break-words text-slate-900">
                                {selectedPromotion?.embedded_discount_products &&
                                selectedPromotion.embedded_discount_products.length > 0 ? (
                                  selectedPromotion.embedded_discount_products.map(
                                    (product: { product_id: string }) => (
                                      <Box as="p" key={product.product_id}>
                                        • {productNames.get(product.product_id) || 'Unknown'}
                                      </Box>
                                    ),
                                  )
                                ) : (
                                  <Box as="p">No products</Box>
                                )}
                              </Box>
                            </Box>
                            <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                              <Box className="font-medium text-slate-700">Plans</Box>
                              <Box className="text-slate-400">:</Box>
                              <Box className="min-w-0 break-words text-slate-900">
                                {selectedPromotion?.embedded_discount_plans &&
                                selectedPromotion.embedded_discount_plans.length > 0 ? (
                                  selectedPromotion.embedded_discount_plans.map(
                                    (plan: { plan_id: string }) => (
                                      <Box as="p" key={plan.plan_id}>
                                        • {planNames.get(plan.plan_id) || 'Unknown'}
                                      </Box>
                                    ),
                                  )
                                ) : (
                                  <Box as="p">No plans</Box>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      {selectedPromotion?.type === 'embedded' && (
                        <Box className="mt-4 w-full rounded-2xl bg-slate-50/80 p-4 ring-1 ring-slate-200/70 md:p-5">
                          <Box className="flex flex-col gap-3.5 text-black">
                            <Box as="h3" className="text-[14px] font-bold text-slate-900">
                              Embedded Details
                            </Box>
                            <Box className="grid gap-3">
                              {Array.isArray(embeddedDiscount) && embeddedDiscount.length > 0 ? (
                                embeddedDiscount.map((embedded: any, index: number) => (
                                  <Box
                                    key={index}
                                    className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5"
                                  >
                                    <Box className="font-medium text-slate-700">
                                      Total Discount Usage
                                    </Box>
                                    <Box className="text-slate-400">:</Box>
                                    <Box className="min-w-0 break-words text-slate-900 tabular-nums">
                                      {`${embedded.currency} ${(
                                        embedded.total_transaction_amount -
                                        embedded.total_discount_amount
                                      ).toLocaleString()}`}
                                    </Box>
                                  </Box>
                                ))
                              ) : (
                                <Box as="p" className="text-[13px] text-slate-500">
                                  Total Discount Usage is not available.
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      )}

                      {selectedPromotion?.type === 'voucher' && vouchers.length > 0 && (
                        <Box className="mt-4 w-full rounded-2xl bg-slate-50/80 p-4 ring-1 ring-slate-200/70 md:p-5">
                          <Box className="flex flex-col gap-3.5 text-black">
                            <Box as="h3" className="text-[14px] font-bold text-slate-900">
                              Voucher Details
                            </Box>
                            <Box className="grid gap-4">
                              {vouchers.map((voucher: any, index: number) => (
                                <Box
                                  key={index}
                                  className="grid gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200/50"
                                >
                                  <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                                    <Box className="font-medium text-slate-700">Code</Box>
                                    <Box className="text-slate-400">:</Box>
                                    <Box className="min-w-0 break-words text-slate-900">
                                      {voucher.code}
                                    </Box>
                                  </Box>
                                  <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                                    <Box className="font-medium text-slate-700">Usage Limit</Box>
                                    <Box className="text-slate-400">:</Box>
                                    <Box className="min-w-0 break-words text-slate-900 tabular-nums">
                                      {voucher.usage_limit}
                                    </Box>
                                  </Box>
                                  <Box className="grid grid-cols-[minmax(6.75rem,8rem)_0.5rem_minmax(0,1fr)] items-start gap-x-2.5 text-left text-[13px] leading-5">
                                    <Box className="font-medium text-slate-700">Used Count</Box>
                                    <Box className="text-slate-400">:</Box>
                                    <Box className="min-w-0 break-words text-slate-900 tabular-nums">
                                      {voucher.used_count}
                                    </Box>
                                  </Box>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      )}

                      <Box className="flex justify-center pt-2">
                        <Button
                          onClick={() => handleEditCampaign(selectedPromotion.campaign_id)}
                          disabled={!canEdit}
                          className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 flex items-center justify-center h-10 min-w-32 shadow-none"
                        >
                          Edit
                        </Button>
                      </Box>
                    </Box>
                  </React.Fragment>
                )}
              </Box>
            </DrawerDescription>
          </Box>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
