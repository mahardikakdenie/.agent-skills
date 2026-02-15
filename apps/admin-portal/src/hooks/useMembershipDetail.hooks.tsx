import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { policyService } from "@/services/policy/api/policy.service";

interface MembershipDetail {
  id: string;
  number: string;
  status: string;
  created_at: string;
  profile: {
    subsidiary?: string;
    employee_id?: string;
    employee_name?: string;
    member_name?: string;
    gender?: string;
    date_of_birth?: string;
    member_status?: string;
    marital_status?: string;
    plan?: string;
    effective_date?: string;
    remarks?: string;
    bank_name?: string;
    branch?: string;
    bank_account_number?: string;
    bank_account_name?: string;
    email?: string;
  };
  other_info: {
    tpa_member_id?: string;
    email?: string;
    gender?: string;
    [key: string]: any;
  };
  policies?: {
    policy_holders?: {
      name?: string;
      phone?: string;
      email?: string;
    };
  };
}

interface UseMembershipDetailProps {
  membershipDetail: MembershipDetail | null;
  isLoading: boolean;
  isError: boolean;
  error: any;

  formatLabel: (key: string) => string;
  getStatusColor: (status: string) => string;
  getMembershipDetail: (id: string) => void;
  refetch: () => void;
}

export function useMembershipDetail(): UseMembershipDetailProps {
  const [membershipDetail, setMembershipDetail] =
    useState<MembershipDetail | null>(null);
  const [membershipId, setMembershipId] = useState<string>("");

  const {
    data: membershipResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["membership-detail", membershipId],
    queryFn: async () => {
      if (!membershipId) return null;

      return policyService.getInsuredPartyById(membershipId);
    },
    enabled: !!membershipId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  useEffect(() => {
    if (membershipResponse) {
      setMembershipDetail(membershipResponse as MembershipDetail);
    }
  }, [membershipResponse]);

  const formatLabel = useCallback((key: string) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Pending":
        return "text-[#CC9B36]";
      case "Active":
        return "text-[#00AB4F]";
      case "Inactive":
        return "text-[#939597]";
      default:
        return "text-[#CC9B36]";
    }
  }, []);

  const getMembershipDetail = useCallback((id: string) => {
    setMembershipId(id);
  }, []);

  return {
    membershipDetail,

    isLoading,
    isError,
    error,

    formatLabel,
    getStatusColor,
    getMembershipDetail,
    refetch,
  };
}
