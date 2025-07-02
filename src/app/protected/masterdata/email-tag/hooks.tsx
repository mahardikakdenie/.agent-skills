import { EmailTagService } from "@/services/masterdata/email-tag.service";
import { EmailTagResponse } from "@/services/masterdata/mail-template.service";
import { useState } from "react";

export const useEmailTag = () => {
  const emailTagService = new EmailTagService();

  const [productsEmailTag, setProductsEmailTag] = useState<EmailTagResponse[]>(
    []
  );
  const [emailTag, setEmailTag] = useState<any[]>([]);
  const [journeys, setJourneys] = useState<any[]>([]);

  const fetchEmailTag = async (data: any) => {
    const { data: response } = await emailTagService.getEmailTag(data);
    return response;
  };

  const fetchEmailTagById = async (id: string) => {
    const response = await emailTagService.getEmailTagById(id);
    return response;
  };

  const saveEmailTag = async (data: any) => {
    const { data: response } = await emailTagService.saveEmailTag(data);
    return response;
  };

  const updateEmailTag = async (data: any, id: string) => {
    const { data: response } = await emailTagService.updateEmailTag(data, id);
    return response;
  };

  const deleteEmailTag = async (id: string) => {
    const { data: response } = await emailTagService.deleteEmailTag(id);
    return response;
  };

  const fetchJourney = async (search: any) => {
    const { data } = await emailTagService.getJourney(search);
    setJourneys(data);
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
