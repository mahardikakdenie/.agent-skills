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
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  products,
  selectedProductIds,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set(selectedProductIds));

  useEffect(() => {
    setSelectedProducts(new Set(selectedProductIds));
  }, [selectedProductIds]);

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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-700 opacity-75" onClick={onClose}></div>
      <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full relative">
        <h2 className="text-xl font-semibold mb-4">Select Products</h2>
        <div className="overflow-y-auto max-h-80">
          {products.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Select</th>
                  <th className="border p-2">Product ID</th>
                  <th className="border p-2">Product Name</th>
                  <th className="border p-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="border p-2">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => handleCheckboxChange(product.id)}
                      />
                    </td>
                    <td className="border p-2">{product.id}</td>
                    <td className="border p-2">{product.name}</td>
                    <td className="border p-2">${product.instant_policy ? 'Free' : 'Paid'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No products available.</p>
          )}
        </div>
        <div className="mt-4 flex justify-end space-x-4">
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
