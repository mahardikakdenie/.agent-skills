import { useState, useCallback, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import AppURL from "@/constants/app-url.const";
import { useChannelsV1 } from "@/services/channel/hooks/queries";
import {
  useCategories,
  useInsurances,
  usePackageDetail,
  usePackagesByPlan,
  usePlanBenefits,
  usePlanChannels,
  usePlanDetail,
  usePlanDetailsByType,
  usePlans,
  useProductConfig,
  useProducts as useProductList,
} from "@/services/product/hooks/queries";
import {
  useAssignChannelPlans,
  useBulkCreatePackagesByCategory,
  useBulkCreatePlanBenefits,
  useBulkCreatePlanDetails,
  useCreatePackage,
  useCreatePlan,
  useCreatePlanBenefit,
  useDeletePackage,
  useDeletePlan,
  useDeletePlanBenefit,
  useUnassignChannelPlans,
  useUpdatePackage,
  useUpdatePlan,
} from "@/services/product/hooks/mutations";
import { productKeys } from "@/services/product/query-keys";
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

  const productsParams = useMemo(
    () => (searchInsurer ? { insuranceId: searchInsurer } : undefined),
    [searchInsurer],
  );

  const {
    data: productsResponse,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useProductList(productsParams, { staleTime: 5 * 60 * 1000 });
  const productsData = useMemo(
    () => (productsResponse as any)?.data || [],
    [productsResponse],
  );

  const { data: insurancesResponse, isLoading: isLoadingInsurances } =
    useInsurances({}, { staleTime: 10 * 60 * 1000 });
  const insurancesData = useMemo(
    () => (insurancesResponse as any)?.data || [],
    [insurancesResponse],
  );

  const catalogPlansParams = useMemo(() => {
    if (!category) return undefined;
    return {
      page,
      pageSize: rowsPerPage,
      category,
      ...(searchPlanName && { planName: searchPlanName }),
      ...(searchInsurer && { insuranceId: searchInsurer }),
      ...(searchProduct && { productId: searchProduct }),
    };
  }, [
    category,
    page,
    rowsPerPage,
    searchInsurer,
    searchPlanName,
    searchProduct,
  ]);

  const {
    data: catalogPlansData,
    isLoading: isLoadingCatalogPlans,
    refetch: refetchCatalogPlans,
  } = usePlans(catalogPlansParams, {
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: planResponse,
    isLoading: isLoadingPlan,
    refetch: refetchPlan,
  } = usePlanDetail(planId || "", {
    enabled: !!planId,
    staleTime: 5 * 60 * 1000,
  });
  const planData = (planResponse as any)?.data?.[0] || null;

  const flattenTree = useCallback(
    (node: any, parent_id: string | null = null, level: number = 0) => {
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
    },
    [],
  );

  const {
    data: benefitsResponse,
    isLoading: isLoadingBenefits,
    refetch: refetchBenefits,
  } = usePlanBenefits(planId || "", {
    enabled: !!planId,
    staleTime: 5 * 60 * 1000,
  });
  const benefitsData = useMemo(() => {
    const benefitTree = (benefitsResponse as any)?.data;
    if (!Array.isArray(benefitTree)) return [];
    return benefitTree.flatMap((item: any) => flattenTree(item));
  }, [benefitsResponse, flattenTree]);

  const {
    data: planDetailsResponse,
    isLoading: isLoadingPlanDetails,
    refetch: refetchPlanDetails,
  } = usePlanDetailsByType(planId || "", detailType || "", {
    enabled: !!planId && !!detailType,
    staleTime: 5 * 60 * 1000,
  });
  const planDetailsData = (planDetailsResponse as any)?.data || [];

  const { data: channelsResponse, isLoading: isLoadingChannels } = useChannelsV1(
    { page: 1, limit: 100 },
    { staleTime: 10 * 60 * 1000 },
  );
  const channelsData = (channelsResponse as any)?.data || [];

  const {
    data: channelPlansResponse,
    isLoading: isLoadingChannelPlans,
    refetch: refetchChannelPlans,
  } = usePlanChannels(planId || "", {
    enabled: !!planId,
    staleTime: 5 * 60 * 1000,
  });
  const channelPlansData = (channelPlansResponse as any)?.data || [];

  const allPlansParams = useMemo(
    () => (searchProduct ? { productId: searchProduct } : undefined),
    [searchProduct],
  );
  const { data: allPlansResponse, isFetching: isLoadingAllPlans } = usePlans(
    allPlansParams,
    { staleTime: 5 * 60 * 1000 },
  );
  const allPlansData = useMemo(
    () => (allPlansResponse as any)?.data || [],
    [allPlansResponse],
  );

  const packagesParams = useMemo(
    () => ({
      page: packagesPage,
      pageSize: packagesRowsPerPage,
    }),
    [packagesPage, packagesRowsPerPage],
  );
  const {
    data: packagesData,
    isLoading: isLoadingPackages,
    refetch: refetchPackages,
  } = usePackagesByPlan(planId || "", packagesParams, {
    enabled: !!planId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: packageData, isLoading: isLoadingPackage } = usePackageDetail(
    packageId || "",
    {
      enabled: !!packageId,
      staleTime: 5 * 60 * 1000,
    },
  );

  const { data: productConfigResponse, isLoading: isLoadingProductConfig } =
    useProductConfig(category || "", {
      enabled: !!category,
      staleTime: 10 * 60 * 1000,
    });
  const productConfigData = (productConfigResponse as any)?.data || null;

  const { data: categoriesResponse } = useCategories(
    { limit: 1000 },
    {
      staleTime: 10 * 60 * 1000,
      refetchOnMount: "always",
    },
  );

  const formattedCategories = useMemo(() => {
    const responseData = categoriesResponse as any;
    const rawCategories =
      responseData?.data?.data ?? responseData?.data ?? responseData ?? [];
    const normalizedCategories = Array.isArray(rawCategories)
      ? rawCategories
      : [];

    return normalizedCategories.map((item: any) => ({
      id: item.id,
      url: `${AppURL.productCategory}?category=${item.name}`,
      label: item?.display_name || formatCategoryLabel(item.name),
      slug: item.name,
    }));
  }, [categoriesResponse]);

  const savePlanMutation = useCreatePlan({
    onSuccess: () => {
      toastNotification("Plan created successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to create plan", "error");
    },
  });

  const updatePlanMutation = useUpdatePlan({
    onSuccess: () => {
      toastNotification("Plan updated successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to update plan", "error");
    },
  });

  const deletePlanMutation = useDeletePlan({
    onSuccess: () => {
      toastNotification("Plan deleted successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to delete plan", "error");
    },
  });

  const uploadPackageMutation = useBulkCreatePackagesByCategory({
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.packageDetail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: productKeys.packagesByPlan(variables.id),
      });
      toastNotification("Packages uploaded successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to upload packages", "error");
    },
  });

  const uploadPlanBenefitsMutation = useBulkCreatePlanBenefits({
    onSuccess: (_, variables) => {
      if (variables?.planId) {
        queryClient.invalidateQueries({
          queryKey: productKeys.planBenefits(variables.planId),
        });
      }
      toastNotification("Plan benefits uploaded successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(
        error?.message || "Failed to upload plan benefits",
        "error",
      );
    },
  });

  const uploadPlanDetailsMutation = useBulkCreatePlanDetails({
    onSuccess: (_, variables) => {
      if (variables?.planId) {
        queryClient.invalidateQueries({
          queryKey: productKeys.planDetails(variables.planId, variables.type),
        });
      }
      toastNotification("Plan details uploaded successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(
        error?.message || "Failed to upload plan details",
        "error",
      );
    },
  });

  const assignPlansMutation = useAssignChannelPlans({
    onSuccess: (_, variables: any) => {
      const assignedPlanId = variables?.plans?.[0];
      if (assignedPlanId) {
        queryClient.invalidateQueries({
          queryKey: productKeys.planChannels(assignedPlanId),
        });
      }
      toastNotification("Plan assigned to channel successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(
        error?.message || "Failed to assign plan to channel",
        "error",
      );
    },
  });

  const unAssignPlansMutation = useUnassignChannelPlans({
    onSuccess: (_, variables: any) => {
      const unassignedPlanId = variables?.plans?.[0];
      if (unassignedPlanId) {
        queryClient.invalidateQueries({
          queryKey: productKeys.planChannels(unassignedPlanId),
        });
      }
      toastNotification("Plan unassigned from channel successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(
        error?.message || "Failed to unassign plan from channel",
        "error",
      );
    },
  });

  const savePackageMutation = useCreatePackage({
    onSuccess: (data: any) => {
      if (data?.plan) {
        queryClient.invalidateQueries({
          queryKey: productKeys.packagesByPlan(data.plan),
        });
      }

      if (planId) {
        queryClient.invalidateQueries({
          queryKey: productKeys.packagesByPlan(planId),
        });
      }
      toastNotification("Package created successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to create package", "error");
    },
  });

  const updatePackageMutation = useUpdatePackage({
    onSuccess: (data: any, variables) => {
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: productKeys.packageDetail(variables.id),
        });
      }

      if (data?.plan) {
        queryClient.invalidateQueries({
          queryKey: productKeys.packagesByPlan(data.plan),
        });
      }
      if (planId) {
        queryClient.invalidateQueries({
          queryKey: productKeys.packagesByPlan(planId),
        });
      }
      toastNotification("Package updated successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to update package", "error");
    },
  });

  const deletePackageMutation = useDeletePackage({
    onSuccess: (_, packageDetailId) => {
      if (packageDetailId) {
        queryClient.invalidateQueries({
          queryKey: productKeys.packageDetail(packageDetailId),
        });
      }

      if (planId) {
        queryClient.invalidateQueries({
          queryKey: productKeys.packagesByPlan(planId),
        });
      }
      toastNotification("Package deleted successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to delete package", "error");
    },
  });

  const saveBenefitMutation = useCreatePlanBenefit({
    onSuccess: () => {
      if (planId) {
        queryClient.invalidateQueries({
          queryKey: productKeys.planBenefits(planId),
        });
      }
      toastNotification("Benefit created successfully", "success");
    },
    onError: (error: any) => {
      toastNotification(error?.message || "Failed to create benefit", "error");
    },
  });

  const deleteBenefitMutation = useDeletePlanBenefit({
    onSuccess: () => {
      if (planId) {
        queryClient.invalidateQueries({
          queryKey: productKeys.planBenefits(planId),
        });
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
      void params;
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
  const catalogPlansResult = catalogPlansData as any;
  const packagesResult = packagesData as any;

  return {
    products: productsData || [],
    insurances: insurancesData || [],
    catalogPlans: catalogPlansResult?.data || [],
    totalPages: catalogPlansResult?.meta
      ? Math.ceil(catalogPlansResult.meta.total / rowsPerPage)
      : 1,
    totalItems: catalogPlansResult?.meta?.total || 0,
    plan: planData,
    benefits: benefitsData || [],
    details: planDetailsData || [],
    channels: channelsData || [],
    channelPlans: channelPlansData || [],
    plans: allPlansData || [],
    packages: packagesResult?.data || [],
    packagesMeta: packagesResult?.meta || { page: 1, total: 0 },
    packagesTotalPages: packagesResult?.meta
      ? Math.ceil(packagesResult.meta.total / packagesRowsPerPage)
      : 1,
    packagesTotalItems: packagesResult?.meta?.total || 0,
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
    updatePlan: async ({ id, data }: { id: string; data: any }) =>
      updatePlanMutation.mutateAsync({ id, payload: data }),
    deletePlan: deletePlanMutation.mutateAsync,
    uploadPackage: async ({
      category,
      id,
      data,
    }: {
      category: string;
      id: string;
      data: any;
    }) => uploadPackageMutation.mutateAsync({ category, id, payload: data }),
    uploadPlanBenefits: async ({ id, data }: { id: string; data: any }) =>
      uploadPlanBenefitsMutation.mutateAsync({ planId: id, payload: data }),
    uploadPlanDetails: async ({
      id,
      type,
      data,
    }: {
      id: string;
      type: string;
      data: any;
    }) =>
      uploadPlanDetailsMutation.mutateAsync({
        planId: id,
        type,
        payload: data,
      }),
    assignPlans: async ({
      planId,
      channel,
    }: {
      planId: string;
      channel: string;
    }) => {
      const [channelId, channelName] = channel.split("|");
      return assignPlansMutation.mutateAsync({
        channel: channelId,
        plans: [planId],
        channelName,
      });
    },
    unAssignPlans: async ({
      planId,
      channelId,
    }: {
      planId: string;
      channelId: string;
    }) =>
      unAssignPlansMutation.mutateAsync({
        channel: channelId,
        plans: [planId],
      }),
    savePackage: savePackageMutation.mutateAsync,
    updatePackage: async ({ id, data }: { id: string; data: any }) =>
      updatePackageMutation.mutateAsync({ id, payload: data }),
    deletePackage: async (id: string) => {
      await deletePackageMutation.mutateAsync(id);
    },
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
