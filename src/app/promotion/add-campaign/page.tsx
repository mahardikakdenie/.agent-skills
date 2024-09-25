"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PromotionService } from "@/services/promotion.service";
import { FaCheck, FaPlus, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import WithSidebar from "@/hoc/with-sidebar";
import { EmbeddedDiscountInsurance, PromotionDetails } from "../dto/promotion.details.dto";
import { ChannelService } from "@/services/channel.services";
import { InsuranceService } from "@/services/insurance.services";
import { ProductService } from "@/services/product.services";
import { PlanService } from "@/services/plan.services";
import { Insurance, InsuranceResponseDTO, NewPromotionCampaign, Plan, Product } from "../dto/promotion.dto";
import ChannelSelectionModal from "../components/channel-selection-modal";
import InsuranceSelectionModal from "../components/insurance-selection-modal";
import ProductSelectionModal from "../components/product-selection-modal";
import PlanSelectionModal from "../components/plan-selection-modal";
import { AxiosResponse } from "axios";
import { VoucherService } from "@/services/voucher.services";
import { isValid, parseISO } from 'date-fns';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { ChevronLeft } from "react-feather";

const CURRENCIES = [
  { code: 'IDR', name: 'Indonesian Rupiah' },
  { code: 'MYR', name: 'Malaysian Ringgit' },
  { code: 'PHP', name: 'Philippine Peso' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'THB', name: 'Thai Baht' },
  { code: 'VND', name: 'Vietnamese Dong' },
];

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


const CreatePromotionPage = () => {
  const router = useRouter();
  const promotionService = new PromotionService();
  const channelService = new ChannelService();
  const insuranceService = new InsuranceService();
  const productService = new ProductService();
  const planService = new PlanService();
  const voucherService = new VoucherService();

  const [products, setProducts] = useState<Product[]>([]);
  const [hasProducts, setHasProducts] = useState(false);
  const [promotion, setPromotion] = useState<NewPromotionCampaign>({
    campaign_id: "",
    name: "",
    type: "embedded",
    start_date: "",
    end_date: "",
    value: 0,
    active: true,
    value_currency: 'IDR',
    value_type: "fixed",
    minimum_amount: 0,
    maximum_amount: 0,
    embedded_discount_channels: [],
    embedded_discount_insurances: [],
    embedded_discount_plans: [],
    embedded_discount_products: [],
    vouchers: []
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channels, setChannels] = useState<ChannelResponseDTO | undefined>(undefined);
  const [selectedChannelIds, setSelectedChannelIds] = useState<Set<string>>(new Set());
  const [insurances, setInsurances] = useState<InsuranceResponseDTO | undefined>(undefined);
  const [selectedInsuranceIds, setSelectedInsuranceIds] = useState<Set<string>>(new Set());
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanIds, setSelectedPlanIds] = useState<Set<string>>(new Set());
  const [selectedInsurances, setSelectedInsurances] = useState<any[]>([]);
  const [voucherDetails, setVoucherDetails] = useState<any>(null);
  const [vouchers, setVouchers] = useState<{ code: string; usageLimit: number }[]>([]);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [voucherUsageLimit, setVoucherUsageLimit] = useState<number>(1);
  const [alertMessage, setAlertMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageIns, setCurrentPageIns] = useState(1);
  const [currentPagePlan, setCurrentPagePlan] = useState(1);
  const [currentPageChannel, setCurrentPageChannel] = useState(1);
  const [totalPlanItems, setTotalPlanItems] = useState(0);
  const [showPlansPerPage, setShowPlansPerPage] = useState(10);
  const [selectedPlans, setSelectedPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetchInsurances(currentPageIns);
  }, [currentPageIns]);

  useEffect(() => {
    fetchChannels(currentPageChannel);
  }, [currentPageChannel]);


  useEffect(() => {
    if (selectedInsuranceIds.size > 0) {
      fetchProductsByInsurances(Array.from(selectedInsuranceIds), currentPageIns);
    } else {
      setProducts([]);
      setHasProducts(false);
    }
  }, [selectedInsuranceIds]);

  useEffect(() => {
    if (selectedProductIds.size > 0) {
      fetchPlansByProducts(Array.from(selectedProductIds), currentPagePlan, showPlansPerPage);
    } else {
      setPlans([]);
      setSelectedPlanIds(new Set());
    }
  }, [selectedProductIds]);

  useEffect(() => {
    if (selectedProductIds.size > 0) {
      fetchPlansByProducts(Array.from(selectedProductIds), currentPagePlan, showPlansPerPage);
    }
  }, [selectedProductIds, currentPagePlan, showPlansPerPage]);


  const fetchPlansByProducts = async (productIds: string[], page: number, limit: number) => {
    console.log("Fetching plans for page:", page, "with limit:", limit);
    try {
      const responses = await planService.getPlansByProductId(productIds, limit, page);
      setPlans(responses.data);
      setTotalPlanItems(responses.meta.total);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      setPlans([]);
    }
  };



  const fetchChannels = async (page: number) => {
    try {
      const limit = 10;
      const response = await channelService.getChannels(page, limit);
      setChannels(response);
    } catch (error) {
      console.error("Failed to fetch channels:", error);
    }
  };

  const fetchInsurances = async (page: number) => {
    try {
      const limit = 10;
      const response = await insuranceService.getInsurances(page, limit);
      setInsurances(response);
    } catch (error) {
      console.error("Failed to fetch insurances:", error);
    }
  };

  const fetchProductsByInsurances = async (insuranceIds: string[], page: number) => {
    if (insuranceIds.length === 0) {
      setProducts([]);
      setHasProducts(false);
      return;
    }

    try {
      const limit = 10;
      const allProducts = await productService.getProductByInsuranceId(insuranceIds, limit, page);
      setProducts(allProducts.data);
      setHasProducts(allProducts.data.length > 0);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
      setHasProducts(false);
    }
  };



  const isProductButtonDisabled = !hasProducts;

  const handleSelectInsurance = (selectedInsurances: Insurance[]) => {
    const updatedInsurances: EmbeddedDiscountInsurance[] = selectedInsurances.map(insurance => ({
      insurance_id: insurance.id,
      insurance_name: insurance.name,
      id: insurance.id,
      name: insurance.name
    }));

    setPromotion(prevState => ({
      ...prevState,
      embedded_discount_insurances: updatedInsurances
    }));

    setSelectedInsuranceIds(new Set(selectedInsurances.map(ins => ins.id)));
    setIsInsuranceModalOpen(false);
  };


  // const handleSelectProduct = (selectedProducts: Product[]) => {
  //   setPromotion(prevState => ({
  //     ...prevState,
  //     embedded_discount_products: selectedProducts.map(product => ({
  //       product_id: product.id,
  //       product_name: product.name
  //     }))
  //   }));
  //   setSelectedProductIds(new Set(selectedProducts.map(product => product.id)));
  // };

  const handleSelectProduct = (selectedProducts: Product[]) => {
    // Get the selected product IDs from the updated selection
    const selectedProductIdsSet = new Set(selectedProducts.map(product => product.id));

    // Update promotion state with the new selected products
    setPromotion(prevState => {
      // Filter plans associated with selected products only
      const updatedPlans = prevState.embedded_discount_plans.filter(plan =>
        selectedProductIdsSet.has(plan.plan_id)
      );

      return {
        ...prevState,
        embedded_discount_products: selectedProducts.map(product => ({
          product_id: product.id,
          product_name: product.name
        })),
        embedded_discount_plans: updatedPlans,  // Update plans to keep only those tied to selected products
      };
    });

    // Update the state for selected product IDs
    setSelectedProductIds(selectedProductIdsSet);
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value } = target;

    if (target.type === 'checkbox') {
      setPromotion(prevState => ({
        ...prevState,
        [name]: target.checked
      }));
    } else {
      setPromotion(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleAddChannel = () => {
    setSelectedChannelIds(new Set(promotion.embedded_discount_channels.map(channel => channel.channel_id)));
    setIsModalOpen(true);
  };

  const handleAddProduct = () => {
    setIsProductModalOpen(true);
  };

  const handleRemoveArrayItem = (arrayName: keyof PromotionDetails, index: number) => {
    setPromotion(prevState => {
      const updatedArray = (prevState[arrayName] as Array<any>).filter((_, i) => i !== index);

      if (arrayName === 'embedded_discount_insurances') {
        const removedInsuranceId = prevState.embedded_discount_insurances[index].insurance_id;
        fetchProductsByInsurances(updatedArray.map(ins => ins.insurance_id), currentPage);

        return {
          ...prevState,
          [arrayName]: updatedArray,
          embedded_discount_products: [],
          embedded_discount_plans: []
        };
      }

      return {
        ...prevState,
        [arrayName]: updatedArray,
      };
    });

    if (arrayName === 'embedded_discount_insurances') {
      setSelectedInsurances(prevInsurances =>
        prevInsurances.filter((_, i) => i !== index)
      );
      setSelectedProductIds(new Set());
      setSelectedPlanIds(new Set());
    }
  };

  const handleValueTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPromotion(prevState => ({
      ...prevState,
      value_type: e.target.value
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
    setVouchers(prevVouchers => [
      ...prevVouchers,
      { code, usageLimit }
    ]);
    setVoucherCode('');
    setVoucherUsageLimit(1);

  };

  const handleSave = async () => {
    setErrorMessage('');
    setAlertMessage('');
    setShowAlert(false);

    if (!promotion.type || !promotion.value || !promotion.value_type || !promotion.value_currency ||
      !promotion.start_date || !promotion.end_date || !promotion.name) {
      setErrorMessage('Please fill in all required fields.');
      setShowAlert(true);
      return;
    }

    if (promotion.embedded_discount_insurances.length < 1 || promotion.embedded_discount_products.length < 1 ||
      promotion.embedded_discount_plans.length < 1 || promotion.embedded_discount_channels.length < 1) {
      setErrorMessage('Please select at least one data in Channel/Insurance/Product/Plan.');
      setShowAlert(true);
      return;
    }

    if (promotion.type == "voucher") {
      if (vouchers.length < 1) {
        setErrorMessage('Please insert at least one voucher.');
        setShowAlert(true);
        return;
      }
    }

    const startDate = parseISO(promotion.start_date);
    const endDate = parseISO(promotion.end_date);

    if (!isValid(startDate) || !isValid(endDate)) {
      setErrorMessage('Invalid date format. Please use DD-MM-YYYY format.');
      setShowAlert(true);
      return;
    }

    if (startDate > endDate) {
      setErrorMessage('End date must be later than start date.');
      setShowAlert(true);
      return;
    }

    const payload = {
      type: promotion.type,
      value: promotion.value,
      value_type: promotion.value_type,
      value_currency: promotion.value_currency,
      start_date: promotion.start_date,
      end_date: promotion.end_date,
      name: promotion.name,
      minimum_amount: promotion.minimum_amount,
      maximum_amount: promotion.maximum_amount,
      products: promotion.embedded_discount_products.map(product => ({
        product_id: product.product_id,
      })),
      insurances: promotion.embedded_discount_insurances.map(insurance => ({
        insurance_id: insurance.insurance_id,
      })),
      plans: promotion.embedded_discount_plans.map(plan => ({
        plan_id: plan.plan_id,
      })),
      channels: promotion.embedded_discount_channels.map(channel => ({
        channel_id: channel.channel_id,
      })),
      vouchers: vouchers.map(voucher => ({
        code: voucher.code,
        usage_limit: voucher.usageLimit
      })),
    };

    setLoading(true);

    try {
      let voucherExists = false;
      let existingVoucherCodes: string[] = [];

      for (const element of payload.vouchers) {
        const voucherVerify = await voucherService.getVoucherByCode(element.code);
        const { data } = voucherVerify;

        if (data.length > 0 && data[0].code != null) {
          voucherExists = true;
          existingVoucherCodes.push(element.code);
        }
      }

      if (voucherExists) {
        setErrorMessage(`Voucher Code(s) ${existingVoucherCodes.join(', ')} already exist.`);
        setShowAlert(true);
      } else {
        const response: AxiosResponse<any> = await promotionService.createPromotion(payload);
        const { data } = response;

        // console.log("data: "+ response.data.data.data.error.code);
        if (promotion.type == "embedded") {

          if (data.data.data != null) {
            if (data.data.data.error.code === 409) {
              setErrorMessage("Unable to submit campaign, one or more plan has already been used by another embedded campaign.");
              setShowAlert(true);
              return;
            } else {

              planService.getSyncEmbeddedDiscount();

              setErrorMessage("Promotion Campaign Submitted!");
            }

          } else {
            setErrorMessage("Promotion Campaign Submitted!");
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
              router.push("/promotion");
            }, 2000);
          }
        }
        else {
          setErrorMessage("Promotion Campaign Submitted!");
        }

        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          router.push("/promotion");
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to save promotion:', error);
      setErrorMessage('Failed to create promotion. Please try again.');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };




  const handleSelectChannel = (selectedChannels: Channel[]) => {
    setPromotion(prevState => ({
      ...prevState,
      embedded_discount_channels: selectedChannels.map(channel => ({
        channel_id: channel.id,
        channel_name: channel.name
      }))
    }));
    setSelectedChannelIds(new Set(selectedChannels.map(channel => channel.id)));
    setIsModalOpen(false);
  };

  const handleSelectPlan = (newSelectedPlans: Plan[]) => {
    const updatedPlans = [...selectedPlans];

    newSelectedPlans.forEach(newPlan => {
      const existingPlan = updatedPlans.find(plan => plan.id === newPlan.id);
      if (!existingPlan) {
        updatedPlans.push(newPlan); // Add new plan if it hasn't been selected already
      }
    });

    setSelectedPlans(updatedPlans); // Update the state with all selected plans
    setSelectedPlanIds(new Set(updatedPlans.map(plan => plan.id))); // Sync modal checkboxes with textbox
  };



  const handleAddPlan = () => {
    setIsPlanModalOpen(true);
  };

  const handleRemovePlan = (index: number) => {
    const updatedPlans = [...selectedPlans];
    const removedPlan = updatedPlans.splice(index, 1)[0]; // Remove plan by index

    // Update selected plans state and also untick the corresponding checkbox in the modal
    setSelectedPlans(updatedPlans);
    setSelectedPlanIds(prevIds => {
      const updatedIds = new Set(prevIds);
      updatedIds.delete(removedPlan.id);
      return updatedIds;
    });
  };

  const handleRemoveVoucher = (index: number) => {
    setVouchers(prevVouchers => prevVouchers.filter((_, i) => i !== index));
  };

  const handleRemoveProduct = (index: number) => {
    setPromotion(prevState => {
      const removedProductId = prevState.embedded_discount_products[index].product_id;

      const updatedProducts = prevState.embedded_discount_products.filter((_, i) => i !== index);

      const updatedPlans = prevState.embedded_discount_plans.filter(plan =>
        updatedProducts.some(product => product.product_id === plan.plan_id)
      );

      const updatedSelectedPlanIds = new Set(selectedPlanIds);
      prevState.embedded_discount_plans.forEach(plan => {
        if (!updatedPlans.some(p => p.plan_id === plan.plan_id)) {
          updatedSelectedPlanIds.delete(plan.plan_id);
        }
      });

      return {
        ...prevState,
        embedded_discount_products: updatedProducts,
        embedded_discount_plans: updatedPlans,
      };
    });

    setSelectedProductIds(prevIds => {
      const updatedIds = new Set(prevIds);
      updatedIds.delete(promotion.embedded_discount_products[index].product_id);
      return updatedIds;
    });

    setHasProducts(products.length > 0);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1) {
      setCurrentPage(page);
    }
  };

  const handlePageChangeChannel = (page: number) => {
    if (page >= 1) {
      setCurrentPageChannel(page);
    }
  };

  const handlePageChangeIns = (page: number) => {
    if (page >= 1) {
      setCurrentPageIns(page);
    }
  };

  const handlePageChangePlans = (page: number) => {
    if (page >= 1 && page !== currentPagePlan) {
      setCurrentPagePlan(page);
      fetchPlansByProducts(Array.from(selectedProductIds), page, showPlansPerPage);
    }
  };

  const handlePlansPerPageChange = async (newPlansPerPage: number) => {
    setShowPlansPerPage(newPlansPerPage);
    setCurrentPagePlan(1);  // Reset to first page
    fetchPlansByProducts(Array.from(selectedProductIds), 1, newPlansPerPage);
  };


  const ErrorModal = ({ isOpen, message, onClose }: { isOpen: boolean, message: string, onClose: () => void }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-md w-1/3">
          <h2 className="text-lg font-semibold mb-4">Alert</h2>
          <p>{message}</p>
          <div className="flex justify-end mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={handleSave}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>Campaign</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit Campaign</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h2 className="text-black font-bold text-2xl mt-2">
              Create New Campaign
            </h2>
          </div>
          <div className="flex space-x-4">
            <div
              onClick={() => router.push('/promotion')}
              className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-6 py-3"
            >
              {loading ? <span>Saving...</span> : <FaSave className="mr-2" />}
              Submit
            </button>
          </div>
        </div>
        {showAlert && (
          <ErrorModal isOpen={showAlert} message={errorMessage!} onClose={() => setShowAlert(false)} />
        )}
        <ChannelSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleSelectChannel}
          selectedChannelIds={selectedChannelIds}
          channels={channels}
          onPageChangeChannel={handlePageChangeChannel}
        />
        <InsuranceSelectionModal
          isOpen={isInsuranceModalOpen}
          onClose={() => setIsInsuranceModalOpen(false)}
          onSelect={handleSelectInsurance}
          insurances={insurances}
          initialSelectedInsurances={promotion.embedded_discount_insurances.map(ins => ({
            id: ins.insurance_id,
            name: ins.insurance_name,
            brand: '',
            logo_url: ''
          }))}
          onPageChange={handlePageChangeIns}
        />
        <ProductSelectionModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onSelect={handleSelectProduct}
          products={products}
          selectedProductIds={selectedProductIds}
          initialSelectedProductIds={new Set(promotion.embedded_discount_products.map(p => p.product_id))}
          onPageChange={handlePageChange}
        />
        <PlanSelectionModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          onSelect={handleSelectPlan}
          plans={plans}
          products={promotion.embedded_discount_products.map(p => ({
            id: p.product_id,
            name: p.product_name,
          }))}
          preSelectedPlanIds={new Set(selectedPlans.map(plan => plan.id))} // Pre-select already selected plans
          selectedProductIds={new Set(promotion.embedded_discount_products.map(p => p.product_id))}
          onPageChangePlan={handlePageChangePlans}
          totalPlanItems={totalPlanItems}
          pagePlan={currentPagePlan}
          showPlansPerPage={showPlansPerPage}
          onPlansPerPageChange={handlePlansPerPageChange}
        />


        {/* Create New Campaign */}
        <div className="flex space-x-4 mb-4">
          <div className="flex flex-col w-1/2">
            <label htmlFor="name" className="font-normal">Promotion Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={promotion.name}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label htmlFor="type" className="font-normal">Type</label>
            <select
              id="type"
              name="type"
              value={promotion.type}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            >
              <option value="embedded">Embedded</option>
              <option value="voucher">Voucher</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          <div className="flex flex-col w-1/2">
            <label htmlFor="start_date" className="font-normal">Start Date</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={promotion.start_date}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label htmlFor="end_date" className="font-normal">End Date</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={promotion.end_date}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required
            />
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          <div className="flex flex-col w-1/2">
            <label htmlFor="value_type" className="font-normal">Value Type</label>
            <select
              id="value_type"
              name="value_type"
              value={promotion.value_type}
              onChange={handleValueTypeChange}
              className="p-2 border rounded w-full"
            >
              <option value="fixed">Fixed</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>
          <div className="flex flex-col w-1/2">
            <label htmlFor="value" className="font-normal">Value</label>
            <input
              type="number"
              id="value"
              name="value"
              value={promotion.value}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required
            />
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          <div className="flex flex-col w-1/2">
            <label htmlFor="minimum_amount" className="font-normal">Minimum Amount</label>
            <input
              type="number"
              id="minimum_amount"
              name="minimum_amount"
              value={promotion.minimum_amount}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label htmlFor="maximum_amount" className="font-normal">Maximum Amount</label>
            <input
              type="number"
              id="maximum_amount"
              name="maximum_amount"
              value={promotion.maximum_amount}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex space-x-4 mb-4">
            <div className="flex flex-col w-full">
              <label htmlFor="value_currency" className="font-normal">Currency</label>
              <select
                id="value_currency"
                name="value_currency"
                value={promotion.value_currency}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              >
                {CURRENCIES.map(currency => (
                  <option key={currency.code} value={currency.code}>{currency.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Channels Section */}
          <div>
            <label className="font-normal">Channels</label>
            <div className="flex items-start mt-2">
              <div className="border rounded bg-white overflow-y-auto flex-grow mr-2 h-32">
                <div className="flex flex-wrap p-2">
                  {promotion.embedded_discount_channels.length > 0 ? (
                    promotion.embedded_discount_channels.map((channel, index) => (
                      <div key={index} className="flex items-center mb-1 mr-1 border border-gray-300 rounded p-1">
                        <span className="h-auto max-w-xs overflow-hidden text-ellipsis whitespace-normal">
                          {channel.channel_name || 'Unknown Channel'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem('embedded_discount_channels', index)}
                          className="text-red-500 ml-1"
                        >
                          X
                        </button>
                      </div>
                    ))
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
          <div>
            <label className="font-normal">Insurances</label>
            <div className="flex items-start mt-2">
              <div className="border rounded bg-white overflow-y-auto flex-grow mr-2 h-32">
                <div className="flex flex-wrap p-2">
                  {promotion.embedded_discount_insurances.length > 0 ? (
                    promotion.embedded_discount_insurances.map((insurance, index) => (
                      <div key={index} className="flex items-center mb-1 mr-1 border border-gray-300 rounded p-1">
                        <span className="h-auto max-w-xs overflow-hidden text-ellipsis whitespace-normal">
                          {insurance.insurance_name || 'Unknown Insurance'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem('embedded_discount_insurances', index)}
                          className="text-red-500 ml-1"
                        >
                          X
                        </button>
                      </div>
                    ))
                  ) : (
                    <span>No insurances added</span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 flex justify-center items-center">
                <button
                  type="button"
                  onClick={() => setIsInsuranceModalOpen(true)}
                  className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 h-10 flex items-center w-40"
                >
                  <FaPlus className="mr-2" />
                  Insurance
                </button>
              </div>
            </div>
          </div>


          {/* Products Section */}
          <div>
            <label className="font-normal">Products</label>
            <div className="flex items-start mt-2">
              <div className="border rounded bg-white overflow-y-auto flex-grow mr-2 h-32">
                <div className="flex flex-wrap p-2">
                  {promotion.embedded_discount_products.length > 0 ? (
                    promotion.embedded_discount_products.map((product, index) => (
                      <div key={index} className="flex items-center mb-1 mr-1 border border-gray-300 rounded p-1">
                        <span className="h-auto max-w-xs overflow-hidden text-ellipsis whitespace-normal">
                          {product.product_name || 'Unknown Product'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(index)}
                          className="text-red-500 ml-1"
                        >
                          X
                        </button>
                      </div>
                    ))
                  ) : (
                    <span>No products added</span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 flex justify-center items-center">
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className={`bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 h-10 flex items-center w-40 ${isProductButtonDisabled ? 'bg-gray-500 text-white cursor-not-allowed' : ''}`}
                  disabled={isProductButtonDisabled}
                >
                  <FaPlus className="mr-2" />
                  Product
                </button>
              </div>
            </div>
          </div>


          {/* Plans Section */}
          <div>
            <label className="font-normal">Plans</label>
            <div className="flex items-start mt-2">
              <div className="border rounded bg-white overflow-y-auto flex-grow mr-2 h-32">
                <div className="flex flex-wrap p-2">
                  {selectedPlans.length > 0 ? (
                    selectedPlans.map((plan, index) => (
                      <div key={index} className="flex items-center mb-1 mr-1 border border-gray-300 rounded p-1">
                        <span className="h-auto max-w-xs overflow-hidden text-ellipsis whitespace-normal">
                          {plan.name} {/* Displaying plan name from selectedPlans */}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemovePlan(index)}  // Remove plan by index
                          className="text-red-500 ml-1"
                        >
                          X
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
                  className={`bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 h-10 flex items-center w-40 ${promotion.embedded_discount_products.length > 0 ? '' : 'bg-gray-500 text-white cursor-not-allowed'
                    }`}
                  disabled={promotion.embedded_discount_products.length === 0}
                >
                  <FaPlus className="mr-2" />
                  Plan
                </button>
              </div>
            </div>
          </div>

          {/* Vouchers Section */}
          <div className="my-4" />
          <div>
            {promotion.type === 'voucher' && (
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
                    onChange={(e) => setVoucherUsageLimit(Number(e.target.value))}
                    className="p-2 border rounded ml-2 w-24"
                    placeholder="Usage limit"
                    min={1}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddVoucher(voucherCode, voucherUsageLimit)}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                    disabled={!voucherCode || voucherUsageLimit <= 0}
                  >
                    Add Voucher
                  </button>
                </div>
                <div className="mt-4">
                  {vouchers.map((voucher, index) => (
                    <div key={index} className="flex items-center mt-2">
                      <span className="mr-2">{voucher.code} (Usage Limit: {voucher.usageLimit})</span>
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


      </form>
    </div>
  );
};

const CreatePromotionPageWithSidebar = (params: any) =>
  WithSidebar(CreatePromotionPage)(params);
export default CreatePromotionPageWithSidebar;


