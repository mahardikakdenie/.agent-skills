import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { ProductService } from '@/services/product.services';

interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  insurance: string;
  category: string;
  name: string;
  instant_policy: boolean;
}

export interface ProductResponseDTO {
  data: Product[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (products: Product[]) => void;
  products?: ProductResponseDTO;
  initialSelectedProductIds: Set<string>;
  selectedProductIds: Set<string>;
  showProdPerPage: number;
  onProdPerPageChange: (page: number) => void;
  globalSelectedProdIds: Set<string>;
  setGlobalSelectedProdIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  onPageChangeProd: (page: number) => void;
  currentPageProd: number;
  onRemoveProd: (prodId: string) => void;
}

interface Category {
  id: string;
  name: string;
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  products,
  initialSelectedProductIds,
  selectedProductIds,
  showProdPerPage,
  onProdPerPageChange,
  globalSelectedProdIds,
  setGlobalSelectedProdIds,
  onPageChangeProd,
  currentPageProd,
  onRemoveProd,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [localSelectedProductIds, setLocalSelectedProductIds] = useState<Set<string>>(new Set());

  const data = products?.data || [];
  const totalItems = products?.meta.total || 0;
  const totalPages = Math.ceil(totalItems / showProdPerPage);

  const productService = new ProductService();

  const formatCategoryName = (name: string): string => {
    return name
      .replace(/[-_]/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Initialize local selection based on global selected IDs when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelectedProductIds(new Set(globalSelectedProdIds));
    }
  }, [isOpen, globalSelectedProdIds]);

  // Check if all products on the current page are selected
  useEffect(() => {
    setSelectAll(data.length > 0 && data.every(product => localSelectedProductIds.has(product.id)));
  }, [data, localSelectedProductIds]);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getPromotionCategories();
        if (response.data && Array.isArray(response.data)) {
          const categoryList = response.data.map((category: { id: string; name: string }) => ({
            id: category.id,
            name: formatCategoryName(category.name),
          }));
          setCategories([{ id: '', name: 'All Products' }, ...categoryList]);
        } else {
          throw new Error('Unexpected response structure');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCheckboxChange = (productId: string) => {
    setLocalSelectedProductIds(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
        onRemoveProd(productId); // Call to remove the productId from main state
      } else {
        newSelected.add(productId);
      }
      return newSelected;
    });
  };

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;  // Toggle selectAll state
    setSelectAll(newSelectAll);

    const newSelected = new Set(globalSelectedProdIds);  // Copy the current selected prod

    if (newSelectAll) {
      // Selecting all prod
      data.forEach(prod => {
        newSelected.add(prod.id);
      });
    } else {
      // Deselecting all prod
      data.forEach(prod => {
        newSelected.delete(prod.id);
        onRemoveProd(prod.id); // Remove each prod from the main state
      });
    }

    setGlobalSelectedProdIds(newSelected);  // Update the selected prod
  };

  const handleApply = () => {
    // Update global selected product IDs only when Save is clicked
    setGlobalSelectedProdIds(localSelectedProductIds);

    // Prepare the selected products data to return
    const selectedProductsData: Product[] = Array.from(localSelectedProductIds)
      .map(productId => data.find(product => product.id === productId))
      .filter((prod): prod is Product => Boolean(prod));

    onClose();
    setTimeout(() => {
      onSelect(selectedProductsData);
    }, 100);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChangeProd(page);
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(event.target.value);
  };

  const filteredProducts = data.filter(
    (product) => selectedCategoryId === '' || product.category === selectedCategoryId
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-3xl h-[90vh] flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
        <h2 className="text-2xl font-semibold mb-4">
          <span className="text-[#016DA1]">Select Products</span>
        </h2>

        {/* Filter Dropdown */}
        <div className="mb-4">
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          {loading ? (
            <p className="text-center text-sm text-gray-500">Loading categories...</p>
          ) : error ? (
            <p className="text-center text-sm text-red-500">{error}</p>
          ) : (
            <select
              id="category-filter"
              value={selectedCategoryId}
              onChange={handleCategoryChange}
              className="block w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Product List with Pagination */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={localSelectedProductIds.has(product.id)} // Use localSelectedProductIds here
                        onChange={() => handleCheckboxChange(product.id)} // Call the change handler
                        className="form-checkbox"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No products available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination and Rows Per Page Controls */}
        <div className="flex justify-center items-center gap-2 font-normal mb-4">
          <label htmlFor="rowsPerPage">Showing:</label>
          <select
            id="rowsPerPage"
            className="p-2 border rounded"
            value={showProdPerPage}
            onChange={(e) => onProdPerPageChange(Number(e.target.value))}
          >
            {[10, 20, 30, 50].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="mr-2">of {totalItems} items</span>
          <button
            onClick={() => handlePageChange(currentPageProd - 1)}
            disabled={currentPageProd === 1}
            className="bg-gray-500 text-white px-2 py-1 rounded flex items-center disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          <span>{`Page ${currentPageProd} of ${totalPages}`}</span>
          <button
            onClick={() => handlePageChange(currentPageProd + 1)}
            disabled={currentPageProd === totalPages}
            className="bg-gray-500 text-white px-2 py-1 rounded flex items-center disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Save Button */}
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

export default ProductSelectionModal;

