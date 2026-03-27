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
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";

import PieChart from "@/components/ui/recharts/piechart";
import LineChart from "@/components/ui/recharts/dashedlinechart";
import DetailTable from "@/components/ui/recharts/table-policy";
import BarChartComp from "@/components/ui/recharts/barchart-horizontal";
import useTransactionDashboard from "@/hooks/useTransactionDashboard.hooks";
import { ContentLoadingWrapper } from "@/components/ui/Loading/index";

const policyColumns = [
  { key: "created_at", label: "Created At" },
  { key: "plan_name", label: "Plan Name" },
  { key: "price", label: "Price" },
  { key: "transaction", label: "Transaction" },
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
    <div className="w-full bg-[#ebf6ff] p-5 bg-blue min-h-screen">
      <div className="text-center bg-primary px-5 py-4 rounded-md shadow-sm mb-5">
        <h5 className="text-2xl font-bold text-white">
          Insurance Sales Performance Dashboard
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
        loadingText="Loading transaction statistics..."
      >
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-6">
            <div className="bg-white py-5 rounded-md shadow-sm w-full">
              <h5 className="font-semibold mb-3 pl-5">
                Daily Sales Performance
              </h5>
              <div className="h-[400px]">
                <LineChart data={lineChartData} />
              </div>
            </div>
          </div>
          <div className="col-span-6">
            <div className="bg-white pt-5 rounded-md shadow-sm">
              <h5 className="font-semibold pl-5">Daily GWP Performance</h5>
              <div className="w-full h-[431px]">
                <BarChartComp data={barChartData} />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <div className="bg-white p-5 rounded-md shadow-sm">
              <h5 className="font-semibold">Total Sales by Plan Name</h5>
              <div className="w-full h-[403px]">
                <PieChart data={pieChartData} />
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="bg-white p-5 rounded-md shadow-sm w-full table-transaction min-h-[466px]">
              <h5 className="font-semibold mb-3">Latest Transactions</h5>
              <DetailTable data={tableData} columns={policyColumns} />
            </div>
          </div>
        </div>
      </ContentLoadingWrapper>
    </div>
  );
}
