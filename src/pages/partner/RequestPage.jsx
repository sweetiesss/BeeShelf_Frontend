import React, { useState, useEffect, useContext, useCallback } from "react";

import { AuthContext } from "../../context/AuthContext";
// import { OrderDetailCard } from "../../component/partner/order/OrderCard";
import RequestList from "../../component/partner/request/RequestList";
import AxiosRequest from "../../services/Request";
import { useDetail } from "../../context/DetailContext";
import CreateRequestImport from "../../component/partner/product/CreateRequestImport";
import AxiosProduct from "../../services/Product";
import AxiosInventory from "../../services/Inventory";

export default function RequestPage() {
  const { userInfor } = useContext(AuthContext);
  const { getRequestByUserId, deleteRequestById } = AxiosRequest();
  const [fetchAgain, setFetchingAgain] = useState(false);
  const [requests, setRequests] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [inventories, setInventories] = useState();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
  const [productPage, setProductPage] = useState(0);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductOnCreateRequest, setSelectedProductOnCreateRequest] =
    useState();

  const { getProductByUserId } = AxiosProduct();
  const {getInventory100}=AxiosInventory();
  const [type, setType] = useState();
  const {
    dataDetail,
    typeDetail,
    updateDataDetail,
    updateTypeDetail,
    refresh,
    createRequest,
    setCreateRequest,
  } = useDetail();

  const [filterField, setFilterField] = useState({
    userId: userInfor?.id,
    status: "",
    descending: true,
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetchingData();
  }, []);
  useEffect(() => {
    fetchingData();
  }, [fetchAgain]);
  useEffect(() => {
    const fetching = async () => {
      if (refresh && refresh > 0) {
        const response = await getRequestByUserId(
          filterField.userId,
          filterField.status,
          filterField.descending,
          filterField.pageIndex,
          filterField.pageSize
        );
        console.log(response);

        setRequests(response?.data);
        updateDataDetail(
          response?.data?.items.find((item) => item.id === refresh)
        );
      }
      if (refresh && refresh < 0) {
        const response = await getRequestByUserId(
          filterField.userId,
          filterField.status,
          filterField.descending,
          filterField.pageIndex,
          filterField.pageSize
        );
        console.log(response);
        setRequests(response?.data);
      }
    };
    fetching();
  }, [refresh]);
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

  const fetchingData = async () => {
    const response = await getRequestByUserId(
      filterField.userId,
      filterField.status,
      filterField.descending,
      filterField.pageIndex,
      filterField.pageSize
    );
    setRequests(response?.data);
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
  const handleDeleteClick = (e, request) => {
    e.stopPropagation();
    setShowDeleteConfirmation(request);
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteRequestById(showDeleteConfirmation?.id);
    } catch (e) {
    } finally {
      setShowDeleteConfirmation(null);
      setFetchingAgain((prev) => !prev);
    }
  };
  const cancelDelete = () => {
    setShowDeleteConfirmation(null);
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
  const handleShowDetail = (request) => {
    updateDataDetail(request);
    updateTypeDetail("request");
    console.log(request);
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && !isFetchingNextPage) {
      setProductPage((prevPage) => prevPage + 1); // Load next page
    }
  };

  useEffect(() => {
    fetchingProducts(productPage);
  }, [productPage]);

  const fetchingProducts = async (page) => {
    try {
      setIsFetchingNextPage(true);
      const response = await getProductByUserId(userInfor?.id, page, 10);
      console.log(response);
      if (response?.status === 200) {
        setProducts((prev) => [...prev, ...response?.data?.items]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsFetchingNextPage(false);
    }
  };

  useEffect(() => {
    const fetchingData = async () => {
      const result = await getInventory100();
      console.log(result);
      setInventories(result);
    };
    fetchingData();
  }, []);
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

      <button onClick={() => setCreateRequest(true)}>Create request</button>
      <div className="flex justify-left gap-4 mt-6 ">
        <div className="w-full">
          <RequestList
            requests={requests}
            handleDeleteClick={handleDeleteClick}
            handleSelectOrder={handleSelectOrder}
            selectedOrder={selectedOrder}
            filterField={filterField}
            setFilterField={setFilterField}
            handleShowDetail={handleShowDetail}
          />
        </div>
        {showDeleteConfirmation && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div
              className="absolute bg-white border border-gray-300 shadow-md rounded-lg p-4 w-fit h-fit"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <p>{`Are you sure you want to delete ${showDeleteConfirmation.name}?`}</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => confirmDelete(showDeleteConfirmation)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {createRequest && (
        <CreateRequestImport
          product={selectedProductOnCreateRequest}
          setProduct={setSelectedProductOnCreateRequest}
          inventories={inventories}
          enableSelect={true}
          type={type}
          products={products}
          setType={setType}
        />
      )}
    </div>
  );
}
