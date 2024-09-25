"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PromotionService } from "@/services/promotion.service";
import { format, parseISO, isValid } from "date-fns";
import { FaSave, FaTimes, FaTrash } from "react-icons/fa";
import WithSidebar from "@/hoc/with-sidebar";
import { EmbeddedDiscountInsurance, PromotionDetails } from "../../dto/promotion.details.dto";
import ChannelSelectionModal from "../../components/channel-selection-modal";
import InsuranceSelectionModal from "../../components/insurance-selection-modal";
import { ChannelService } from "@/services/channel.services";
import { InsuranceService } from "@/services/insurance.services";
import { ProductService } from "@/services/product.services";
import ProductSelectionModal from "../../components/product-selection-modal";
import { Channel, ChannelResponseDTO, Insurance, InsuranceResponseDTO, Plan, Product } from "../../dto/promotion.dto";
import { PlanService } from "@/services/plan.services";
import PlanSelectionModal from "../../components/plan-selection-modal";
import axios, { AxiosResponse } from "axios";
import { VoucherService } from "@/services/voucher.services";
import { ChevronLeft } from "react-feather";
import { FaCheck, FaPlus } from 'react-icons/fa';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channels, setChannels] = useState<ChannelResponseDTO | undefined>(undefined);
  const [insurances, setInsurances] = useState<InsuranceResponseDTO | undefined>(undefined);
  const [selectedInsurances, setSelectedInsurances] = useState<any[]>([]);
  const [selectedChannelIds, setSelectedChannelIds] = useState<Set<string>>(new Set());
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [hasProducts, setHasProducts] = useState(false);
  const [selectedPlanIds, setSelectedPlanIds] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [voucherDetails, setVoucherDetails] = useState<any>(null);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [voucherUsageLimit, setVoucherUsageLimit] = useState<number>(1);
  const [selectedInsuranceIds, setSelectedInsuranceIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [showPlansPerPage, setShowPlansPerPage] = useState(10);
  const [currentPagePlan, setCurrentPagePlan] = useState(1);
  const [totalPlanItems, setTotalPlanItems] = useState(0);
  const [currentPageIns, setCurrentPageIns] = useState(1);
  const [currentPageChannel, setCurrentPageChannel] = useState(1);

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
      fetchPlansByProducts(promotion.embedded_discount_products.map(p => p.product_id), currentPagePlan, showPlansPerPage);
    }
  }, [promotion.embedded_discount_products]);

  useEffect(() => {
    if (params.id) {
      promotionService.getPromotionCampaignById(params.id as string)
        .then((res) => {
          const promotionData: PromotionDetails = res.data[0];
          console.log('Fetched Promotion Data:', promotionData);
          setPromotion(promotionData);
          fetchProductsByInsurances(promotionData.embedded_discount_insurances.map(ins => ins.insurance_id), currentPageIns);
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
          console.log("product: " + promotionData.embedded_discount_products[0].product_id);
        })
        .catch(error => {
          console.error("Failed to fetch promotion details:", error);
          setLoading(false);
        });
    }
    // fetchChannels(1);
    // fetchInsurances(1);
  }, [params.id]);

  useEffect(() => {
    fetchInsurances(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchChannels(currentPage);
  }, [currentPage]);



  useEffect(() => {
    if (selectedInsurances.length > 0) {
      fetchProductsByInsurances(selectedInsurances.map(ins => ins.id), currentPageIns);
    } else {
      setProducts([]);
    }
  }, [selectedInsurances]);

  const handlePageChange = (page: number) => {
    if (page >= 1) {
      setCurrentPage(page);
    }
  };

  const existingChannelIds = new Set(promotion.embedded_discount_channels.map(channel => channel.channel_id));

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

  const handlePlansPerPageChange = async (newPlansPerPage: number) => {
    setShowPlansPerPage(newPlansPerPage);
    setCurrentPagePlan(1);  // Reset to first page
    fetchPlansByProducts(Array.from(selectedProductIds), 1, newPlansPerPage);
  };

  const handlePageChangePlans = (page: number) => {
    if (page >= 1 && page !== currentPagePlan) {
      setCurrentPagePlan(page);
      fetchPlansByProducts(Array.from(selectedProductIds), page, showPlansPerPage);
    }
  };

  const handlePageChangeIns = (page: number) => {
    if (page >= 1) {
      setCurrentPageIns(page);
    }
  };

  const handlePageChangeChannel = (page: number) => {
    if (page >= 1) {
      setCurrentPageChannel(page);
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
    setIsModalOpen(false);
  };


  const handleAddInsurance = () => {
    setIsInsuranceModalOpen(true);
  };


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

  const handleAddProduct = () => {
    if (selectedInsurances.length > 0) {
      setIsProductModalOpen(true);
    } else {
      alert('Please select at least one insurance before adding products.');
    }
  };

  const handleSelectProduct = (selectedProducts: Product[]) => {
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
    // Reset alert messages before validation
    setErrorMessage('');
    setAlertMessage('');
    setShowAlert(false);

    if (!promotion.type || !promotion.value || !promotion.value_currency ||
      !promotion.start_date || !promotion.end_date || !promotion.name) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }


    if (promotion.embedded_discount_insurances.length < 1 || promotion.embedded_discount_products.length < 1 ||
      promotion.embedded_discount_plans.length < 1 || promotion.embedded_discount_channels.length < 1) {
      setErrorMessage('Please select at least one data in Channel/Insurance/Product/Plan.');
      setShowAlert(true);
      return;
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
        usage_limit: voucher.usageLimit
      })),
    };

    try {
      if (promotion.type === "voucher" && !promotion.active && vouchers.length > 0) {
        const campaign_id = params.id;

        for (const voucher of vouchers) {
          try {
            const newVoucher = {
              code: voucher.code,
              usage_limit: voucher.usageLimit,
              campaign_id,
            };
            console.log("test" + newVoucher.usage_limit);
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

      if (promotion.type == "embedded") {
        if (data.data != null) {
          if (data.data.error.code === 409) {
            setErrorMessage("The plan has already been used by another embedded campaign.");
          } else {
            setErrorMessage("Promotion updated successfully!");
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
              router.push("/promotion");
            }, 2000);
          }
        } else {
          setErrorMessage("Promotion updated successfully!");
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
            router.push("/promotion");
          }, 2000);
        }
      } else {
        setErrorMessage("Promotion updated successfully!");
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
    <div className="container mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
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
              Edit Campaign
            </h2>
          </div>
          <div className="flex space-x-4">
            <div
              onClick={handleCancel}
              className="font-semibold items-center flex gap-1 text-red-700 text-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </div>
            <button
              type="submit"
              className="flex items-center bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-6 py-3"
            >
              <FaCheck className="mr-2" />
              Save
            </button>
          </div>
        </div>

        {/* Campaign Name and Promotion Type */}
        <div className="flex space-x-4">
          <div className="flex flex-col w-1/2">
            <label htmlFor="name" className="font-normal">Campaign Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={promotion.name}
              onChange={handleChange}
              className="p-2 border rounded"
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
              className="p-2 border border-gray-300 rounded-md"
              disabled={promotion.active}
            >
              <option value="embedded">Embedded</option>
              <option value="voucher">Voucher</option>
            </select>
          </div>
        </div>

        {/* Currency and Value */}
        <div className="flex space-x-4">
          <div className="flex flex-col w-1/2">
            <label htmlFor="value_currency" className="font-normal">Currency</label>
            <input
              id="value_currency"
              name="value_currency"
              type="text"
              value={promotion.value_currency}
              onChange={handleChange}
              className={`p-2 rounded ${promotion.active ? 'border-none bg-gray-100' : 'border border-gray-300'}`}
              required
              disabled
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label htmlFor="value" className="font-normal">Value</label>
            <input
              id="value"
              name="value"
              type="number"
              value={promotion.value}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Start Date and End Date */}
        <div className="flex space-x-4">
          <div className="flex flex-col w-1/2">
            <label htmlFor="start_date" className="font-normal">Start Date</label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              value={formatDate(promotion.start_date)}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label htmlFor="end_date" className="font-normal">End Date</label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              value={formatDate(promotion.end_date)}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="font-normal">Status</label>
          <input
            type="text"
            value={promotion.active ? 'Active' : 'Inactive'}
            readOnly
            className={`ml-2 p-2 border rounded ${promotion.active ? 'text-green-500' : 'text-red-500'} bg-white`}
          />
        </div>

        {/* Channels */}
        <div>
          <label className="font-normal">Channels</label>
          <div className="flex items-start mt-2">
            <div className="border rounded bg-white overflow-y-auto flex-grow mr-2 h-32">
              <div className="flex flex-wrap p-2">
                {promotion.embedded_discount_channels.length > 0 ? (
                  promotion.embedded_discount_channels.map((channel, index) => {
                    const channelDetail = channels?.data.find(c => c.id === channel.channel_id);
                    return (
                      <div key={index} className="flex items-center mb-1 mr-1 border border-gray-300 rounded p-1">
                        <span className="h-auto max-w-xs overflow-hidden text-ellipsis whitespace-normal">
                          {channelDetail ? channelDetail.name : 'Unknown Channel'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem('embedded_discount_channels', index)}
                          className="text-red-500 ml-1"
                        >
                          X
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <span>No channels added</span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 flex justify-center items-center">
              <button
                type="button"
                onClick={() => {
                  setSelectedChannelIds(existingChannelIds); // Update the selectedChannelIds state
                  setIsModalOpen(true); // Open the modal
                }}
                className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 h-10 flex items-center w-40"
              >
                <FaPlus className="mr-2" />
                Channel
              </button>
            </div>
          </div>
        </div>


        {/* Insurances */}
        <div>
          <label className="font-normal">Insurances</label>
          <div className="flex items-start mt-2">
            <div className="border rounded bg-white overflow-y-auto flex-grow mr-2 h-32">
              <div className="flex flex-wrap p-2">
                {promotion.embedded_discount_insurances.length > 0 ? (
                  promotion.embedded_discount_insurances.map((insurance, index) => {
                    const selectedInsurance = insurances?.data.find(ins => ins.id === insurance.insurance_id);
                    return (
                      <div key={index} className="flex items-center mb-1 mr-1 border border-gray-300 rounded p-1">
                        <span className="h-auto max-w-xs overflow-hidden text-ellipsis whitespace-normal">
                          {selectedInsurance ? selectedInsurance.name : 'Unknown Insurance'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem('embedded_discount_insurances', index)}
                          className="text-red-500 ml-1"
                        >
                          X
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <span>No insurances added</span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 flex justify-center items-center">
              <button
                type="button"
                onClick={handleAddInsurance}
                className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 h-10 flex items-center w-40"
              >
                <FaPlus className="mr-2" />
                Insurance
              </button>
            </div>
          </div>
        </div>


        {/* Products */}
        <div>
          <label className="font-normal">Products</label>
          <div className="flex items-start mt-2">
            <div className="border rounded bg-white overflow-y-auto flex-grow mr-2 h-32">
              <div className="flex flex-wrap p-2">
                {promotion.embedded_discount_products.length > 0 ? (
                  promotion.embedded_discount_products.map((product, index) => {
                    const productDetail = products.find(p => p.id === product.product_id);
                    return (
                      <div key={index} className="flex items-center mb-1 mr-1 border border-gray-300 rounded p-1">
                        <span className="h-auto max-w-xs overflow-hidden text-ellipsis whitespace-normal">
                          {productDetail ? productDetail.name : 'Unknown Product'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(index)}
                          className="text-red-500 ml-1"
                        >
                          X
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <span>No products added</span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 flex justify-center items-center">
              <button
                type="button"
                onClick={handleAddProduct}
                className={`bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 h-10 flex items-center w-40 ${selectedInsurances.length > 0 ? 'bg-[#F5BA41]' : 'bg-gray-500'}`}
                disabled={selectedInsurances.length === 0}
              >
                <FaPlus className="mr-2" />
                Product
              </button>
            </div>
          </div>
        </div>



        {/* Plans */}
        <div>
          <label className="font-normal">Plans</label>
          <div className="flex items-start mt-2">
            <div className="border rounded bg-white overflow-y-auto flex-grow mr-2 h-32">
              <div className="flex flex-wrap p-2">
                {promotion.embedded_discount_plans.length > 0 ? (
                  promotion.embedded_discount_plans.map((plan, index) => {
                    const planDetail = plans.find(p => p.id === plan.plan_id);
                    return (
                      <div key={index} className="flex items-center mb-1 mr-1 border border-gray-300 rounded p-1">
                        <span className="h-auto max-w-xs overflow-hidden text-ellipsis whitespace-normal">
                          {planDetail ? planDetail.name : 'Unknown Plan'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemovePlan(index)}
                          className="text-red-500 ml-1"
                        >
                          X
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <span>No plans added</span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 flex justify-center items-center">
              <button
                type="button"
                onClick={handleAddPlan}
                className={`bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-4 py-2 h-10 flex items-center w-40 ${promotion.embedded_discount_products.length > 0 ? 'bg-[#F5BA41]' : 'bg-gray-500'}`}
                disabled={promotion.embedded_discount_products.length === 0}
              >
                <FaPlus className="mr-2" />
                Plan
              </button>
            </div>
          </div>
        </div>

        {/* Vouchers */}
        <div className="my-4" />
        <div>
          {promotion.type === 'voucher' && (
            <div>
              <label className="font-normal">Vouchers</label>
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
      {isModalOpen && (
        <ChannelSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleSelectChannel}
          selectedChannelIds={selectedChannelIds}
          channels={channels}
          onPageChangeChannel={handlePageChangeChannel}
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
            logo_url: ''
          }))}
          onPageChange={handlePageChangeIns}
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
          onPageChange={handlePageChange}
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
          onPageChangePlan={handlePageChangePlans}
          totalPlanItems={totalPlanItems}
          pagePlan={currentPagePlan}
          showPlansPerPage={showPlansPerPage}
          onPlansPerPageChange={handlePlansPerPageChange}
        />
      )}

    </div>
  );
};

const EditPromotionPageWithSidebar = (params: any) =>
  WithSidebar(EditPromotionPage)(params);
export default EditPromotionPageWithSidebar;