import { productService } from "@/services/product/api/product.service";
import { root } from "postcss";
import { useState } from "react";

export const useCurrency = () => {
  const [currency, setCurrencys] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [insurances, setInsurances] = useState<any[]>([]);
  const [typeCurrencies, setTypeCurrencies] = useState<any[]>([]);

  const fetchCurrency = async (
    search: any,
    categories: string,
    insurance: string
  ) => {
    const params: any = {
      page: 1,
      pageSize: 100,
      insuranceId: insurance ? insurance : undefined,
      categoryId: categories ? categories : undefined,
      category: search ? search : undefined,
    };

    const data = await productService.getInsuranceCurrencies(insurance, params);
    console.log(1, data);
    setCurrencies(data as any);
  };

  const fetchCurrencyById = async (id: string) => {
    const response = await productService.getProductById(id);
    console.log(2, (response as any)?.data ?? response);
    return (response as any)?.data ?? response;
  };

  const saveCurrency = async (data: any, id: string) => {
    const response = await productService.createInsuranceCurrency(id, data);
    return response;
  };

  const updateCurrency = async (
    data: any,
    idInsurance: string,
    idCurrency: string
  ) => {
    const response = await productService.updateInsuranceCurrency(
      idInsurance,
      idCurrency,
      data
    );
    return response;
  };

  const deleteCurrency = async (idInsurance: string, idCurrency: string) => {
    const response = await productService.deleteInsuranceCurrency(
      idInsurance,
      idCurrency
    );
    return response;
  };

  const fetchCategories = async (search: any) => {
    const data = await productService.getCategories({ ...search });
    console.log(3, data);
    setCategories(data as any);
  };

  const fetchInsurances = async (search: any) => {
    const data: any = await productService.getInsurances({ ...search });
    console.log(4, data);
    setInsurances(data?.data);
  };

  const fetchTypeCurrencies = async (search: any) => {
    const data: any = await productService.getReferenceCurrencies({ ...search });
    console.log(5, data);
    setTypeCurrencies(data?.data);
  };

  return {
    root,
    currency,
    saveCurrency,
    updateCurrency,
    deleteCurrency,
    fetchCurrency,
    productService,
    currencies,
    setCurrencys,
    fetchCurrencyById,
    categories,
    fetchCategories,
    insurances,
    fetchInsurances,
    typeCurrencies,
    fetchTypeCurrencies,
  };
};
