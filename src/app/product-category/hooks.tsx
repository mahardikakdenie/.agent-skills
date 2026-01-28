import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import ApiURL from "@/constants/api-url.const";
import AppURL from "@/constants/app-url.const";
import { channelService, productService } from "@/services/api.service";
import { ProductCatalogService } from "@/services/product-catalog.service";
import { useAuth } from "@/context/auth.context";
import { toastNotification } from "@/lib/toast";

interface UseProductCategoryProps {
  category?: string;
  planId?: string;
  packageId?: string;
}

interface SubmenuItem {
  id: string;
  url: string;
  label: string;
  slug: string;
}

const formatCategoryLabel = (value: string | undefined) => {
  if (!value) return "";
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const useProducts = (props: UseProductCategoryProps = {}) => {
  const { category, planId, packageId } = props;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { permissionList } = useAuth();

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchPlanName, setSearchPlanName] = useState("");
  const [searchInsurer, setSearchInsurer] = useState("");
  const [searchProduct, setSearchProduct] = useState("");

  const [detailType, setDetailType] = useState<string>("");

  const [packagesPage, setPackagesPage] = useState(1);
  const [packagesRowsPerPage, setPackagesRowsPerPage] = useState(200);

  const [benefitsPage, setBenefitsPage] = useState(1);
  const [benefitsRowsPerPage, setBenefitsRowsPerPage] = useState(50);

  const [detailsPage, setDetailsPage] = useState(1);
  const [detailsRowsPerPage, setDetailsRowsPerPage] = useState(50);

  const canRead = permissionList.includes("Product Category.Read");
  const canEdit = permissionList.includes("Product Category.Update");
  const canDelete = permissionList.includes("Product Category.Delete");
  const canCreate = permissionList.includes("Product Category.Create");

  useEffect(() => {
    if (!canRead) {
      router.push(AppURL.forbidden);
    }
  }, [canRead, router]);

  useEffect(() => {
    if (searchPlanName || searchInsurer || searchProduct) {
      setPage(1);
    }
  }, [searchPlanName, searchInsurer, searchProduct]);

  useEffect(() => {
    if (searchInsurer) {
      refetchProducts();
    }
  }, [searchInsurer]);

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products", searchInsurer],
    queryFn: async () => {
      const params = searchInsurer ? { insuranceId: searchInsurer } : {};
      const response: any = await productService.get(ApiURL.v1Products, {
        params,
      });
      return response?.data?.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: insurancesData, isLoading: isLoadingInsurances } = useQuery({
    queryKey: ["insurances"],
    queryFn: async () => {
      const response: any = await productService.get(ApiURL.v1Insurances, {
        params: {},
      });
      return response?.data?.data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: catalogPlansData,
    isLoading: isLoadingCatalogPlans,
    refetch: refetchCatalogPlans,
  } = useQuery({
    queryKey: [
      "product-catalog-plans",
      category,
      page,
      rowsPerPage,
      searchPlanName,
      searchInsurer,
      searchProduct,
    ],
    queryFn: async () => {
      if (!category) return null;
      const productCatalogService = new ProductCatalogService();
      const params = {
        page,
        pageSize: rowsPerPage,
        category,
        ...(searchPlanName && { planName: searchPlanName }),
        ...(searchInsurer && { insuranceId: searchInsurer }),
        ...(searchProduct && { productId: searchProduct }),
      };
      const response = await productCatalogService.getPlans(params);
      return response;
    },
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: planData,
    isLoading: isLoadingPlan,
    refetch: refetchPlan,
  } = useQuery({
    queryKey: ["plan", planId],
    queryFn: async () => {
      if (!planId) return null;
      const response: any = await productService.get(
        ApiURL.v1PlanDetails(planId),
      );
      return response?.data?.data[0] || null;
    },
    enabled: !!planId,
    staleTime: 5 * 60 * 1000,
  });

  const flattenTree = (
    node: any,
    parent_id: string | null = null,
    level: number = 0,
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

  const {
    data: benefitsData,
    isLoading: isLoadingBenefits,
    refetch: refetchBenefits,
  } = useQuery({
    queryKey: ["plan-benefits", planId],
    queryFn: async () => {
      if (!planId) return [];
      const response: any = await productService.get(
        ApiURL.v1PlanDetailsBenefits(planId),
      );
      const reformatTreeToFlatArray = response?.data?.data?.flatMap(
        (item: any) => flattenTree(item),
      );
      return reformatTreeToFlatArray || [];
    },
    enabled: !!planId,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: planDetailsData,
    isLoading: isLoadingPlanDetails,
    refetch: refetchPlanDetails,
  } = useQuery({
    queryKey: ["plan-details", planId, detailType],
    queryFn: async () => {
      if (!planId || !detailType) return [];
      const response: any = await productService.get(
        ApiURL.v1PlanDetailsDetailsType(planId, detailType),
      );
      return response?.data.data || [];
    },
    enabled: !!planId && !!detailType,
    staleTime: 5 * 60 * 1000,
  });

  const { data: channelsData, isLoading: isLoadingChannels } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const response: any = await channelService.get(ApiURL.v1Channels, {
        params: { page: 1, limit: 100 },
      });
      return response?.data.data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: channelPlansData,
    isLoading: isLoadingChannelPlans,
    refetch: refetchChannelPlans,
  } = useQuery({
    queryKey: ["channel-plans", planId],
    queryFn: async () => {
      if (!planId) return [];
      const response: any = await productService.get(
        ApiURL.v1PlanDetailsChannels(planId),
      );
      return response?.data.data || [];
    },
    enabled: !!planId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: allPlansData, isFetching: isLoadingAllPlans } = useQuery({
    queryKey: ["all-plans", searchProduct],
    queryFn: async () => {
      const response: any = await productService.get(ApiURL.v1Plans, {
        params: {
          ...(searchProduct && { productId: searchProduct }),
        },
      });
      return response?.data?.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: packagesData,
    isLoading: isLoadingPackages,
    refetch: refetchPackages,
  } = useQuery({
    queryKey: ["packages-by-plan", planId, packagesPage, packagesRowsPerPage],
    queryFn: async () => {
      if (!planId) return { data: [], meta: { page: 1, total: 0 } };
      const productCatalogService = new ProductCatalogService();
      const response = await productCatalogService.getPackagesByPlanId(
        planId,
        packagesPage,
        packagesRowsPerPage,
      );
      return response;
    },
    enabled: !!planId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: packageData, isLoading: isLoadingPackage } = useQuery({
    queryKey: ["package", packageId],
    queryFn: async () => {
      if (!packageId) return null;
      const response: any = await productService.get(
        ApiURL.v1PackagesDetails(packageId),
      );
      return response?.data || null;
    },
    enabled: !!packageId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: productConfigData, isLoading: isLoadingProductConfig } =
    useQuery({
      queryKey: ["product-config", category],
      queryFn: async () => {
        if (!category) return null;
        const response: any = await productService.get(
          ApiURL.productConfigType(category),
        );
        return response?.data.data || null;
      },
      enabled: !!category,
      staleTime: 10 * 60 * 1000,
    });

  const { data: categoriesData } = useQuery({
    queryKey: ["product-categories-catalog"],
    queryFn: async () => {
      const response: any = await productService.get(ApiURL.v1Categories, {
        params: { limit: 1000 },
      });
      const rawCategories =
        response?.data?.data ?? response?.data ?? response ?? [];
      const normalizedCategories = Array.isArray(rawCategories)
        ? rawCategories
        : [];

      const formatted = normalizedCategories.map((item: any) => ({
        id: item.id,
        url: `${AppURL.productCategory}?category=${item.name}`,
        label: item?.display_name || formatCategoryLabel(item.name),
        slug: item.name,
      }));

      return formatted;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnMount: "always",
  });

  const formattedCategories = categoriesData || [];

  const savePlanMutation = useMutation({
    mutationFn: async (data: any) => {
      const response: any = await productService.post(ApiURL.v1Plans, data);
      return response?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-catalog-plans"] });
      queryClient.invalidateQueries({ queryKey: ["all-plans"] });
      toastNotification("Plan created successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to create plan", "error");
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({ data, id }: { data: any; id: string }) => {
      const response: any = await productService.put(
        ApiURL.v1PlanDetails(id),
        data,
      );
      return response?.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-catalog-plans"] });
      queryClient.invalidateQueries({ queryKey: ["plan", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["all-plans"] });
      toastNotification("Plan updated successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to update plan", "error");
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (id: string) => {
      const productCatalogService = new ProductCatalogService();
      await productCatalogService.deletePlan(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-catalog-plans"] });
      queryClient.invalidateQueries({ queryKey: ["all-plans"] });
      toastNotification("Plan deleted successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to delete plan", "error");
    },
  });

  const uploadPackageMutation = useMutation({
    mutationFn: async ({
      category,
      id,
      data,
    }: {
      category: string;
      id: string;
      data: any;
    }) => {
      const response: any = await productService.post(
        ApiURL.packagesCategoryBulkCreateDetail(category, id),
        data,
      );
      return response?.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["package", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["packages-by-plan", variables.id],
      });
      toastNotification("Packages uploaded successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to upload packages", "error");
    },
  });

  const uploadPlanBenefitsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response: any = await productService.post(
        ApiURL.v1PlanBenefitBulkCreateDetails(id),
        data,
      );
      return response?.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["plan-benefits", variables.id],
      });
      toastNotification("Plan benefits uploaded successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(
        error?.message || "Failed to upload plan benefits",
        "error",
      );
    },
  });

  const uploadPlanDetailsMutation = useMutation({
    mutationFn: async ({
      id,
      type,
      data,
    }: {
      id: string;
      type: string;
      data: any;
    }) => {
      const response: any = await productService.post(
        ApiURL.v1PlanBulkCreateDetailsType(id, type),
        data,
      );
      return response?.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["plan-details", variables.id, variables.type],
      });
      toastNotification("Plan details uploaded successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(
        error?.message || "Failed to upload plan details",
        "error",
      );
    },
  });

  const assignPlansMutation = useMutation({
    mutationFn: async ({
      planId,
      channel,
    }: {
      planId: string;
      channel: string;
    }) => {
      const extractChannel = channel.split("|");
      const response: any = await productService.post(
        ApiURL.v1ChannelPackagesAssignPlans,
        {
          channel: extractChannel[0],
          plans: [planId],
          channelName: extractChannel[1],
        },
      );
      return response?.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["channel-plans", variables.planId],
      });
      toastNotification("Plan assigned to channel successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(
        error?.message || "Failed to assign plan to channel",
        "error",
      );
    },
  });

  const unAssignPlansMutation = useMutation({
    mutationFn: async ({
      planId,
      channelId,
    }: {
      planId: string;
      channelId: string;
    }) => {
      const response: any = await productService.post(
        ApiURL.v1ChannelPackagesUnassignPlans,
        { channel: channelId, plans: [planId] },
      );
      return response?.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["channel-plans", variables.planId],
      });
      toastNotification("Plan unassigned from channel successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(
        error?.message || "Failed to unassign plan from channel",
        "error",
      );
    },
  });

  const savePackageMutation = useMutation({
    mutationFn: async (data: any) => {
      const response: any = await productService.post(ApiURL.v1Packages, data);
      return response?.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["package"] });

      if (data?.plan) {
        queryClient.invalidateQueries({
          queryKey: ["packages-by-plan", data.plan],
        });
      }

      if (planId) {
        queryClient.invalidateQueries({
          queryKey: ["packages-by-plan", planId],
        });
      }
      toastNotification("Package created successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to create package", "error");
    },
  });

  const updatePackageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response: any = await productService.put(
        ApiURL.v1PackagesDetails(id),
        data,
      );
      return response?.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["package", variables.id] });

      if (data?.plan) {
        queryClient.invalidateQueries({
          queryKey: ["packages-by-plan", data.plan],
        });
      }
      if (planId) {
        queryClient.invalidateQueries({
          queryKey: ["packages-by-plan", planId],
        });
      }
      toastNotification("Package updated successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to update package", "error");
    },
  });

  const deletePackageMutation = useMutation({
    mutationFn: async (id: string) => {
      const response: any = await productService.delete(
        ApiURL.v1PackagesDetails(id),
      );
      return response?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["package"] });

      if (planId) {
        queryClient.invalidateQueries({
          queryKey: ["packages-by-plan", planId],
        });
      }
      toastNotification("Package deleted successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to delete package", "error");
    },
  });

  const saveBenefitMutation = useMutation({
    mutationFn: async (data: any) => {
      const response: any = await productService.post(
        ApiURL.v1PlanBenefitCreate,
        data,
      );
      return response?.data;
    },
    onSuccess: () => {
      if (planId) {
        queryClient.invalidateQueries({ queryKey: ["plan-benefits", planId] });
      }
      toastNotification("Benefit created successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to create benefit", "error");
    },
  });

  const deleteBenefitMutation = useMutation({
    mutationFn: async (id: string) => {
      const response: any = await productService.delete(
        ApiURL.v1PlanBenefitDetails(id),
      );
      return response?.data;
    },
    onSuccess: () => {
      if (planId) {
        queryClient.invalidateQueries({ queryKey: ["plan-benefits", planId] });
      }
      toastNotification("Benefit deleted successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to delete benefit", "error");
    },
  });

  const handleViewDetail = useCallback(
    (id: string) => {
      if (!category) return;
      router.push(AppURL.productCatalogDetail(category, id));
    },
    [router, category],
  );

  const handleSearchInsurerOnChange = useCallback((v: string) => {
    setSearchInsurer(v);
  }, []);

  const handleRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const handleDeletePlan = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to delete this plan?")) {
        await deletePlanMutation.mutateAsync(id);
      }
    },
    [deletePlanMutation],
  );

  const handlePackagesPageChange = useCallback((newPage: number) => {
    setPackagesPage(newPage);
  }, []);

  const handlePackagesRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPackagesRowsPerPage(Number(e.target.value));
      setPackagesPage(1);
    },
    [],
  );

  const handlePackagesPrevPage = useCallback(() => {
    setPackagesPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handlePackagesNextPage = useCallback(() => {
    setPackagesPage((prev) => prev + 1);
  }, []);

  const fetchInsurances = useCallback(
    async (params: any = {}) => {
      return insurancesData || [];
    },
    [insurancesData],
  );

  const fetchProducts = useCallback(
    async (params: any = {}) => {
      if (params.insuranceId) {
        setSearchInsurer(params.insuranceId);
      }
      return productsData || [];
    },
    [productsData],
  );

  const fetchPlans = useCallback(
    async (params: any = {}) => {
      if (params.productId) {
        setSearchProduct(params.productId as string);
      }
      return allPlansData || [];
    },
    [allPlansData],
  );

  const getPlanDetails = useCallback(
    async (type: string) => {
      setDetailType(type);
      await new Promise((resolve) => setTimeout(resolve, 0));
      return await refetchPlanDetails();
    },
    [refetchPlanDetails],
  );

  const getProductCategoryId = useCallback((): string | null => {
    const foundCategory = formattedCategories?.find((item: SubmenuItem) => {
      return item.slug === category;
    });

    if (foundCategory) {
      return foundCategory.id;
    }

    return null;
  }, [category, formattedCategories]);

  const getProductByCategoryId = useCallback((): any[] => {
    const categoryId = getProductCategoryId();

    if (!categoryId) return [];

    return (
      productsData?.filter((product: any) => product.category === categoryId) ||
      []
    );
  }, [productsData, getProductCategoryId]);

  return {
    products: productsData || [],
    insurances: insurancesData || [],
    catalogPlans: catalogPlansData?.data || [],
    totalPages: catalogPlansData?.meta
      ? Math.ceil(catalogPlansData.meta.total / rowsPerPage)
      : 1,
    totalItems: catalogPlansData?.meta?.total || 0,
    plan: planData,
    benefits: benefitsData || [],
    details: planDetailsData || [],
    channels: channelsData || [],
    channelPlans: channelPlansData || [],
    plans: allPlansData || [],
    packages: packagesData?.data || [],
    packagesMeta: packagesData?.meta || { page: 1, total: 0 },
    packagesTotalPages: packagesData?.meta
      ? Math.ceil(packagesData.meta.total / packagesRowsPerPage)
      : 1,
    packagesTotalItems: packagesData?.meta?.total || 0,
    packageDetail: packageData,
    productConfig: productConfigData,
    subMenuItems: formattedCategories,

    isLoadingProducts,
    isLoadingInsurances,
    isLoadingCatalogPlans,
    isLoadingPlan,
    isLoadingBenefits,
    isLoadingPlanDetails,
    isLoadingChannels,
    isLoadingChannelPlans,
    isLoadingAllPlans,
    isLoadingPackages,
    isLoadingPackage,
    isLoadingProductConfig,

    isLoadingSavePlan: savePlanMutation.isPending,
    isLoadingUpdatePlan: updatePlanMutation.isPending,
    isLoadingDeletePlan: deletePlanMutation.isPending,
    isLoadingUploadPackage: uploadPackageMutation.isPending,
    isLoadingUploadPlanBenefits: uploadPlanBenefitsMutation.isPending,
    isLoadingUploadPlanDetails: uploadPlanDetailsMutation.isPending,
    isLoadingAssignPlans: assignPlansMutation.isPending,
    isLoadingUnAssignPlans: unAssignPlansMutation.isPending,
    isLoadingSavePackage: savePackageMutation.isPending,
    isLoadingUpdatePackage: updatePackageMutation.isPending,
    isLoadingDeletePackage: deletePackageMutation.isPending,
    isLoadingSaveBenefit: saveBenefitMutation.isPending,
    isLoadingDeleteBenefit: deleteBenefitMutation.isPending,

    page,
    rowsPerPage,
    searchPlanName,
    searchInsurer,
    searchProduct,
    setPage,
    setSearchPlanName,
    setSearchInsurer,
    setSearchProduct,

    packagesPage,
    packagesRowsPerPage,
    setPackagesPage,
    setPackagesRowsPerPage,

    benefitsPage,
    benefitsRowsPerPage,
    setBenefitsPage,
    setBenefitsRowsPerPage,

    detailsPage,
    detailsRowsPerPage,
    setDetailsPage,
    setDetailsRowsPerPage,

    canRead,
    canEdit,
    canDelete,
    canCreate,

    savePlan: savePlanMutation.mutateAsync,
    updatePlan: updatePlanMutation.mutateAsync,
    deletePlan: deletePlanMutation.mutateAsync,
    uploadPackage: uploadPackageMutation.mutateAsync,
    uploadPlanBenefits: uploadPlanBenefitsMutation.mutateAsync,
    uploadPlanDetails: uploadPlanDetailsMutation.mutateAsync,
    assignPlans: assignPlansMutation.mutateAsync,
    unAssignPlans: unAssignPlansMutation.mutateAsync,
    savePackage: savePackageMutation.mutateAsync,
    updatePackage: updatePackageMutation.mutateAsync,
    deletePackage: deletePackageMutation.mutateAsync,
    saveBenefit: saveBenefitMutation.mutateAsync,
    deleteBenefit: deleteBenefitMutation.mutateAsync,

    refetchProducts,
    refetchCatalogPlans,
    refetchPlan,
    refetchChannelPlans,
    refetchBenefits,
    refetchPlanDetails,
    refetchPackages,

    fetchInsurances,
    fetchProducts,
    fetchPlans,
    getPlanDetails,
    getProductCategoryId,
    getProductByCategoryId,

    handleViewDetail,
    handleSearchInsurerOnChange,
    handleRowsPerPageChange,
    handleDeletePlan,
    handlePackagesPageChange,
    handlePackagesRowsPerPageChange,
    handlePackagesPrevPage,
    handlePackagesNextPage,
  };
};
