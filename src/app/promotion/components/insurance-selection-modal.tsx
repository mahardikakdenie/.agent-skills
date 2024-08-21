import React from 'react';
import { FaTimes } from 'react-icons/fa';

interface Insurance {
  id: string;
  name: string;
  brand: string;
  logo_url: string | null;
}

interface InsuranceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (insurance: Insurance) => void;
  insurances: Insurance[];
}

const InsuranceSelectionModal: React.FC<InsuranceSelectionModalProps> = ({ isOpen, onClose, onSelect, insurances }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-2/3 max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Insurance</h2>
          <button onClick={onClose} className="text-gray-600">
            <FaTimes size={24} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-80">
          <div className="space-y-4">
            {insurances.map((insurance) => (
              <div
                key={insurance.id}
                className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100"
                onClick={() => onSelect(insurance)}
              >
                {insurance.logo_url && (
                  <img
                    src={insurance.logo_url}
                    alt={insurance.name}
                    className="w-12 h-12 mr-4"
                  />
                )}
                <div>
                  <div className="font-semibold">{insurance.name}</div>
                  <div className="text-gray-600">{insurance.brand}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceSelectionModal;