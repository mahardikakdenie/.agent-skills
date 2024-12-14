import { BillingService } from "@/services/billing.services";
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
  const billingService = new BillingService();
  const getBilling = async (page?: number, pageSize?: number) => {
    const billings = await billingService.getBillings(
      page ?? 1,
      pageSize ?? 10,
      {}
    );
    setBillingList(billings);
  };

  const createBilling = async (data: any) => {
    await billingService.createBilling(data);
  };
  const getFees = async (insuranceId: string) => {
    if (!insuranceId) {
      return;
    }
    const feesResponse = await billingService.getFees(insuranceId);

    if (feesResponse.data[0]) {
      // check if fee exist i fees state
      let checkFeesExist: { [key: string]: any } = {};
      checkFeesExist[feesResponse.data[0]?.insurance] = {
        insurance: feesResponse.data[0].insurance,
        fee: feesResponse.data[0].fee,
        fee_type: feesResponse.data[0].fee_type,
      };

      // update fees state
      setFees((fee: any) => {
        return {
          ...fee,
          [feesResponse.data[0]?.insurance]: {
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
          [feesResponse.data[0]?.insurance]: {
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
    pageSize?: number
  ) => {
    const billing = await billingService.getBillingById(id, page, pageSize);
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
