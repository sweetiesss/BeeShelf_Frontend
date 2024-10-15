import React from 'react';

export default function InventoryOverview({ inventories }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Inventory Overview</h2>
      <ul>
        {inventories.map((inventory) => (
          <li key={inventory.id} className="mb-2">
            <p className="text-lg">{inventory.warehouseName}</p>
            <p className="text-sm text-gray-600">Products: {inventory.products.length}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
