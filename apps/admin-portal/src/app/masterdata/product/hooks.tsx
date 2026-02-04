import {
  MdProductService,
  ProductResponse,
} from "@/services/masterdata/product.service";
import { root } from "postcss";
import { useState } from "react";
import {productService} from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";

export const useProduct = () => {
  const mdProduct = new MdProductService();
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

    const { data } = await mdProduct.getProduct(
      page,
      rowsPerPage,
      category,
      categoryId,
      insuranceId
    );
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
    const response: any = await productService.get(ApiURL.v1Insurances, { params: { ...search } });
    setInsurances(response?.data?.data);
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
