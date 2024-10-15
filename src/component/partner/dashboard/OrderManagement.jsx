import React from 'react';

export default function OrderManagement({ orders }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="mb-4">
            <p className="text-lg">{order.customerName}</p>
            <p className="text-sm text-gray-600">Status: {order.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
