import {
  MailTemplateService,
  ProductResponse,
} from "@/services/masterdata/mail-template.service";
import { root } from "postcss";
import { useState } from "react";

export const usePages = () => {
  const mailTemplateService = new MailTemplateService();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [product, setProduct] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [insurances, setInsurances] = useState<any[]>([]);
  const [mailTemplate, setMailTemplate] = useState<any[]>([]);
  const [journey, setJourney] = useState<any[]>([]);
  const [emailTag, setEmailTag] = useState<any[]>([]);

  const fetchProduct = async (
    search: any,
    categories: string,
    insurance: string
  ) => {
    const page = 1;
    const rowsPerPage = 10;
    const category = search || "";
    const insuranceId = insurance;
    const categoryId = categories;

    const { data } = await mailTemplateService.getProduct(
      page,
      rowsPerPage,
      category,
      categoryId,
      insuranceId
    );
    setProduct(data);
  };

  const savePages = async (data: any, id: string) => {
    const { data: response } = await mailTemplateService.saveJourney(data, id);
    return response;
  };

  const updateProduct = async (data: any, id: string) => {
    const { data: response } = await mailTemplateService.updateProduct(
      data,
      id
    );
    return response;
  };

  const fetchCategories = async (search: any) => {
    const { data } = await mailTemplateService.getCategory(search);
    setCategories(data);
  };

  const fetchInsurances = async (search: any) => {
    const { data } = await mailTemplateService.getInsurance(search);
    setInsurances(data);
  };

  const fetchProductSelect = async (search: any) => {
    const { data } = await mailTemplateService.getProductSelect(search);
    setProducts(data);
  };

  const fetchPlans = async (search: any) => {
    const { data } = await mailTemplateService.getPlans(search);
    setPlans(data);
  };

  const fetchMailTemplate = async (search: any) => {
    const { data } = await mailTemplateService.getMailTemplate(search);
    setMailTemplate(data);
  };
  const deleteMailTemplate = async (id: string) => {
    const { data: response } = await mailTemplateService.deleteMailTemplate(id);
    return response;
  };
  const fetchMailTemplateById = async (id: string) => {
    const { data } = await mailTemplateService.getMailTemplateById(id);
    setMailTemplate(data);
  };
  const fetchJourney = async (search: any) => {
    const { data } = await mailTemplateService.getJourney(search);
    setJourney(data);
  };

  const fetchEmailTag = async (search: any) => {
    const { data } = await mailTemplateService.getEmailTag(search);
    setEmailTag(data);
  };

  return {
    root,
    product,
    savePages,
    updateProduct,
    deleteMailTemplate,
    fetchProduct,
    mailTemplateService,
    products,
    setProducts,
    fetchMailTemplateById,
    categories,
    fetchCategories,
    insurances,
    fetchInsurances,
    mailTemplate,
    fetchMailTemplate,
    fetchProductSelect,
    plans,
    fetchPlans,
    journey,
    fetchJourney,
    emailTag,
    fetchEmailTag,
  };
};
