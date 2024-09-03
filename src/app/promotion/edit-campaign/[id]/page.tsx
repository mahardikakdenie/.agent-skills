"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PromotionService } from "@/services/promotion.service";
import { format, parseISO, isValid } from "date-fns";
import { FaSave, FaTimes, FaTrash } from "react-icons/fa";
import WithSidebar from "@/hoc/with-sidebar";
import { PromotionDetails } from "../../dto/promotion.details.dto";
import ChannelSelectionModal from "../../components/channel-selection-modal";
import InsuranceSelectionModal from "../../components/insurance-selection-modal";
import { ChannelService } from "@/services/channel.services";
import { InsuranceService } from "@/services/insurance.services";
import { ProductService } from "@/services/product.services";
import ProductSelectionModal from "../../components/product-selection-modal";
import { Channel, ChannelResponseDTO, Insurance, Plan, Product } from "../../dto/promotion.dto";
import { PlanService } from "@/services/plan.services";
import PlanSelectionModal from "../../components/plan-selection-modal";
import axios, { AxiosResponse } from "axios";
import { VoucherService } from "@/services/voucher.services";

const EditPromotionPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const promotionService = new PromotionService();
  const channelService = new ChannelService();
  const insuranceService = new InsuranceService();
  const productService = new ProductService();
  const planService = new PlanService();
  const voucherService = new VoucherService();

  const [promotion, setPromotion] = useState<PromotionDetails>({
    campaign_id: "",
    name: "",
    type: "",
    start_date: "",
    end_date: "",
    value: 0,
    active: true,
    value_currency: "",
    minimum_amount: 0,
    maximum_amount: 0,
    embedded_discount_channels: [],
    embedded_discount_insurances: [],
    embedded_discount_plans: [],
    embedded_discount_products: [],
  });
  const [loading, setLoading] = useState(true);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [channels, setChannels] = useState<ChannelResponseDTO>();
  const [insurances, setInsurances] = useState<any[]>([]);
  const [selectedInsurances, setSelectedInsurances] = useState<any[]>([]);
  const [selectedChannelIds, setSelectedChannelIds] = useState<Set<string>>(new Set());
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<any[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [hasProducts, setHasProducts] = useState(false);
  const [selectedPlanIds, setSelectedPlanIds] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [voucherDetails, setVoucherDetails] = useState<any>(null);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [voucherCode, setVoucherCode] = useState<string>('');


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

  useEffect(() => {
    if (promotion.embedded_discount_insurances.length > 0) {
      setSelectedInsurances(
        promotion.embedded_discount_insurances.map(ins => ({
          id: ins.insurance_id,
          name: ins.insurance_name,
        }))
      );
    }
  }, [promotion.embedded_discount_insurances]);

  useEffect(() => {
    if (promotion.embedded_discount_products.length > 0) {
      fetchPlansByProducts(promotion.embedded_discount_products.map(p => p.product_id));
    }
  }, [promotion.embedded_discount_products]);

  useEffect(() => {
    if (params.id) {
      promotionService.getPromotionCampaignById(params.id as string)
        .then((res) => {
          const promotionData: PromotionDetails = res.data[0];
          console.log('Fetched Promotion Data:', promotionData);
          setPromotion(promotionData);
          fetchProductsByInsurances(promotionData.embedded_discount_insurances.map(ins => ins.insurance_id));
          setLoading(false);

          if (promotionData.type === "voucher") {
            voucherService.getVoucherByCampaignId(promotionData.campaign_id)
              .then(voucherRes => {
                setVoucherDetails(voucherRes.data);
              })
              .catch(error => {
                console.error("Failed to fetch voucher details:", error);
              });
          }
        })
        .catch(error => {
          console.error("Failed to fetch promotion details:", error);
          setLoading(false);
        });
    }
    fetchChannels(1);
    fetchInsurances();
  }, [params.id]);



  useEffect(() => {
    if (selectedInsurances.length > 0) {
      fetchProductsByInsurances(selectedInsurances.map(ins => ins.id));
    } else {
      setProducts([]);
    }
  }, [selectedInsurances]);

  const handlePageChange = (page: number) => {
    fetchChannels(page);
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
      setInsurances(response as Insurance[]);
    } catch (error) {
      console.error("Failed to fetch insurances:", error);
    }
  };


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
      setHasProducts(false);
    }
  };

  const handleAddPlan = () => {
    if (promotion.embedded_discount_products.length > 0) {
      setIsPlanModalOpen(true);
    } else {
      alert('Please add at least one product before adding plans.');
    }
  };

  const isCheckbox = (element: HTMLInputElement | HTMLSelectElement): element is HTMLInputElement => {
    return element.type === 'checkbox';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, value } = target;

    if (isCheckbox(target)) {
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

  const handleSelectPlan = (selectedPlans: Plan[]) => {
    const selectedPlanIds = new Set(selectedPlans.map(plan => plan.id));
    setPromotion(prevState => ({
      ...prevState,
      embedded_discount_plans: selectedPlans.map(plan => ({
        plan_id: plan.id,
      })),
    }));
    setSelectedPlanIds(selectedPlanIds);
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

    setSelectedPlanIds(new Set());
  };

  const handleAddVoucher = (code: string) => {
    if (code.trim()) {
      setVouchers(prevVouchers => [...prevVouchers, { code }]);
      setVoucherCode('');
    }
  };

  const handleRemoveVoucher = (index: number) => {
    setVouchers(prevVouchers => prevVouchers.filter((_, i) => i !== index));
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

  const handleAddChannel = () => {
    setSelectedChannelIds(new Set(promotion.embedded_discount_channels.map(channel => channel.channel_id)));
    setIsChannelModalOpen(true);
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
    setIsChannelModalOpen(false);
  };


  const handleAddInsurance = () => {
    setIsInsuranceModalOpen(true);
  };

  const handleSelectInsurance = (selectedInsurances: Insurance[]) => {
    const updatedInsurances = selectedInsurances.map(ins => ({
      insurance_id: ins.id,
      insurance_name: ins.name,
      id: ins.id,
      name: ins.name
    }));

    console.log('Updated Insurances:', updatedInsurances);

    setPromotion(prevState => ({
      ...prevState,
      embedded_discount_insurances: updatedInsurances,
      embedded_discount_products: [],
    }));

    setSelectedInsurances(selectedInsurances);
    setIsInsuranceModalOpen(false);
  };

  const handleAddProduct = () => {
    if (selectedInsurances.length > 0) {
      setIsProductModalOpen(true);
    } else {
      alert('Please select at least one insurance before adding products.');
    }
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


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      type: promotion.type,
      value: promotion.value,
      start_date: promotion.start_date,
      end_date: promotion.end_date,
      name: promotion.name,
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
      })),
    };

    try {
      if (promotion.type === "voucher" && !promotion.active && vouchers.length > 0) {
        const campaign_id = params.id;

        for (const voucher of vouchers) {
          try {
            const newVoucher = {
              code: voucher.code,
              campaign_id,
            };

            await voucherService.createVoucher(newVoucher);
          } catch (voucherError) {
            console.error("Failed to create voucher:", voucherError);
            setErrorMessage("Failed to create one or more vouchers.");
            return;
          }
        }
      }

      // Update the promotion
      const response: AxiosResponse<any> = await promotionService.updatePromotionCampaign(params.id, payload);
      const { data } = response;

      if (data.data != null) {
        if (data.data.error.code === 409) {
          setErrorMessage("The plan has already been used by another embedded campaign.");
        } else {
          setAlertMessage("Promotion updated successfully!");
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
            router.push("/promotion");
          }, 2000);
        }
      } else {
        setAlertMessage("Promotion updated successfully!");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          router.push("/promotion");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to update promotion:", error);
      setErrorMessage("Failed to update promotion.");
    }
  };




  const handleCancel = () => {
    router.push("/promotion");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd') : '';
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full p-6 m-2 bg-white rounded shadow-md">
      <h1 className="text-2xl font-semibold">Edit Promotion Campaign</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields */}
        <div className="flex items-center">
          <label htmlFor="name" className="w-1/4 font-semibold">Campaign Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={promotion.name}
            onChange={handleChange}
            className="w-3/4 p-2 border rounded"
            required
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="type" className="w-1/4 font-semibold">Type:</label>
          <input
            id="type"
            name="type"
            type="text"
            value={promotion.type}
            onChange={handleChange}
            className={`w-3/4 p-2 rounded ${promotion.active ? 'border-none bg-gray-100' : 'border border-gray-300'}`}
            required
            disabled={promotion.active}
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="type" className="w-1/4 font-semibold">Currency:</label>
          <input
            id="value_currency"
            name="value_currency"
            type="text"
            value={promotion.value_currency}
            onChange={handleChange}
            className={`w-3/4 p-2 rounded ${promotion.active ? 'border-none bg-gray-100' : 'border border-gray-300'}`}
            required
            disabled
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="value" className="w-1/4 font-semibold">Value:</label>
          <input
            id="value"
            name="value"
            type="number"
            value={promotion.value}
            onChange={handleChange}
            className="w-3/4 p-2 border rounded"
            required
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="start_date" className="w-1/4 font-semibold">Start Date:</label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            value={formatDate(promotion.start_date)}
            onChange={handleChange}
            className="w-3/4 p-2 border rounded"
            required
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="end_date" className="w-1/4 font-semibold">End Date:</label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            value={formatDate(promotion.end_date)}
            onChange={handleChange}
            className="w-3/4 p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="font-semibold">Status:</label>
          <span className={`ml-2 ${promotion.active ? 'text-green-500' : 'text-red-500'}`}>
            {promotion.active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Channels */}
        <div>
          <label className="font-semibold">Channels:</label>
          <button
            type="button"
            onClick={handleAddChannel}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Channel
          </button>
          {promotion.embedded_discount_channels.map((channel, index) => {
            const channelDetail = channels?.data.find(c => c.id === channel.channel_id);
            return (
              <div key={index} className="flex items-center mt-2">
                <span className="mr-2">{channelDetail ? channelDetail.name : 'Unknown Channel'}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('embedded_discount_channels', index)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            );
          })}
        </div>


        {/* Insurances */}
        <div>
          <label className="font-semibold">Insurances:</label>
          <button
            type="button"
            onClick={handleAddInsurance}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Insurance
          </button>
          {promotion.embedded_discount_insurances.map((insurance, index) => {
            const selectedInsurance = insurances.find(ins => ins.id === insurance.insurance_id);
            return (
              <div key={index} className="flex items-center mt-2">
                <span className="mr-2">{selectedInsurance ? selectedInsurance.name : insurance.insurance_id}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('embedded_discount_insurances', index)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            );
          })}
        </div>

        {/* Products */}
        <div>
          <label className="font-semibold">Products:</label>
          <button
            type="button"
            onClick={handleAddProduct}
            className={`ml-2 px-4 py-2 ${selectedInsurances.length > 0 ? 'bg-blue-500' : 'bg-gray-500'} text-white rounded`}
            disabled={selectedInsurances.length === 0}
          >
            Add Product
          </button>
          {promotion.embedded_discount_products.map((product, index) => {
            const productDetail = products.find(p => p.id === product.product_id);
            return (
              <div key={index} className="flex items-center mt-2">
                <span className="mr-2">{productDetail ? productDetail.name : 'Unknown Product'}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(index)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            );
          })}
        </div>

        {/* Plans */}
        <div>
          <label className="font-semibold">Plans:</label>
          <button
            type="button"
            onClick={handleAddPlan}
            className={`ml-2 px-4 py-2 ${promotion.embedded_discount_products.length > 0 ? 'bg-blue-500' : 'bg-gray-500'} text-white rounded`}
            disabled={promotion.embedded_discount_products.length === 0}
          >
            Add Plan
          </button>
          {promotion.embedded_discount_plans.map((plan, index) => {
            const planDetail = plans.find(p => p.id === plan.plan_id);
            return (
              <div key={index} className="flex items-center mt-2">
                <span className="mr-2">{planDetail ? planDetail.name : 'Unknown Plan'}</span>
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

        {/* Vouchers */}
        <div>
          {promotion.type === 'voucher' && (
            <div>
              <label className="font-semibold">Vouchers:</label>
              {!promotion.active ? (
                <>
                  <div className="flex items-center mt-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      className="p-2 border rounded"
                      placeholder="Enter voucher code"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddVoucher(voucherCode)}
                      className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                      disabled={!voucherCode}
                    >
                      Add Voucher
                    </button>
                  </div>
                  <div className="mt-4">
                    {vouchers.map((voucher, index) => (
                      <div key={index} className="flex items-center mt-2">
                        <span className="mr-2">{voucher.code}</span>
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
                </>
              ) : (
                <p className="text-red-500">Cannot add vouchers while the promotion is active.</p>
              )}
            </div>
          )}
        </div>


        {promotion.type === "voucher" && voucherDetails && (
          <div className="bg-gray-100 p-4 rounded shadow-md mt-4">
            <h2 className="text-lg font-semibold">Voucher Details</h2>
            {Array.isArray(voucherDetails) ? (
              voucherDetails.map((voucher, index) => (
                <div key={index} className="mb-4 p-4 bg-white rounded shadow-sm">
                  <h3 className="text-md font-semibold">Voucher {index + 1}</h3>
                  <div className="flex items-center mt-2">
                    <label className="w-1/4 font-semibold">Campaign ID:</label>
                    <span className="w-3/4">{voucher.campaign_id}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-1/4 font-semibold">Code:</label>
                    <span className="w-3/4">{voucher.code}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-1/4 font-semibold">Usage Limit:</label>
                    <span className="w-3/4">{voucher.usage_limit}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-1/4 font-semibold">Used Count:</label>
                    <span className="w-3/4">{voucher.used_count}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-white rounded shadow-sm">
                <div className="flex items-center mt-2">
                  <label className="w-1/4 font-semibold">Campaign ID:</label>
                  <span className="w-3/4">{voucherDetails.campaign_id}</span>
                </div>
                <div className="flex items-center mt-2">
                  <label className="w-1/4 font-semibold">Code:</label>
                  <span className="w-3/4">{voucherDetails.code}</span>
                </div>
                <div className="flex items-center mt-2">
                  <label className="w-1/4 font-semibold">Usage Limit:</label>
                  <span className="w-3/4">{voucherDetails.usage_limit}</span>
                </div>
                <div className="flex items-center mt-2">
                  <label className="w-1/4 font-semibold">Used Count:</label>
                  <span className="w-3/4">{voucherDetails.used_count}</span>
                </div>
              </div>
            )}
          </div>
        )}


        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded flex items-center"
          >
            <FaSave className="mr-2" />
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded flex items-center"
          >
            <FaTimes className="mr-2" />
            Cancel
          </button>
        </div>
      </form>

      {/* Alert Popup */}
      {showAlert && (
        <div className="alert">
          {alertMessage}
        </div>
      )}

      {/* Error Modal */}
      {errorMessage && (
        <ErrorModal
          isOpen={!!errorMessage}
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}

      {/* Channel Modal */}
      {isChannelModalOpen && (
        <ChannelSelectionModal
          isOpen={isChannelModalOpen}
          onClose={() => setIsChannelModalOpen(false)}
          onSelect={handleSelectChannel}
          channels={channels}
          onPageChange={handlePageChange}
          selectedChannelIds={selectedChannelIds}
        />
      )}

      {/* Insurance Modal */}
      {isInsuranceModalOpen && (
        <InsuranceSelectionModal
          isOpen={isInsuranceModalOpen}
          onClose={() => setIsInsuranceModalOpen(false)}
          onSelect={handleSelectInsurance}
          insurances={insurances}
          initialSelectedInsurances={promotion.embedded_discount_insurances.map(ins => ({
            id: ins.insurance_id,
            name: ins.insurance_name,
            brand: '',
            logo_url: '',
          }))}
        />
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <ProductSelectionModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onSelect={handleSelectProduct}
          products={products}
          selectedProductIds={selectedProductIds}
          initialSelectedProductIds={new Set(promotion.embedded_discount_products.map(p => p.product_id))}
        />
      )}

      {/* Plan Modal */}
      {isPlanModalOpen && (
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
      )}

    </div>
  );
};

const EditPromotionPageWithSidebar = (params: any) =>
  WithSidebar(EditPromotionPage)(params);
export default EditPromotionPageWithSidebar;