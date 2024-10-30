import React, { useState, useEffect, useContext, useCallback } from "react";

import { AuthContext } from "../../context/AuthContext";
// import { OrderDetailCard } from "../../component/partner/order/OrderCard";
import RequestList from "../../component/partner/request/RequestList";
import AxiosRequest from "../../services/Request";

export default function RequestPage() {
  const { userInfor } = useContext(AuthContext);
  const { getRequestByUserId } = AxiosRequest();
  const [requests, setRequests] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [filterField, setFilterField] = useState({
    userId: userInfor?.id,
    status: "Draft",
    pageIndex: 0,
    pageSize: 10,
  });
  useEffect(() => {
    debouncedFetchRequests();
  }, []);
  useEffect(() => {
    debouncedFetchRequests();
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

  const debouncedFetchRequests = useCallback(
    debounce(async () => {
      const response = await getRequestByUserId(
        filterField.userId,
        filterField.status,
        filterField.pageIndex,
        filterField.pageSize
      );
      setRequests(response?.data);
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
  console.log("here", requests);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Request Management</h1>

      {/* <div className="mb-6">
        <input
          type="text"
          placeholder="Search Orders..."
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded-lg w-full md:w-1/3"
        />
      </div>


      <OrderForm
        onAddOrder={handleAddOrder}
        onUpdateOrder={handleUpdateOrder}
        selectedOrder={selectedOrder}
      /> */}

      {/* Order List */}
      <div className="flex justify-left gap-4 mt-6 ">
        <div className="w-[60vw]">
          <RequestList
            requests={requests}
            onDeleteOrder={handleDeleteOrder}
            handleSelectOrder={handleSelectOrder}
            selectedOrder={selectedOrder}
            filterField={filterField}
            setFilterField={setFilterField}
          />
        </div>
        {/* <div>{selectedOrder && <OrderDetailCard order={selectedOrder} />}</div> */}
      </div>
    </div>
  );
}
