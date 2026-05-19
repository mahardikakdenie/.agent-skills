import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useScreen } from "@/context/screen.context";
import _ from "lodash";
import AppURL from "@/constants/app-url.const";
import { useClaimListLimit } from "@/services/claims/hooks/queries/useClaimListLimit";
import { capitalizeString, getHeaderPage } from "@/lib/app-utils";

interface ClaimHistoryDetail {
  claimId: string;
  insuredName: string;
  status: string;
  currency: string;
  paymentType: string;
  submittedDate: string;
  claimAmount: number;
  paid: number;
  remainingLimit: number;
}

interface ClaimHistorySummary {
  data: ClaimHistoryDetail[];
  plans: { planId: string; planName: string }[];
  policies: { policyId: string; policyNo: string }[];
  totalLimit: number;
  totalPaid: number;
  remainingClaimLimit: number;
}

interface UseClaimHistoryProps {
  claimHistoryData?: ClaimHistorySummary | null;
  searchData: string;
  selectedPlanId: string;
  selectedPolicyId: string;
  disableSelectPlan: boolean;
  disableSelectPolicy: boolean;
  isSearchParamValid: boolean;
  isLoading: boolean;
  isError: boolean;
  error: any;
  setSearchData: (search: string) => void;
  setSelectedPlanId: (planId: string) => void;
  setSelectedPolicyId: (policyId: string) => void;
  handleSearch: (keyword: string) => void;
  handleSelectPlan: (planId: string) => void;
  handleSelectPolicy: (policyId: string) => void;
  refetch: () => void;
}

export function useClaimHistory(): UseClaimHistoryProps {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { permissionList } = useAuth();
  const { setLoading } = useScreen();

  const [searchData, setSearchDataState] = useState(() => {
    return searchParams.get("search") || "";
  });

  const [selectedPlanId, setSelectedPlanIdState] = useState(() => {
    return searchParams.get("plan_id") || "";
  });

  const [selectedPolicyId, setSelectedPolicyIdState] = useState(() => {
    return searchParams.get("policy_id") || "";
  });

  const [disableSelectPlan, setDisableSelectPlan] = useState(true);
  const [disableSelectPolicy, setDisableSelectPolicy] = useState(true);
  const [isSearchParamValid, setIsSearchParamValid] = useState(true);

  const [allAvailablePlans, setAllAvailablePlans] = useState<
    { planId: string; planName: string }[]
  >([]);
  const [allAvailablePolicies, setAllAvailablePolicies] = useState<
    { policyId: string; policyNo: string }[]
  >([]);
  const [allOptionsData, setAllOptionsData] =
    useState<ClaimHistorySummary | null>(null);
  const [filteredClaimHistoryData, setFilteredClaimHistoryData] =
    useState<ClaimHistorySummary | null>(null);

  const updateURL = useCallback(
    (params: Record<string, string | undefined>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          current.set(key, String(value));
        } else {
          current.delete(key);
        }
      });

      const search = current.toString();
      const query = search ? `?${search}` : "";

      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const setSearchData = useCallback(
    (newSearchData: string) => {
      setSearchDataState(newSearchData);

      setSelectedPlanIdState("");
      setSelectedPolicyIdState("");
      setAllAvailablePlans([]);
      setAllAvailablePolicies([]);
      setDisableSelectPlan(true);
      setDisableSelectPolicy(true);

      updateURL({
        search: newSearchData || undefined,
        plan_id: undefined,
        policy_id: undefined,
      });
    },
    [updateURL]
  );

  const setSelectedPlanId = useCallback(
    (newPlanId: string) => {
      setSelectedPlanIdState(newPlanId);
      updateURL({ plan_id: newPlanId || undefined });
    },
    [updateURL]
  );

  const setSelectedPolicyId = useCallback(
    (newPolicyId: string) => {
      setSelectedPolicyIdState(newPolicyId);
      updateURL({ policy_id: newPolicyId || undefined });
    },
    [updateURL]
  );

  const mapResponse = useCallback(
    (response: any): ClaimHistorySummary => {
      const dataResponse = response.data;

      const mappedData: ClaimHistoryDetail[] = dataResponse?.map(
        (claim: any) => ({
          claimId: claim.claimId,
          insuredName: claim.insuredName || "-",
          status: claim.status,
          currency: claim.currency || "IDR",
          paymentType: claim.paymentType || "-",
          submittedDate: claim.submittedDate || "",
          claimAmount: Number(claim.claimAmount) || 0,
          paid: Number(claim.paid) || 0,
          remainingLimit: Number(claim.remainingLimit) || 0,
        })
      ) || [];

      const currentPlans: { planId: string; planName: string }[] = [];
      dataResponse?.forEach((claim: any) => {
        if (claim.plan?.planId && claim.plan?.planName) {
          const isNewPlan = !currentPlans.some(
            (plan) => plan.planId === claim.plan.planId
          );
          if (isNewPlan) {
            currentPlans.push({
              planId: claim.plan.planId,
              planName: claim.plan.planName,
            });
          }
        }
      });

      const currentPolicies = response.availablePolicies || [];

      return {
        data: mappedData,
        plans: currentPlans,
        policies: currentPolicies,
        totalLimit: Number(response.totalLimit) || 0,
        totalPaid: Number(response.totalPaid) || 0,
        remainingClaimLimit: Number(response.remainingClaimLimit) || 0,
      };
    },
    []
  );

  const allOptionsParams = searchData
    ? {
        search: searchData,
      }
    : undefined;

  const { data: allOptionsResponse, isLoading: isLoadingAllOptions } =
    useClaimListLimit(allOptionsParams, {
      enabled:
        !!searchData &&
        allAvailablePlans.length === 0 &&
        allAvailablePolicies.length === 0,
      staleTime: 30000,
      refetchOnWindowFocus: false,
      retry: 2,
    });

  const filteredParams = {
    plan_id: selectedPlanId || undefined,
    policy_id: selectedPolicyId || undefined,
    search: searchData || undefined,
  };

  const {
    data: filteredClaimHistoryResponse,
    isLoading: isLoadingFilteredData,
    isError,
    error,
    refetch,
  } = useClaimListLimit(filteredParams, {
    enabled: !!(searchData || selectedPlanId || selectedPolicyId),
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  useEffect(() => {
    if (!allOptionsResponse) {
      setAllOptionsData(null);
      return;
    }

    const payload = (allOptionsResponse as any)?.data ?? allOptionsResponse;
    const mapped = mapResponse(payload);
    setAllOptionsData(mapped);

    if (mapped.plans.length > 0 || mapped.policies.length > 0) {
      setAllAvailablePlans(mapped.plans);
      setAllAvailablePolicies(mapped.policies);
      setDisableSelectPlan(false);
      setDisableSelectPolicy(false);
    }
  }, [allOptionsResponse, mapResponse]);

  useEffect(() => {
    if (!filteredClaimHistoryResponse) {
      setFilteredClaimHistoryData(null);
      return;
    }

    const payload =
      (filteredClaimHistoryResponse as any)?.data ?? filteredClaimHistoryResponse;
    const mappedResponse = mapResponse(payload);

    if (mappedResponse.data.length > 0) {
      setIsSearchParamValid(true);
      setFilteredClaimHistoryData(mappedResponse);
    } else {
      setIsSearchParamValid(false);
      setFilteredClaimHistoryData(null);
    }
  }, [filteredClaimHistoryResponse, mapResponse]);

  const isLoading = isLoadingAllOptions || isLoadingFilteredData;

  const claimHistoryData = useMemo(() => {
    const data = filteredClaimHistoryData || allOptionsData;
    if (!data) return null;

    return {
      ...data,
      plans: allAvailablePlans.length > 0 ? allAvailablePlans : data.plans,
      policies: allAvailablePolicies.length > 0 ? allAvailablePolicies : data.policies,
    };
  }, [filteredClaimHistoryData, allOptionsData, allAvailablePlans, allAvailablePolicies]);

  useEffect(() => {
    const checkAccess = async () => {
      const headerPage = getHeaderPage(2, pathname, true);
      const hasAccess = permissionList.includes(
        `${capitalizeString(headerPage.breadcrumbsArray[0])}.${
          headerPage.pageName
        }.Read`
      );

      if (!hasAccess) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, pathname, permissionList]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const handleSearch = useMemo(
    () =>
      _.debounce((keyword: string) => {
        setSearchData(keyword);
      }, 300),
    [setSearchData]
  );

  const handleSelectPlan = useCallback(
    (planId: string) => {
      setSelectedPlanId(planId);
    },
    [setSelectedPlanId]
  );

  const handleSelectPolicy = useCallback(
    (policyId: string) => {
      setSelectedPolicyId(policyId);
    },
    [setSelectedPolicyId]
  );

  useEffect(() => {
    return () => {
      handleSearch.cancel?.();
    };
  }, [handleSearch]);

  return {
    claimHistoryData,
    searchData,
    selectedPlanId,
    selectedPolicyId,
    disableSelectPlan,
    disableSelectPolicy,
    isSearchParamValid,
    isLoading,
    isError,
    error,
    setSearchData,
    setSelectedPlanId,
    setSelectedPolicyId,
    handleSearch,
    handleSelectPlan,
    handleSelectPolicy,
    refetch,
  };
}
