import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useAccountInsurersByAccount } from "@/services/auth/hooks/queries";
import {
  useAddAccountInsurer,
  useRemoveAccountInsurer,
} from "@/services/auth/hooks/mutations";

interface UseAccountInsurerProps {
  accountInsurers: any[];
  isLoading: boolean;

  handleAddInsurer: (accountId: string, insurerId: string) => Promise<void>;
  handleDeleteInsurer: (accountId: string, insurerId: string) => Promise<void>;
  loadAccountInsurers: (accountId: string) => void;
}

export function useAccountInsurer(): UseAccountInsurerProps {
  const [accountId, setAccountId] = useState<string>("");

  const { data: accountInsurers = [], isLoading, refetch } =
    useAccountInsurersByAccount(accountId, {
      enabled: !!accountId,
      staleTime: 30000,
      select: (response: any) => response?.data || [],
    });

  const addInsurerMutation = useAddAccountInsurer({
    onSuccess: () => {
      refetch();
      toast.success("Insurer added successfully");
    },
    onError: (error) => {
      console.error("Failed to add insurer:", error);
      toast.error("Failed to add insurer");
    },
  });

  const deleteInsurerMutation = useRemoveAccountInsurer({
    onSuccess: () => {
      refetch();
      toast.success("Insurer removed successfully");
    },
    onError: (error) => {
      console.error("Failed to remove insurer:", error);
      toast.error("Failed to remove insurer");
    },
  });

  const handleAddInsurer = useCallback(
    async (accountId: string, insurerId: string) => {
      await addInsurerMutation.mutateAsync({
        account: accountId,
        insurance: insurerId,
      });
    },
    [addInsurerMutation]
  );

  const handleDeleteInsurer = useCallback(
    async (accountId: string, insurerId: string) => {
      await deleteInsurerMutation.mutateAsync(insurerId);
    },
    [deleteInsurerMutation]
  );

  const loadAccountInsurers = useCallback((id: string) => {
    setAccountId(id);
  }, []);

  const normalizedAccountInsurers = Array.isArray(accountInsurers)
    ? accountInsurers
    : [];

  return {
    accountInsurers: normalizedAccountInsurers,
    isLoading,
    handleAddInsurer,
    handleDeleteInsurer,
    loadAccountInsurers,
  };
}
