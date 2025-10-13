import { productService } from "@/services/api.service";
import { root } from "postcss";
import { useState } from "react";
import ApiURL from "@/constants/api-url.const";

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
      category: search ? search : undefined
    };

    const { data } = await productService.get(ApiURL.v1InsuranceDetailsCurrency(insurance), { params });
    console.log(1, data)
    setCurrencies(data);
  };

  const fetchCurrencyById = async (id: string) => {
    const response = await productService.get(ApiURL.v1ProductDetails(id));
    console.log(2, response.data);
    return response.data;
  };

  const saveCurrency = async (data: any, id: string) => {
    const { data: response } = await productService.post(ApiURL.v1InsuranceDetailsCurrency(id), data);
    return response;
  };

  const updateCurrency = async (
    data: any,
    idInsurance: string,
    idCurrency: string
  ) => {
    const { data: response } = await productService.put(ApiURL.v1InsuranceDetailsCurrencyDetails(idInsurance, idCurrency), data);
    return response;
  };

  const deleteCurrency = async (idInsurance: string, idCurrency: string) => {
    const { data: response } = await productService.delete(ApiURL.v1InsuranceDetailsCurrencyDetails(idInsurance, idCurrency));
    return response;
  };

  const fetchCategories = async (search: any) => {
    const { data } = await productService.get(ApiURL.v1Categories, { params: { ...search } });
    console.log(3, data);
    setCategories(data);
  };

  const fetchInsurances = async (search: any) => {
    const { data } = await productService.get(ApiURL.v1Insurances, { params: { ...search } });
    console.log(4, data);
    setInsurances(data);
  };

  const fetchTypeCurrencies = async (search: any) => {
    const { data } = await productService.get(ApiURL.v1ReferencesTypeCurrencies, { params: { ...search } });
    console.log(5, data);
    setTypeCurrencies(data);
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
