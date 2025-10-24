import { useState } from "react";
import ApiURL from "@/constants/api-url.const";
import { channelService, productService } from "@/services/api.service";

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [insurances, setInsurances] = useState<any[]>([]);
  const [plan, setPlan] = useState<any | null>(null);
  const [plans, setPlans] = useState<any[] | null>(null);
  const [benefits, setBenefits] = useState<any[]>([]);
  const [details, setDetails] = useState<any[]>([]);
  const [productConfig, setProductConfig] = useState<any>();
  const [packageDetail, setPackageDetail] = useState<any[]>([]);

  const fetchProducts = async (params: any) => {
    const response: any = await productService.get(ApiURL.v1Products, {
      params,
    });
    setProducts(response?.data?.data);
  };
  const fetchInsurances = async (params: any) => {
    const response: any = await productService.get(ApiURL.v1Insurances, {
      params,
    });
    setInsurances(response?.data?.data);
  };

  const savePlan = async (data: any) => {
    const response: any = await productService.post(ApiURL.v1Plans, data);
    return response?.data;
  };

  const updatePlan = async (data: any, id: string) => {
    const response: any = await productService.put(
      ApiURL.v1PlanDetails(id),
      data
    );
    return response?.data;
  };

  const deletePlan = async (id: string) => {
    const response: any = await productService.delete(ApiURL.v1PlanDetails(id));
    return response?.data;
  };

  const fetchPlanById = async (id: string) => {
    const response: any = await productService.get(ApiURL.v1PlanDetails(id));
    setPlan(response?.data?.data[0]);
  };

  const uploadPackage = async (category: string, id: string, data: any) => {
    const response: any = await productService.post(
      ApiURL.packagesCategoryBulkCreateDetail(category, id),
      data
    );
    return response?.data;
  };

  const uploadPlanBenefits = async (id: string, data: any) => {
    const response: any = await productService.post(
      ApiURL.v1PlanBenefitBulkCreateDetails(id),
      data
    );
    return response?.data;
  };

  const uploadPlanDetails = async (id: string, type: string, data: any) => {
    const response: any = await productService.post(
      ApiURL.v1PlanBulkCreateDetailsType(id, type),
      data
    );
    return response?.data;
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
      level,
    });

    if (children && children.length > 0) {
      children.forEach((child: any) => {
        flatArray = flatArray.concat(flattenTree(child, node.id, level + 1));
      });
    }

    return flatArray;
  };

  const getPlanBenefits = async (id: string) => {
    const response: any = await productService.get(
      ApiURL.v1PlanDetailsBenefits(id)
    );
    const reformatTreeToFlatArray = response?.data?.data?.flatMap((item: any) =>
      flattenTree(item)
    );
    setBenefits(reformatTreeToFlatArray);
    return reformatTreeToFlatArray;
  };

  const getPlanDetails = async (id: string, type: string) => {
    const response: any = await productService.get(
      ApiURL.v1PlanDetailsDetailsType(id, type)
    );
    setDetails(response?.data);
    return response?.data;
  };

  const assignPlans = async (planId: string, channel: string) => {
    const extractChannel = channel.split("|");
    const response: any = await productService.post(
      ApiURL.v1ChannelPackagesAssignPlans,
      {
        channel: extractChannel[0],
        plans: [planId],
        channelName: extractChannel[1],
      }
    );
    await getChannelPlans(planId);
    return response?.data;
  };

  const unAssignPlans = async (planId: string, channelId: string) => {
    const response: any = await productService.post(
      ApiURL.v1ChannelPackagesUnassignPlans,
      { channel: channelId, plans: [planId] }
    );
    await getChannelPlans(planId);
    return response?.data;
  };

  const [channels, setChannels] = useState<any[]>([]);
  const getChannels = async () => {
    const response: any = await channelService.get(ApiURL.v1Channels, {
      params: { page: 1, limit: 100 },
    });
    setChannels(response?.data);
    return response?.data;
  };

  const [channelPlans, setChannelPlans] = useState<any[]>([]);
  const getChannelPlans = async (planId: string) => {
    const response: any = await productService.get(
      ApiURL.v1PlanDetailsChannels(planId)
    );
    setChannelPlans(response?.data);
    return response?.data;
  };

  const fetchPlans = async (params: any) => {
    const response: any = await productService.get(ApiURL.v1Plans, { params });
    setPlans(response?.data?.data);
  };

  const savePackage = async (data: any) => {
    const response: any = await productService.post(ApiURL.v1Packages, data);
    return response?.data;
  };

  const updatePackage = async (id: string, data: any) => {
    const response: any = await productService.put(
      ApiURL.v1PackagesDetails(id),
      data
    );
    return response?.data;
  };

  const fetchProductConfigByType = async (type: string) => {
    const response: any = await productService.get(
      ApiURL.productConfigType(type)
    );
    setProductConfig(response?.data.data);
  };

  const fetchPackageById = async (id: string) => {
    const response: any = await productService.get(
      ApiURL.v1PackagesDetails(id)
    );
    setPackageDetail(response?.data);
  };

  const deletePackage = async (id: string) => {
    const response: any = await productService.delete(
      ApiURL.v1PackagesDetails(id)
    );
    return response?.data;
  };

  const saveBenefit = async (data: any) => {
    const response: any = await productService.post(
      ApiURL.v1PlanBenefitCreate,
      data
    );
    return response?.data;
  };

  const deleteBenefit = async (id: string) => {
    const response: any = await productService.delete(
      ApiURL.v1PlanBenefitDetails(id)
    );
    return response?.data;
  };

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
    packageDetail,
    deletePackage,
    saveBenefit,
    deleteBenefit,
  };
};
