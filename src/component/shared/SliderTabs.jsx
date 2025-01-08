import React from 'react';

export default function SliderTabs({ activeChart, setActiveChart }) {
  return (
    <div className="flex space-x-4 mb-4">
      <button
        onClick={() => setActiveChart('InventoryChart')}
        className={`px-4 py-2 rounded-lg ${activeChart === 'InventoryChart' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
      >
        Inventory Chart
      </button>

      <button
        onClick={() => setActiveChart('ProductChart')}
        className={`px-4 py-2 rounded-lg ${activeChart === 'ProductChart' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
      >
        Product Chart
      </button>
      <button
        onClick={() => setActiveChart('OrderChart')}
        className={`px-4 py-2 rounded-lg ${activeChart === 'OrderChart' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
      >
        Order Chart
      </button>
    </div>
  );
}
