import { ProductCatalogService } from "@/services/product-catalog.service";
import { useState } from "react";

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [insurances, setInsurances] = useState<any[]>([]);
  const [plan, setPlan] = useState<any | null>(null);
  const productCatalogService = new ProductCatalogService();
  const fetchProducts = async (search: any) => {
    const { data } = await productCatalogService.getProducts(search);
    setProducts(data);
  };
  const fetchInsurances = async (search: any) => {
    const { data } = await productCatalogService.getInsurances(search);
    setInsurances(data);
  };

  const savePlan = async (data: any) => {
    const { data: response } = await productCatalogService.savePlan(data);
    return response;
  };

  const fetchPlanById = async (id: string) => {
    const { data } = await productCatalogService.getPlanById(id);
    setPlan(data[0]);
  };

  const uploadPackage = async (category: string, id: string, data: any) => {
    const { data: response } = await productCatalogService.uploadPackage(
      category,
      id,
      data
    );
    return response;
  };
  return {
    products,
    insurances,
    fetchProducts,
    fetchInsurances,
    savePlan,
    fetchPlanById,
    plan,
    uploadPackage,
  };
};
