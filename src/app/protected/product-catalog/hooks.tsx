import { ChannelService } from "@/services/channel.services";
import {
  GetPlansRequest,
  PackageDto,
  ProductCatalogRequest,
  ProductCatalogService,
  ProductList,
} from "@/services/product-catalog.service";
import { ProductConfig, ProductConfigService } from "@/services/product-config.service";
import { useState } from "react";

export const useProducts = () => {
  const [products, setProducts] = useState<ProductList[]>([]);
  const [insurances, setInsurances] = useState<any[]>([]);
  const [plan, setPlan] = useState<any | null>(null);
  const [plans, setPlans] = useState<any[] | null>(null);
  const [benefits, setBenefits] = useState<any[]>([]);
  const [details, setDetails] = useState<any[]>([]);
  const [productConfig, setProductConfig] = useState<ProductConfig>();
  const [packageDetail, setPackageDetail] = useState<PackageDto>();

  const productCatalogService = new ProductCatalogService();
  const channelService = new ChannelService();
  const productConfigService = new ProductConfigService();

  const fetchProducts = async (params: ProductCatalogRequest) => {
    const data = await productCatalogService.getProducts(params);
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

  const updatePlan = async (data: any, id: string) => {
    const { data: response } = await productCatalogService.updatePlan(data, id);
    return response;
  };

  const deletePlan = async (id: string) => {
    const { data: response } = await productCatalogService.deletePlan(id);
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

  const uploadPlanBenefits = async (id: string, data: any) => {
    const { data: response } = await productCatalogService.uploadPlanBenefits(
      id,
      data
    );
    return response;
  };

  const uploadPlanDetails = async (id: string, type: string, data: any) => {
    const { data: response } = await productCatalogService.uploadPlanDetails(
      id,
      type,
      data
    );
    return response;
  };
  const flattenTree = (
    node: any,
    parent_id: string | null = null,
    level: number = 0
  ) => {
    let flatArray: any[] = [];
    const { children, ...rest } = node;
    flatArray.push({
      ...rest,
      parent_id,
      name:
        " - ".repeat(level) + rest.benefits.description_id ||
        rest.benefits.description_en ||
        rest.benefits.description_multilanguage,
    });

    if (children && children.length > 0) {
      children.forEach((child: any) => {
        flatArray = flatArray.concat(flattenTree(child, node.id, level + 1));
      });
    }

    return flatArray;
  };

  const getPlanBenefits = async (id: string) => {
    const { data } = await productCatalogService.getPlanBenefits(id);
    const reformatTreeToFlatArray = data.flatMap((item: any) =>
      flattenTree(item)
    );
    setBenefits(reformatTreeToFlatArray);
    return reformatTreeToFlatArray;
  };

  const getPlanDetails = async (id: string, type: string) => {
    const { data } = await productCatalogService.getPlanDetails(id, type);
    setDetails(data);
    return data;
  };

  const assignPlans = async (planId: string, channel: string) => {
    const extractChannel = channel.split("|");
    const { data } = await productCatalogService.assignPlans(
      planId,
      extractChannel[0],
      extractChannel[1]
    );
    await getChannelPlans(planId);

    return data;
  };

  const unAssignPlans = async (planId: string, channelId: string) => {
    const { data } = await productCatalogService.unAssignPlans(
      planId,
      channelId
    );
    await getChannelPlans(planId);
    return data;
  };

  const [channels, setChannels] = useState<any[]>([]);
  const getChannels = async () => {
    const { data } = await channelService.getChannels();
    setChannels(data);
    return data;
  };

  const [channelPlans, setChannelPlans] = useState<any[]>([]);
  const getChannelPlans = async (planId: string) => {
    const { data } = await productCatalogService.getChannelPlans(planId);
    setChannelPlans(data);
    return data;
  };

  const fetchPlans = async (params: GetPlansRequest) => {
    const { data } = await productCatalogService.getPlans(params);
    setPlans(data);
  };

  const savePackage = async (data: any) => {
    const { data: response } = await productCatalogService.savePackage(data);

    return response;
  }

  const updatePackage = async (id: string, data: any) => {
    const { data: response } = await productCatalogService.updatePackage(id, data);

    return response;
  }

  const fetchProductConfigByType = async(type: string) => {
    const { data } = await productConfigService.getProductConfigByType(type);

    setProductConfig(data)
  }

  const fetchPackageById = async (id: string) => {
    const { data } = await productCatalogService.getPackageById(id);

    setPackageDetail(data);
  }

  return {
    fetchPlans,
    products,
    insurances,
    plans,
    fetchProducts,
    fetchInsurances,
    savePlan,
    updatePlan,
    fetchPlanById,
    plan,
    uploadPackage,
    deletePlan,
    getPlanBenefits,
    benefits,
    uploadPlanBenefits,
    getPlanDetails,
    details,
    uploadPlanDetails,
    assignPlans,
    unAssignPlans,
    channels,
    getChannels,
    getChannelPlans,
    channelPlans,
    savePackage,
    updatePackage,
    fetchProductConfigByType,
    productConfig,
    fetchPackageById,
    packageDetail
  };
};
