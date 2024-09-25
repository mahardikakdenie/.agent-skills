import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { FaCheck } from 'react-icons/fa';

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
  products: Product;
}

interface Product{
  id: string;
  created_at: string;
  updated_at: string;
  insurance: string;
  category: string;
  name: string;
  instant_policy: boolean;
}

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (plans: Plan[]) => void;
  plans: Plan[];
  products: { id: string; name: string }[];
  preSelectedPlanIds: Set<string>;
  selectedProductIds: Set<string>;
  onPageChangePlan: (page: number) => void;
  totalPlanItems: number;
  pagePlan: number;
  showPlansPerPage: number;
  onPlansPerPageChange: (plansPerPage: number) => void;
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
  showPlansPerPage,
  onPlansPerPageChange,
}) => {
  // const [selectedPlans, setSelectedPlans] = useState<Set<string>>(new Set());
  const [selectedPlans, setSelectedPlans] = useState<Set<string>>(new Set(preSelectedPlanIds));
  const [productNames, setProductNames] = useState<{ [key: string]: string }>({});
  const [selectAll, setSelectAll] = useState(false);
  const [currentPagePlan, setCurrentPagePlan] = useState(pagePlan);

  // Calculate total pages
  const totalPages = useMemo(() => Math.ceil(totalPlanItems / showPlansPerPage), [totalPlanItems, showPlansPerPage]);

  // Calculate current plans based on the current page
  const currentPlans = useMemo(() => {
    return plans.slice((currentPagePlan - 1) * showPlansPerPage, currentPagePlan * showPlansPerPage);
  }, [plans, currentPagePlan, showPlansPerPage]);

  useEffect(() => {
    const names: { [key: string]: string } = {};
    products.forEach(product => {
      names[product.id] = product.name;
    });
    setProductNames(names);
  }, [products]);

  useEffect(() => {
    setSelectAll(currentPlans.length > 0 && currentPlans.every(plan => selectedPlans.has(plan.id)));
  }, [selectedPlans, currentPlans]);

  useEffect(() => {
    setSelectedPlans(new Set(preSelectedPlanIds));
  }, [preSelectedPlanIds]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChangePlan(page);
    }
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      // Unselect all current plans
      const updatedSelected = new Set(selectedPlans);
      currentPlans.forEach(plan => updatedSelected.delete(plan.id));
      setSelectedPlans(updatedSelected);
    } else {
      // Select all current plans
      const updatedSelected = new Set(selectedPlans);
      currentPlans.forEach(plan => updatedSelected.add(plan.id));
      setSelectedPlans(updatedSelected);
    }
    setSelectAll(!selectAll);
  };

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

  const handleApply = () => {
    // Create an array of selected plan details
    const selectedPlansArray = Array.from(selectedPlans)
      .map(planId => plans.find(plan => plan.id === planId))
      .filter(Boolean) as Plan[];

    onSelect(selectedPlansArray);  // Pass full plan details to the parent component
    onClose();
  };


  const getProductNameById = (productId: string) => {
    return productNames[productId] || 'Unknown Product';
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPlansPerPage = Number(e.target.value);
    onPlansPerPageChange(newPlansPerPage);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-3xl h-[90vh] flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          ✖
        </button>
        <h2 className="text-2xl font-semibold mb-4">
          <span className="text-[#016DA1]">Select Plans</span>
        </h2>

        {/* Plan List */}
        <div className="overflow-y-auto flex-grow mb-4">
          {plans.length > 0 ? (
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
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Product</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={selectedPlans.has(plan.id)}
                        onChange={() => handleCheckboxChange(plan.id)}
                        className="form-checkbox"
                      />
                    </td>
                    <td className="px-6 py-4">{plan.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.products.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No plans available.</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 font-normal mb-4">
          <label htmlFor="rowsPerPage" className="mr-2">Showing:</label>
          <select
            id="rowsPerPage"
            value={showPlansPerPage}
            onChange={handleRowsPerPageChange}
            className="p-2 border rounded"
          >
            {[10, 20, 30, 50].map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="mr-2">of {totalPlanItems} items</span>

          <button
            type="button"
            onClick={() => handlePageChange(pagePlan - 1)}
            disabled={pagePlan === 1}
            className="bg-gray-500 text-white px-2 py-1 rounded flex items-center"
          >
            <ChevronLeft />
          </button>
          <span>Page {pagePlan} of {totalPages}</span>
          <button
            type="button"
            onClick={() => handlePageChange(pagePlan + 1)}
            disabled={pagePlan === totalPages}
            className="bg-gray-500 text-white px-2 py-1 rounded flex items-center"
          >
            <ChevronRight />
          </button>
        </div>

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
