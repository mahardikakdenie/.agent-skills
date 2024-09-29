import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { FaCheck, FaTimes } from 'react-icons/fa';

export interface InsuranceResponseDTO {
  data: Insurance[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface Insurance {
  id: string;
  name: string;
  brand: string;
  logo_url: string | null;
}

interface InsuranceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (insurances: Insurance[]) => void;
  insurances?: InsuranceResponseDTO;
  initialSelectedInsurances: Insurance[];
  onPageChangeIns: (page: number) => void;
  showInsPerPage: number;
  onInsurancePerPageChange: (insPerPage: number) => void;
  globalSelectedInsuranceIds: Set<string>;
  setGlobalSelectedInsuranceIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  currentPageIns: number;
  onRemoveInsurance: (insuranceId: string) => void;
}

const InsuranceSelectionModal: React.FC<InsuranceSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  insurances,
  initialSelectedInsurances,
  onPageChangeIns,
  showInsPerPage,
  onInsurancePerPageChange,
  globalSelectedInsuranceIds,
  setGlobalSelectedInsuranceIds,
  currentPageIns,
  onRemoveInsurance,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [localSelectedInsuranceIds, setLocalSelectedInsuranceIds] = useState<Set<string>>(new Set());
  const data = insurances?.data || [];
  const totalItems = insurances?.meta.total || 0;
  const totalPages = Math.ceil(totalItems / showInsPerPage);

  // Initialize local selection based on global selected IDs when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelectedInsuranceIds(new Set(globalSelectedInsuranceIds));
    }
  }, [isOpen, globalSelectedInsuranceIds]);

  useEffect(() => {
    setSelectAll(data.length > 0 && data.every(insurance => localSelectedInsuranceIds.has(insurance.id)));
  }, [data, localSelectedInsuranceIds]);

  const handleCheckboxChange = (insuranceId: string) => {
    setLocalSelectedInsuranceIds(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(insuranceId)) {
        newSelected.delete(insuranceId);
      } else {
        newSelected.add(insuranceId);
      }
      return newSelected;
    });
  };

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const newSelected = new Set(localSelectedInsuranceIds);

    if (newSelectAll) {
      data.forEach(insurance => newSelected.add(insurance.id));
    } else {
      data.forEach(insurance => newSelected.delete(insurance.id));
    }

    setLocalSelectedInsuranceIds(newSelected);
  };

  const handleApply = () => {
    // Update global selected insurance IDs only when Save is clicked
    setGlobalSelectedInsuranceIds(localSelectedInsuranceIds);
    
    // Prepare the selected insurances data to return
    const selectedInsurancesData: Insurance[] = Array.from(localSelectedInsuranceIds)
      .map(insuranceId => data.find(insurance => insurance.id === insuranceId))
      .filter((ins): ins is Insurance => Boolean(ins));

    onClose();
    setTimeout(() => {
      onSelect(selectedInsurancesData);
    }, 100);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChangeIns(page);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-3xl h-[90vh] flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>

        <h2 className="text-2xl font-semibold mb-4">
          <span className="text-[#016DA1]">Select Insurances</span>
        </h2>
        <div className="flex-grow overflow-y-auto mb-4">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((insurance) => (
                  <tr key={insurance.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={localSelectedInsuranceIds.has(insurance.id)}
                        onChange={() => handleCheckboxChange(insurance.id)}
                        className="form-checkbox"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{insurance.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{insurance.brand}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {insurance.logo_url ? (
                        <img src={insurance.logo_url} alt={insurance.name} className="w-12 h-12 object-cover" />
                      ) : (
                        <span>No Logo</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No insurances available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center gap-2 font-normal mb-4">
          <label htmlFor="rowsPerPage">Showing:</label>
          <select
            id="rowsPerPage"
            className="p-2 border rounded"
            value={showInsPerPage}
            onChange={(e) => onInsurancePerPageChange(Number(e.target.value))}
          >
            {[10, 20, 30, 50].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="mr-2">of {totalItems} items</span>
          <button
            onClick={() => handlePageChange(currentPageIns - 1)}
            disabled={currentPageIns === 1}
            className="bg-gray-500 text-white px-2 py-1 rounded flex items-center disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          <span>{`Page ${currentPageIns} of ${totalPages}`}</span>
          <button
            onClick={() => handlePageChange(currentPageIns + 1)}
            disabled={currentPageIns === totalPages}
            className="bg-gray-500 text-white px-2 py-1 rounded flex items-center disabled:opacity-50"
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

export default InsuranceSelectionModal;
