import React, { useState, useEffect } from 'react';
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
  selectedProductIds: Set<string>;
  initialSelectedProductIds: Set<string>;
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
  selectedProductIds,
  initialSelectedProductIds
}) => {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(''); 
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    setSelectedProducts(prevSelected => {
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
      const allProductIds = new Set(filteredProducts.map(product => product.id));
      setSelectedProducts(allProductIds);
    }
    setSelectAll(!selectAll);
  };

  const handleConfirm = () => {
    const selected = products.filter(product => selectedProducts.has(product.id));
    onSelect(selected);
    onClose();
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(event.target.value);
  };

  const filteredProducts = products.filter(product =>
    selectedCategoryId === '' || product.category === selectedCategoryId
  );

  useEffect(() => {
    setSelectAll(filteredProducts.length > 0 && filteredProducts.every(product => selectedProducts.has(product.id)));
  }, [selectedProducts, filteredProducts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-3/4 max-w-2xl h-auto">
        <h2 className="text-2xl font-semibold mb-4">Select Products</h2>
        
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

        <div className="overflow-y-auto max-h-80">
          {filteredProducts.length > 0 ? (
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
                {filteredProducts.map((product) => (
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
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-sm text-gray-500">No products available.</p>
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
            onClick={handleConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSelectionModal;
