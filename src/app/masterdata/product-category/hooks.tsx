import {
  ProductCategories,
  ProductCategoriesService,
} from "@/services/masterdata/product-category.service";
import { useState } from "react";

export const useCategories = () => {
  const productCategoriesService = new ProductCategoriesService();

  const [productsCategories, setProductsCategories] = useState<
    ProductCategories[]
  >([]);

  const fetchCategories = async (search?: any) => {
    const result = await productCategoriesService.getCategories();
    return result;
  };

  const fetchCategoriesById = async (id: string) => {
    const response = await productCategoriesService.getCategoriesById(id);
    return response;
  };

  const saveCategories = async (data: any) => {
    const { data: response } = await productCategoriesService.saveCategories(
      data
    );
    return response;
  };

  const updateCategories = async (data: any, id: string) => {
    const { data: response } = await productCategoriesService.updateCategories(
      data,
      id
    );
    return response;
  };

  const deleteCategories = async (id: string) => {
    const { data: response } = await productCategoriesService.deleteCategories(
      id
    );
    return response;
  };

  return {
    saveCategories,
    updateCategories,
    deleteCategories,
    fetchCategories,
    fetchCategoriesById,
    productsCategories,
    setProductsCategories,
  };
};
