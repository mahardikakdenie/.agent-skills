import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface PlanResponseDTO {
  data: Plan[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
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
  plans?: PlanResponseDTO;
  products: { id: string; name: string }[];
  preSelectedPlanIds: Set<string>;
  selectedProductIds: Set<string>;
  onPageChangePlan: (page: number) => void;
  totalPlanItems: number;
  pagePlan: number;
  showPlansPerPage: number;
  onPlansPerPageChange: (plansPerPage: number) => void;
  globalSelectedPlanIds: Set<string>;
  setGlobalSelectedPlanIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  onRemovePlan: (planId: string) => void;
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
  globalSelectedPlanIds,
  setGlobalSelectedPlanIds,
  onRemovePlan,
}) => {
  const [selectedPlans, setSelectedPlans] = useState<Set<string>>(new Set(preSelectedPlanIds));
  const [productNames, setProductNames] = useState<{ [key: string]: string }>({});
  const [selectAll, setSelectAll] = useState(false);
  const [currentPagePlan, setCurrentPagePlan] = useState(pagePlan);

  const data = plans?.data || [];

  // Calculate total pages
  const totalItems = plans?.meta.total || 0;
  const totalPages = Math.ceil(totalItems / showPlansPerPage);


  useEffect(() => {
    const names: { [key: string]: string } = {};
    products.forEach(product => {
      names[product.id] = product.name;
    });
    setProductNames(names);
  }, [products]);


  useEffect(() => {
    // Synchronizing select all state with the selected plans
    setSelectAll(data.length > 0 && data.every(plan => globalSelectedPlanIds.has(plan.id)));
  }, [data, globalSelectedPlanIds]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChangePlan(page);
    }
  };

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const newSelected = new Set(globalSelectedPlanIds);

    if (newSelectAll) {
      // Selecting all
      data.forEach(plan => {
        newSelected.add(plan.id);
      });
    } else {
      // Deselecting all
      data.forEach(plan => {
        newSelected.delete(plan.id);
        onRemovePlan(plan.id); 
      });
    }
    setGlobalSelectedPlanIds(newSelected);
  };

  const handleCheckboxChange = (planId: string) => {
    setGlobalSelectedPlanIds(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(planId)) {
        newSelected.delete(planId);
        onRemovePlan(planId);
      } else {
        newSelected.add(planId);
      }
      return newSelected;
    });
  };

  const handleApply = () => {
    const selectedPlansData: Plan[] = Array.from(globalSelectedPlanIds)
      .map(planId => data.find(plan => plan.id === planId))
      .filter((plan): plan is Plan => Boolean(plan));

    onClose();
    setTimeout(() => {
      onSelect(selectedPlansData);
    }, 100);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-3xl h-[90vh] flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
        <h2 className="text-2xl font-semibold mb-4">
          <span className="text-[#016DA1]">Select Plans</span>
        </h2>

        {/* Plan List */}
        <div className="overflow-y-auto flex-grow mb-4">
          {data.length > 0 ? (
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
                {data.map(plan => (
                  <tr key={plan.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={globalSelectedPlanIds.has(plan.id)}
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
            onChange={(e) => onPlansPerPageChange(Number(e.target.value))}
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
