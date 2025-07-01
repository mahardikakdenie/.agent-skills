import { FinanceService } from "@/services/finance.services";
import { ChannelService } from "@/services/channel.services";
import { TransactionService } from "@/services/transaction.service";
import { useState } from "react";

export const useChannel = () => {
  const [channel, setChannel] = useState<string>("");
  const [channelList, setChannelList] = useState<any[]>([]);
  const channelService = new ChannelService();
  const getChannel = async () => {
    const channels = await channelService.getChannels(1, 10000);
    setChannelList(channels.data);
  };
  return { getChannel, channel, channelList };
};

export const useBilling = () => {
  const [billing, setBilling] = useState<any>({});
  const [billingList, setBillingList] = useState<any>({});
  const [fees, setFees] = useState<any>([]);
  const billingService = new FinanceService();
  const getBilling = async (query: any, page?: number, pageSize?: number) => {
    const billings = await billingService.getBillings(
      page ?? 1,
      pageSize ?? 10,
      query
    );
    setBillingList(billings);
  };

  const createBilling = async (data: any) => {
    await billingService.createBilling(data);
  };
  const clearFees = () => {
    setFees([]);
  }

  const getFees = async (
    insuranceId: string,
    productId?: string,
    planId?: string
  ) => {
    if (!insuranceId) {
      return;
    }
    const feesResponse = await billingService.getFees({
      insuranceId,
      productId,
      planId,
    });

    if (feesResponse && feesResponse.data.length > 0) {
      // check if fee exist i fees state
      let checkFeesExist: { [key: string]: any } = {};
      checkFeesExist[
        `${feesResponse.data[0]?.insurance}-${productId}-${planId}`
      ] = {
        insurance: feesResponse.data[0].insurance,
        fee: feesResponse.data[0].fee,
        fee_type: feesResponse.data[0].fee_type,
      };
      // update fees state
      setFees((fee: any) => {
        return {
          ...fee,
          [`${feesResponse.data[0]?.insurance}-${productId}-${planId}`]: {
            insurance: feesResponse.data[0].insurance,
            fee: feesResponse.data[0].fee,
            fee_type: feesResponse.data[0].fee_type,
          },
        };
      });
    } else {
      setFees((fee: any) => {
        return {
          ...fee,
          [`${insuranceId}-${productId}-${planId}`]: {
            insurance: "",
            fee: 0,
            fee_type: "",
          },
        };
      });
    }
  };

  const getChannelFees = async (
    channelId: string,
    insuranceId?: string,
    productId?: string,
    planId?: string
  ) => {
    if (!channelId) {
      return;
    }
    if (!insuranceId) {
      return;
    }
    const feesResponse = await billingService.getChannelFees({
      channelId,
      insuranceId,
      productId,
      planId,
    });

    if (feesResponse && feesResponse.data.length > 0) {
      // check if fee exist i fees state
      let checkFeesExist: { [key: string]: any } = {};
      checkFeesExist[
        `${feesResponse.data[0]?.channel}-${insuranceId}-${productId}-${planId}`
      ] = {
        channel: channelId,
        insurance: feesResponse.data[0].insurance,
        fee: feesResponse.data[0].fee,
        fee_type: feesResponse.data[0].fee_type,
      };
      // update fees state
      setFees((fee: any) => {
        return {
          ...fee,
          [`${feesResponse.data[0]?.channel}-${insuranceId}-${productId}-${planId}`]: {
            channel: channelId,
            insurance: feesResponse.data[0].insurance,
            fee: feesResponse.data[0].fee,
            fee_type: feesResponse.data[0].fee_type,
          },
        };
      });
    } else {
      setFees((fee: any) => {
        return {
          ...fee,
          [`${channelId}-${insuranceId}-${productId}-${planId}`]: {
            channel: "",
            insurance: "",
            fee: 0,
            fee_type: "",
          },
        };
      });
    }
  };

  const getBillingById = async (
    id: string,
    page?: number,
    pageSize?: number,
    groupBy?: string
  ) => {
    const billing = await billingService.getBillingById(id, page, pageSize, groupBy);
    setBilling(billing);
  };

  const checkDuplicateBilling = async (
    type: string,
    company: string,
    period: string
  ) => {
    const result = await billingService.getBillings(1, 10, {
      type,
      company,
      transaction_period: period,
    });
    return result;
  };

  const updateBilling = async (id: string, data: any) => {
    await billingService.updateBilling(id, data);
  };
  return {
    updateBilling,
    checkDuplicateBilling,
    getBillingById,
    getBilling,
    billing,
    billingList,
    getFees,
    getChannelFees,
    clearFees,
    fees,
    createBilling,
  };
};

export const useTransaction = () => {
  const transactionService = new TransactionService();
  const [transactionList, setTransactionList] = useState<any>({});
  const getTransactions = async (search: any) => {
    const transaction = await transactionService.searchTransactions(search);
    setTransactionList(transaction);
  };

  return {
    getTransactions,
    transactionList,
    setTransactionList,
  };
};
