import {
  ProductCategories,
} from "@/services/masterdata/product-category.service";
import { productService } from "@/services/product/api/product.service";
import { useState } from "react";

export const useCategories = () => {
  const [productsCategories, setProductsCategories] = useState<
    ProductCategories[]
  >([]);

  const fetchCategories = async (search?: any) => {
    const result = await productService.getCategories(search);
    return result;
  };

  const fetchCategoriesById = async (id: string) => {
    const response: any = await productService.getCategoryById(id);
    return response?.data ?? response;
  };

  const saveCategories = async (data: any) => {
    const response = await productService.createCategory(data);
    return response;
  };

  const updateCategories = async (data: any, id: string) => {
    const response = await productService.updateCategory(id, data);
    return response;
  };

  const deleteCategories = async (id: string) => {
    const response = await productService.deleteCategory(id);
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
