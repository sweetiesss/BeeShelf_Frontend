import React, { useState, useEffect, useContext, useCallback } from "react";
import OrderForm from "../../component/partner/order/OrderForm";
import OrderList from "../../component/partner/order/OrderList";
import AxiosOrder from "../../services/Order";
import { AuthContext } from "../../context/AuthContext";
import { OrderDetailCard } from "../../component/partner/order/OrderCard";
import { useDetail } from "../../context/DetailContext";
import { useNavigate } from "react-router-dom";
import AxiosInventory from "../../services/Inventory";

import SpinnerLoading from "../../component/shared/Loading";
import { useTranslation } from "react-i18next";

export default function OrderPage() {
  const { t } = useTranslation();
  const { userInfor } = useContext(AuthContext);
  const { getOrderByUserId, deleteOrderById } = AxiosOrder();
  const { getInventory1000ByUserId } = AxiosInventory();
  const [orders, setOrders] = useState();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isShowDetailOrder, setShowDetailOrder] = useState(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [orderHolder, setOrderHolder] = useState(false);
  const nav = useNavigate();
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
    filterByStatus: "",
    sortBy: "CreateDate",
    descending: true,
    pageIndex: 0,
    size: 10,
  });
  useEffect(() => {
    debouncedFetchOrders();
  }, []);
  useEffect(() => {
    debouncedFetchOrders();
  }, [refresh, filterField]);
  // useEffect(() => {
  //   try {
  //     debouncedFetchOrders();
  //     setLoading(true);
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [filterField]);

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
      try {
        setLoading(true);
        const response = await getOrderByUserId(
          filterField.userId,
          filterField.filterByStatus,
          filterField.sortBy,
          filterField.descending,
          filterField.pageIndex,
          filterField.size
        );
        setOrders(response?.data);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
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

  const handleDeleteOrder = (order) => {
    setDeleteConfirmation(true);
    setOrderHolder(order);
  };

  const confirmDelete = async () => {
    await deleteOrderById(parseInt(orderHolder?.id));
    setDeleteConfirmation(false);
    setRefresh((prev) => !prev);
  };
  const cancelDelete = () => {
    setDeleteConfirmation(false);
    setOrderHolder();
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
      <h1 className="text-3xl font-bold mb-6">{t("Orders Management")}</h1>

      {/* <select
        name="filterByStatus"
        value={filterField.filterByStatus}
        onChange={handleFiltered}
      >
        <option value={""}>Select Request Status</option>
        <option value={"Draft"}>Draft</option>
        <option value={"Pending"}>Pending</option>
        <option value={"Canceled"}>Canceled</option>
        <option value={"Processing"}>Processing</option>
        <option value={"Delivered"}>Delivered</option>
        <option value={"Failed"}>Failed</option>
        <option value={"Completed"}>Completed</option>
      </select> */}
      <div className="flex gap-10">
        <div
          className={`flex items-center border border-gray-300 rounded-2xl overflow-hidden w-fit  px-4 py-1  focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black ${
            filterField.filterByStatus != ""
              ? "text-black ring-[var(--Xanh-Base)] ring-2"
              : "text-[var(--en-vu-300)]"
          }`}
        >
          <label>{t("Status")}: </label>
          <select
            className="outline-none"
            name="status"
            value={filterField.filterByStatus}
            onChange={handleFiltered}
          >
            <option value={""}>{t("All")}</option>
            <option value={"Draft"}>{t("Draft")}</option>
            <option value={"Pending"}>{t("Pending")}</option>
            <option value={"Canceled"}>{t("Canceled")}</option>
            <option value={"Processing"}>{t("Processing")}</option>
            <option value={"Shipped"}>{t("Shipped")}</option>
            <option value={"Delivered"}>{t("Delivered")}</option>
            <option value={"Returned"}>{t("Returned")}</option>
            <option value={"Refunded"}>{t("Refunded")}</option>
            <option value={"Completed"}>{t("Completed")}</option>
          </select>
        </div>

        <button
          className="outline-2 outline flex items-center gap-2 outline-[var(--line-main-color)] text-[var(--en-vu-500-disable)] hover:outline-[var(--Xanh-Base)] hover:text-black  pr-4 pl-3 py-1 rounded-xl font-semibold"
          onClick={() => nav("create-order")}
        >
          + {t("Create Order")}
        </button>
      </div>
      <div className="flex justify-left gap-4 mt-6 ">
        <div className="w-full">
          {loading ? (
            <SpinnerLoading loading={loading} />
          ) : (
            <OrderList
              orders={orders}
              onDeleteOrder={handleDeleteOrder}
              handleSelectOrder={handleSelectOrder}
              selectedOrder={selectedOrder}
              filterField={filterField}
              setFilterField={setFilterField}
              handleShowDetailOrder={handleShowDetailOrder}
              handleDeleteClick={handleDeleteOrder}
            />
          )}
        </div>
      </div>
      {deleteConfirmation && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div>
          <div
            className="absolute bg-white border z-10 border-gray-300 shadow-md rounded-lg p-4 w-fit h-fit"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <p>{`${t("AreYouSureWantToDelete")} ${orderHolder?.orderCode}?`}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
              >
                {t("Cancel")}
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                {t("Confirm")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
