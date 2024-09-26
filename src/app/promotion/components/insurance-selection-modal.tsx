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
  onPageChange: (page: number) => void;
  currentPage: number; 
  totalItems: number; 
  rowsPerPage: number; 
  fetchInsurances: (page: number, limit: number) => Promise<void>; 
}

const InsuranceSelectionModal: React.FC<InsuranceSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  insurances,
  initialSelectedInsurances,
  onPageChange,
  currentPage,
  totalItems,
  rowsPerPage,
  fetchInsurances,
}) => {
  const [selectedInsurances, setSelectedInsurances] = useState<Set<string>>(new Set(initialSelectedInsurances.map(ins => ins.id)));
  const [selectAll, setSelectAll] = useState(false);

  const data = insurances?.data || [];
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  useEffect(() => {
    setSelectedInsurances(new Set(initialSelectedInsurances.map(ins => ins.id)));
  }, [initialSelectedInsurances]);

  useEffect(() => {
    setSelectAll(data.length > 0 && data.every(insurance => selectedInsurances.has(insurance.id)));
  }, [selectedInsurances, data]);

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

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedInsurances(new Set());
    } else {
      const allInsuranceIds = new Set(data.map(insurance => insurance.id));
      setSelectedInsurances(allInsuranceIds);
    }
    setSelectAll(!selectAll);
  };

  const handleApply = () => {
    const selectedInsurancesArray = data.filter(insurance => selectedInsurances.has(insurance.id));
    onSelect(selectedInsurancesArray);
    onClose();
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      fetchInsurances(page, rowsPerPage);
    }
  };

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
                        checked={selectedInsurances.has(insurance.id)}
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
          <label htmlFor="rowsPerPage" className="mr-2">Showing:</label>
          <select
            id="rowsPerPage"
            className="p-2 border rounded"
            value={rowsPerPage}
            onChange={(e) => {
              const newRowsPerPage = Number(e.target.value);
              onPageChange(1); // Reset to first page when changing rows per page
              fetchInsurances(1, newRowsPerPage); // Fetch new insurances
            }}
          >
            {[10, 20, 30, 50].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="mr-2">of {totalItems} items</span>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            title="Previous"
            className="bg-gray-500 text-white px-2 py-1 rounded flex items-center disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            title="Next"
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
