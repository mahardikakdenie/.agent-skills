import React, { useState, useEffect } from 'react';

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

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  products,
  selectedProductIds,
  initialSelectedProductIds
}) => {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedProducts(new Set(initialSelectedProductIds));
  }, [initialSelectedProductIds]);

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

  const handleConfirm = () => {
    const selected = products.filter(product => selectedProducts.has(product.id));
    onSelect(selected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-3/4 max-w-2xl h-auto">
        <h2 className="text-2xl font-semibold mb-4">Select Products</h2>
        <div className="overflow-y-auto max-h-80">
          {products.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
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
