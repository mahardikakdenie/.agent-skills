"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import _, { set } from "lodash";
import moment from "moment";

import { hasPermission } from "@/context/auth.context";
import { useLoading } from "@/context/loading.context";
import WithSidebar from "@/hoc/with-sidebar";
import useRequireAuth from "@/hooks/useRequireAuth";
import { ClaimService, ClaimHistorySummary, ClaimHistoryDetail } from "@/services/claim.service";
import { formatMoney, formatMoneyClaim } from "@/lib/formatter";

import {
  Search,
} from "react-feather";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import emptyStateSearchPrompt from "/public/images/empty-state-search-prompt.svg";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const claimService = new ClaimService();
const ClaimHistoryPage = () => {
  useRequireAuth();

  const { setLoading } = useLoading();

  // Define router to redirect user to forbidden page if user has no permission
  const router = useRouter();

  // Permissions state, for future use when edit feature is available
  // const [canEdit, setCanEdit] = useState<boolean>(false);

  // Data state
  const [searchData, setSearchData] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedPolicyId, setSelectedPolicyId] = useState("");
  const [claimHistoryData, setClaimHistoryData] = useState<ClaimHistorySummary | null>(null);

  const [disableSelectPlan, setDisableSelectPlan] = useState<boolean>(true);
  const [disableSelectPolicy, setDisableSelectPolicy] = useState<boolean>(true);
  const [isSearchParamValid, setIsSearchParamValid] = useState<boolean>(true);

  // Permissions checking
  useEffect(() => {
    const checkAccess = async () => {
      const hasAccess = await hasPermission('Claim History.Read');

      // For future use when edit feature is available
      // const hasEditAccess = await hasPermission('Claim History.Update');
      // setCanEdit(hasEditAccess);

      // Redirect to forbidden page if user has no permission to read
      if(!hasAccess) {
        router.push("/forbidden");
      }
    };

    checkAccess();
  }, [router]);

  const mapResponse = (response: any): ClaimHistorySummary => {
    // Map the claim details response
    const dataResponse = response.data;

    const mappedData: ClaimHistoryDetail[] = dataResponse.map((claim: any) => ({
      claimId: claim.claimId,
      insuredName: claim.insuredName || "-",
      status: claim.status,
      currency: claim.currency || "IDR",
      paymentType: claim.paymentType || "-",
      submittedDate: claim.submittedDate || "",
      claimAmount: Number(claim.claimAmount) || 0,
      paid: Number(claim.paid) || 0,
      remainingLimit: Number(claim.remainingLimit) || 0,
    }));
  
    // Extract & deduplicate the plans
    const plans: { planId: string; planName: string }[] = [];
    dataResponse.forEach((claim: any) => {
      if (claim.plan?.planId && claim.plan?.planName) {
        const isNewPlan = !plans.some((plan) => plan.planId === claim.plan.planId);
        if (isNewPlan) {
          plans.push({ planId: claim.plan.planId, planName: claim.plan.planName });
        }
      }
    });

    // Set the selected policy
    const selectedPolicy = response.selectedPolicy;
    const policies = response.availablePolicies
    setSelectedPolicyId(selectedPolicy);

    // Enable the select plan & policy component as default state
    if (plans.length > 0 || policies.length > 0) {
      setDisableSelectPlan(false);
      setDisableSelectPolicy(false);
    }
  
    return {
      data: mappedData,
      plans,
      policies,
      totalLimit: Number(response.totalLimit) || 0,
      totalPaid: Number(response.totalPaid) || 0,
      remainingClaimLimit: Number(response.remainingClaimLimit) || 0,
    };
  };

  // Fetch data to populate the list of claim history
  useEffect(() => {
    // Prevent fetching data when the page is loaded for the first time
    if (searchData === "" && selectedPlanId === "") return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await claimService.getClaimsHistoriesList({
          searchData,
          planId: selectedPlanId,
          policyId: selectedPolicyId,
        });

        // Validate the response
        const mappedResponse = mapResponse(res.data);
        if (mappedResponse.data.length > 0) {
          setIsSearchParamValid(true);
          setClaimHistoryData(mappedResponse);
        } else {
          setIsSearchParamValid(false);
          setClaimHistoryData(null);
        }
      } catch (error) {
        setIsSearchParamValid(false);
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [
    searchData,
    selectedPlanId,
    selectedPolicyId,
    setLoading,
  ]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleSelectPolicy = (policyId: string) => {
    setSelectedPolicyId(policyId);
  }

  const handleSearch = _.debounce((keyword: string) => {
    setSearchData(keyword);

    // Reset select component
    setSelectedPlanId("");
    setSelectedPolicyId("");

    // Disable filter select component & reset claim history
    setDisableSelectPlan(true);
    setDisableSelectPolicy(true);
    setClaimHistoryData(null);
  }, 100);

  const renderPlan = (plans: {planId: string, planName: string}[]) => {
    if (plans.length === 0) return null;
    return (
      <SelectGroup>
        {plans.map((plan) => (
          <SelectItem key={plan.planId} value={plan.planId}>
            {plan.planName}
          </SelectItem>
        ))}
      </SelectGroup>
    );
  };

  const renderPolicy = (policies: {policyId: string, policyNo: string}[]) => {
    if (policies.length === 0) return null;
    return (
      <SelectGroup>
        {policies.map((policy) => (
          <SelectItem key={policy.policyId} value={policy.policyId}>
            {policy.policyNo}
          </SelectItem>
        ))}
      </SelectGroup>
    );
  };

  const renderSearchPromptImage = () => {
    return (
      <Table>
        <TableBody>
          <TableRow className="hover:!bg-white">
            <TableCell colSpan={10}>
              <div className="flex flex-col gap-4 items-center justify-center py-14">
                <Image alt="no data" src={emptyStateSearchPrompt} width={200} />
                <div className="text-[#939597] text-base">
                  Masukkan KTP / ID / NIK Number untuk melihat histori claim
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

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
          <div className="relative mb-1.5">
            <Input
              type="text"
              placeholder="Search by Claim ID"
              onChange={(e) => handleSearch(e.target.value)}
              className="border p-3 rounded-md pr-10 w-full"
            />
            <Search className="absolute top-1/2 w-4 h-4 right-3 transform -translate-y-1/2 text-[#016da1]" />
          </div>
          {
            !isSearchParamValid && (
              <p className="text-[#E83F3F] text-xs">
                Please double-check your ID card, NIK, passport, or claim number
              </p>
            )
          }
        </div>
        <div className="flex w-full flex-col">
          <div className="text-xs mb-1.5 font-medium">
            Policy Number
          </div>
          <div>
            <Select
              value={selectedPolicyId}
              onValueChange={handleSelectPolicy}
              disabled={disableSelectPolicy}
            >
              <SelectTrigger className="h-full">
                <SelectValue placeholder={disableSelectPlan ? '-' : ''} />
              </SelectTrigger>
              <SelectContent>
                {!disableSelectPolicy && renderPolicy(claimHistoryData?.policies ?? [])}
              </SelectContent>

            </Select>
          </div>
        </div>
        <div className="flex w-full flex-col">
          <div className="text-xs mb-1.5 font-medium">
            Plan Name
          </div>
          <div>
            <Select
              value={selectedPlanId}
              onValueChange={handleSelectPlan}
              disabled={disableSelectPlan}
            >
              <SelectTrigger className="h-full">
                <SelectValue placeholder={disableSelectPlan ? '-' : 'All Plan'} />
              </SelectTrigger>
              <SelectContent>
                {!disableSelectPlan && renderPlan(claimHistoryData?.plans ?? [])}
              </SelectContent>

            </Select>
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-xl p-4">
        {
          claimHistoryData?.data?.length ?? 0 > 0 ? (
            <>
              <div className="bg-white flex flex-wrap flex-start gap-16 shadow p-4">
                <div className="flex">
                  <div className="mr-3 text-base">Claim Limit</div>
                  <div className="font-bold text-[#016DA1]">{formatMoney(Number(claimHistoryData?.totalLimit))}</div>
                </div>
                <div className="flex">
                  <div className="mr-3 text-base">Total Paid</div>
                  <div className="font-bold text-[#016DA1]">{formatMoney(Number(claimHistoryData?.totalPaid))}</div>
                </div>
                <div className="flex">
                  <div className="mr-3 text-base">Remaining Claim Limit</div>
                  <div className="font-bold text-[#016DA1]">{formatMoney(Number(claimHistoryData?.remainingClaimLimit))}</div>
                </div>
              </div>

              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Claim ID</TableHead>
                      <TableHead>Insured Name</TableHead>
                      <TableHead>Submitted Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Claim Amount</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Remaining Limit</TableHead>
                      <TableHead>Payment Type</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      claimHistoryData?.data.map((claim, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>{claim.claimId}</div>
                          </TableCell>
                          <TableCell>
                            <div>{claim.insuredName}</div>
                          </TableCell>
                          <TableCell>
                            <div>{!!claim.submittedDate ? moment(claim.submittedDate).format("DD/MM/YYYY") : "-"}</div>
                          </TableCell>
                          <TableCell>
                            <div>{claim.status}</div>
                          </TableCell>
                          <TableCell>
                            <div>{claim.currency}</div>
                          </TableCell>
                          <TableCell>
                            <div>{formatMoneyClaim(Number(claim.claimAmount))}</div>
                          </TableCell>
                          <TableCell>
                            <div>{claim.paid ? formatMoneyClaim(Number(claim.paid)) : '-'}</div>
                          </TableCell>
                          <TableCell>
                            <div>{formatMoneyClaim(Number(claim.remainingLimit))}</div>
                          </TableCell>
                          <TableCell>
                            <div>{claim.paymentType}</div>
                          </TableCell>
                          <TableCell>
                            {/* This button is disabled until edit feature is enabled */}
                            <Button
                              disabled
                              className="rounded-full"
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </div>
            </>
          ) : renderSearchPromptImage()
        }
      </div>
    </div>
  );
};

ClaimHistoryPage.displayName = "ClaimHistoryPage";

const ClaimHistoryWithSidebar = (params: any) => WithSidebar(ClaimHistoryPage)(params);
export default ClaimHistoryWithSidebar;