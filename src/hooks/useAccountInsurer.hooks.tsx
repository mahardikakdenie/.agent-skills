import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InsurerService } from "@/services/masterdata/insurer.service";
import toast from "react-hot-toast";

interface UseAccountInsurerProps {
  accountInsurers: any[];
  isLoading: boolean;

  handleAddInsurer: (accountId: string, insurerId: string) => Promise<void>;
  handleDeleteInsurer: (accountId: string, insurerId: string) => Promise<void>;
  loadAccountInsurers: (accountId: string) => void;
}

export function useAccountInsurer(): UseAccountInsurerProps {
  const queryClient = useQueryClient();
  const insurerService = new InsurerService();
  const [accountId, setAccountId] = useState<string>("");

  const { data: accountInsurers = [], isLoading } = useQuery({
    queryKey: ["account-insurers", accountId],
    queryFn: async () => {
      if (!accountId) return [];
      const response = await insurerService.getAccountInsurersByAccountId(
        accountId
      );
      return response.data || [];
    },
    enabled: !!accountId,
    staleTime: 30000,
  });

  const addInsurerMutation = useMutation({
    mutationFn: async ({
      accountId,
      insurerId,
    }: {
      accountId: string;
      insurerId: string;
    }) => {
      await insurerService.addAccountInsurers({
        account: accountId,
        insurance: insurerId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-insurers"] });
      toast.success("Insurer added successfully");
    },
    onError: (error) => {
      console.error("Failed to add insurer:", error);
      toast.error("Failed to add insurer");
    },
  });

  const deleteInsurerMutation = useMutation({
    mutationFn: async (insurerId: string) => {
      await insurerService.removeAccountInsurers(insurerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-insurers"] });
      toast.success("Insurer removed successfully");
    },
    onError: (error) => {
      console.error("Failed to remove insurer:", error);
      toast.error("Failed to remove insurer");
    },
  });

  const handleAddInsurer = useCallback(
    async (accountId: string, insurerId: string) => {
      await addInsurerMutation.mutateAsync({ accountId, insurerId });
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

  return {
    accountInsurers,
    isLoading,
    handleAddInsurer,
    handleDeleteInsurer,
    loadAccountInsurers,
  };
}
