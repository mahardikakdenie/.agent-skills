import { EmailTagResponse } from "@/services/masterdata/mail-template.service";
import { productService } from "@/services/product/api/product.service";
import { useState } from "react";

export const useEmailTag = () => {
  const [productsEmailTag, setProductsEmailTag] = useState<EmailTagResponse[]>(
    []
  );
  const [emailTag, setEmailTag] = useState<any[]>([]);
  const [journeys, setJourneys] = useState<any[]>([]);

  const fetchEmailTag = async (data: any) => {
    const response: any = await productService.getEmailTags(data);
    return response?.data ?? [];
  };

  const fetchEmailTagById = async (id: string) => {
    const response: any = await productService.getEmailTagById(id);
    return response?.data ?? response;
  };

  const saveEmailTag = async (data: any) => {
    const response = await productService.createEmailTag(data);
    return response;
  };

  const updateEmailTag = async (data: any, id: string) => {
    const response = await productService.updateEmailTag(id, data);
    return response;
  };

  const deleteEmailTag = async (id: string) => {
    const response = await productService.deleteEmailTag(id);
    return response;
  };

  const fetchJourney = async (search: any) => {
    const response: any = await productService.getReferenceEmailJourney(search);
    setJourneys(response?.data || []);
  };

  return {
    emailTag,
    saveEmailTag,
    updateEmailTag,
    deleteEmailTag,
    fetchEmailTag,
    fetchEmailTagById,
    productsEmailTag,
    setProductsEmailTag,
    journeys,
    fetchJourney,
  };
};
