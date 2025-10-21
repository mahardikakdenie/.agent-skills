import { useState } from "react";
import ApiURL from "@/constants/api-url.const";
import {channelService, financeService, financeServiceFormData, transactionService} from "@/services/api.service";

export const useChannel = () => {
  const [channel, setChannel] = useState<string>("");
  const [channelList, setChannelList] = useState<any[]>([]);
  const getChannel = async () => {
    const channels: any = await channelService.get(ApiURL.v1Channels, { params: { page: 1, limit: 10000 } });
    setChannelList(channels?.data?.data);
  };
  return { getChannel, channel, channelList };
};

export const useBilling = () => {
  const [billing, setBilling] = useState<any>({});
  const [billingList, setBillingList] = useState<any>({});
  const [unmatchedReconcillbillingList, setUnmatchedReconcillBillingList] = useState<any>({});
  const [fees, setFees] = useState<any>([]);
  const getBilling = async (query: any, page?: number, pageSize?: number) => {
    const billings: any = await financeService.get(ApiURL.v1Billings, { params: { page: page ?? 1, pageSize: pageSize ?? 10, ...query } });
    setBillingList(billings?.data);
  };
  
  const createBilling = async (data: any) => {
    await financeService.post(ApiURL.v1Billings, data);
  };
  
  const importBillingTransactions = async (data: any) => {
    await financeServiceFormData.post(ApiURL.v1BillingsImportTransaction, data);
  };

  const getUnmatchedReconcillBilling = async (page: number, pageSize: number, query?: any) => {
    const unmatchedBillings: any = await financeService.get(ApiURL.v1BillingsNotMatchReconciliation, { params: { page: page ?? 1, pageSize: pageSize ?? 10, ...query } });
    setUnmatchedReconcillBillingList(unmatchedBillings?.data);
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
    const response: any = await financeService.get(ApiURL.v1FeesBrokerFilter, { params: { insuranceId, productId, planId } });
    const feesResponse: any = response?.data;

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
    const response: any = await financeService.get(ApiURL.v1FeesChannelFilter, { params: { channelId, insuranceId } });
    const feesResponse: any = response?.data;

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
    const billing: any = await financeService.get(ApiURL.v1BillingDetails(id), { params: { page, pageSize, groupBy } });
    setBilling(billing?.data);
  };

  const checkDuplicateBilling = async (
    type: string,
    company: string,
    period: string
  ) => {
    const result = await financeService.get(ApiURL.v1Billings, { params: { page: 1, pageSize: 10, type, company, transaction_period: period } });
    return result?.data;
  };

  const updateBilling = async (id: string, data: any) => {
    await financeService.put(ApiURL.v1BillingDetails(id), data);
  };

  const confirmReconcilliation = async (id:string) => {
    await financeService.post(ApiURL.v1BillingDetailsConfirmReconciliation(id));
  }
  return {
    updateBilling,
    checkDuplicateBilling,
    getBillingById,
    getBilling,
    getUnmatchedReconcillBilling,
    unmatchedReconcillbillingList,
    billing,
    billingList,
    getFees,
    getChannelFees,
    clearFees,
    fees,
    createBilling,
    importBillingTransactions,
    confirmReconcilliation
  };
};

export const useTransaction = () => {
  const [transactionList, setTransactionList] = useState<any>({});
  const getTransactions = async (search: any) => {
    const transaction = await transactionService.get(ApiURL.v1Transactions, { params: { ...search } });
    setTransactionList(transaction?.data);
  };

  return {
    getTransactions,
    transactionList,
    setTransactionList,
  };
};
