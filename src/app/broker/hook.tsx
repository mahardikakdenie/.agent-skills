import { FinanceService } from "@/services/finance.services";
import { useState } from "react";

const useBrokerFee = () => {
  const [brokerFees, setBrokerFees] = useState<any>();
  const [channelFees, setChannelFees] = useState<any>();

  const financeService = new FinanceService();
  const getBrokerFees = async (
    where?: any,
    page?: number,
    pageSize?: number
  ) => {
    const fee = await financeService.getBrokerFee(where, page, pageSize);
    setBrokerFees(fee);
  };

  const getChannelFees = async (
    where?: any,
    page?: number,
    pageSize?: number
  ) => {
    const fee = await financeService.getChannelFee(where, page, pageSize);
    setChannelFees(fee);
  };


  const createBrokerFee = async (data: any) => {
    await financeService.createBrokerFee(data);
  };

  const updateBrokerFee = async (id: string, data: any) => {
    await financeService.updateBrokerFee(id, data);
  };

  const deleteBrokerFee = async (id: string) => {
    await financeService.deleteBrokerFee(id);
  };

  const createChannelFee = async (channelId: string, data: any) => {
    await financeService.createChannelFee(channelId, data);
  };
  const updateChannelFee = async (id: string, data: any) => {
    await financeService.updateChannelFee(id, data);
  };
  const deleteChannelFee = async (id: string) => {
    await financeService.deleteChannelFee(id);
  };
  return {
    deleteBrokerFee,
    brokerFees,
    channelFees,
    getBrokerFees,
    getChannelFees,
    createBrokerFee,
    updateBrokerFee,
    createChannelFee,
    updateChannelFee,
    deleteChannelFee,

  };
};

export default useBrokerFee;
