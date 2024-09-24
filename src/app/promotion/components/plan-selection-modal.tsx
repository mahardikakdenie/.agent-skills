import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { FaCheck } from 'react-icons/fa';

interface Product {
  id: string;
  name: string;
}

interface Plan {
  id: string;
  created_at: string;
  updated_at: string;
  product: string;
  name: string;
  duration_max: number | null;
  duration_max_additional_days: number | null;
  duration_max_additional_premium: number | null;
  policy_per_participant: boolean;
  slug: string;
  premium_discount_type: string;
  premium_discount_value: string;
  premium_campaign_id: string;
}

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (plans: Plan[]) => void;
  plans: Plan[];
  products: Product[];
  preSelectedPlanIds: Set<string>;
  selectedProductIds: Set<string>;
  onPageChangePlan: (page: number) => void;
  totalPlanItems: number;
  pagePlan: number;
}

const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  plans,
  products,
  preSelectedPlanIds,
  selectedProductIds,
  onPageChangePlan,
  totalPlanItems,
  pagePlan,
}) => {
  const [selectedPlans, setSelectedPlans] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [productNames, setProductNames] = useState<{ [key: string]: string }>({});
  const [currentPagePlan, setCurrentPagePlan] = useState(1);
  const [plansPerPage, setPlansPerPage] = useState(10);

  useEffect(() => {
      setSelectedPlans(new Set(preSelectedPlanIds));
  }, [preSelectedPlanIds]);

  useEffect(() => {
      const names: { [key: string]: string } = {};
      products.forEach(product => {
          names[product.id] = product.name;
      });
      setProductNames(names);
  }, [products]);

  // Calculate total pages
  const totalPages = Math.ceil(totalPlanItems / plansPerPage);
  // Calculate current plans based on the current page
  const currentPlans = plans.slice((currentPagePlan - 1) * plansPerPage, currentPagePlan * plansPerPage);

  useEffect(() => {
      setSelectAll(currentPlans.length > 0 && currentPlans.every(plan => selectedPlans.has(plan.id)));
  }, [selectedPlans, currentPlans]);

  useEffect(() => {
    // Fetch plans only if page or selectedProductIds changes
    if (selectedProductIds.size > 0 && currentPagePlan > 0) {
      onPageChangePlan(currentPagePlan);
    }
  }, [currentPagePlan, selectedProductIds]);

  // Handle checkbox change for individual plans
  const handleCheckboxChange = (planId: string) => {
      setSelectedPlans(prevState => {
          const newState = new Set(prevState);
          if (newState.has(planId)) {
              newState.delete(planId);
          } else {
              newState.add(planId);
          }
          return newState;
      });
  };

  // Handle select all
  const handleSelectAllChange = () => {
      if (selectAll) {
          setSelectedPlans(new Set());
      } else {
          const allPlanIds = new Set(currentPlans.map(plan => plan.id));
          setSelectedPlans(allPlanIds);
      }
      setSelectAll(!selectAll);
  };

  // Handle apply button click
  const handleApply = () => {
      const selectedPlansArray = currentPlans.filter(plan => selectedPlans.has(plan.id));
      onSelect(selectedPlansArray);
      onClose();
  };

  const getProductNameById = (productId: string) => {
      return productNames[productId] || 'Unknown Product';
  };

  const handlePageChange = (page: number) => {
      if (page >= 1 && page <= totalPages) {
          setCurrentPagePlan(page); // Update the current page
      }
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-3xl h-[90vh] flex flex-col relative">
              <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                  <span className="text-2xl">✖</span>
              </button>
              <h2 className="text-2xl font-semibold mb-4">
                  <span className="text-[#016DA1]">Select Plans</span>
              </h2>

              <div className="overflow-y-auto flex-grow mb-4">
                  {currentPlans.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                              <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      <input
                                          type="checkbox"
                                          checked={selectAll}
                                          onChange={handleSelectAllChange}
                                          className="form-checkbox"
                                      />
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                              </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                              {currentPlans.map(plan => (
                                  <tr key={plan.id}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                          <input
                                              type="checkbox"
                                              checked={selectedPlans.has(plan.id)}
                                              onChange={() => handleCheckboxChange(plan.id)}
                                              className="form-checkbox"
                                          />
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plan.name}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getProductNameById(plan.product)}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  ) : (
                      <p className="text-center text-sm text-gray-500">No plans available.</p>
                  )}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-2 font-normal mb-4">
                  <button
                      onClick={() => handlePageChange(currentPagePlan - 1)}
                      disabled={currentPagePlan === 1}
                      title="Previous"
                      className="bg-gray-500 text-white px-2 py-1 rounded flex items-center disabled:opacity-50"
                  >
                      <ChevronLeft />
                  </button>
                  <span>Page {currentPagePlan} of {totalPages}</span>
                  <button
                      onClick={() => handlePageChange(currentPagePlan + 1)}
                      disabled={currentPagePlan === totalPages}
                      title="Next"
                      className="bg-gray-500 text-white px-2 py-1 rounded flex items-center disabled:opacity-50"
                  >
                      <ChevronRight />
                  </button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center mt-4">
                  <button
                      type="button"
                      onClick={handleApply}
                      className="flex items-center bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded-full px-6 py-3"
                  >
                      <FaCheck className="mr-2" />
                      Save
                  </button>
              </div>
          </div>
      </div>
  );
};


export default PlanSelectionModal;
