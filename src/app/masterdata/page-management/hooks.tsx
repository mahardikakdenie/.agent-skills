import {
  PagesResponse,
  PagesService,
} from "@/services/masterdata/page.service";
import { useState } from "react";

export const usePages = () => {
  const pagesService = new PagesService();

  const [productsPages, setProductsPages] = useState<PagesResponse[]>([]);
  const [categories, setPages] = useState<any[]>([]);

  const fetchPages = async (search: any) => {
    const { data } = await pagesService.getPages();
    setPages(data);
  };

  const fetchPagesById = async (id: string) => {
    const response = await pagesService.getPagesById(id);
    return response;
  };

  const savePages = async (data: any) => {
    const { data: response } = await pagesService.savePages(data);
    return response;
  };

  const updatePages = async (data: any, id: string) => {
    const { data: response } = await pagesService.updatePages(data, id);
    return response;
  };

  const deletePages = async (id: string) => {
    const { data: response } = await pagesService.deletePages(id);
    return response;
  };

  return {
    categories,
    savePages,
    updatePages,
    deletePages,
    fetchPages,
    fetchPagesById,
    productsPages,
    setProductsPages,
  };
};
