import {
  ProductCategories,
  ProductCategoriesService,
} from "@/services/masterdata/product-category.service";
import { useState } from "react";

export const useMasterData = () => {
  const productCategoriesService = new ProductCategoriesService();
  const [productsCategories, setProductsCategories] = useState<
    ProductCategories[]
  >([]);
  const [categories, setCategories] = useState<any[]>([]);

  const fetchCategories = async (search: any) => {
    const { data } = await productCategoriesService.getCategories(search);
    setCategories(data);
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
    categories,
    saveCategories,
    updateCategories,
    deleteCategories,
    fetchCategories,
    productsCategories,
    setProductsCategories,
  };
};
