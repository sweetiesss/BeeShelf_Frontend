import React, { useState, useEffect, useContext, useCallback } from "react";
import OrderForm from "../../component/partner/order/OrderForm";
import OrderList from "../../component/partner/order/OrderList";
import AxiosOrder from "../../services/Order";
import { AuthContext } from "../../context/AuthContext";
import { OrderDetailCard } from "../../component/partner/order/OrderCard";
import { useDetail } from "../../context/DetailContext";

export default function OrderPage() {
  const { userInfor } = useContext(AuthContext);
  const { getOrderByUserId } = AxiosOrder();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isShowDetailOrder, setShowDetailOrder] = useState(null);
  const {
    dataDetail,
    updateDataDetail,
    updateTypeDetail,
    refresh,
    setRefresh,
    createOrder,
    setCreateOrder,
  } = useDetail();

  const [filterField, setFilterField] = useState({
    userId: userInfor?.id,
    filterByStatus: undefined,
    sortBy: undefined,
    descending: undefined,
    pageIndex: 0,
    size: 10,
  });
  useEffect(() => {
    debouncedFetchOrders();
  }, []);
  useEffect(() => {
    debouncedFetchOrders();
  }, [filterField]);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const debouncedFetchOrders = useCallback(
    debounce(async () => {
      const response = await getOrderByUserId(
        filterField.userId,
        filterField.filterByStatus,
        filterField.sortBy,
        filterField.descending,
        filterField.pageIndex,
        filterField.size
      );
      setOrders(response?.data);
    }, 500),
    [filterField]
  );

  console.log(filterField);

  const handleAddOrder = async (order) => {
    // const newOrder = await addOrder(order);
    // setOrders([...orders, newOrder]);
  };

  const handleUpdateOrder = async (order) => {
    // const updatedOrder = await updateOrder(order);
    // setOrders(orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    // setSelectedOrder(null);
  };

  const handleDeleteOrder = async (orderId) => {
    // await deleteOrder(orderId);
    // setOrders(orders.filter((o) => o.id !== orderId));
  };

  const handleSelectOrder = (order) => {
    selectedOrder === order ? setSelectedOrder(null) : setSelectedOrder(order);
  };

  const handleSearch = (event) => {
    // setSearchQuery(event.target.value);
  };

  // const filteredOrders = orders.filter((order) =>
  //   order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  console.log("here", orders);

  const handleShowDetailOrder = (e, order) => {
    e.stopPropagation();
    setShowDetailOrder(isShowDetailOrder === order ? null : order);
    updateDataDetail(order);
    updateTypeDetail("order");
  };
  const handleFiltered = (e) => {
    const { name, value } = e.target;
    setFilterField((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Request Management</h1>

      <select
        name="status"
        value={filterField.status}
        onChange={handleFiltered}
      >
        <option>Select Request Status</option>
        <option value={"Draft"}>Draft</option>
        <option value={"Pending"}>Pending</option>
        <option value={"Canceled"}>Canceled</option>
        <option value={"Processing"}>Processing</option>
        <option value={"Delivered"}>Delivered</option>
        <option value={"Failed"}>Failed</option>
        <option value={"Completed"}>Completed</option>
      </select>

      <button onClick={() => setCreateOrder(true)}>Create Order</button>

      <div className="flex justify-left gap-4 mt-6 ">
        <div className="w-full">
          <OrderList
            orders={orders}
            onDeleteOrder={handleDeleteOrder}
            handleSelectOrder={handleSelectOrder}
            selectedOrder={selectedOrder}
            filterField={filterField}
            setFilterField={setFilterField}
            handleShowDetailOrder={handleShowDetailOrder}
          />
        </div>

      </div>
    </div>
  );
}
