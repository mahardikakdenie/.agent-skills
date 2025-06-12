import { UserService } from '@/services/masterdata/user.service';
import { useState } from 'react';

export interface AccountChannel {
  id: string;
  name: string;
  type: string;
  channel_id?: string;
}

export const useAccountChannel = () => {
  const userService = new UserService();
  const [accountChannels, setAccountChannels] = useState<AccountChannel[]>([]);
  const [loading, setLoading] = useState(false);

  const getAccountChannels = async (accountId: string) => {
    try {
      setLoading(true);
      const response = await userService.getAccountChannelsByAccountId(accountId);
      setAccountChannels(response.data);
      return response;
    } catch (error) {
      console.error('Error fetching account channels:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addAccountChannel = async (data: { account: string; channel: string }) => {
    try {
      setLoading(true);
      const response = await userService.addAccountChannels(data);
      await getAccountChannels(data.account);
      return response;
    } catch (error) {
      console.error('Error adding account channel:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeAccountChannel = async (accountId: string, channelId: string) => {
    try {
      setLoading(true);
      const response = await userService.removeAccountChannels(channelId);
      await getAccountChannels(accountId);
      return response;
    } catch (error) {
      console.error('Error removing account channel:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    accountChannels,
    loading,
    getAccountChannels,
    addAccountChannel,
    removeAccountChannel,
  };
};