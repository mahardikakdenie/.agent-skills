'use client';

import emptyStateSearchPrompt from '@public/images/empty-state-search-prompt.svg';
import Image from 'next/image';
import React from 'react';

import {
  Box,
  Combobox,
  DataTable,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';

import { createClaimHistoryTableColumns } from '@/components/table-config/claim-history-table-config';
import { DebouncedSearchInput } from '@/components/core/debounced-search-input';
import { useClaimHistory } from '@/hooks/useClaimHistory.hooks';
import { formatMoney } from '@/lib/formatter';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Paid':
        return 'text-[#00AB4F]';
      case 'Pending':
        return 'text-[#CC9B36]';
      case 'Rejected':
      case 'Declined':
        return 'text-[#E83F3F]';
      default:
        return 'text-[#016DA1]';
    }
  };

  const claimHistoryTableColumns = React.useMemo(
    () =>
      createClaimHistoryTableColumns({
        page: 1,
        rowsPerPage: 1000,
        getStatusColor,
      }),
    [],
  );

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
    <Box className="w-full rounded-xl bg-white p-4">
      <Box className="flex flex-col items-center justify-center gap-4 py-14">
        <Image alt="no data" src={emptyStateSearchPrompt} width={200} />
        <Box className="text-base text-[#939597]">
          Enter NIK / Passport / Claim Number to view claim history
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box className="flex w-full flex-col p-4 md:p-6">
      <Box className="flex items-center justify-start pb-4 flex-wrap">
        <Box as="h1" className="mt-2 w-full text-2xl font-bold text-black sm:w-auto">
          Claim History
        </Box>
      </Box>

      <Box className="mb-3 flex gap-4 rounded-xl bg-white p-6">
        <Box className="flex w-full flex-col">
          <Box className="mb-1.5 whitespace-nowrap text-xs font-medium">
            NIK / Passport / Claim Number
          </Box>
          <Box className="mb-1.5">
            <DebouncedSearchInput
              value={searchData}
              placeholder="Search by Claim ID"
              ariaLabel="Search claim history by claim ID"
              onDebouncedChange={handleSearch}
              className="h-10 pr-1.5"
            />
          </Box>
          {!isSearchParamValid && (
            <Box as="p" className="text-xs text-[#E83F3F]">
              Please double-check your ID card, NIK, passport, or claim number
            </Box>
          )}
        </Box>

        <Box className="flex w-full flex-col">
          <Box className="mb-1.5 text-xs font-medium">Policy Number</Box>
          <Box>
            <Select
              value={selectedPolicyId}
              onValueChange={handleSelectPolicy}
              disabled={disableSelectPolicy}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder={disableSelectPolicy ? '-' : ''} />
              </SelectTrigger>
              <SelectContent>
                {!disableSelectPolicy && renderPolicy(claimHistoryData?.policies ?? [])}
              </SelectContent>
            </Select>
          </Box>
        </Box>

        <Box className="flex w-full flex-col">
          <Box className="mb-1.5 text-xs font-medium">Plan Name</Box>
          <Box>
            <Combobox
              options={(claimHistoryData?.plans ?? []).map((plan) => ({
                label: plan.planName,
                value: plan.planId,
              }))}
              value={selectedPlanId}
              onValueChange={handleSelectPlan}
              disabled={disableSelectPlan}
              placeholder={disableSelectPlan ? '-' : 'All Plan'}
              triggerClassName="h-10"
            />
          </Box>
        </Box>
      </Box>

      {claimHistoryData?.data?.length ? (
        <Box className="w-full rounded-xl bg-white p-4">
          <Box className="mb-6 flex flex-start flex-wrap gap-16 p-4 shadow bg-white">
            <Box className="flex">
              <Box className="mr-3 text-base">Claim Limit</Box>
              <Box className="font-bold text-[#016DA1]">
                {formatMoney(Number(claimHistoryData?.totalLimit))}
              </Box>
            </Box>
            <Box className="flex">
              <Box className="mr-3 text-base">Total Paid</Box>
              <Box className="font-bold text-[#016DA1]">
                {formatMoney(Number(claimHistoryData?.totalPaid))}
              </Box>
            </Box>
            <Box className="flex">
              <Box className="mr-3 text-base">Remaining Claim Limit</Box>
              <Box className="font-bold text-[#016DA1]">
                {formatMoney(Number(claimHistoryData?.remainingClaimLimit))}
              </Box>
            </Box>
          </Box>

          <DataTable
            loading={isLoading}
            data={claimHistoryData.data}
            columns={claimHistoryTableColumns}
            className="claim-history-table"
          />
        </Box>
      ) : (
        renderEmptyState()
      )}
    </Box>
  );
}
