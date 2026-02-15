import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useAccountChannelsByAccount } from "@/services/auth/hooks/queries";
import {
  useAddAccountChannel,
  useRemoveAccountChannel,
} from "@/services/auth/hooks/mutations";

interface UseAccountChannelProps {
  accountChannels: any[];
  isLoading: boolean;

  handleAddChannel: (accountId: string, channelId: string) => Promise<void>;
  handleDeleteChannel: (accountId: string, channelId: string) => Promise<void>;
  loadAccountChannels: (accountId: string) => void;
}

export function useAccountChannel(): UseAccountChannelProps {
  const [accountId, setAccountId] = useState<string>("");

  const { data: accountChannels = [], isLoading, refetch } =
    useAccountChannelsByAccount(accountId, {
      enabled: !!accountId,
      staleTime: 30000,
      select: (response: any) => response?.data || [],
    });

  const addChannelMutation = useAddAccountChannel({
    onSuccess: () => {
      refetch();
      toast.success("Channel added successfully");
    },
    onError: (error) => {
      console.error("Failed to add channel:", error);
      toast.error("Failed to add channel");
    },
  });

  const deleteChannelMutation = useRemoveAccountChannel({
    onSuccess: () => {
      refetch();
      toast.success("Channel removed successfully");
    },
    onError: (error) => {
      console.error("Failed to remove channel:", error);
      toast.error("Failed to remove channel");
    },
  });

  const handleAddChannel = useCallback(
    async (accountId: string, channelId: string) => {
      await addChannelMutation.mutateAsync({
        account: accountId,
        channel: channelId,
      });
    },
    [addChannelMutation]
  );

  const handleDeleteChannel = useCallback(
    async (accountId: string, channelId: string) => {
      await deleteChannelMutation.mutateAsync(channelId);
    },
    [deleteChannelMutation]
  );

  const loadAccountChannels = useCallback((id: string) => {
    setAccountId(id);
  }, []);

  const normalizedAccountChannels = Array.isArray(accountChannels)
    ? accountChannels
    : [];

  return {
    accountChannels: normalizedAccountChannels,
    isLoading,
    handleAddChannel,
    handleDeleteChannel,
    loadAccountChannels,
  };
}
