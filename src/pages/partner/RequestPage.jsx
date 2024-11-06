import React, { useState, useEffect, useContext, useCallback } from "react";

import { AuthContext } from "../../context/AuthContext";
// import { OrderDetailCard } from "../../component/partner/order/OrderCard";
import RequestList from "../../component/partner/request/RequestList";
import AxiosRequest from "../../services/Request";
import { useDetail } from "../../context/DetailContext";

export default function RequestPage() {
  const { userInfor } = useContext(AuthContext);
  const { getRequestByUserId } = AxiosRequest();
  const [requests, setRequests] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { dataDetail, typeDetail, updateDataDetail, updateTypeDetail } =
    useDetail();

  const [filterField, setFilterField] = useState({
    userId: userInfor?.id,
    status: "",
    descending: true,
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
        filterField.descending,
        filterField.pageIndex,
        filterField.pageSize
      );
      setRequests(response?.data);
    }, 500),
    [filterField]
  );

  const handleFiltered = (e) => {
    const { name, value } = e.target;
    setFilterField((prev) => ({ ...prev, [name]: value }));
  };

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
  const handleShowDetail = (request) => {
    updateDataDetail(request);
    updateTypeDetail("request");
    console.log(request);
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

      <button>Create request</button>
      <div className="flex justify-left gap-4 mt-6 ">
        <div className="w-full">
          <RequestList
            requests={requests}
            onDeleteOrder={handleDeleteOrder}
            handleSelectOrder={handleSelectOrder}
            selectedOrder={selectedOrder}
            filterField={filterField}
            setFilterField={setFilterField}
            handleShowDetail={handleShowDetail}
          />
        </div>
        {/* <div>{selectedOrder && <OrderDetailCard order={selectedOrder} />}</div> */}
      </div>
    </div>
  );
}
