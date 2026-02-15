import {
  Insurance,
} from "@/services/masterdata/insurance.service";
import { productService } from "@/services/product/api/product.service";
import { useState } from "react";

export const useInsurance = () => {
  const [productsInsurance, setsInsurance] = useState<Insurance[]>([]);
  const [insurance, setInsurance] = useState<any[]>([]);

  const fetchInsurance = async (search: any) => {
    const response: any = await productService.getInsurances(search);
    setInsurance(response?.data || []);
  };

  const fetchInsuranceById = async (id: string) => {
    const response: any = await productService.getInsuranceById(id);
    return response?.data ?? response;
  };

  const saveInsurance = async (data: any) => {
    const response = await productService.createInsurance(data);
    return response;
  };

  const updateInsurance = async (data: any, id: string) => {
    const response = await productService.updateInsurance(id, data);
    return response;
  };

  const deleteInsurance = async (id: string) => {
    const response = await productService.deleteInsurance(id);
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
