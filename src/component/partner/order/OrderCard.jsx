import React from 'react';

export default function OrderCard({ order,onClickEdit,onClickDelete }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="text-lg font-bold">{order.customerName}</div>
        <div
          className={`px-2 py-1 rounded-full text-sm ${
            order.status === 'Delivered'
              ? 'bg-green-200 text-green-800'
              : order.status === 'Shipped'
              ? 'bg-yellow-200 text-yellow-800'
              : 'bg-red-200 text-red-800'
          }`}
        >
          {order.status}
        </div>
      </div>

      <div className="text-sm text-gray-600">Order ID: {order.id}</div>
      <div className="text-sm text-gray-600">Total: ${order.totalPrice}</div>

      <div className="mt-4">
        <button className="text-blue-600 hover:underline mr-4" onClick={onClickEdit}>Edit</button>
        <button className="text-red-600 hover:underline" onClick={onClickDelete}>Delete</button>
      </div>
    </div>
  );
}
