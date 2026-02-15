import React, { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/auth.context";
import AppURL from "@/constants/app-url.const";
import { policyService } from "@/services/policy/api/policy.service";

interface PolicyVisibility {
  name: boolean;
  email: boolean;
  phone: boolean;
  status: boolean;
}

interface UsePolicyDetailProps {
  policy: any;
  policyVisibility: PolicyVisibility;

  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;

  isLoading: boolean;
  isRenewing: boolean;
  isError: boolean;
  error: any;

  getPolicyDetail: (id: string) => void;
  handleOpenDialog: () => void;
  handleRenewPolicy: () => Promise<void>;
  getStatusColor: (status: string) => string;
  refetch: () => void;
}

export function usePolicyDetail(): UsePolicyDetailProps {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { permissionList } = useAuth();

  const [policyId, setPolicyId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [policyVisibility, setPolicyVisibility] = useState<PolicyVisibility>({
    name: true,
    email: true,
    phone: true,
    status: true,
  });

  const {
    data: policy,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["policy-detail", policyId],
    queryFn: async () => {
      if (!policyId) return null;
      return policyService.getPolicyById(policyId);
    },
    enabled: !!policyId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
  const policyData: any = policy;

  const renewPolicyMutation = useMutation({
    mutationFn: async (id: string) => {
      return policyService.renewPolicy(id);
    },
    onSuccess: () => {
      toast.success("Policy renewed successfully!");

      queryClient.invalidateQueries({ queryKey: ["policies"] });
      queryClient.invalidateQueries({ queryKey: ["policy-detail"] });
      router.push(AppURL.policyList);
    },
    onError: (error) => {
      console.error("Failed to renew policy:", error);
      toast.error("Failed to renew policy!");
    },
    onSettled: () => {
      setDialogOpen(false);
    },
  });

  useEffect(() => {
    const checkAccess = () => {
      const isHidePolicyEmail = permissionList.includes(
        "Policy.View.Policy.HideEmail"
      );
      const isHidePolicyPhone = permissionList.includes(
        "Policy.View.Policy.HidePhone"
      );

      setPolicyVisibility({
        name: true,
        email: !isHidePolicyEmail,
        phone: !isHidePolicyPhone,
        status: true,
      });
    };

    checkAccess();
  }, [permissionList]);

  const getPolicyDetail = useCallback((id: string) => {
    setPolicyId(id);
  }, []);

  const handleOpenDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleRenewPolicy = useCallback(async () => {
    if (!policyData?.id) return;

    try {
      await renewPolicyMutation.mutateAsync(policyData.id);
    } catch (error) {
      throw error;
    }
  }, [policyData?.id, renewPolicyMutation]);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "Declaration":
        return "text-[#016DA1]";
      case "Grace Period":
        return "text-[#CC9B36]";
      case "Expired":
        return "text-gray-400";
      default:
        return "text-[#016DA1]";
    }
  }, []);

  return {
    policy: policyData,
    policyVisibility,

    dialogOpen,
    setDialogOpen,

    isLoading,
    isRenewing: renewPolicyMutation.isPending,
    isError,
    error,

    getPolicyDetail,
    handleOpenDialog,
    handleRenewPolicy,
    getStatusColor,
    refetch,
  };
}
