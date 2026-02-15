import {
  PagesResponse,
} from "@/services/masterdata/page.service";
import { authService } from "@/services/auth/api/auth.service";
import { useState } from "react";

export const usePages = () => {
  const [productsPages, setProductsPages] = useState<PagesResponse[]>([]);
  const [categories, setPages] = useState<any[]>([]);

  const fetchPages = async (search: any) => {
    const response: any = await authService.getPages(search);
    setPages(response?.data || []);
  };

  const fetchPagesById = async (id: string) => {
    return await authService.getPageById(id);
  };

  const savePages = async (data: any) => {
    return await authService.createPage(data);
  };

  const updatePages = async (data: any, id: string) => {
    return await authService.updatePage(id, data);
  };

  const deletePages = async (id: string) => {
    return await authService.deletePage(id);
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
