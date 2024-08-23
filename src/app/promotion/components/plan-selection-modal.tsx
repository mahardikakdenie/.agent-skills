import React, { useEffect, useState } from 'react';

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
  selectedProductIds: Set<string>;  // Added this prop
}

const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  plans,
  products,
  preSelectedPlanIds = new Set(),
  selectedProductIds,
}) => {
  const [selectedPlans, setSelectedPlans] = useState<Set<string>>(preSelectedPlanIds);

  useEffect(() => {
    setSelectedPlans(prevSelectedPlans => {
      const updatedSelectedPlans = new Set(preSelectedPlanIds);
      return updatedSelectedPlans;
    });
  }, [preSelectedPlanIds, plans]);

  const filteredPlans = plans.filter(plan => selectedProductIds.has(plan.product));

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
    const selectedPlansArray = filteredPlans.filter(plan => selectedPlans.has(plan.id));
    onSelect(selectedPlansArray);
    onClose();
  };

  const getProductNameById = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-3/4 max-w-2xl h-auto">
        <h2 className="text-2xl font-semibold mb-4">Select Plans</h2>
        <div className="overflow-y-auto max-h-80">
          {filteredPlans.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlans.map(plan => (
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

export default PlanSelectionModal;
