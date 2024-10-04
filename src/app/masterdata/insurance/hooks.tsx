import {
  ProductInsurance,
  ProductInsuranceProductService,
} from "@/services/masterdata/insurance-product.service";
import { useState } from "react";

export const useInsurance = () => {
  const insuranceProductService = new ProductInsuranceProductService();
  const [productsInsurance, setProductsInsurance] = useState<
    ProductInsurance[]
  >([]);
  const [insurance, setInsurance] = useState<any[]>([]);

  const fetchInsurance = async (search: any) => {
    const { data } = await insuranceProductService.getInsuranceProduct();
    setInsurance(data);
  };

  const fetchInsuranceById = async (id: string) => {
    const response = await insuranceProductService.getInsuranceById(id);
    return response;
  };

  const saveInsurance = async (data: any) => {
    const { data: response } =
      await insuranceProductService.saveInsuranceProduct(data);
    return response;
  };

  const updateInsurance = async (data: any, id: string) => {
    const { data: response } =
      await insuranceProductService.updateInsuranceProduct(data, id);
    return response;
  };

  const deleteInsurance = async (id: string) => {
    const { data: response } =
      await insuranceProductService.deleteInsuranceProduct(id);
    return response;
  };

  return {
    insurance,
    saveInsurance,
    updateInsurance,
    deleteInsurance,
    fetchInsurance,
    productsInsurance,
    setProductsInsurance,
    fetchInsuranceById,
  };
};
