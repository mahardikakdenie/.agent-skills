import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { useForm } from "react-hook-form";
import { isValid, parseISO, format } from "date-fns";
import { productService } from "@/services/product/api/product.service";
import { promotionService } from "@/services/promotion/api/promotion.service";
import { useChannelsV1 } from "@/services/channel/hooks/queries/useChannelsV1";
import { useCreateCampaign } from "@/services/promotion/hooks/mutations/useCreateCampaign";
import { useUpdateCampaign } from "@/services/promotion/hooks/mutations/useUpdateCampaign";
import { useCampaignDetail } from "@/services/promotion/hooks/queries/useCampaignDetail";
import { useInsurances } from "@/services/product/hooks/queries/useInsurances";
import { usePlans } from "@/services/product/hooks/queries/usePlans";
import { useProducts } from "@/services/product/hooks/queries/useProducts";
import { useReferenceCurrencies } from "@/services/product/hooks/queries/useReferenceCurrencies";
import AppURL from "@/constants/app-url.const";
import { PromotionDetails } from "@/app/promotion/dto/promotion.details.dto";

interface CampaignFormData {
  name: string;
  type: string;
  value_currency: string;
  value: number;
  value_type: string;
  start_date: string;
  end_date: string;
  minimum_amount: number;
  maximum_amount: number;
}

interface UseCampaignFormProps {
  handleSubmit: any;
  control: any;
  errors: any;
  reset: any;
  watch: any;

  promotion: PromotionDetails;
  currency: any[];

  hasAccess: boolean | null;
  showAlert: boolean;
  errorMessage: string;
  isEdit: boolean;

  handleSave: (formData: CampaignFormData) => void;
  setShowAlert: (show: boolean) => void;
  goBack: () => void;
  loadCampaignDetail: (id: string) => void;
  handleChangeType: (value: string) => void;
  handleChangeValueType: (value: string) => void;
  handleChangeInsurance: (selectedCurrency: { currencyName: string }) => void;

  channels: any;
  isChannelModalOpen: boolean;
  selectedChannelIds: Set<string>;
  globalSelectedChannels: Set<string>;
  currentPageChannels: number;
  showChannelsPerPage: number;
  setIsChannelModalOpen: (open: boolean) => void;
  setSelectedChannelIds: (ids: Set<string>) => void;
  setGlobalSelectedChannels: React.Dispatch<React.SetStateAction<Set<string>>>;
  handleAddChannel: () => void;
  handleSelectChannel: (selectedChannels: any[]) => void;
  handleRemoveChannel: (channelId: string) => void;
  handleRemoveArrayItemChan: (
    arrayName: keyof PromotionDetails,
    index: number
  ) => void;
  handlePageChangeChannel: (page: number) => void;
  handleChannelsPerPageChange: (newChannelsPerPage: number) => void;

  insurances: any;
  isInsuranceModalOpen: boolean;
  selectedInsuranceIds: Set<string>;
  globalSelectedInsuranceIds: Set<string>;
  selectedInsurances: any[];
  currentPageIns: number;
  showInsPerPage: number;
  totalInsuranceItems: number;
  setIsInsuranceModalOpen: (open: boolean) => void;
  setSelectedInsuranceIds: (ids: Set<string>) => void;
  setGlobalSelectedInsuranceIds: React.Dispatch<
    React.SetStateAction<Set<string>>
  >;
  handleAddInsurance: () => void;
  handleSelectInsurance: (selectedInsurances: any[]) => void;
  handleRemoveInsurance: (insuranceId: string) => void;
  handleRemoveArrayItemIns: (
    arrayName: keyof PromotionDetails,
    index: number
  ) => void;
  handlePageChangeInsurances: (page: number) => void;
  handleInsurancePerPageChange: (newInsPerPage: number) => void;

  products: any;
  isProductModalOpen: boolean;
  selectedProductIds: Set<string>;
  globalSelectedProdIds: Set<string>;
  selectedProducts: any[];
  currentPageProd: number;
  showProdPerPage: number;
  totalProductItems: number;
  setIsProductModalOpen: (open: boolean) => void;
  setSelectedProductIds: (ids: Set<string>) => void;
  setGlobalSelectedProdIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  handleAddProduct: () => void;
  handleSelectProduct: (selectedProducts: any[]) => void;
  handleRemoveProduct: (index: number) => void;
  handleRemoveProd: (prodId: string) => void;
  handlePageChangeProd: (page: number) => void;
  handleProdPerPageChange: (newProdPerPage: number) => void;

  plans: any;
  isPlanModalOpen: boolean;
  selectedPlanIds: Set<string>;
  globalSelectedPlanIds: Set<string>;
  selectedPlans: any[];
  currentPagePlan: number;
  showPlansPerPage: number;
  totalPlanItems: number;
  setIsPlanModalOpen: (open: boolean) => void;
  setSelectedPlanIds: (ids: Set<string>) => void;
  setGlobalSelectedPlanIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  handleAddPlan: () => void;
  handleSelectPlan: (newSelectedPlans: any[]) => void;
  handleRemovePlan: (index: number) => void;
  handleRemovePlans: (planId: string) => void;
  handlePageChangePlans: (page: number) => void;
  handlePlansPerPageChange: (newPlansPerPage: number) => void;
  handleSearch: (query: string) => void;

  vouchers: { code: string; usageLimit: number }[];
  voucherCode: string;
  voucherUsageLimit: number;
  setVoucherCode: (code: string) => void;
  setVoucherUsageLimit: (limit: number) => void;
  handleAddVoucher: (code: string, usageLimit: number) => void;
  handleRemoveVoucher: (index: number) => void;
  handleChangeVoucherLimit: (value: string) => void;
  handleVoucherLimitBlur: () => void;

  isLoadingCurrency: boolean;
  isLoadingDetail: boolean;
  isSaving: boolean;
}

export function useCampaignForm(
  mode: "create" | "edit" = "create"
): UseCampaignFormProps {
  const router = useRouter();
  const { permissionList } = useAuth();
  const queryClient = useQueryClient();
  const isEdit = mode === "edit";

  const {
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CampaignFormData>({
    shouldUnregister: false,
    defaultValues: {
      name: "",
      type: "embedded",
      value_currency: "IDR",
      value: 0,
      value_type: "fixed",
      start_date: "",
      end_date: "",
      minimum_amount: 0,
      maximum_amount: 0,
    },
  });

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [campaignId, setCampaignId] = useState<string>("");

  const [promotion, setPromotion] = useState<PromotionDetails>({
    campaign_id: "",
    name: "",
    type: isEdit ? "" : "embedded",
    start_date: "",
    end_date: "",
    value: 0,
    active: true,
    value_currency: "IDR",
    value_type: isEdit ? "" : "fixed",
    minimum_amount: 0,
    maximum_amount: 0,
    embedded_discount_channels: [],
    embedded_discount_insurances: [],
    embedded_discount_plans: [],
    embedded_discount_products: [],
  });

  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [selectedChannelIds, setSelectedChannelIds] = useState<Set<string>>(
    new Set()
  );
  const [globalSelectedChannels, setGlobalSelectedChannels] = useState<
    Set<string>
  >(new Set());
  const [currentPageChannels, setCurrentPageChannels] = useState(1);
  const [showChannelsPerPage, setShowChannelsPerPage] = useState(10);

  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const [selectedInsuranceIds, setSelectedInsuranceIds] = useState<Set<string>>(
    new Set()
  );
  const [globalSelectedInsuranceIds, setGlobalSelectedInsuranceIds] = useState<
    Set<string>
  >(new Set());
  const [selectedInsurances, setSelectedInsurances] = useState<any[]>([]);
  const [currentPageIns, setCurrentPageIns] = useState(1);
  const [showInsPerPage, setShowInsPerPage] = useState(10);
  const [totalInsuranceItems, setTotalInsuranceItems] = useState(0);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set()
  );
  const [globalSelectedProdIds, setGlobalSelectedProdIds] = useState<
    Set<string>
  >(new Set());
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [currentPageProd, setCurrentPageProd] = useState(1);
  const [showProdPerPage, setShowProdPerPage] = useState(10);
  const [totalProductItems, setTotalProductItems] = useState(0);

  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlanIds, setSelectedPlanIds] = useState<Set<string>>(
    new Set()
  );
  const [globalSelectedPlanIds, setGlobalSelectedPlanIds] = useState<
    Set<string>
  >(new Set());
  const [selectedPlans, setSelectedPlans] = useState<any[]>([]);
  const [currentPagePlan, setCurrentPagePlan] = useState(1);
  const [showPlansPerPage, setShowPlansPerPage] = useState(10);
  const [totalPlanItems, setTotalPlanItems] = useState(0);

  const [vouchers, setVouchers] = useState<
    { code: string; usageLimit: number }[]
  >([]);
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [voucherUsageLimit, setVoucherUsageLimit] = useState<number>(1);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkAccess = async () => {
      const requiredPermission = isEdit
        ? "Promotions.Update"
        : "Promotions.Create";
      const access = permissionList.includes(requiredPermission);
      setHasAccess(access);

      if (!access) {
        router.push(AppURL.forbidden);
      }
    };

    checkAccess();
  }, [router, permissionList, isEdit]);

  const { data: currencyResponse, isLoading: isLoadingCurrency } =
    useReferenceCurrencies(undefined, {
      staleTime: 30000,
      refetchOnWindowFocus: false,
    });
  const currency = (currencyResponse as any)?.data || [];

  const { data: channels } = useChannelsV1(
    {
      page: currentPageChannels,
      limit: showChannelsPerPage,
    },
    {
      staleTime: 30000,
      refetchOnWindowFocus: false,
    }
  );

  const { data: insurances } = useInsurances(
    {
      page: currentPageIns,
      limit: showInsPerPage,
    },
    {
      staleTime: 30000,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    setTotalInsuranceItems((insurances as any)?.meta?.total || 0);
  }, [insurances]);

  const productParams =
    globalSelectedInsuranceIds.size > 0
      ? {
          insuranceIds: Array.from(globalSelectedInsuranceIds),
          page: currentPageProd,
          pageSize: showProdPerPage,
        }
      : undefined;

  const { data: products } = useProducts(productParams, {
    enabled: globalSelectedInsuranceIds.size > 0,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setTotalProductItems((products as any)?.meta?.total || 0);
  }, [products]);

  const planParams =
    globalSelectedProdIds.size > 0
      ? {
          productIds: Array.from(globalSelectedProdIds),
          page: currentPagePlan,
          pageSize: showPlansPerPage,
          ...(searchQuery ? { planName: searchQuery } : {}),
        }
      : undefined;

  const { data: plans } = usePlans(planParams, {
    enabled: globalSelectedProdIds.size > 0,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setTotalPlanItems((plans as any)?.meta?.total || 0);
  }, [plans]);

  const { data: campaignDetailResponse, isLoading: isLoadingDetail } =
    useCampaignDetail(campaignId || "", {
      enabled: isEdit && !!campaignId,
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: "always",
    });

  const campaignDetail = useMemo(() => {
    return (
      (campaignDetailResponse as any)?.data?.[0] ??
      (campaignDetailResponse as any)?.data?.data?.[0] ??
      null
    );
  }, [campaignDetailResponse]);

  useEffect(() => {
    if (campaignDetail && isEdit) {
      const formatDate = (dateString: string) => {
        if (!dateString) return "";
        try {
          const parsedDate = parseISO(dateString);
          return isValid(parsedDate) ? format(parsedDate, "yyyy-MM-dd") : "";
        } catch (error) {
          console.error("Date formatting error:", error);
          return "";
        }
      };

      const formData = {
        name: campaignDetail.name || "",
        type: campaignDetail.type || "embedded",
        value_currency: campaignDetail.value_currency || "IDR",
        value: campaignDetail.value || 0,
        value_type: campaignDetail.value_type || "fixed",
        start_date: formatDate(campaignDetail.start_date),
        end_date: formatDate(campaignDetail.end_date),
        minimum_amount: campaignDetail.minimum_amount || 0,
        maximum_amount: campaignDetail.maximum_amount || 0,
      };

      setPromotion(campaignDetail);

      reset(formData, {
        keepErrors: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      });

      setTimeout(() => {
        const fieldsToUpdate = [
          { field: "type", value: campaignDetail.type || "embedded" },
          { field: "value_type", value: campaignDetail.value_type || "fixed" },
          {
            field: "value_currency",
            value: campaignDetail.value_currency || "IDR",
          },
          { field: "value", value: campaignDetail.value || 0 },
          {
            field: "minimum_amount",
            value: campaignDetail.minimum_amount || 0,
          },
          {
            field: "maximum_amount",
            value: campaignDetail.maximum_amount || 0,
          },
        ];

        fieldsToUpdate.forEach(({ field, value }) => {
          if (watch(field as keyof CampaignFormData) !== value) {
            setValue(field as keyof CampaignFormData, value, {
              shouldValidate: true,
            });
          }
        });
      }, 100);

      setGlobalSelectedChannels(
        new Set(
          campaignDetail.embedded_discount_channels?.map(
            (c: any) => c.channel_id
          ) || []
        )
      );
      setGlobalSelectedInsuranceIds(
        new Set(
          campaignDetail.embedded_discount_insurances?.map(
            (i: any) => i.insurance_id
          ) || []
        )
      );
      setGlobalSelectedProdIds(
        new Set(
          campaignDetail.embedded_discount_products?.map(
            (p: any) => p.product_id
          ) || []
        )
      );
      setGlobalSelectedPlanIds(
        new Set(
          campaignDetail.embedded_discount_plans?.map((p: any) => p.plan_id) ||
            []
        )
      );

      if (campaignDetail.type === "voucher") {
        const voucherData = campaignDetail.vouchers || [];
        setVouchers(
          voucherData.map((v: any) => ({
            code: v.code || "",
            usageLimit: v.usage_limit || 1,
          }))
        );
      } else {
        setVouchers([]);
      }
    }
  }, [campaignDetail, isEdit, reset, watch, setValue]);

  const handleSaveSuccess = useCallback(
    async (data: any) => {
      if (promotion.type === "embedded") {
        if (data?.data?.error?.code === 409) {
          setErrorMessage(
            isEdit
              ? "The plan has already been used by another embedded campaign."
              : "Unable to submit campaign, one or more plan has already been used by another embedded campaign."
          );
          setShowAlert(true);
          return;
        }

        await productService.syncEmbeddedDiscounts();
      }

      setErrorMessage(
        isEdit
          ? "Promotion updated successfully!"
          : "Promotion Campaign Submitted!"
      );
      setShowAlert(true);
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      setTimeout(() => {
        setShowAlert(false);
        router.push(AppURL.promotionCampaign);
      }, 2000);
    },
    [isEdit, promotion.type, queryClient, router]
  );

  const handleSaveError = useCallback(
    (error: unknown) => {
      console.error("Failed to save campaign:", error);
      setErrorMessage(
        isEdit
          ? "Failed to update promotion. Please try again."
          : "Failed to create promotion. Please try again."
      );
      setShowAlert(true);
    },
    [isEdit]
  );

  const createCampaignMutation = useCreateCampaign({
    onSuccess: handleSaveSuccess,
    onError: handleSaveError,
  });

  const updateCampaignMutation = useUpdateCampaign({
    onSuccess: handleSaveSuccess,
    onError: handleSaveError,
  });

  const handleSave = useCallback(
    async (formData: CampaignFormData) => {
      setErrorMessage("");
      setShowAlert(false);

      if (
        !formData.type ||
        !formData.value ||
        !formData.value_type ||
        !formData.value_currency ||
        !formData.start_date ||
        !formData.end_date ||
        !formData.name
      ) {
        setErrorMessage("Please fill in all required fields.");
        setShowAlert(true);
        return;
      }

      if (
        promotion.embedded_discount_insurances.length < 1 ||
        promotion.embedded_discount_products.length < 1 ||
        promotion.embedded_discount_plans.length < 1 ||
        promotion.embedded_discount_channels.length < 1
      ) {
        setErrorMessage(
          "Please select at least one data in Channel/Insurance/Product/Plan."
        );
        setShowAlert(true);
        return;
      }

      const startDate = parseISO(formData.start_date);
      const endDate = parseISO(formData.end_date);

      if (!isValid(startDate) || !isValid(endDate)) {
        setErrorMessage("Invalid date format. Please use DD-MM-YYYY format.");
        setShowAlert(true);
        return;
      }

      if (startDate > endDate) {
        setErrorMessage("End date must be later than start date.");
        setShowAlert(true);
        return;
      }

      if (!isEdit && formData.type === "voucher" && vouchers.length > 0) {
        let voucherExists = false;
        let existingVoucherCodes: string[] = [];

        for (const voucher of vouchers) {
          try {
            const voucherVerify: any = await promotionService.getVoucherByCode(
              voucher.code
            );
            const data = voucherVerify?.data ?? voucherVerify?.data?.data ?? [];

            if (data.length > 0 && data[0].code != null) {
              voucherExists = true;
              existingVoucherCodes.push(voucher.code);
            }
          } catch (error) {
            console.error("Error checking voucher:", error);
          }
        }

        if (voucherExists) {
          setErrorMessage(
            `Voucher Code(s) ${existingVoucherCodes.join(", ")} already exist.`
          );
          setShowAlert(true);
          return;
        }
      }

      const payload = {
        type: formData.type,
        value: formData.value,
        value_type: formData.value_type,
        value_currency: formData.value_currency,
        start_date: formData.start_date,
        end_date: formData.end_date,
        name: formData.name,
        minimum_amount: formData.minimum_amount,
        maximum_amount: formData.maximum_amount,
        products: promotion.embedded_discount_products.map((product) => ({
          product_id: product.product_id,
          name: product.product_name,
        })),
        insurances: promotion.embedded_discount_insurances.map((insurance) => ({
          insurance_id: insurance.insurance_id,
          name: insurance.insurance_name,
        })),
        plans: promotion.embedded_discount_plans.map((plan) => ({
          plan_id: plan.plan_id,
          name: plan.name,
        })),
        channels: promotion.embedded_discount_channels.map((channel) => ({
          channel_id: channel.channel_id,
          name: channel.channel_name,
        })),
        vouchers: vouchers.map((voucher) => ({
          code: voucher.code,
          usage_limit: voucher.usageLimit,
        })),
      };

      if (isEdit && campaignId) {
        updateCampaignMutation.mutate({ id: campaignId, payload });
      } else {
        createCampaignMutation.mutate(payload);
      }
    },
    [
      campaignId,
      createCampaignMutation,
      isEdit,
      promotion,
      updateCampaignMutation,
      vouchers,
    ]
  );

  const handleChangeType = useCallback((value: string) => {
    setPromotion((prevState) => ({
      ...prevState,
      type: value,
    }));
  }, []);

  const handleChangeValueType = useCallback((value: string) => {
    setPromotion((prevState) => ({
      ...prevState,
      value_type: value,
    }));
  }, []);

  const handleChangeInsurance = useCallback(
    (selectedCurrency: { currencyName: string }) => {
      setPromotion((prevState) => ({
        ...prevState,
        value_currency: selectedCurrency.currencyName,
      }));
    },
    []
  );

  const handleAddChannel = useCallback(() => {
    const selectedChannelIds = new Set(
      promotion.embedded_discount_channels.map((channel) => channel.channel_id)
    );
    setGlobalSelectedChannels(selectedChannelIds);
    setIsChannelModalOpen(true);
  }, [promotion.embedded_discount_channels]);

  const handleSelectChannel = useCallback(
    (selectedChannels: any[]) => {
      const existingChannels = promotion.embedded_discount_channels;
      const updatedChannels = [...existingChannels];

      selectedChannels.forEach((channel) => {
        const existingChannel = updatedChannels.find(
          (c) => c.channel_id === channel.id
        );
        if (!existingChannel) {
          updatedChannels.push({
            channel_id: channel.id,
            channel_name: channel.name,
          });
        }
      });

      setPromotion((prevState) => ({
        ...prevState,
        embedded_discount_channels: updatedChannels,
      }));

      setGlobalSelectedChannels((prevSelected) => {
        const newSelected = new Set(prevSelected);
        selectedChannels.forEach((channel) => newSelected.add(channel.id));
        return newSelected;
      });

      setIsChannelModalOpen(false);
    },
    [promotion.embedded_discount_channels]
  );

  const handleRemoveChannel = useCallback((channelId: string) => {
    setPromotion((prevState) => {
      const updatedChannel = prevState.embedded_discount_channels.filter(
        (channel) => channel.channel_id !== channelId
      );

      return {
        ...prevState,
        embedded_discount_channels: updatedChannel,
        embedded_discount_insurances: [],
        embedded_discount_products: [],
        embedded_discount_plans: [],
      };
    });

    setGlobalSelectedChannels((prevIds) => {
      const newIds = new Set(prevIds);
      newIds.delete(channelId);
      return newIds;
    });

    setSelectedInsuranceIds(new Set());
    setGlobalSelectedInsuranceIds(new Set());
    setSelectedProductIds(new Set());
    setGlobalSelectedProdIds(new Set());
    setSelectedPlanIds(new Set());
    setGlobalSelectedPlanIds(new Set());
    setCurrentPageProd(1);
  }, []);

  const handleRemoveArrayItemChan = useCallback(
    (arrayName: keyof PromotionDetails, index: number) => {
      setPromotion((prevState) => {
        const updatedArray = (prevState[arrayName] as Array<any>).filter(
          (_, i) => i !== index
        );

        if (arrayName === "embedded_discount_channels") {
          return {
            ...prevState,
            [arrayName]: updatedArray,
            embedded_discount_insurances: [],
            embedded_discount_products: [],
            embedded_discount_plans: [],
          };
        }

        return {
          ...prevState,
          [arrayName]: updatedArray,
        };
      });

      if (arrayName === "embedded_discount_channels") {
        setSelectedProductIds(new Set());
        setSelectedPlanIds(new Set());
        setGlobalSelectedProdIds(new Set());
        setGlobalSelectedPlanIds(new Set());
        setGlobalSelectedInsuranceIds(new Set());
        setSelectedInsuranceIds(new Set());
        setSelectedInsurances([]);
        setCurrentPageProd(1);
      }
    },
    []
  );

  const handlePageChangeChannel = useCallback((page: number) => {
    if (page >= 1) {
      setCurrentPageChannels(page);
    }
  }, []);

  const handleChannelsPerPageChange = useCallback(
    (newChannelsPerPage: number) => {
      setShowChannelsPerPage(newChannelsPerPage);
      setCurrentPageChannels(1);
    },
    []
  );

  const handleAddInsurance = useCallback(() => {
    const selectedInsIds = new Set(
      promotion.embedded_discount_insurances.map(
        (insurance) => insurance.insurance_id
      )
    );
    setGlobalSelectedInsuranceIds(selectedInsIds);
    setIsInsuranceModalOpen(true);
  }, [promotion.embedded_discount_insurances]);

  const handleSelectInsurance = useCallback(
    (selectedInsurances: any[]) => {
      const existingInsurance = promotion.embedded_discount_insurances;
      const updatedInsurances = [...existingInsurance];

      selectedInsurances.forEach((insurance) => {
        const existingInsurance = updatedInsurances.find(
          (c) => c.insurance_id === insurance.id
        );
        if (!existingInsurance) {
          updatedInsurances.push({
            insurance_id: insurance.id,
            insurance_name: insurance.name,
          });
        }
      });

      setPromotion((prevState) => ({
        ...prevState,
        embedded_discount_insurances: updatedInsurances,
      }));

      setSelectedInsuranceIds(new Set(selectedInsurances.map((ins) => ins.id)));
      setGlobalSelectedInsuranceIds((prevSelected) => {
        const newSelected = new Set(prevSelected);
        selectedInsurances.forEach((insurance) =>
          newSelected.add(insurance.id)
        );
        return newSelected;
      });

      setIsInsuranceModalOpen(false);
      setCurrentPageProd(1);
    },
    [promotion.embedded_discount_insurances]
  );

  const handleRemoveInsurance = useCallback((insuranceId: string) => {
    setPromotion((prevState) => {
      const updatedInsurances = prevState.embedded_discount_insurances.filter(
        (insurance) => insurance.insurance_id !== insuranceId
      );

      return {
        ...prevState,
        embedded_discount_insurances: updatedInsurances,
        embedded_discount_products: [],
        embedded_discount_plans: [],
      };
    });

    setGlobalSelectedInsuranceIds((prevIds) => {
      const newIds = new Set(prevIds);
      newIds.delete(insuranceId);
      return newIds;
    });

    setSelectedProductIds(new Set());
    setGlobalSelectedProdIds(new Set());
    setSelectedPlanIds(new Set());
    setGlobalSelectedPlanIds(new Set());
    setCurrentPageProd(1);
  }, []);

  const handleRemoveArrayItemIns = useCallback(
    (arrayName: keyof PromotionDetails, index: number) => {
      setPromotion((prevState) => {
        const updatedArray = (prevState[arrayName] as Array<any>).filter(
          (_, i) => i !== index
        );

        if (arrayName === "embedded_discount_insurances") {
          const removedInsuranceId =
            prevState.embedded_discount_insurances[index].insurance_id;

          setGlobalSelectedInsuranceIds((prevIds) => {
            const newIds = new Set(prevIds);
            newIds.delete(removedInsuranceId);
            return newIds;
          });

          return {
            ...prevState,
            [arrayName]: updatedArray,
            embedded_discount_products: [],
            embedded_discount_plans: [],
          };
        }

        return {
          ...prevState,
          [arrayName]: updatedArray,
        };
      });

      if (arrayName === "embedded_discount_insurances") {
        setSelectedInsurances((prevInsurances) =>
          prevInsurances.filter((_, i) => i !== index)
        );
        setSelectedProductIds(new Set());
        setGlobalSelectedProdIds(new Set());
        setSelectedPlanIds(new Set());
        setGlobalSelectedPlanIds(new Set());
        setCurrentPageProd(1);
      }
    },
    []
  );

  const handlePageChangeInsurances = useCallback((page: number) => {
    if (page >= 1) {
      setCurrentPageIns(page);
    }
  }, []);

  const handleInsurancePerPageChange = useCallback((newInsPerPage: number) => {
    setShowInsPerPage(newInsPerPage);
    setCurrentPageIns(1);
  }, []);

  const handleAddProduct = useCallback(() => {
    const selectedProdIds = new Set(
      promotion.embedded_discount_products.map((product) => product.product_id)
    );
    setGlobalSelectedProdIds(selectedProdIds);
    setIsProductModalOpen(true);
  }, [promotion.embedded_discount_products]);

  const handleSelectProduct = useCallback(
    (selectedProducts: any[]) => {
      const existingProducts = promotion.embedded_discount_products;
      const updatedProducts = [...existingProducts];

      selectedProducts.forEach((product) => {
        const existingProduct = updatedProducts.find(
          (p) => p.product_id === product.id
        );
        if (!existingProduct) {
          updatedProducts.push({
            product_id: product.id,
            product_name: product.name,
          });
        }
      });

      setPromotion((prevState) => {
        const updatedPlans = prevState.embedded_discount_plans.filter((plan) =>
          updatedProducts.some((prod) => prod.product_id === plan.plan_id)
        );

        return {
          ...prevState,
          embedded_discount_products: updatedProducts,
          embedded_discount_plans: updatedPlans,
        };
      });

      const newSelectedIds = new Set<string>(
        selectedProducts.map((prod) => prod.id)
      );
      setSelectedProductIds(newSelectedIds);

      setSelectedPlanIds(new Set());
      setGlobalSelectedPlanIds(new Set());
      setGlobalSelectedProdIds((prevSelected) => {
        const newSelected = new Set(prevSelected);
        selectedProducts.forEach((prod) => newSelected.add(prod.id));
        return newSelected;
      });

      setIsProductModalOpen(false);
    },
    [promotion.embedded_discount_products, promotion.embedded_discount_plans]
  );

  const handleRemoveProduct = useCallback((index: number) => {
    setPromotion((prevState) => {
      const removedProductId =
        prevState.embedded_discount_products[index].product_id;

      const updatedProducts = prevState.embedded_discount_products.filter(
        (_, i) => i !== index
      );

      const updatedPlans = prevState.embedded_discount_plans.filter((plan) =>
        updatedProducts.some((product) => product.product_id === plan.plan_id)
      );

      setGlobalSelectedProdIds((prevSelected) => {
        const newSelected = new Set(prevSelected);
        newSelected.delete(removedProductId);
        return newSelected;
      });

      setCurrentPagePlan(1);

      return {
        ...prevState,
        embedded_discount_products: updatedProducts,
        embedded_discount_plans: updatedPlans,
      };
    });
  }, []);

  const handleRemoveProd = useCallback((prodId: string) => {
    setPromotion((prevState) => ({
      ...prevState,
      embedded_discount_products: prevState.embedded_discount_products.filter(
        (product) => product.product_id !== prodId
      ),
    }));
  }, []);

  const handlePageChangeProd = useCallback((page: number) => {
    if (page >= 1) {
      setCurrentPageProd(page);
    }
  }, []);

  const handleProdPerPageChange = useCallback((newProdPerPage: number) => {
    setShowProdPerPage(newProdPerPage);
    setCurrentPageProd(1);
  }, []);

  const handleAddPlan = useCallback(() => {
    const selectedPlanIds = new Set(
      promotion.embedded_discount_plans.map((plan) => plan.plan_id)
    );
    setGlobalSelectedPlanIds(selectedPlanIds);
    setIsPlanModalOpen(true);
  }, [promotion.embedded_discount_plans]);

  const handleSelectPlan = useCallback(
    (newSelectedPlans: any[]) => {
      const updatedPlans = [...promotion.embedded_discount_plans];

      newSelectedPlans.forEach((newPlan) => {
        const existingPlan = updatedPlans.find(
          (plan) => plan.plan_id === newPlan.id
        );
        if (!existingPlan) {
          updatedPlans.push({ plan_id: newPlan.id, name: newPlan.name });
        }
      });

      setPromotion((prev) => ({
        ...prev,
        embedded_discount_plans: updatedPlans,
      }));

      setIsPlanModalOpen(false);
    },
    [promotion.embedded_discount_plans]
  );

  const handleRemovePlan = useCallback(
    (index: number) => {
      const removedPlanId = promotion.embedded_discount_plans[index].plan_id;

      setPromotion((prevState) => {
        const updatedPlans = prevState.embedded_discount_plans.filter(
          (_, i) => i !== index
        );

        return {
          ...prevState,
          embedded_discount_plans: updatedPlans,
        };
      });

      setGlobalSelectedPlanIds((prevSelected) => {
        const newSelected = new Set(prevSelected);
        newSelected.delete(removedPlanId);
        return newSelected;
      });
    },
    [promotion.embedded_discount_plans]
  );

  const handleRemovePlans = useCallback((planId: string) => {
    setPromotion((prevState) => ({
      ...prevState,
      embedded_discount_plans: prevState.embedded_discount_plans.filter(
        (plan) => plan.plan_id !== planId
      ),
    }));
  }, []);

  const handlePageChangePlans = useCallback(
    (page: number) => {
      if (page >= 1 && page !== currentPagePlan) {
        setCurrentPagePlan(page);
      }
    },
    [currentPagePlan]
  );

  const handlePlansPerPageChange = useCallback((newPlansPerPage: number) => {
    setShowPlansPerPage(newPlansPerPage);
    setCurrentPagePlan(1);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPagePlan(1);
  }, []);

  const handleAddVoucher = useCallback(
    async (code: string, usageLimit: number) => {
      if (!code.trim()) return;

      try {
        const voucherVerify: any = await promotionService.getVoucherByCode(code);
        const data = voucherVerify?.data ?? voucherVerify?.data?.data ?? [];

        if (data.length > 0 && data[0].code != null) {
          setErrorMessage(`Voucher Code ${code} already exists.`);
          setShowAlert(true);
          return;
        }

        setVouchers((prevVouchers) => [...prevVouchers, { code, usageLimit }]);
        setVoucherCode("");
        setVoucherUsageLimit(1);
      } catch (error) {
        console.error("Error checking voucher:", error);
      }
    },
    []
  );

  const handleRemoveVoucher = useCallback((index: number) => {
    setVouchers((prevVouchers) => prevVouchers.filter((_, i) => i !== index));
  }, []);

  const goBack = useCallback(() => {
    router.push(AppURL.promotionCampaign);
  }, [router]);

  const loadCampaignDetail = useCallback((id: string) => {
    setCampaignId(id);
  }, []);

  const handleChangeVoucherLimit = (value: string) => {
    if (value === "") {
      setVoucherUsageLimit(0);
      return;
    }

    if (!/^\d+$/.test(value)) {
      return;
    }

    if (value.length > 5) {
      return;
    }

    if (value.startsWith("0")) {
      return;
    }

    const numValue = parseInt(value, 10);
    setVoucherUsageLimit(numValue);
  };

  const handleVoucherLimitBlur = () => {
    if (voucherUsageLimit < 1) {
      setVoucherUsageLimit(1);
    }
  };

  return {
    handleSubmit,
    control,
    errors,
    reset,
    watch,

    promotion,
    currency,

    hasAccess,
    showAlert,
    errorMessage,
    isEdit,

    handleSave,
    setShowAlert,
    goBack,
    loadCampaignDetail,
    handleChangeType,
    handleChangeValueType,
    handleChangeInsurance,

    channels,
    isChannelModalOpen,
    selectedChannelIds,
    globalSelectedChannels,
    currentPageChannels,
    showChannelsPerPage,
    setIsChannelModalOpen,
    setSelectedChannelIds,
    setGlobalSelectedChannels,
    handleAddChannel,
    handleSelectChannel,
    handleRemoveChannel,
    handleRemoveArrayItemChan,
    handlePageChangeChannel,
    handleChannelsPerPageChange,

    insurances,
    isInsuranceModalOpen,
    selectedInsuranceIds,
    globalSelectedInsuranceIds,
    selectedInsurances,
    currentPageIns,
    showInsPerPage,
    totalInsuranceItems,
    setIsInsuranceModalOpen,
    setSelectedInsuranceIds,
    setGlobalSelectedInsuranceIds,
    handleAddInsurance,
    handleSelectInsurance,
    handleRemoveInsurance,
    handleRemoveArrayItemIns,
    handlePageChangeInsurances,
    handleInsurancePerPageChange,

    products,
    isProductModalOpen,
    selectedProductIds,
    globalSelectedProdIds,
    selectedProducts,
    currentPageProd,
    showProdPerPage,
    totalProductItems,
    setIsProductModalOpen,
    setSelectedProductIds,
    setGlobalSelectedProdIds,
    handleAddProduct,
    handleSelectProduct,
    handleRemoveProduct,
    handleRemoveProd,
    handlePageChangeProd,
    handleProdPerPageChange,

    plans,
    isPlanModalOpen,
    selectedPlanIds,
    globalSelectedPlanIds,
    selectedPlans,
    currentPagePlan,
    showPlansPerPage,
    totalPlanItems,
    setIsPlanModalOpen,
    setSelectedPlanIds,
    setGlobalSelectedPlanIds,
    handleAddPlan,
    handleSelectPlan,
    handleRemovePlan,
    handleRemovePlans,
    handlePageChangePlans,
    handlePlansPerPageChange,
    handleSearch,

    vouchers,
    voucherCode,
    voucherUsageLimit,
    setVoucherCode,
    setVoucherUsageLimit,
    handleAddVoucher,
    handleRemoveVoucher,

    handleChangeVoucherLimit,
    handleVoucherLimitBlur,

    isLoadingCurrency,
    isLoadingDetail,
    isSaving: createCampaignMutation.isPending || updateCampaignMutation.isPending,
  };
}
