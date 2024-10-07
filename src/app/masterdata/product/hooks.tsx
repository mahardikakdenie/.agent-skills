import {
  MdProductService,
  ProductResponse,
} from "@/services/masterdata/product.service";
import { root } from "postcss";
import { useState } from "react";

export const useProduct = () => {
  const mdProduct = new MdProductService();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [product, setProduct] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [insurances, setInsurances] = useState<any[]>([]);

  const fetchProduct = async (search: any) => {
    const page = 1;
    const rowsPerPage = 10;
    const category = search || "";

    const { data } = await mdProduct.getProduct(page, rowsPerPage, category);
    setProduct(data);
  };

  const fetchProductById = async (id: string) => {
    const response = await mdProduct.getProductById(id);
    return response;
  };

  const saveProduct = async (data: any) => {
    const { data: response } = await mdProduct.saveProduct(data);
    return response;
  };

  const updateProduct = async (data: any, id: string) => {
    const { data: response } = await mdProduct.updateProduct(data, id);
    return response;
  };

  const deleteProduct = async (id: string) => {
    const { data: response } = await mdProduct.deleteProduct(id);
    return response;
  };

  const fetchCategories = async (search: any) => {
    const { data } = await mdProduct.getCategory(search);
    setCategories(data);
  };

  const fetchInsurances = async (search: any) => {
    const { data } = await mdProduct.getInsurance(search);
    setInsurances(data);
  };

  return {
    root,
    product,
    saveProduct,
    updateProduct,
    deleteProduct,
    fetchProduct,
    mdProduct,
    products,
    setProducts,
    fetchProductById,
    categories,
    fetchCategories,
    insurances,
    fetchInsurances,
  };
};
