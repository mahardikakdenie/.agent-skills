"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PromotionService } from "@/services/promotion.service";
import { FaSave, FaTimes, FaChevronLeft, FaChevronRight, FaTrash } from "react-icons/fa";
import WithSidebar from "@/hoc/with-sidebar";
import { PromotionDetails } from "../dto/promotion.details.dto";
import { ChannelService } from "@/services/channel.services";
import { InsuranceService } from "@/services/insurance.services";
import { ProductService } from "@/services/product.services";
import { PlanService } from "@/services/plan.services";
import { Insurance, Plan, Product } from "../dto/promotion.dto";

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

interface ChannelSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (channels: Channel[]) => void;
  channels?: ChannelResponseDTO;
  onPageChange: (page: number) => void;
  selectedChannelIds: Set<string>;
}

const ChannelSelectionModal: React.FC<ChannelSelectionModalProps> = ({ isOpen, onClose, onSelect, channels, onPageChange, selectedChannelIds }) => {
  const [currentPage, setCurrentPage] = useState(channels?.page || 1);
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set(selectedChannelIds));
  


  useEffect(() => {
    setSelectedChannels(new Set(selectedChannelIds));
  }, [selectedChannelIds]);

  if (!isOpen) return null;

  const data = channels?.data || [];
  const totalPages = channels?.pageTotal || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handleCheckboxChange = (channelId: string) => {
    setSelectedChannels(prevState => {
      const newSelectedChannels = new Set(prevState);
      if (newSelectedChannels.has(channelId)) {
        newSelectedChannels.delete(channelId);
      } else {
        newSelectedChannels.add(channelId);
      }
      return newSelectedChannels;
    });
  };

  const handleApply = () => {
    const selectedChannelsArray = data.filter(channel => selectedChannels.has(channel.id));
    onSelect(selectedChannelsArray);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-3/4 max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Select Channels</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((channel) => (
                <tr key={channel.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={selectedChannels.has(channel.id)}
                      onChange={() => handleCheckboxChange(channel.id)}
                      className="form-checkbox"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{channel.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{channel.type}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No channels available</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center disabled:opacity-50"
          >
            <FaChevronLeft />
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center disabled:opacity-50"
          >
            Next
            <FaChevronRight />
          </button>
        </div>
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

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

  useEffect(() => {
    fetchChannels(1);
  }, []);

  const fetchChannels = async (page: number) => {
    try {
      const response = await channelService.getChannels(page);
      setChannels(response);
    } catch (error) {
      console.error("Failed to fetch channels:", error);
    }
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

  const handlePageChange = (page: number) => {
    fetchChannels(page);
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
        channels={channels}
        onPageChange={handlePageChange}
        selectedChannelIds={selectedChannelIds}
      />
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded shadow-md">
          {/* Form fields */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Campaign Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={promotion.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <select
              id="type"
              name="type"
              value={promotion.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="embedded">Embedded</option>
              <option value="voucher">Voucher</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={promotion.start_date}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={promotion.end_date}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="value_currency" className="block text-sm font-medium text-gray-700">Currency</label>
            <select
              id="value_currency"
              name="value_currency"
              value={promotion.value_currency}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.code})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="value" className="block text-sm font-medium text-gray-700">Value</label>
            <input
              type="number"
              id="value"
              name="value"
              value={promotion.value}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="minimum_amount" className="block text-sm font-medium text-gray-700">Minimum Amount</label>
            <input
              type="number"
              id="minimum_amount"
              name="minimum_amount"
              value={promotion.minimum_amount}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="maximum_amount" className="block text-sm font-medium text-gray-700">Maximum Amount</label>
            <input
              type="number"
              id="maximum_amount"
              name="maximum_amount"
              value={promotion.maximum_amount}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
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
      </div>
    </div>
  );
};

const CreatePromotionPageWithSidebar = WithSidebar(CreatePromotionPage);
export default CreatePromotionPageWithSidebar;


