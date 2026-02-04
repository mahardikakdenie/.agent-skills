import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/masterdata/user.service";
import toast from "react-hot-toast";

interface UseAccountChannelProps {
  accountChannels: any[];
  isLoading: boolean;

  handleAddChannel: (accountId: string, channelId: string) => Promise<void>;
  handleDeleteChannel: (accountId: string, channelId: string) => Promise<void>;
  loadAccountChannels: (accountId: string) => void;
}

export function useAccountChannel(): UseAccountChannelProps {
  const queryClient = useQueryClient();
  const userService = new UserService();
  const [accountId, setAccountId] = useState<string>("");

  // ✅ Fetch account channels
  const { data: accountChannels = [], isLoading } = useQuery({
    queryKey: ["account-channels", accountId],
    queryFn: async () => {
      if (!accountId) return [];
      const response = await userService.getAccountChannelsByAccountId(
        accountId
      );
      return response.data || [];
    },
    enabled: !!accountId,
    staleTime: 30000,
  });

  // ✅ Add channel mutation
  const addChannelMutation = useMutation({
    mutationFn: async ({
      accountId,
      channelId,
    }: {
      accountId: string;
      channelId: string;
    }) => {
      await userService.addAccountChannels({
        account: accountId,
        channel: channelId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-channels"] });
      toast.success("Channel added successfully");
    },
    onError: (error) => {
      console.error("Failed to add channel:", error);
      toast.error("Failed to add channel");
    },
  });

  // ✅ Delete channel mutation
  const deleteChannelMutation = useMutation({
    mutationFn: async (channelId: string) => {
      await userService.removeAccountChannels(channelId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-channels"] });
      toast.success("Channel removed successfully");
    },
    onError: (error) => {
      console.error("Failed to remove channel:", error);
      toast.error("Failed to remove channel");
    },
  });

  const handleAddChannel = useCallback(
    async (accountId: string, channelId: string) => {
      await addChannelMutation.mutateAsync({ accountId, channelId });
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

  return {
    accountChannels,
    isLoading,
    handleAddChannel,
    handleDeleteChannel,
    loadAccountChannels,
  };
}
