import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Insurance {
  id: string;
  name: string;
  brand: string;
  logo_url: string;
}

interface InsuranceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (insurances: Insurance[]) => void;
  insurances?: Insurance[];
  initialSelectedInsurances: Insurance[];
}

const InsuranceSelectionModal: React.FC<InsuranceSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  insurances = [],
  initialSelectedInsurances,
}) => {
  const [selectedInsurances, setSelectedInsurances] = useState<Set<string>>(new Set(initialSelectedInsurances.map(ins => ins.id)));

  useEffect(() => {
    setSelectedInsurances(new Set(initialSelectedInsurances.map(ins => ins.id)));
  }, [initialSelectedInsurances]);

  if (!isOpen) return null;

  const handleCheckboxChange = (insuranceId: string) => {
    setSelectedInsurances(prevState => {
      const newSelectedInsurances = new Set(prevState);
      if (newSelectedInsurances.has(insuranceId)) {
        newSelectedInsurances.delete(insuranceId);
      } else {
        newSelectedInsurances.add(insuranceId);
      }
      return newSelectedInsurances;
    });
  };

  const handleApply = () => {
    const selectedInsurancesArray = insurances.filter(insurance => selectedInsurances.has(insurance.id));
    onSelect(selectedInsurancesArray);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-3/4 max-w-2xl h-auto">
        <h2 className="text-2xl font-semibold mb-4">Select Insurances</h2>
        <div className="overflow-y-auto max-h-80">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {insurances.length > 0 ? (
                insurances.map((insurance) => (
                  <tr key={insurance.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={selectedInsurances.has(insurance.id)}
                        onChange={() => handleCheckboxChange(insurance.id)}
                        className="form-checkbox"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{insurance.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{insurance.brand}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No insurances available</td>
                </tr>
              )}
            </tbody>
          </table>
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

export default InsuranceSelectionModal;
