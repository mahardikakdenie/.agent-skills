import React from 'react';

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
  onSelect: (plan: Plan) => void;
  plans: Plan[];
}

const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({ isOpen, onClose, onSelect, plans }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-gray-700 opacity-75" onClick={onClose}></div>
      {/* Modal Content */}
      <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full relative">
        <h2 className="text-xl font-semibold mb-4">Select a Plan</h2>
        <div className="overflow-y-auto max-h-80">
          {plans.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Plan ID</th>
                  <th className="border p-2">Plan Name</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td className="border p-2">{plan.id}</td>
                    <td className="border p-2">{plan.name}</td>
                    <td className="border p-2">
                      <button
                        type="button"
                        onClick={() => onSelect(plan)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No plans available.</p>
          )}
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionModal;