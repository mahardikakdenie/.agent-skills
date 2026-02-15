import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { FaCheck, FaTimes } from "react-icons/fa";

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

interface Product {
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
  globalSelectedProdIds: Set<string>;
  onRemovePlan: (planId: string) => void;
  onSearch: (query: string) => void;
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
  globalSelectedProdIds,
  onRemovePlan,
  onSearch,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [localSelectedPlanIds, setLocalSelectedPlanIds] = useState<Set<string>>(
    new Set()
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = plans?.data || [];
  const totalItems = plans?.meta.total || 0;
  const totalPages = Math.ceil(totalItems / showPlansPerPage);

  useEffect(() => {
    if (isOpen) {
      setLocalSelectedPlanIds(new Set(preSelectedPlanIds));
    }
  }, [isOpen, preSelectedPlanIds]);

  useEffect(() => {
    const allSelected =
      data.length > 0 &&
      data.every((plan) => localSelectedPlanIds.has(plan.id));
    setSelectAll(allSelected);
  }, [data, localSelectedPlanIds]);

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const newSelected = new Set(localSelectedPlanIds);

    if (newSelectAll) {
      data.forEach((plan) => newSelected.add(plan.id));
    } else {
      data.forEach((plan) => newSelected.delete(plan.id));
    }

    setLocalSelectedPlanIds(newSelected);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChangePlan(page);
    }
  };

  const handleCheckboxChange = (planId: string) => {
    setLocalSelectedPlanIds((prevSelected) => {
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
    const selectedPlansData: Plan[] = Array.from(localSelectedPlanIds)
      .map((planId) => data.find((plan) => plan.id === planId))
      .filter((plan): plan is Plan => Boolean(plan));
    setGlobalSelectedPlanIds(localSelectedPlanIds);
    onClose();
    setTimeout(() => {
      onSelect(selectedPlansData);
    }, 100);
  };

  const handleSearch = async () => {
    onSearch(searchQuery);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-5xl h-[90vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-semibold mb-4">
          <span className="text-[#016DA1]">Select Plans</span>
        </h2>

        {/* Search Bar */}
        <div className="mb-4 flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by plan name..."
            className="flex-grow p-2 border rounded"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="ml-2 bg-[#F5BA41] text-black hover:bg-[#e6a92d] rounded px-4"
          >
            Search
          </button>
        </div>

        {/* Plan List */}
        <div className="overflow-y-auto flex-grow mb-4">
          {data.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                      className="form-checkbox"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {data.map((plan) => (
                  <tr key={plan.id}>
                    <td className="px-2 py-1 text-center whitespace-nowrap text-xs font-medium">
                      <input
                        type="checkbox"
                        checked={localSelectedPlanIds.has(plan.id)}
                        onChange={() => handleCheckboxChange(plan.id)}
                        className="form-checkbox"
                      />
                    </td>
                    <td className="px-6 py-4">{plan.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {plan.products.name}
                    </td>
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
          <label htmlFor="rowsPerPage" className="mr-2">
            Showing:
          </label>
          <select
            id="rowsPerPage"
            value={
              showPlansPerPage === totalPlanItems ? "All" : showPlansPerPage
            }
            onChange={(e) => {
              const value =
                e.target.value === "All"
                  ? totalPlanItems
                  : Number(e.target.value);
              onPlansPerPageChange(value);
            }}
            className="p-2 border rounded"
          >
            {[10, 20, 30, 50, "All"].map((option) => (
              <option key={option} value={option === "All" ? "All" : option}>
                {option === "All" ? "Show All" : option}
              </option>
            ))}
          </select>
          <span className="mr-2">
            {showPlansPerPage === totalPlanItems
              ? `Showing all ${totalPlanItems} items`
              : `of ${totalPlanItems} items`}
          </span>
          <button
            type="button"
            onClick={() => handlePageChange(pagePlan - 1)}
            disabled={pagePlan === 1 || showPlansPerPage === totalPlanItems}
            className="py-1 rounded flex items-center"
          >
            <ChevronLeft />
          </button>
          {/* <span>
            {showPlansPerPage === totalPlanItems
              ? `Showing all on a single page`
              : `Page ${pagePlan} of ${totalPages}`}
          </span> */}
          <button
            type="button"
            onClick={() => handlePageChange(pagePlan + 1)}
            disabled={
              pagePlan === totalPages || showPlansPerPage === totalPlanItems
            }
            className="py-1 rounded flex items-center"
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
