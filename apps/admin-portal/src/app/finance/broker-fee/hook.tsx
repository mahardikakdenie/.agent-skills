import { useState } from "react";
import { financeService } from "@/services/finance/api/finance.service";

const useBrokerFee = () => {
  const [brokerFees, setBrokerFees] = useState<any>();
  const [channelFees, setChannelFees] = useState<any>();

  const getBrokerFees = async (
    where?: any,
    page?: number,
    pageSize?: number,
    searchData?: string
  ) => {
    const fee: any = await financeService.getBrokerFees({
      ...where,
      page,
      pageSize,
      keyword: searchData,
    });
    setBrokerFees(fee);
  };

  const getChannelFees = async (
    where?: any,
    page?: number,
    pageSize?: number,
    searchData?: string
  ) => {
    const fee: any = await financeService.getChannelFees({
      ...where,
      page,
      pageSize,
      keyword: searchData,
    });
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
