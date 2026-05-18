'use client';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Box, DateRangePicker } from '@repo/ui';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';

import DetailTable from '@/components/table-policy';
import VerticalBarChart from '@/components/ui/charts/bar-chart-vertical';
import LineChart from '@/components/ui/charts/line-chart';
import PieChart from '@/components/ui/charts/pie-chart';
import { ContentLoadingWrapper } from '@/components/ui/loading';
import useClaimDashboard from '@/hooks/useClaimDashboard.hooks';
import { numberSimpleFormatter } from '@/lib/formatter';
import { formatMoney } from '@/lib/formatter';

const claimColumns = [
  { key: 'created_at', label: 'Created At' },
  { key: 'number', label: 'Number' },
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'amount_approved', label: 'Amount Approved' },
  { key: 'status', label: 'Status' },
];

const claimLineChartSeries = [
  {
    dataKey: 'total_claim_amount',
    name: 'Total Claim Amount',
    type: 'bar' as const,
    color: '#e83f3f94',
    yAxisId: 'right',
    barSize: 40,
    valueFormatter: (value: number | string) => formatMoney(Number(value) || 0),
  },
  {
    dataKey: 'count',
    name: 'Total Claims',
    type: 'line' as const,
    color: '#006de5',
    yAxisId: 'left',
  },
];

export default function DashboardClaim() {
  const {
    insuranceOptions,
    productOptions,
    planOptions,
    selectedInsuranceId,
    selectedProduct,
    selectedPlan,
    dateRange,
    setSelectedInsuranceId,
    setSelectedProduct,
    setSelectedPlan,
    setDateRange,
    isLoadingStatistics,
    pieChartData,
    lineChartData,
    barChartData,
    tableData,
    totalClaimAmount,
    totalClaimAmountApproved,
    totalClaim,
    totalClaimApproved,
  } = useClaimDashboard();

  const { control } = useForm({
    shouldUnregister: false,
    defaultValues: {
      insurance: selectedInsuranceId,
      product: selectedProduct,
      plan: selectedPlan,
    },
  });

  return (
    <Box className="w-full bg-[#ebf6ff] p-5 min-h-screen">
      <Box className="text-center bg-primary px-5 py-4 rounded-md shadow-sm mb-5">
        <Box as="h5" className="text-2xl font-bold text-white">
          Insurance Claim Performance Dashboard
        </Box>
      </Box>

      <Box className="flex gap-3">
        <Box className="grid grid-cols-4 gap-4 mb-4 w-full">
          <Box>
            <Controller
              name="insurance"
              control={control}
              render={({ field }) => (
                <Select
                  value={selectedInsuranceId}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedInsuranceId(value);
                  }}
                >
                  <SelectTrigger className="w-full h-12 shadow border-0 select-status bg-white hover:cursor-pointer py-2">
                    <SelectValue placeholder="INSURANCE NAME " />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {insuranceOptions.map((insurance: any) => (
                        <SelectItem key={insurance.value} value={insurance.value}>
                          {insurance.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Box>
          <Box>
            <Controller
              name="product"
              control={control}
              render={({ field }) => (
                <Select
                  value={selectedProduct}
                  disabled={selectedInsuranceId === 'All' || selectedInsuranceId === ''}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedProduct(value);
                  }}
                >
                  <SelectTrigger className="w-full disabled:opacity-100 disabled:bg-gray-200 disabled:shadow-none h-12 text-left shadow border-0 select-status bg-white hover:cursor-pointer py-2">
                    <SelectValue placeholder="INSURANCE PRODUCT" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {productOptions.map((prod: any) => (
                        <SelectItem key={prod.value} value={prod.value}>
                          {prod.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Box>
          <Box>
            <Controller
              name="plan"
              control={control}
              render={({ field }) => (
                <Select
                  value={selectedPlan}
                  disabled={selectedProduct === 'All' || selectedProduct === ''}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedPlan(value);
                  }}
                >
                  <SelectTrigger className="w-full disabled:opacity-100 disabled:bg-gray-200 disabled:shadow-none h-12 text-left shadow border-0 select-status bg-white hover:cursor-pointer py-2">
                    <SelectValue placeholder="PLAN NAME" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {planOptions.map((prod: any) => (
                        <SelectItem key={prod.value} value={prod.value}>
                          {prod.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Box>
          <DateRangePicker
            value={dateRange ?? null}
            onChange={(range) =>
              setDateRange(range?.from ? { from: range.from, to: range.to } : undefined)
            }
            changeBehavior="complete"
            className="text-xs [&_[data-slot=date-range-picker-control]]:min-h-[46px] [&_[data-slot=date-range-picker-control]]:border-0 [&_[data-slot=date-range-picker-control]]:bg-white [&_[data-slot=date-range-picker-control]]:shadow [&_[data-slot=date-range-picker-trigger]]:text-[13px]"
          />
        </Box>
      </Box>

      <ContentLoadingWrapper
        isLoading={isLoadingStatistics}
        loadingText="Loading claim statistics..."
      >
        <Box className="grid grid-cols-4 gap-4 mb-4">
          <Box className="bg-white p-5 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
            <Box as="p" className="text-3xl font-bold text-center">
              {numberSimpleFormatter(totalClaimAmount)}
            </Box>
            <Box as="h5" className="text-xs">
              Total Claim Amount
            </Box>
          </Box>
          <Box className="bg-white p-5 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
            <Box as="p" className="text-3xl font-bold text-center">
              {numberSimpleFormatter(totalClaimAmountApproved)}
            </Box>
            <Box as="h5" className="text-xs">
              Total Claim Amount Approved
            </Box>
          </Box>
          <Box className="bg-white p-5 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
            <Box as="p" className="text-3xl font-bold text-center">
              {numberSimpleFormatter(totalClaim)}
            </Box>
            <Box as="h5" className="text-xs">
              Total Claim
            </Box>
          </Box>
          <Box className="bg-white p-5 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
            <Box as="p" className="text-3xl font-bold text-center">
              {numberSimpleFormatter(totalClaimApproved)}
            </Box>
            <Box as="h5" className="text-xs">
              Total Claim Approved
            </Box>
          </Box>
        </Box>
        <Box className="grid grid-cols-12 gap-4 mb-4">
          <Box className="col-span-4">
            <Box className="flex flex-col gap-4">
              <Box className="bg-white p-5 rounded-md shadow-sm">
                <Box as="h5" className="font-semibold">
                  Claim Type
                </Box>
                <Box className="w-full h-[312px]">
                  <PieChart data={pieChartData} />
                </Box>
              </Box>
              <Box className="bg-white p-5 rounded-md shadow-sm">
                <Box as="h5" className="font-semibold">
                  Claim Status
                </Box>
                <Box className="w-full h-[503px]">
                  <VerticalBarChart data={barChartData} />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="col-span-8">
            <Box className="flex flex-col gap-4">
              <Box className="bg-white py-5 rounded-md shadow-sm w-full mb-4">
                <Box as="h5" className="font-semibold mb-3 pl-5">
                  Claim Trends
                </Box>
                <Box className="h-[300px]">
                  <LineChart data={lineChartData} series={claimLineChartSeries} />
                </Box>
              </Box>
            </Box>
            <Box className="bg-white p-5 rounded-md shadow-sm w-full table-claim min-h-[567px]">
              <Box as="h5" className="font-semibold mb-3">
                Detail Claim
              </Box>
              <DetailTable data={tableData} columns={claimColumns} />
            </Box>
          </Box>
        </Box>
      </ContentLoadingWrapper>
    </Box>
  );
}
