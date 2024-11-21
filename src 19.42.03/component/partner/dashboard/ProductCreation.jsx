import React, { useState } from 'react';

export default function ProductCreation() {
  const [product, setProduct] = useState({
    name: '',
    inventoryId: '',
    price: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add product creation logic
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Create Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Inventory</label>
          <select
            value={product.inventoryId}
            onChange={(e) => setProduct({ ...product, inventoryId: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select Inventory</option>
            {/* Map over inventory options here */}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Create Product
        </button>
      </form>
    </div>
  );
}
