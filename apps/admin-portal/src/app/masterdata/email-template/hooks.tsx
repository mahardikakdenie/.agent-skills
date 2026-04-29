import {
  ProductResponse,
} from "@/services/masterdata/mail-template.service";
import { productService } from "@/services/product/api/product.service";
import { root } from "postcss";
import { useState } from "react";

export const usePages = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [product, setProduct] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [insurances, setInsurances] = useState<any[]>([]);
  const [mailTemplate, setMailTemplate] = useState<any[]>([]);
  const [mailTemplateById, setMailTemplateById] = useState<any[]>([]);
  const [journey, setJourney] = useState<any[]>([]);
  const [emailTag, setEmailTag] = useState<any[]>([]);
  const [emailTagMeta, setEmailTagMeta] = useState<any>(null);

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

    const response: any = await productService.getProducts({
      page,
      pageSize: rowsPerPage,
      category,
      categoryId,
      insuranceId,
    });
    setProduct(response?.data || []);
  };

  const savePages = async (data: any) => {
    const response = await productService.createEmailTemplateJourney(data);
    return response;
  };

  const updatePages = async (data: any, id: string) => {
    const response = await productService.updateEmailTemplateJourney(id, data);
    return response;
  };

  const fetchCategories = async (search: any) => {
    const response: any = await productService.getCategories(search);
    setCategories(response?.data || []);
  };

  const fetchInsurances = async (search: any) => {
    const response: any = await productService.getInsurances(search);
    setInsurances(response?.data || []);
  };

  const fetchProductSelect = async (search: any) => {
    const response: any = await productService.getProducts(search);
    setProducts(response?.data || []);
  };

  const fetchPlans = async (search: any) => {
    const response: any = await productService.getPlans(search);
    setPlans(response?.data || []);
  };

  const fetchMailTemplate = async (search: any) => {
    const response: any = await productService.getEmailTemplatesJourney(search);
    setMailTemplate(response?.data || []);
  };

  const fetchMailTemplateById = async (id: any) => {
    const response: any = await productService.getEmailTemplateJourneyById(id);
    setMailTemplateById(response?.data ?? response ?? []);
  };

  const deleteMailTemplate = async (id: string) => {
    const response = await productService.deleteEmailTemplateJourney(id);
    return response;
  };

  const fetchJourney = async (search: any) => {
    const response: any = await productService.getReferenceEmailJourney(search);
    setJourney(response?.data || []);
  };

  const fetchEmailTag = async (params: any) => {
    const response: any = await productService.getEmailTags(params);
    setEmailTag(response?.data || []);
    setEmailTagMeta(response?.meta || null);
  };

  return {
    root,
    product,
    savePages,
    updatePages,
    deleteMailTemplate,
    fetchProduct,
    mailTemplateService: productService,
    products,
    setProducts,
    mailTemplateById,
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
    emailTagMeta,
  };
};
