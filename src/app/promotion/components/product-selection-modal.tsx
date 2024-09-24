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

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (products: Product[]) => void;
  products: Product[];
  initialSelectedProductIds: Set<string>;
  selectedProductIds: Set<string>;
  onPageChange: (page: number) => void;
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
  onPageChange,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set(initialSelectedProductIds));
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(''); 
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  
  const productService = new ProductService();

  const formatCategoryName = (name: string): string => {
    return name
      .replace(/[-_]/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  useEffect(() => {
    setSelectedProducts(new Set(initialSelectedProductIds));
  }, [initialSelectedProductIds]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productService.getPromotionCategories();

        if (response.data && Array.isArray(response.data)) {
          const categoryList = response.data.map((category: { id: string; name: string }) => ({
            id: category.id,
            name: formatCategoryName(category.name)
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
    setSelectedProducts((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(productId)) {
        updatedSelected.delete(productId);
      } else {
        updatedSelected.add(productId);
      }
      return updatedSelected;
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedProducts(new Set());
    } else {
      const allProductIds = new Set(filteredProducts.map((product) => product.id));
      setSelectedProducts(allProductIds);
    }
    setSelectAll(!selectAll);
  };

  const handleApply = () => {
    const selected = products.filter((product) => selectedProducts.has(product.id));
    onSelect(selected);
    onClose();
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange(page);
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(event.target.value);
  };

  const filteredProducts = (Array.isArray(products) ? products : []).filter(product =>
    selectedCategoryId === '' || product.category === selectedCategoryId
  );

  useEffect(() => {
    setSelectAll(filteredProducts.length > 0 && filteredProducts.every((product) => selectedProducts.has(product.id)));
  }, [selectedProducts, filteredProducts]);

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
              {categories.map(category => (
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
                filteredProducts
                  .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                  .map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(product.id)}
                          onChange={() => handleCheckboxChange(product.id)}
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
          <label htmlFor="rowsPerPage" className="mr-2">Showing:</label>
          <select
            id="rowsPerPage"
            className="p-2 border rounded"
            value={rowsPerPage}
            onChange={(e) => {
              const newRowsPerPage = Number(e.target.value);
              setRowsPerPage(newRowsPerPage);
              setCurrentPage(1);
            }}
          >
            {[10, 20, 30, 50].map((option) => (
              <option key={option} value={option}>{option}</option>
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
