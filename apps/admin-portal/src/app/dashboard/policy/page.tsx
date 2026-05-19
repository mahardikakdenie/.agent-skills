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

import LineChart from '@/components/core/linechart-policy';
import DetailTable from '@/components/core/table-policy';
import PieChart from '@/components/core/pie-chart';
import { ContentLoadingWrapper } from '@/components/core/loading';
import usePolicyDashboard from '@/hooks/usePolicyDashboard.hooks';
import { numberSimpleFormatter } from '@/lib/formatter';

const policyColumns = [
  { key: 'number', label: 'Number' },
  { key: 'plan_name', label: 'Plan Name' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Created At' },
];

export default function DashboardPolicy() {
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
    tableData,
    totalPolicies,
    totalPremium,
  } = usePolicyDashboard();

  const { control } = useForm({
    shouldUnregister: false,
    defaultValues: {
      insurance: selectedInsuranceId,
      product: selectedProduct,
      plan: selectedPlan,
    },
  });

  return (
    <Box className="w-full shrink-0 p-5 bg-[#ebf6ff] min-h-full">
      <Box className="text-center bg-primary px-5 py-4 rounded-md shadow-sm mb-5">
        <Box as="h5" className="text-2xl font-bold text-white">
          Insurance Policy Performance Dashboard
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
        loadingText="Loading policy statistics..."
      >
        <Box className="grid grid-cols-12 gap-4 mb-4">
          <Box className="col-span-4 grid gap-4">
            <Box className="grid grid-cols-2 gap-4">
              <Box className="bg-white p-4 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
                <Box as="p" className="text-3xl font-bold text-center mb-1">
                  {totalPolicies}
                </Box>
                <Box as="h5" className="text-xs">
                  Total Policies
                </Box>
              </Box>
              <Box className="bg-white p-4 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
                <Box as="p" className="text-3xl font-bold text-center mb-1">
                  {numberSimpleFormatter(totalPremium)}
                </Box>
                <Box as="h5" className="text-xs">
                  Total GWP
                </Box>
              </Box>
            </Box>
            <Box className="bg-white p-5 rounded-md shadow-sm">
              <Box as="h5" className="font-semibold">
                Policy Type
              </Box>
              <Box className="w-full h-[300px]">
                <PieChart data={pieChartData} />
              </Box>
            </Box>
          </Box>
          <Box className="col-span-8">
            <Box className="bg-white py-5 rounded-md shadow-sm w-full">
              <Box as="h5" className="font-semibold mb-3 pl-5">
                Daily Policy Counts Trends
              </Box>
              <Box className="h-[400px]">
                <LineChart data={lineChartData} />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="bg-white p-5 rounded-md shadow-sm w-full table-policy">
          <Box as="h5" className="font-semibold mb-3">
            Detail Policy
          </Box>
          <DetailTable data={tableData} columns={policyColumns} />
        </Box>
      </ContentLoadingWrapper>
    </Box>
  );
}
