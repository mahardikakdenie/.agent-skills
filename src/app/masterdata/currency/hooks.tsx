import {
  CurrenciesService,
  CurrencyResponse,
} from "@/services/masterdata/currency.service";
import { root } from "postcss";
import { useState } from "react";

export const useCurrency = () => {
  const mdCurrency = new CurrenciesService();
  const [currency, setCurrencys] = useState<CurrencyResponse[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [insurances, setInsurances] = useState<any[]>([]);
  const [typeCurrencies, setTypeCurrencies] = useState<any[]>([]);

  const fetchCurrency = async (
    search: any,
    categories: string,
    insurance: string
  ) => {
    const page = 1;
    const rowsPerPage = 10;
    const category = search || "";
    const insuranceId = insurance;
    const categoryId = categories;

    const { data } = await mdCurrency.getCurrency(
      page,
      rowsPerPage,
      category,
      categoryId,
      insuranceId
    );
    setCurrencies(data);
  };

  const fetchCurrencyById = async (id: string) => {
    const response = await mdCurrency.getCurrencyById(id);
    return response;
  };

  const saveCurrency = async (data: any, id: string) => {
    const { data: response } = await mdCurrency.saveCurrency(data, id);
    return response;
  };

  const updateCurrency = async (
    data: any,
    idInsurance: string,
    idCurrency: string
  ) => {
    const { data: response } = await mdCurrency.updateCurrency(
      data,
      idInsurance,
      idCurrency
    );
    return response;
  };

  const deleteCurrency = async (idInsurance: string, idCurrency: string) => {
    const { data: response } = await mdCurrency.deleteCurrency(
      idInsurance,
      idCurrency
    );
    return response;
  };

  const fetchCategories = async (search: any) => {
    const { data } = await mdCurrency.getCategory(search);
    setCategories(data);
  };

  const fetchInsurances = async (search: any) => {
    const { data } = await mdCurrency.getInsurance(search);
    setInsurances(data);
  };

  const fetchTypeCurrencies = async (search: any) => {
    const { data } = await mdCurrency.getTypeCurrencies(search);
    setTypeCurrencies(data);
  };

  return {
    root,
    currency,
    saveCurrency,
    updateCurrency,
    deleteCurrency,
    fetchCurrency,
    mdCurrency,
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
