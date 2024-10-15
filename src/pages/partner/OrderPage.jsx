import React, { useState, useEffect } from 'react';
import OrderForm from '../../component/partner/order/OrderForm';
import OrderList from '../../component/partner/order/OrderList';
import { fetchOrders, addOrder, updateOrder, deleteOrder } from '../../services/Order';

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const fetchedOrders = await fetchOrders();
    setOrders(fetchedOrders);
  };

  const handleAddOrder = async (order) => {
    const newOrder = await addOrder(order);
    setOrders([...orders, newOrder]);
  };

  const handleUpdateOrder = async (order) => {
    const updatedOrder = await updateOrder(order);
    setOrders(
      orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    setSelectedOrder(null);
  };

  const handleDeleteOrder = async (orderId) => {
    await deleteOrder(orderId);
    setOrders(orders.filter((o) => o.id !== orderId));
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredOrders = orders.filter((order) =>
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Order Management</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Orders..."
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded-lg w-full md:w-1/3"
        />
      </div>

      {/* Form */}
      <OrderForm
        onAddOrder={handleAddOrder}
        onUpdateOrder={handleUpdateOrder}
        selectedOrder={selectedOrder}
      />

      {/* Order List */}
      <div className="mt-6">
        <OrderList
          orders={filteredOrders}
          onDeleteOrder={handleDeleteOrder}
          onSelectOrder={handleSelectOrder}
        />
      </div>
    </div>
  );
}