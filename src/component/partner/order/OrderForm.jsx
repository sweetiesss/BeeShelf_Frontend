import React, { useState, useEffect } from 'react';

export default function OrderForm({ onAddOrder, onUpdateOrder, selectedOrder }) {
  const [order, setOrder] = useState({
    id: '',
    customerName: '',
    totalPrice: '',
    status: '',
  });

  useEffect(() => {
    if (selectedOrder) {
      setOrder(selectedOrder);
    } else {
      resetForm();
    }
  }, [selectedOrder]);

  const resetForm = () => {
    setOrder({
      id: '',
      customerName: '',
      totalPrice: '',
      status: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (order.id) {
      onUpdateOrder(order);
    } else {
      onAddOrder(order);
    }
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={order.customerName}
          onChange={handleInputChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Total Price</label>
        <input
          type="number"
          name="totalPrice"
          placeholder="Total Price"
          value={order.totalPrice}
          onChange={handleInputChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={order.status}
          onChange={handleInputChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
          required
        >
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
        >
          {order.id ? 'Update Order' : 'Add Order'}
        </button>
      </div>
    </form>
  );
}
