import {
  Insurance,
  InsuranceService,
} from "@/services/masterdata/insurance.service";
import { useState } from "react";

export const useInsurance = () => {
  const insuranceService = new InsuranceService();
  const [productsInsurance, setsInsurance] = useState<Insurance[]>([]);
  const [insurance, setInsurance] = useState<any[]>([]);

  const fetchInsurance = async (search: any) => {
    const { data } = await insuranceService.getInsurance();
    setInsurance(data);
  };

  const fetchInsuranceById = async (id: string) => {
    const response = await insuranceService.getInsuranceById(id);
    return response;
  };

  const saveInsurance = async (data: any) => {
    const { data: response } = await insuranceService.saveInsurance(data);
    return response;
  };

  const updateInsurance = async (data: any, id: string) => {
    const { data: response } = await insuranceService.updateInsurance(data, id);
    return response;
  };

  const deleteInsurance = async (id: string) => {
    const { data: response } = await insuranceService.deleteInsurance(id);
    return response;
  };

  return {
    insurance,
    saveInsurance,
    updateInsurance,
    deleteInsurance,
    fetchInsurance,
    productsInsurance,
    setInsurance,
    fetchInsuranceById,
  };
};
