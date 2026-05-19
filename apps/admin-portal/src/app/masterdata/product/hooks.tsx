import type { ProductResponse } from "@/services/product/api/product.types";
import { productService } from "@/services/product/api/product.service";
import { root } from "postcss";
import { useState } from "react";

export const useProduct = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [product, setProduct] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [insurances, setInsurances] = useState<any[]>([]);

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

  const fetchProductById = async (id: string) => {
    const response: any = await productService.getProductById(id);
    return response?.data ?? response;
  };

  const saveProduct = async (data: any) => {
    const response = await productService.createProduct(data);
    return response;
  };

  const updateProduct = async (data: any, id: string) => {
    const response = await productService.updateProduct(id, data);
    return response;
  };

  const deleteProduct = async (id: string) => {
    const response = await productService.deleteProduct(id);
    return response;
  };

  const fetchCategories = async (search: any) => {
    const response: any = await productService.getCategories(search);
    setCategories(response?.data || []);
  };

  const fetchInsurances = async (search: any) => {
    const response: any = await productService.getInsurances({ ...search });
    setInsurances(response?.data);
  };

  return {
    root,
    product,
    saveProduct,
    updateProduct,
    deleteProduct,
    fetchProduct,
    mdProduct: productService,
    products,
    setProducts,
    fetchProductById,
    categories,
    fetchCategories,
    insurances,
    fetchInsurances,
  };
};
