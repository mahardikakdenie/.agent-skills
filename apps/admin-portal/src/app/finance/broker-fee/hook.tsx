import { useState } from "react";
import ApiURL from "@/constants/api-url.const";
import {financeService} from "@/services/api.service";

const useBrokerFee = () => {
  const [brokerFees, setBrokerFees] = useState<any>();
  const [channelFees, setChannelFees] = useState<any>();

  const getBrokerFees = async (
    where?: any,
    page?: number,
    pageSize?: number,
    searchData?: string
  ) => {
    const fee: any = await financeService.get(ApiURL.v1FeesBroker, { params: { ...where, page, pageSize, keyword: searchData } });
    setBrokerFees(fee?.data);
  };

  const getChannelFees = async (
    where?: any,
    page?: number,
    pageSize?: number,
    searchData?: string
  ) => {
    const fee: any = await financeService.get(ApiURL.v1FeesChannel, { params: { ...where, page, pageSize, keyword: searchData } });
    setChannelFees(fee?.data);
  };


  const createBrokerFee = async (data: any) => {
    await financeService.post(ApiURL.v1FeesBroker, data);
  };

  const updateBrokerFee = async (id: string, data: any) => {
    await financeService.put(ApiURL.v1FeesBrokerDetail(id), data);
  };

  const deleteBrokerFee = async (id: string) => {
    await financeService.delete(ApiURL.v1FeesBrokerDetail(id));
  };

  const createChannelFee = async (channelId: string, data: any) => {
    await financeService.post(ApiURL.v1FeesChannelDetail(channelId), data);
  };
  const updateChannelFee = async (id: string, data: any) => {
    await financeService.put(ApiURL.v1FeesChannelDetail(id), data);
  };
  const deleteChannelFee = async (id: string) => {
    await financeService.delete(ApiURL.v1FeesChannelDetail(id));
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
