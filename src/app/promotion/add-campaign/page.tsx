"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PromotionService } from "@/services/promotion.service";
import { FaSave, FaTimes, FaChevronLeft, FaChevronRight, FaTrash } from "react-icons/fa";
import WithSidebar from "@/hoc/with-sidebar";
import { EmbeddedDiscountInsurance, PromotionDetails } from "../dto/promotion.details.dto";
import { ChannelService } from "@/services/channel.services";
import { InsuranceService } from "@/services/insurance.services";
import { ProductService } from "@/services/product.services";
import { PlanService } from "@/services/plan.services";
import { Insurance, Plan, Product } from "../dto/promotion.dto";
import ChannelSelectionModal from "../components/channel-selection-modal";
import InsuranceSelectionModal from "../components/insurance-selection-modal";
import ProductSelectionModal from "../components/product-selection-modal";
import PlanSelectionModal from "../components/plan-selection-modal";

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
  pageTotal: number;
  page: number;
}

const CreatePromotionPage = () => {
  const router = useRouter();
  const promotionService = new PromotionService();
  const channelService = new ChannelService();
  const insuranceService = new InsuranceService();
  const productService = new ProductService();
  const planService = new PlanService();

  const [products, setProducts] = useState<Product[]>([]);
  const [hasProducts, setHasProducts] = useState(false);
  const [promotion, setPromotion] = useState<PromotionDetails>({
    campaign_id: "",
    name: "",
    type: "embedded",
    start_date: "",
    end_date: "",
    value: 0,
    active: true,
    value_currency: 'IDR',
    minimum_amount: 0,
    maximum_amount: 0,
    embedded_discount_channels: [],
    embedded_discount_insurances: [],
    embedded_discount_plans: [],
    embedded_discount_products: [],
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channels, setChannels] = useState<ChannelResponseDTO | undefined>(undefined);
  const [selectedChannelIds, setSelectedChannelIds] = useState<Set<string>>(new Set());
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [selectedInsuranceIds, setSelectedInsuranceIds] = useState<Set<string>>(new Set());
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanIds, setSelectedPlanIds] = useState<Set<string>>(new Set());
  const [selectedInsurances, setSelectedInsurances] = useState<any[]>([]);

  useEffect(() => {
    fetchChannels(1);
  }, []);

  useEffect(() => {
    fetchInsurances();
  }, []);

  useEffect(() => {
    if (selectedInsuranceIds.size > 0) {
      fetchProductsByInsurances(Array.from(selectedInsuranceIds));
    } else {
      setProducts([]);
      setHasProducts(false);
    }
  }, [selectedInsuranceIds]);

  useEffect(() => {
    if (selectedProductIds.size > 0) {
      fetchPlansByProducts(Array.from(selectedProductIds));
    } else {
      setPlans([]);
      setSelectedPlanIds(new Set());
    }
  }, [selectedProductIds]);


  const fetchPlansByProducts = async (productIds: string[]) => {
    if (productIds.length === 0) {
      setPlans([]);
      return;
    }

    try {
      const responses = await Promise.all(
        productIds.map(id => planService.getPlansByProductId(id))
      );

      const allPlans = responses.flat();
      setPlans(allPlans);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      setPlans([]);
    }
  };

  const fetchChannels = async (page: number) => {
    try {
      const response = await channelService.getChannels(page);
      setChannels(response);
    } catch (error) {
      console.error("Failed to fetch channels:", error);
    }
  };

  const fetchInsurances = async () => {
    try {
      const response = await insuranceService.getInsurances();
      setInsurances(response);
    } catch (error) {
      console.error("Failed to fetch insurances:", error);
    }
  };

  const fetchProductsByInsurances = async (insuranceIds: string[]) => {
    if (insuranceIds.length === 0) {
      setProducts([]);
      setHasProducts(false);
      return;
    }

    try {
      const responses = await Promise.all(
        insuranceIds.map(id => productService.getProductByInsuranceId(id))
      );

      const allProducts = responses.flat();
      setProducts(allProducts);
      setHasProducts(allProducts.length > 0);
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

  const handleSelectProduct = (selectedProducts: Product[]) => {
    console.log('Selected Products:', selectedProducts);
    setPromotion(prevState => ({
      ...prevState,
      embedded_discount_products: selectedProducts.map(product => ({
        product_id: product.id,
        product_name: product.name
      }))
    }));
    setSelectedProductIds(new Set(selectedProducts.map(product => product.id)));
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
        fetchProductsByInsurances(updatedArray.map(ins => ins.insurance_id));

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



  const handleSave = async () => {
    if (!promotion.name || !promotion.type || !promotion.start_date || !promotion.end_date) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      // await promotionService.createPromotion(promotion);
      router.push('/promotions');
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

  const handleSelectPlan = (selectedPlans: Plan[]) => {
    setPromotion(prevState => ({
      ...prevState,
      embedded_discount_plans: selectedPlans.map(plan => ({
        plan_id: plan.id,
        plan_name: plan.name
      }))
    }));
    setIsPlanModalOpen(false);
  };

  const handleAddPlan = () => {
    setIsPlanModalOpen(true);
  };

  const handleRemovePlan = (index: number) => {
    setPromotion(prevState => {
      const removedPlanId = prevState.embedded_discount_plans[index].plan_id;

      const updatedPlans = prevState.embedded_discount_plans.filter((_, i) => i !== index);
      const updatedSelectedPlanIds = new Set(selectedPlanIds);
      updatedSelectedPlanIds.delete(removedPlanId);

      return {
        ...prevState,
        embedded_discount_plans: updatedPlans,
      };
    });

    setSelectedPlanIds(prevIds => {
      const updatedIds = new Set(prevIds);
      updatedIds.delete(promotion.embedded_discount_plans[index].plan_id);
      return updatedIds;
    });
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
    fetchChannels(page);
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
      <h1 className="text-2xl font-bold mb-4">Create New Promotion Campaign</h1>
      {showAlert && (
        <ErrorModal isOpen={showAlert} message={errorMessage!} onClose={() => setShowAlert(false)} />
      )}
      <ChannelSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectChannel}
        selectedChannelIds={selectedChannelIds}
        channels={channels}
        onPageChange={handlePageChange}
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
      />
      <ProductSelectionModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSelect={handleSelectProduct}
        products={products}
        selectedProductIds={selectedProductIds}
        initialSelectedProductIds={new Set(promotion.embedded_discount_products.map(p => p.product_id))}
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
        preSelectedPlanIds={new Set(promotion.embedded_discount_plans.map(plan => plan.plan_id))}
        selectedProductIds={new Set(promotion.embedded_discount_products.map(p => p.product_id))}
      />
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Promotion Name</label>
        <input
          type="text"
          name="name"
          value={promotion.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Promotion Type</label>
        <select
          name="type"
          value={promotion.type}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="embedded">Embedded</option>
          {/* Add other promotion types if needed */}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Start Date</label>
        <input
          type="date"
          name="start_date"
          value={promotion.start_date}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">End Date</label>
        <input
          type="date"
          name="end_date"
          value={promotion.end_date}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Discount Value</label>
        <input
          type="number"
          name="value"
          value={promotion.value}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Currency</label>
        <select
          name="value_currency"
          value={promotion.value_currency}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          {CURRENCIES.map(currency => (
            <option key={currency.code} value={currency.code}>{currency.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Minimum Amount</label>
        <input
          type="number"
          name="minimum_amount"
          value={promotion.minimum_amount}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Maximum Amount</label>
        <input
          type="number"
          name="maximum_amount"
          value={promotion.maximum_amount}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Channels</label>
        <button
          type="button"
          onClick={handleAddChannel}
          className="p-2 bg-blue-500 text-white rounded-md"
        >
          Add Channel
        </button>
        {promotion.embedded_discount_channels.map((channel, index) => (
          <div key={index} className="flex items-center mt-2">
            <span className="text-sm">{channel.channel_name}</span>
            <button
              type="button"
              onClick={() => handleRemoveArrayItem('embedded_discount_channels', index)}
              className="ml-2 text-red-500"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Insurances</label>
        <button
          type="button"
          onClick={() => setIsInsuranceModalOpen(true)}
          className="p-2 bg-blue-500 text-white rounded-md"
        >
          Add Insurance
        </button>
        {promotion.embedded_discount_insurances.map((insurance, index) => (
          <div key={index} className="flex items-center mt-2">
            <span className="text-sm">{insurance.insurance_name}</span>
            <button
              type="button"
              onClick={() => handleRemoveArrayItem('embedded_discount_insurances', index)}
              className="ml-2 text-red-500"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Products</label>
        <button
          type="button"
          onClick={handleAddProduct}
          className={`p-2 rounded-md ${isProductButtonDisabled ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-blue-500 text-white'}`}
          disabled={isProductButtonDisabled}
        >
          Add Product
        </button>
        {promotion.embedded_discount_products.map((product, index) => (
          <div key={index} className="flex items-center mt-2">
            <span className="text-sm">{product.product_name}</span>
            <button
              type="button"
              onClick={() => handleRemoveProduct(index)}
              className="ml-2 text-red-500"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Plans</label>
        <button
          type="button"
          onClick={handleAddPlan}
          className={`p-2 rounded-md ${promotion.embedded_discount_products.length > 0 ? 'bg-blue-500' : 'bg-gray-500'} text-white ${promotion.embedded_discount_products.length > 0 ? 'hover:bg-blue-600' : 'cursor-not-allowed'} ${promotion.embedded_discount_products.length === 0 ? 'cursor-not-allowed' : ''}`}
          disabled={promotion.embedded_discount_products.length === 0}
        >
          Add Plan
        </button>
        {promotion.embedded_discount_plans.map((plan, index) => {
          const planDetail = plans.find(p => p.id === plan.plan_id);
          return (
            <div key={index} className="flex items-center mt-2">
              <span className="text-sm">{planDetail ? planDetail.name : 'Unknown Plan'}</span>
              <button
                type="button"
                onClick={() => handleRemovePlan(index)}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? <span>Saving...</span> : <FaSave className="mr-2" />}
          Save
        </button>
        <button
          onClick={() => router.push('/promotions')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-4"
        >
          <FaTimes className="mr-2" />
          Cancel
        </button>
      </div>
    </div>
  );
};

const CreatePromotionPageWithSidebar = (params: any) =>
  WithSidebar(CreatePromotionPage)(params);
export default CreatePromotionPageWithSidebar;


