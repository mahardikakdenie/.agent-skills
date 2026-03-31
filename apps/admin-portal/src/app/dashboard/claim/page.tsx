"use client";
import React from "react";
import { DateRangePicker } from "@repo/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { Controller, useForm } from "react-hook-form";
import { numberSimpleFormatter } from "@/lib/formatter";

import PieChart from "@/components/ui/charts/piechart";
import LineChart from "@/components/ui/charts/linechart";
import DetailTable from "@/components/table-policy";
import BarChartComp from "@/components/ui/recharts/barchart-vertical";
import useClaimDashboard from "@/hooks/useClaimDashboard.hooks";
import { ContentLoadingWrapper } from "@/components/ui/loading";
import { formatMoney } from "@/lib/formatter";

const claimColumns = [
  { key: "created_at", label: "Created At" },
  { key: "number", label: "Number" },
  { key: "type", label: "Type" },
  { key: "amount", label: "Amount" },
  { key: "amount_approved", label: "Amount Approved" },
  { key: "status", label: "Status" },
];

const claimLineChartSeries = [
  {
    dataKey: "total_claim_amount",
    name: "Total Claim Amount",
    type: "bar" as const,
    color: "#e83f3f94",
    yAxisId: "right",
    barSize: 40,
    valueFormatter: (value: number | string) => formatMoney(Number(value) || 0),
  },
  {
    dataKey: "count",
    name: "Total Claims",
    type: "line" as const,
    color: "#006de5",
    yAxisId: "left",
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
    <div className="w-full bg-[#ebf6ff] p-5 min-h-screen">
      <div className="text-center bg-primary px-5 py-4 rounded-md shadow-sm mb-5">
        <h5 className="text-2xl font-bold text-white">
          Insurance Claim Performance Dashboard
        </h5>
      </div>

      <div className="flex gap-3">
        <div className="grid grid-cols-4 gap-4 mb-4 w-full">
          <div>
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
                        <SelectItem
                          key={insurance.value}
                          value={insurance.value}
                        >
                          {insurance.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Controller
              name="product"
              control={control}
              render={({ field }) => (
                <Select
                  value={selectedProduct}
                  disabled={
                    selectedInsuranceId === "All" || selectedInsuranceId === ""
                  }
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
          </div>
          <div>
            <Controller
              name="plan"
              control={control}
              render={({ field }) => (
                <Select
                  value={selectedPlan}
                  disabled={selectedProduct === "All" || selectedProduct === ""}
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
          </div>
          <DateRangePicker
            value={dateRange ?? null}
            onChange={(range) =>
              setDateRange(range?.from ? { from: range.from, to: range.to } : undefined)
            }
            changeBehavior="complete"
            className="text-xs [&_[data-slot=date-range-picker-control]]:min-h-[46px] [&_[data-slot=date-range-picker-control]]:border-0 [&_[data-slot=date-range-picker-control]]:bg-white [&_[data-slot=date-range-picker-control]]:shadow [&_[data-slot=date-range-picker-trigger]]:text-[13px]"
          />
        </div>
      </div>

      <ContentLoadingWrapper
        isLoading={isLoadingStatistics}
        loadingText="Loading claim statistics..."
      >
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-5 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-center">
              {numberSimpleFormatter(totalClaimAmount)}
            </p>
            <h5 className="text-xs">Total Claim Amount</h5>
          </div>
          <div className="bg-white p-5 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-center">
              {numberSimpleFormatter(totalClaimAmountApproved)}
            </p>
            <h5 className="text-xs">Total Claim Amount Approved</h5>
          </div>
          <div className="bg-white p-5 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-center">
              {numberSimpleFormatter(totalClaim)}
            </p>
            <h5 className="text-xs">Total Claim</h5>
          </div>
          <div className="bg-white p-5 rounded-md shadow-sm text-center flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-center">
              {numberSimpleFormatter(totalClaimApproved)}
            </p>
            <h5 className="text-xs">Total Claim Approved</h5>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-4">
            <div className="flex flex-col gap-4">
              <div className="bg-white p-5 rounded-md shadow-sm">
                <h5 className="font-semibold">Claim Type</h5>
                <div className="w-full h-[312px]">
                  <PieChart data={pieChartData} />
                </div>
              </div>
              <div className="bg-white p-5 rounded-md shadow-sm">
                <h5 className="font-semibold">Claim Status</h5>
                <div className="w-full h-[503px]">
                  <BarChartComp data={barChartData} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-8">
            <div className="flex flex-col gap-4">
              <div className="bg-white py-5 rounded-md shadow-sm w-full mb-4">
                <h5 className="font-semibold mb-3 pl-5">Claim Trends</h5>
                <div className="h-[300px]">
                  <LineChart data={lineChartData} series={claimLineChartSeries} />
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-md shadow-sm w-full table-claim min-h-[567px]">
              <h5 className="font-semibold mb-3">Detail Claim</h5>
              <DetailTable data={tableData} columns={claimColumns} />
            </div>
          </div>
        </div>
      </ContentLoadingWrapper>
    </div>
  );
}

