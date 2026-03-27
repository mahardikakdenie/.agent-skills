"use client";
import React from "react";
import Image from "next/image";
import { formatMoney } from "@/lib/formatter";
import { Search } from "react-feather";
import { Input } from "@repo/ui";
import emptyStateSearchPrompt from "@public/images/empty-state-search-prompt.svg";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { DataTable } from "@/components/ui/DataTable";
import { useClaimHistory } from "@/hooks/useClaimHistory.hooks";
import { createClaimHistoryTableColumns } from "@/components/tableConfig/claimHistoryTableConfig";

export default function ClaimHistoryPage() {
  const {
    claimHistoryData,

    searchData,
    selectedPlanId,
    selectedPolicyId,

    disableSelectPlan,
    disableSelectPolicy,
    isSearchParamValid,

    isLoading,

    handleSearch,
    handleSelectPlan,
    handleSelectPolicy,
  } = useClaimHistory();

  const claimHistoryTableColumns = createClaimHistoryTableColumns();

  const renderPlan = (plans: { planId: string; planName: string }[]) => {
    if (plans.length === 0) return null;
    return (
      <SelectGroup>
        {plans.map((plan, index) => (
          <SelectItem key={index} value={plan.planId}>
            {plan.planName}
          </SelectItem>
        ))}
      </SelectGroup>
    );
  };

  const renderPolicy = (policies: { policyId: string; policyNo: string }[]) => {
    if (policies.length === 0) return null;
    return (
      <SelectGroup>
        {policies.map((policy, index) => (
          <SelectItem key={index} value={policy.policyId}>
            {policy.policyNo}
          </SelectItem>
        ))}
      </SelectGroup>
    );
  };

  const renderEmptyState = () => (
    <div className="w-full bg-white rounded-xl p-4">
      <div className="flex flex-col gap-4 items-center justify-center py-14">
        <Image alt="no data" src={emptyStateSearchPrompt} width={200} />
        <div className="text-[#939597] text-base">
          Enter NIK / Passport / Claim Number to view claim history
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex flex-wrap justify-start pb-4 items-center">
        <h1 className="text-black font-bold text-2xl mt-2 sm:w-auto w-full">
          Claim History
        </h1>
      </div>

      <div className="flex bg-white rounded-xl gap-4 mb-3 p-6">
        <div className="flex w-full flex-col">
          <div className="text-xs mb-1.5 font-medium whitespace-nowrap">
            NIK / Passport / Claim Number
          </div>
          <div className="mb-1.5">
            <Input
              type="text"
              placeholder="Search by Claim ID"
              aria-label="Search claim history by claim ID"
              value={searchData}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-10"
              rightIcon={
                <Search
                  aria-hidden="true"
                  className="h-4 w-4 text-[#016da1]"
                />
              }
            />
          </div>
          {!isSearchParamValid && (
            <p className="text-[#E83F3F] text-xs">
              Please double-check your ID card, NIK, passport, or claim number
            </p>
          )}
        </div>

        <div className="flex w-full flex-col">
          <div className="text-xs mb-1.5 font-medium">Policy Number</div>
          <div>
            <Select
              value={selectedPolicyId}
              onValueChange={handleSelectPolicy}
              disabled={disableSelectPolicy}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder={disableSelectPolicy ? "-" : ""} />
              </SelectTrigger>
              <SelectContent>
                {!disableSelectPolicy &&
                  renderPolicy(claimHistoryData?.policies ?? [])}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex w-full flex-col">
          <div className="text-xs mb-1.5 font-medium">Plan Name</div>
          <div>
            <Select
              value={selectedPlanId}
              onValueChange={handleSelectPlan}
              disabled={disableSelectPlan}
            >
              <SelectTrigger className="h-10">
                <SelectValue
                  placeholder={disableSelectPlan ? "-" : "All Plan"}
                />
              </SelectTrigger>
              <SelectContent>
                {!disableSelectPlan &&
                  renderPlan(claimHistoryData?.plans ?? [])}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {claimHistoryData?.data?.length ? (
        <div className="w-full bg-white rounded-xl p-4">
          <div className="bg-white flex flex-wrap flex-start gap-16 shadow p-4 mb-6">
            <div className="flex">
              <div className="mr-3 text-base">Claim Limit</div>
              <div className="font-bold text-[#016DA1]">
                {formatMoney(Number(claimHistoryData?.totalLimit))}
              </div>
            </div>
            <div className="flex">
              <div className="mr-3 text-base">Total Paid</div>
              <div className="font-bold text-[#016DA1]">
                {formatMoney(Number(claimHistoryData?.totalPaid))}
              </div>
            </div>
            <div className="flex">
              <div className="mr-3 text-base">Remaining Claim Limit</div>
              <div className="font-bold text-[#016DA1]">
                {formatMoney(Number(claimHistoryData?.remainingClaimLimit))}
              </div>
            </div>
          </div>

          <DataTable
            loading={isLoading}
            data={claimHistoryData.data}
            columns={claimHistoryTableColumns}
            className="claim-history-table"
            noDataText="No claim history available"
          />
        </div>
      ) : (
        renderEmptyState()
      )}
    </div>
  );
}


