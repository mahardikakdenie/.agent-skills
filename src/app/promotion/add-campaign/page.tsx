"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PromotionService } from "@/services/promotion.service";
import { FaCheck, FaPlus, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import WithSidebar from "@/hoc/with-sidebar";
import {
  EmbeddedDiscountInsurance,
  PromotionDetails,
} from "../dto/promotion.details.dto";
import { ChannelService } from "@/services/channel.services";
import { InsuranceService } from "@/services/insurance.services";
import { ProductService } from "@/services/product.services";
import { PlanService } from "@/services/plan.services";
import {
  Insurance,
  InsuranceResponseDTO,
  NewPromotionCampaign,
  Plan,
  PlanResponseDTO,
  Product,
  ProductResponseDTO,
} from "../dto/promotion.dto";
import ChannelSelectionModal from "../components/channel-selection-modal";
import InsuranceSelectionModal from "../components/insurance-selection-modal";
import ProductSelectionModal from "../components/product-selection-modal";
import PlanSelectionModal from "../components/plan-selection-modal";
import { AxiosResponse } from "axios";
import { VoucherService } from "@/services/voucher.services";
import { isValid, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ChevronLeft, Trash } from "react-feather";

interface Channel {
  id: string;
  name: string;
  type: string;
}

interface ChannelResponseDTO {
  data: Channel[];
  total: number;
  limit: number;
  page: number;
  pageTotal: number;
}

interface Currency {
  code: string;
  name: string;
}

const CreatePromotionPage = () => {
  const router = useRouter();
  const promotionService = new PromotionService();
  const channelService = new ChannelService();
  const insuranceService = new InsuranceService();
  const productService = new ProductService();
  const planService = new PlanService();
  const voucherService = new VoucherService();
  const [value_currency, setValue_currency] = useState("");
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");
  const [value_type, setValue_type] = useState("");
  const [value, setValue] = useState("");
  const [minimum_amount, setMinimum_amount] = useState("");
  const [maximum_amount, setMaximum_amount] = useState("");

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
    defaultValues: {
      value_currency: "IDR",
      type,
      name,
      start_date,
      end_date,
      value_type,
      value,
      minimum_amount,
      maximum_amount,
    },
  });

  const [products, setProducts] = useState<ProductResponseDTO | undefined>(
    undefined
  );
  const [hasProducts, setHasProducts] = useState(false);
  const [promotion, setPromotion] = useState<NewPromotionCampaign>({
    campaign_id: "",
    name: "",
    type: "embedded",
    start_date: "",
    end_date: "",
    value: 0,
    active: true,
    value_currency: "IDR",
    value_type: "fixed",
    minimum_amount: 0,
    maximum_amount: 0,
    embedded_discount_channels: [],
    embedded_discount_insurances: [],
    embedded_discount_plans: [],
    embedded_discount_products: [],
    vouchers: [],
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency[]>([]);
  const [channels, setChannels] = useState<ChannelResponseDTO | undefined>(
    undefined
  );
  const [selectedChannelIds, setSelectedChannelIds] = useState<Set<string>>(
    new Set()
  );
  const [insurances, setInsurances] = useState<
    InsuranceResponseDTO | undefined
  >(undefined);
  const [selectedInsuranceIds, setSelectedInsuranceIds] = useState<Set<string>>(
    new Set()
  );
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set()
  );
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [plans, setPlans] = useState<PlanResponseDTO | undefined>(undefined);
  const [selectedPlanIds, setSelectedPlanIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedInsurances, setSelectedInsurances] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [voucherDetails, setVoucherDetails] = useState<any>(null);
  const [vouchers, setVouchers] = useState<
    { code: string; usageLimit: number }[]
  >([]);
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [voucherUsageLimit, setVoucherUsageLimit] = useState<number>(1);
  const [alertMessage, setAlertMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageIns, setCurrentPageIns] = useState(1);
  const [currentPageProd, setCurrentPageProd] = useState(1);
  const [currentPagePlan, setCurrentPagePlan] = useState(1);
  const [currentPageChannels, setCurrentPageChannels] = useState(1);
  const [totalPlanItems, setTotalPlanItems] = useState(0);
  const [showPlansPerPage, setShowPlansPerPage] = useState(10);
  const [showChannelsPerPage, setShowChannelsPerPage] = useState(10);
  const [showProdPerPage, setShowProdPerPage] = useState(10);
  const [selectedPlans, setSelectedPlans] = useState<Plan[]>([]);
  const [globalSelectedChannels, setGlobalSelectedChannels] = useState<
    Set<string>
  >(new Set());
  const [showInsurancesPerPage, setShowInsurancesPerPage] = useState(10);
  const [totalInsuranceItems, setTotalInsuranceItems] = useState(0);
  const [totalProductItems, setTotalProductItems] = useState(0);
  const [globalSelectedInsuranceIds, setGlobalSelectedInsuranceIds] = useState<
    Set<string>
  >(new Set());
  const [globalSelectedProdIds, setGlobalSelectedProdIds] = useState<
    Set<string>
  >(new Set());
  const [globalSelectedPlanIds, setGlobalSelectedPlanIds] = useState<
    Set<string>
  >(new Set());
  const [showInsPerPage, setShowInsPerPage] = useState(10);

  useEffect(() => {
    fetchInsurances(currentPageIns, showInsPerPage);
  }, [showInsPerPage]); // Trigger only when the page size changes

  useEffect(() => {
    fetchChannels(currentPageChannels, showChannelsPerPage);
  }, [currentPageChannels, showChannelsPerPage]);

  useEffect(() => {
    fetchCurrency();
  }, []);

  useEffect(() => {
    if (globalSelectedProdIds.size > 0) {
      fetchPlansByProducts(
        Array.from(globalSelectedProdIds),
        currentPagePlan,
        showPlansPerPage
      );
      setCurrentPagePlan(1);
    } else {
      setPlans(undefined);
      setSelectedPlanIds(new Set());
    }
  }, [globalSelectedProdIds]);

  const fetchPlansByProducts = async (
    productIds: string[],
    page: number,
    limit: number
  ) => {
    // console.log("Fetching plans for page:", page, "with limit:", limit);
    try {
      const responses = await planService.getPlansByProductId(
        productIds,
        limit,
        page
      );
      setPlans(responses);
      setTotalPlanItems(responses.meta.total);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      setPlans(undefined);
    }
  };

  const fetchChannels = async (page: number, limit: number) => {
    try {
      const response = await channelService.getChannels(page, limit);
      setChannels(response);
    } catch (error) {
      console.error("Failed to fetch channels:", error);
    }
  };

  const fetchCurrency = async () => {
    try {
      const response = await productService.getCurrency();
      setCurrency(response.data);
    } catch (error) {
      console.error("Failed to fetch currency:", error);
    }
  };

  const fetchInsurances = async (page: number, limit: number) => {
    // console.log("Fetching insurances for page:", page, "with limit:", limit);
    try {
      const response = await insuranceService.getInsurances(page, limit);
      setInsurances(response);
      setTotalInsuranceItems(response.meta.total);
    } catch (error) {
      console.error("Failed to fetch insurances:", error);
      setInsurances(undefined);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const response = await planService.getPlansNameByProductId(
        Array.from(globalSelectedProdIds),
        query
      );
      setPlans(response);
      setTotalPlanItems(response.meta.total);
      setCurrentPagePlan(1);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const fetchProductsByInsurances = async (
    insuranceIds: string[],
    page: number,
    limit: number
  ) => {
    if (insuranceIds.length === 0) {
      setProducts(undefined);
      setHasProducts(false);
      return;
    }

    try {
      const allProducts = await productService.getProductByInsuranceId(
        insuranceIds,
        limit,
        page
      );
      setProducts(allProducts);
      setTotalProductItems(allProducts.meta.total);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts(undefined);
      setHasProducts(false);
    }
  };

  const isProductButtonDisabled =
    selectedInsuranceIds.size === 0 || globalSelectedInsuranceIds.size === 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value } = target;

    if (target.type === "checkbox") {
      setPromotion((prevState) => ({
        ...prevState,
        [name]: target.checked,
      }));
    } else {
      setPromotion((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleAddChannel = () => {
    const selectedChannelIds = new Set(
      promotion.embedded_discount_channels.map((channel) => channel.channel_id)
    );
    setGlobalSelectedChannels(selectedChannelIds);
    setIsModalOpen(true);
  };

  const handleAddIns = () => {
    const selectedInsIds = new Set(
      promotion.embedded_discount_insurances.map(
        (insurances) => insurances.insurance_id
      )
    );
    setGlobalSelectedInsuranceIds(selectedInsIds);
    setIsInsuranceModalOpen(true);
  };

  const handleAddProduct = () => {
    const selectedProdIds = new Set(
      promotion.embedded_discount_products.map(
        (products) => products.product_id
      )
    );
    setGlobalSelectedProdIds(selectedProdIds);
    setIsProductModalOpen(true);
  };

  const handleRemoveArrayItemChan = (
    arrayName: keyof PromotionDetails,
    index: number
  ) => {
    setPromotion((prevState) => {
      const updatedArray = (prevState[arrayName] as Array<any>).filter(
        (_, i) => i !== index
      );

      if (arrayName === "embedded_discount_channels") {
        // Reset insurances, products, and plans when a channel is removed
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
      // Reset global states or selections
      setSelectedProductIds(new Set());
      setSelectedPlanIds(new Set());
      setGlobalSelectedProdIds(new Set());
      setGlobalSelectedPlanIds(new Set());
      setGlobalSelectedInsuranceIds(new Set());
      setSelectedInsuranceIds(new Set());
      setSelectedInsurances([]);
      setCurrentPageProd(1);
    }
  };

  const handleValueTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPromotion((prevState) => ({
      ...prevState,
      value_type: e.target.value,
    }));
  };

  const handleAddVoucher = async (code: string, usageLimit: number) => {
    if (!code.trim()) return; // Early return if code is empty

    // Check if the voucher already exists
    const voucherVerify = await voucherService.getVoucherByCode(code);
    const { data } = voucherVerify;

    if (data.length > 0 && data[0].code != null) {
      // If voucher exists, set error message and show alert
      setErrorMessage(`Voucher Code ${code} already exists.`);
      setShowAlert(true);
      return; // Exit the function to prevent adding the voucher
    }

    // If the voucher does not exist, proceed to add it
    setVouchers((prevVouchers) => [...prevVouchers, { code, usageLimit }]);
    setVoucherCode("");
    setVoucherUsageLimit(1);
  };

  const handleSave = async (formData: any) => {
    // e.preventDefault();

    setErrorMessage("");
    setAlertMessage("");
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
      })),
      insurances: promotion.embedded_discount_insurances.map((insurance) => ({
        insurance_id: insurance.insurance_id,
      })),
      plans: promotion.embedded_discount_plans.map((plan) => ({
        plan_id: plan.plan_id,
      })),
      channels: promotion.embedded_discount_channels.map((channel) => ({
        channel_id: channel.channel_id,
        name: channel.channel_name
      })),
      vouchers: vouchers.map((voucher) => ({
        code: voucher.code,
        usage_limit: voucher.usageLimit,
      })),
    };

    setLoading(true);

    try {
      let voucherExists = false;
      let existingVoucherCodes: string[] = [];

      for (const element of payload.vouchers) {
        const voucherVerify = await voucherService.getVoucherByCode(
          element.code
        );
        const { data } = voucherVerify;

        if (data.length > 0 && data[0].code != null) {
          voucherExists = true;
          existingVoucherCodes.push(element.code);
        }
      }

      if (voucherExists) {
        setErrorMessage(
          `Voucher Code(s) ${existingVoucherCodes.join(", ")} already exist.`
        );
        setShowAlert(true);
      } else {
        const response: AxiosResponse<any> =
          await promotionService.createPromotion(payload);
        const { data } = response;

        if (formData.type == "embedded") {
          // console.log("data: " + data);
          if (data != null) {
            if (data.data?.error?.code === 409) {
              setErrorMessage(
                "Unable to submit campaign, one or more plan has already been used by another embedded campaign."
              );
              setShowAlert(true);
              return;
            } else {
              planService.getSyncEmbeddedDiscount();

              setErrorMessage("Promotion Campaign Submitted!");
            }
          } else {
            setErrorMessage("Failed to create promotion. Please try again.");
            setShowAlert(true);
          }
        } else {
          setErrorMessage("Promotion Campaign Submitted!");
        }

        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          router.push("/promotion");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to save promotion:", error);
      setErrorMessage("Failed to create promotion. Please try again.");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChannel = (selectedChannels: Channel[]) => {
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

    setIsModalOpen(false);
  };

  const handleSelectProduct = (selectedProducts: Product[]) => {
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

    setGlobalSelectedProdIds((prevSelected) => {
      const newSelected = new Set(prevSelected);
      selectedProducts.forEach((prod) => newSelected.add(prod.id));
      return newSelected;
    });
  };

  const handleSelectInsurance = (selectedInsurances: Insurance[]) => {
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

    const newSelectedIds = new Set<string>(
      selectedInsurances.map((ins) => ins.id)
    );
    setSelectedInsuranceIds(new Set(selectedInsurances.map((ins) => ins.id)));

    const insuranceIdsToFetch = updatedInsurances.map(
      (ins) => ins.insurance_id
    );
    fetchProductsByInsurances(
      Array.from(insuranceIdsToFetch),
      1,
      showProdPerPage
    ); // Fetch products based on updated insurance IDs and reset to page 1.

    setIsInsuranceModalOpen(false);
    setCurrentPageProd(1); // Reset the product modal page to 1 after changing insurances
  };

  const handleSelectPlan = (newSelectedPlans: Plan[]) => {
    const updatedPlans = [...promotion.embedded_discount_plans];

    newSelectedPlans.forEach((newPlan) => {
      const existingPlan = updatedPlans.find(
        (plan) => plan.plan_id === newPlan.id
      );
      if (!existingPlan) {
        updatedPlans.push({ plan_id: newPlan.id, name: newPlan.name }); // Add new plan if not already in the list
      }
    });

    setPromotion((prev) => ({
      ...prev,
      embedded_discount_plans: updatedPlans, // Update promotion with selected plans
    }));
  };

  const handleAddPlan = () => {
    const selectedPlanIds = new Set(
      promotion.embedded_discount_plans.map((plans) => plans.plan_id)
    );
    setGlobalSelectedPlanIds(selectedPlanIds);
    setIsPlanModalOpen(true);
  };

  const handleRemoveVoucher = (index: number) => {
    setVouchers((prevVouchers) => prevVouchers.filter((_, i) => i !== index));
  };

  const handleRemoveProduct = (index: number) => {
    setPromotion((prevState) => {
      const removedProductId =
        prevState.embedded_discount_products[index].product_id;

      const updatedProducts = prevState.embedded_discount_products.filter(
        (_, i) => i !== index
      );

      const updatedPlans = prevState.embedded_discount_plans.filter((plan) =>
        updatedProducts.some((product) => product.product_id === plan.plan_id)
      );

      const updatedSelectedPlanIds = new Set(selectedPlanIds);
      prevState.embedded_discount_plans.forEach((plan) => {
        if (!updatedPlans.some((p) => p.plan_id === plan.plan_id)) {
          updatedSelectedPlanIds.delete(plan.plan_id);
        }
      });

      setGlobalSelectedProdIds((prevSelected) => {
        const newSelected = new Set(prevSelected);

        updatedProducts.forEach((prod) => newSelected.add(prod.product_id));
        newSelected.delete(removedProductId);
        return newSelected;
      });

      // Fetch plans based on the remaining global selected product IDs
      fetchPlansByProducts(
        Array.from(globalSelectedProdIds),
        1,
        showPlansPerPage
      );
      setCurrentPagePlan(1);

      return {
        ...prevState,
        embedded_discount_products: updatedProducts,
        embedded_discount_plans: updatedPlans,
      };
    });

    // Check if there are still products available
    setHasProducts(products?.data?.length ? products.data.length > 0 : false);
  };

  const handleRemoveArrayItemIns = (
    arrayName: keyof PromotionDetails,
    index: number
  ) => {
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

        fetchProductsByInsurances(
          updatedArray.map((ins) => ins.insurance_id),
          1,
          showProdPerPage
        );

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
      setSelectedPlanIds(new Set());
      setCurrentPageProd(1);
    }
  };

  const handleChangeInsurance = (selectedCurrency: {
    currencyName: string;
  }) => {
    setPromotion((prevState) => ({
      ...prevState,
      value_currency: selectedCurrency.currencyName,
    }));
  };

  const handleChangeType = (value: string) => {
    setPromotion((prevState) => ({
      ...prevState,
      type: value,
    }));
  };


  const handleChangeValueType = (value: string) => {
    setPromotion((prevState) => ({
      ...prevState,
      value_type: value,
    }));
  };

  const handleRemovePlan = (index: number) => {
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
  };

  const handleRemovePlans = (planId: string) => {
    setPromotion((prevState) => ({
      ...prevState,
      embedded_discount_plans: prevState.embedded_discount_plans.filter(
        (plan) => plan.plan_id !== planId
      ),
    }));
  };

  const handlePageChangeProd = (page: number) => {
    if (page >= 1) {
      setCurrentPageProd(page);
      fetchProductsByInsurances(
        Array.from(globalSelectedInsuranceIds),
        page,
        showProdPerPage
      );
    }
  };

  const handlePageChangeChannel = (page: number) => {
    if (page >= 1) {
      setCurrentPageChannels(page);
    }
  };

  const handlePageChangePlans = (page: number) => {
    if (page >= 1 && page !== currentPagePlan) {
      setCurrentPagePlan(page);
      fetchPlansByProducts(
        Array.from(globalSelectedProdIds),
        page,
        showPlansPerPage
      );
    }
  };

  const handlePlansPerPageChange = async (newPlansPerPage: number) => {
    setShowPlansPerPage(newPlansPerPage);
    setCurrentPagePlan(1);
    fetchPlansByProducts(Array.from(globalSelectedProdIds), 1, newPlansPerPage);
  };

  const handleChannelsPerPageChange = async (newChannelsPerPage: number) => {
    setShowChannelsPerPage(newChannelsPerPage);
    setCurrentPageChannels(1);
    fetchChannels(1, newChannelsPerPage);
  };

  const handleInsurancePerPageChange = async (newInsPerPage: number) => {
    // console.log("insPerPage: " + newInsPerPage);
    setShowInsPerPage(newInsPerPage);
    setCurrentPageIns(1);
    fetchInsurances(1, newInsPerPage);
  };

  const handleProdPerPageChange = async (newProdPerPage: number) => {
    setShowProdPerPage(newProdPerPage);
    setCurrentPageProd(1);
    fetchProductsByInsurances(
      Array.from(globalSelectedInsuranceIds),
      1,
      newProdPerPage
    );
  };

  const handlePageChangeInsurances = (page: number) => {
    if (page >= 1) {
      setCurrentPageIns(page);
      fetchInsurances(page, showInsPerPage);
    }
  };

  const handleRemoveChannel = (channelId: string) => {
    setPromotion((prevState) => {
      const updatedChannel = prevState.embedded_discount_channels.filter(
        (channel) => channel.channel_id !== channelId
      );

      return {
        ...prevState,
        embedded_discount_channels: updatedChannel,
        embedded_discount_insurances: [], // Clear insurances
        embedded_discount_products: [], // Clear products
        embedded_discount_plans: [], // Clear plans
      };
    });

    setGlobalSelectedChannels((prevIds) => {
      const newIds = new Set(prevIds);
      newIds.delete(channelId);
      return newIds;
    });

    setSelectedInsuranceIds(new Set());
    setGlobalSelectedInsuranceIds(new Set());
    setSelectedProductIds(new Set()); // Reset selected product IDs
    setGlobalSelectedProdIds(new Set());
    setSelectedPlanIds(new Set()); // Reset selected plan IDs
    setGlobalSelectedPlanIds(new Set());
    setCurrentPageProd(1); // Reset pagination for products
  };

  const handleRemoveInsurance = (insuranceId: string) => {
    setPromotion((prevState) => {
      const updatedInsurances = prevState.embedded_discount_insurances.filter(
        (insurance) => insurance.insurance_id !== insuranceId
      );

      return {
        ...prevState,
        embedded_discount_insurances: updatedInsurances,
        embedded_discount_products: [], // Clear products
        embedded_discount_plans: [], // Clear plans
      };
    });

    setGlobalSelectedInsuranceIds((prevIds) => {
      const newIds = new Set(prevIds);
      newIds.delete(insuranceId);
      return newIds;
    });

    setSelectedProductIds(new Set()); // Reset selected product IDs
    setSelectedPlanIds(new Set()); // Reset selected plan IDs
    setCurrentPageProd(1); // Reset pagination for products
  };

  const handleRemoveProd = (prodId: string) => {
    setPromotion((prevState) => ({
      ...prevState,
      embedded_discount_products: prevState.embedded_discount_products.filter(
        (product) => product.product_id !== prodId
      ),
    }));
  };

  const ErrorModal = ({
    isOpen,
    message,
    onClose,
  }: {
    isOpen: boolean;
    message: string;
    onClose: () => void;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-md w-1/3">
          <h2 className="text-lg font-semibold mb-4">Alert</h2>
          <p>{message}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <form onSubmit={handleSubmit(handleSave)} className="w-full">
        <div className="bg-white md:px-6 p-4 flex items-center">
          <div>
            <Breadcrumb className="sm:block hidden">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>Campaign</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add Campaign</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold sm:text-2xl text-lg sm:mt-2">
              Create New Campaign
            </h2>
          </div>
          <div className="flex space-x-4 ml-auto">
            <div
              onClick={() => router.push("/promotion")}
              className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-6 py-2"
            >
              {loading ? <span>Saving...</span> : <FaSave className="mr-2" />}
              Submit
            </button>
          </div>
        </div>
        {showAlert && (
          <ErrorModal
            isOpen={showAlert}
            message={errorMessage!}
            onClose={() => setShowAlert(false)}
          />
        )}
        <ChannelSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleSelectChannel}
          channels={channels}
          onPageChangeChannel={handlePageChangeChannel}
          selectedChannelIds={selectedChannelIds}
          showChannelsPerPage={showChannelsPerPage}
          onChannelsPerPageChange={handleChannelsPerPageChange}
          globalSelectedChannels={globalSelectedChannels}
          setGlobalSelectedChannels={setGlobalSelectedChannels}
          onRemoveChannel={handleRemoveChannel}
        />
        <InsuranceSelectionModal
          isOpen={isInsuranceModalOpen}
          onClose={() => setIsInsuranceModalOpen(false)}
          onSelect={handleSelectInsurance}
          insurances={insurances}
          initialSelectedInsurances={selectedInsurances}
          onPageChangeIns={handlePageChangeInsurances}
          showInsPerPage={showInsPerPage}
          onInsurancePerPageChange={handleInsurancePerPageChange}
          globalSelectedInsuranceIds={globalSelectedInsuranceIds}
          setGlobalSelectedInsuranceIds={setGlobalSelectedInsuranceIds}
          currentPageIns={currentPageIns}
          onRemoveInsurance={handleRemoveInsurance}
        />
        <ProductSelectionModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onSelect={handleSelectProduct}
          products={products}
          initialSelectedProductIds={
            new Set(
              promotion.embedded_discount_products.map((p) => p.product_id)
            )
          }
          selectedProductIds={selectedProductIds}
          showProdPerPage={showProdPerPage}
          onProdPerPageChange={handleProdPerPageChange}
          globalSelectedProdIds={globalSelectedProdIds}
          setGlobalSelectedProdIds={setGlobalSelectedProdIds}
          onPageChangeProd={handlePageChangeProd}
          currentPageProd={currentPageProd}
          onRemoveProd={handleRemoveProd}
        />
        <PlanSelectionModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          onSelect={handleSelectPlan}
          plans={plans}
          products={promotion.embedded_discount_products.map((p) => ({
            id: p.product_id,
            name: p.product_name,
          }))}
          preSelectedPlanIds={
            new Set(promotion.embedded_discount_plans.map((p) => p.plan_id))
          }
          selectedProductIds={
            new Set(
              promotion.embedded_discount_products.map((p) => p.product_id)
            )
          }
          onPageChangePlan={handlePageChangePlans}
          totalPlanItems={totalPlanItems}
          pagePlan={currentPagePlan}
          showPlansPerPage={showPlansPerPage}
          onPlansPerPageChange={handlePlansPerPageChange}
          globalSelectedPlanIds={globalSelectedPlanIds}
          setGlobalSelectedPlanIds={setGlobalSelectedPlanIds}
          globalSelectedProdIds={globalSelectedProdIds}
          onRemovePlan={handleRemovePlans}
          onSearch={handleSearch}
        />

        {/* Create New Campaign */}
        <div className="w-full flex flex-col p-4 sm:p-6">
          <div className="bg-white md:px-6 p-4 grid grid-cols-2 gap-4">
            <div className="">
              <label htmlFor="name" className="font-normal">
                Campaign Name
              </label>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{ required: "Campaign Name is required" }}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    required
                    placeholder="Insert Campaign Name"
                    {...field}
                    className={`mt-1 block w-full h-16 ${errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                  />
                )}
              />
            </div>
            <div className="">
              <label htmlFor="type" className="font-normal">
                Type
              </label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      handleChangeType(value);
                      field.onChange(value);
                    }}
                    disabled={false}
                    required
                  >
                    <SelectTrigger className="w-full h-16 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 mt-1">
                      {" "}
                      {/* Match height and margin */}
                      <SelectValue placeholder="Select a Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="embedded">Embedded</SelectItem>
                        <SelectItem value="voucher">Voucher</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="">
              <label htmlFor="start_date" className="font-normal">
                Start Date
              </label>
              <Controller
                name="start_date"
                control={control}
                defaultValue=""
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <Input
                    type="date"
                    id="start_date"
                    required
                    placeholder="Insert start date"
                    {...field}
                    className={`mt-1 block w-full h-16 ${errors.start_date ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                  />
                )}
              />
            </div>
            <div className="">
              <label htmlFor="end_date" className="font-normal">
                End Date
              </label>
              <Controller
                name="end_date"
                control={control}
                defaultValue=""
                rules={{ required: "End date is required" }}
                render={({ field }) => (
                  <Input
                    type="date"
                    id="end_date"
                    required
                    placeholder="Insert end date"
                    {...field}
                    className={`mt-1 block w-full h-16 ${errors.end_date ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                  />
                )}
              />
            </div>
            <div className="">
              <label htmlFor="value_type" className="font-normal">
                Value Type
              </label>
              <Controller
                name="value_type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      handleChangeValueType(value);
                      field.onChange(value);
                    }}
                    disabled={false}
                    required
                  >
                    <SelectTrigger className="w-full h-16 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2 mt-1">
                      {" "}
                      {/* Match height and margin */}
                      <SelectValue placeholder="Select Value Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="">
              <label htmlFor="value" className="font-normal">
                Value
              </label>
              <Controller
                name="value"
                control={control}
                defaultValue=""
                rules={{ required: "Value is required" }}
                render={({ field }) => (
                  <Input
                    type="number"
                    id="value"
                    required
                    placeholder="Insert a value"
                    {...field}
                    className={`mt-1 block w-full h-16 ${errors.value ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                  />
                )}
              />
            </div>
            <div className="">
              <label htmlFor="minimum_amount" className="font-normal">
                Minimum Amount
              </label>
              <Controller
                name="minimum_amount"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    type="number"
                    id="minimum_amount"
                    required
                    placeholder="Insert a minimum amount"
                    {...field}
                    className={`mt-1 block w-full h-16 ${errors.minimum_amount ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                  />
                )}
              />
            </div>
            <div className="">
              <label htmlFor="maximum_amount" className="font-normal">
                Maximum Amount
              </label>
              <Controller
                name="maximum_amount"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Input
                    type="number"
                    id="maximum_amount"
                    required
                    placeholder="Insert a maximum amount"
                    {...field}
                    className={`mt-1 block w-full h-16 ${errors.maximum_amount ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm`}
                  />
                )}
              />
            </div>
            <div className="col-span-2">
              <div className="flex flex-col w-full">
                <label htmlFor="value_currency" className="font-normal">
                  Currency
                </label>
                <Controller
                  name="value_currency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""} // Sets the selected value in the dropdown
                      onValueChange={(currencyCode) => {
                        // Find the selected currency object based on the selected code
                        const selectedCurrency = currency.find(
                          (item) => item.code === currencyCode
                        );

                        // Update form state and any related changes (e.g., insurance)
                        handleChangeInsurance({
                          currencyName: selectedCurrency?.name || "",
                        });

                        // Update the field's value to the selected currency code
                        field.onChange(currencyCode);
                      }}
                      disabled={false}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-300 select-status bg-transparent hover:cursor-pointer py-2">
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {/* Map over the currency data payload */}
                          {currency.map((currencyItem) => (
                            <SelectItem
                              key={currencyItem.code}
                              value={currencyItem.code}
                            >
                              {currencyItem.name}{" "}
                              {/* Display the currency name */}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Channels Section */}
            <div className="col-span-2">
              <label className="font-normal">Channels</label>
              <div className="flex items-start mt-2">
                <div className="border rounded bg-white overflow-y-auto flex-grow mr-2 h-32">
                  <div className="flex flex-col p-2">
                    {promotion.embedded_discount_channels.length > 0 ? (
                      promotion.embedded_discount_channels.map(
                        (channel, index) => (
                          <div
                            key={index}
                            className="flex items-center mb-1 mr-1 border border-gray-300 rounded p-1"
                          >
                            <span className="whitespace-normal">
                              {channel.channel_name || "Unknown Channel"}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveArrayItemChan(
                                  "embedded_discount_channels",
                                  index
                                )
                              }
                              className="text-red-500 ml-auto"
                            >
                              <Trash />
                            </button>
                          </div>
                        )
                      )
                    ) : (
                      <span>No channels added</span>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 flex justify-center items-center">
                  <button
                    type="button"
                    onClick={handleAddChannel}
                    className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 h-10 flex items-center w-40"
                  >
                    <FaPlus className="mr-2" />
                    Channel
                  </button>
                </div>
              </div>
            </div>

            {/* Insurances Section */}
            <div className="col-span-2">
              <label className="font-normal">Insurances</label>
              <div className="flex items-start mt-2">
                <div className="border rounded bg-white overflow-y-auto flex-grow mr-2 h-32">
                  <div className="flex flex-col p-2">
                    {promotion.embedded_discount_insurances.length > 0 ? (
                      promotion.embedded_discount_insurances.map(
                        (insurance, index) => (
                          <div
                            key={index}
                            className="flex items-center mb-1 mr-1 border border-gray-300 rounded p-1"
                          >
                            <span className="whitespace-normal">
                              {insurance.insurance_name || "Unknown Insurance"}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveArrayItemIns(
                                  "embedded_discount_insurances",
                                  index
                                )
                              }
                              className="text-red-500 ml-auto"
                            >
                              <Trash />
                            </button>
                          </div>
                        )
                      )
                    ) : (
                      <span>No insurances added</span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 flex justify-center items-center">
                  <button
                    type="button"
                    onClick={handleAddIns}
                    className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 h-10 flex items-center w-40"
                    disabled={promotion.embedded_discount_channels.length === 0}
                  >
                    <FaPlus className="mr-2" />
                    Insurance
                  </button>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="col-span-2">
              <label className="font-normal">Products</label>
              <div className="flex items-start mt-2">
                <div className="border rounded bg-white overflow-y-auto flex-grow mr-2 h-32">
                  <div className="flex flex-col p-2">
                    {promotion.embedded_discount_products.length > 0 ? (
                      promotion.embedded_discount_products.map(
                        (product, index) => (
                          <div
                            key={index}
                            className="flex items-center mb-1 mr-1 border border-gray-300 rounded p-1"
                          >
                            <span className="whitespace-normal">
                              {product.product_name || "Unknown Product"}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(index)}
                              className="text-red-500 ml-auto"
                            >
                              <Trash />
                            </button>
                          </div>
                        )
                      )
                    ) : (
                      <span>No products added</span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 flex justify-center items-center">
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 h-10 flex items-center w-40"
                    disabled={
                      promotion.embedded_discount_insurances.length === 0
                    }
                  >
                    <FaPlus className="mr-2" />
                    Product
                  </button>
                </div>
              </div>
            </div>

            {/* Plans Section */}
            <div className="col-span-2">
              <label className="font-normal">Plans</label>
              <div className="flex items-start mt-2">
                <div className="border rounded bg-white overflow-y-auto flex-grow mr-2 h-32">
                  <div className="flex flex-col p-2">
                    {promotion.embedded_discount_plans.length > 0 ? (
                      promotion.embedded_discount_plans.map((plan, index) => (
                        <div
                          key={index}
                          className="flex items-center mb-1 mr-1 border border-gray-300 rounded p-1"
                        >
                          <span className="whitespace-normal">{plan.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePlan(index)}
                            className="text-red-500 ml-auto"
                          >
                            <Trash />
                          </button>
                        </div>
                      ))
                    ) : (
                      <span>No plans added</span>
                    )}
                  </div>
                </div>
                {/* Add Plan Button */}
                <div className="flex-shrink-0 flex justify-center items-center">
                  <button
                    type="button"
                    onClick={handleAddPlan}
                    className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 h-10 flex items-center w-40"
                    disabled={promotion.embedded_discount_products.length === 0}
                  >
                    <FaPlus className="mr-2" />
                    Plan
                  </button>
                </div>
              </div>
            </div>

            {/* Vouchers Section */}
            {/* <div className="my-4" /> */}
            <div className="col-span-2">
              {promotion.type === "voucher" && (
                <div>
                  <label className="font-normal">Vouchers</label>
                  <div className="flex items-center mt-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      className="p-2 border rounded"
                      placeholder="Enter voucher code"
                    />
                    <input
                      type="number"
                      value={voucherUsageLimit}
                      onChange={(e) =>
                        setVoucherUsageLimit(Number(e.target.value))
                      }
                      className="p-2 border rounded ml-2 w-24"
                      placeholder="Usage limit"
                      min={1}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleAddVoucher(voucherCode, voucherUsageLimit)
                      }
                      className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                      disabled={!voucherCode || voucherUsageLimit <= 0}
                    >
                      Add Voucher
                    </button>
                  </div>
                  <div className="mt-4">
                    {vouchers.map((voucher, index) => (
                      <div key={index} className="flex items-center mt-2">
                        <span className="mr-2">
                          {voucher.code} (Usage Limit: {voucher.usageLimit})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveVoucher(index)}
                          className="text-red-500"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const CreatePromotionPageWithSidebar = (params: any) =>
  WithSidebar(CreatePromotionPage)(params);
export default CreatePromotionPageWithSidebar;
