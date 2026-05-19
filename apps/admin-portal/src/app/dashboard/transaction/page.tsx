'use client';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  Box,
  DateRangePicker,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';

import DetailTable from '@/components/core/table-policy';
import BarChartComp from '@/components/core/bar-chart-horizontal';
import LineChart from '@/components/core/dashed-line-chart';
import PieChart from '@/components/core/pie-chart';
import { ContentLoadingWrapper } from '@/components/core/loading';
import useTransactionDashboard from '@/hooks/useTransactionDashboard.hooks';
import { formatMoney } from '@/lib/formatter';

const policyColumns = [
  { key: 'created_at', label: 'Created At' },
  { key: 'plan_name', label: 'Plan Name' },
  { key: 'price', label: 'Price' },
  { key: 'transaction', label: 'Transaction' },
];

export default function DashboardTransaction() {
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
  } = useTransactionDashboard();

  const { control } = useForm({
    shouldUnregister: false,
    defaultValues: {
      insurance: selectedInsuranceId,
      product: selectedProduct,
      plan: selectedPlan,
    },
  });

  return (
    <Box className="w-full shrink-0 bg-[#ebf6ff] p-5 min-h-full">
      <Box className="text-center bg-primary px-5 py-4 rounded-md shadow-sm mb-5">
        <Box as="h5" className="text-2xl font-bold text-white">
          Insurance Sales Performance Dashboard
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
                  <SelectTrigger className="w-full disabled:!opacity-100 disabled:!bg-[#e3f1f8] disabled:!text-slate-400 disabled:!shadow-sm disabled:!ring-1 disabled:!ring-[#cfe5f0] disabled:!cursor-not-allowed [&:disabled_[data-slot=select-icon]]:!text-slate-400 [&:disabled_[data-slot=select-value-wrapper]]:!text-slate-400 h-12 text-left shadow border-0 select-status bg-white hover:cursor-pointer py-2">
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
                  <SelectTrigger className="w-full disabled:!opacity-100 disabled:!bg-[#e3f1f8] disabled:!text-slate-400 disabled:!shadow-sm disabled:!ring-1 disabled:!ring-[#cfe5f0] disabled:!cursor-not-allowed [&:disabled_[data-slot=select-icon]]:!text-slate-400 [&:disabled_[data-slot=select-value-wrapper]]:!text-slate-400 h-12 text-left shadow border-0 select-status bg-white hover:cursor-pointer py-2">
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
        loadingText="Loading transaction statistics..."
      >
        <Box className="grid grid-cols-12 gap-4 mb-4">
          <Box className="col-span-6">
            <Box className="bg-white py-5 rounded-md shadow-sm w-full">
              <Box as="h5" className="font-semibold mb-3 pl-5">
                Daily Sales Performance
              </Box>
              <Box className="h-[400px]">
                <LineChart data={lineChartData} seriesLabel="Transactions" />
              </Box>
            </Box>
          </Box>
          <Box className="col-span-6">
            <Box className="bg-white pt-5 rounded-md shadow-sm">
              <Box as="h5" className="font-semibold pl-5">
                Daily GWP Performance
              </Box>
              <Box className="w-full h-[431px]">
                <BarChartComp
                  data={barChartData}
                  seriesLabel="GWP"
                  valueFormatter={(value) => `IDR ${formatMoney(Number(value) || 0)}`}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="grid grid-cols-3 gap-4">
          <Box className="col-span-1">
            <Box className="bg-white p-5 rounded-md shadow-sm">
              <Box as="h5" className="font-semibold">
                Total Sales by Plan Name
              </Box>
              <Box className="w-full h-[403px]">
                <PieChart data={pieChartData} minLabelPercent={0.05} showInnerPie={false} />
              </Box>
            </Box>
          </Box>
          <Box className="col-span-2">
            <Box className="bg-white p-5 rounded-md shadow-sm w-full table-transaction min-h-[466px]">
              <Box as="h5" className="font-semibold mb-3">
                Latest Transactions
              </Box>
              <DetailTable data={tableData} columns={policyColumns} />
            </Box>
          </Box>
        </Box>
      </ContentLoadingWrapper>
    </Box>
  );
}
