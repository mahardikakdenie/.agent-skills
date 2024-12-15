import { FinanceService } from "@/services/finance.services";
import { useState } from "react";

const useBrokerFee = () => {
  const [brokerFees, setBrokerFees] = useState<any>();

  const financeService = new FinanceService();
  const getBrokerFees = async (
    where?: any,
    page?: number,
    pageSize?: number
  ) => {
    const fee = await financeService.getBrokerFee(where, page, pageSize);
    setBrokerFees(fee);
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
  return {
    deleteBrokerFee,
    brokerFees,
    getBrokerFees,
    createBrokerFee,
    updateBrokerFee,
  };
};

export default useBrokerFee;
