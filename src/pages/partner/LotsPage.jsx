import React, { useState, useEffect, useContext, useCallback } from "react";
import OrderForm from "../../component/partner/order/OrderForm";
import OrderList from "../../component/partner/order/OrderList";
import AxiosOrder from "../../services/Order";
import { AuthContext } from "../../context/AuthContext";
import { OrderDetailCard } from "../../component/partner/order/OrderCard";
import { useDetail } from "../../context/DetailContext";
import { useLocation, useNavigate } from "react-router-dom";
import AxiosInventory from "../../services/Inventory";

import SpinnerLoading from "../../component/shared/Loading";
import LotList from "../../component/partner/inventory/LotList";
import AxiosLot from "../../services/Lot";
import { useTranslation } from "react-i18next";

export default function LotsPage() {
  const { userInfor } = useContext(AuthContext);
  const { getOrderByUserId } = AxiosOrder();
  const { getLotByUserId } = AxiosLot();
  const [lots, setLots] = useState();
  const { t } = useTranslation();

  const [selectedLot, setSelectedLot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isShowDetailLot, setShowDetailLot] = useState(null);
  const nav = useNavigate();
  const location = useLocation();
  const [inventory, setInventory] = useState(location?.state);
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
    search: "",
    productId: null,
    inventoryId: inventory ? inventory?.id : null,
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
  console.log("inventory", inventory);

  const debouncedFetchOrders = useCallback(
    debounce(async () => {
      try {
        setLoading(true);
        const response = await getLotByUserId(
          filterField.userId,
          filterField.search,
          filterField.productId,
          filterField.inventoryId,
          filterField.sortBy,
          filterField.descending,
          filterField.pageIndex,
          filterField.size
        );
        setLots(response?.data);
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
    // setLots([...lots, newOrder]);
  };

  const handleUpdateOrder = async (order) => {
    // const updatedOrder = await updateOrder(order);
    // setLots(lots.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
    // setSelectedLot(null);
  };

  const handleDeleteOrder = async (orderId) => {
    // await deleteOrder(orderId);
    // setLots(lots.filter((o) => o.id !== orderId));
  };

  const handleSelectOrder = (order) => {
    selectedLot === order ? setSelectedLot(null) : setSelectedLot(order);
  };

  const handleSearch = (event) => {
    // setSearchQuery(event.target.value);
  };

  // const filteredOrders = lots.filter((order) =>
  //   order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  console.log("here", lots);

  const handleShowDetailOrder = (e, order) => {
    e.stopPropagation();
    setShowDetailLot(isShowDetailLot === order ? null : order);
    updateDataDetail(order);
    updateTypeDetail("lots");
  };
  const handleFiltered = (e) => {
    const { name, value } = e.target;
    setFilterField((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4">
      <div className=" flex gap-4">
        {inventory?.id && (
          <h1
            className="text-3xl font-bold mb-6 text-gray-400 cursor-pointer hover:text-gray-600"
            onClick={() => {
              nav("../inventory", { state: { ...inventory } });
            }}
          >
            {inventory?.name} {">"}
          </h1>
        )}
        <h1 className="text-3xl font-bold mb-6">{t("LotsManagement")}</h1>
      </div>
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

        {/* <button
          className="outline-2 outline flex items-center gap-2 outline-[var(--line-main-color)] text-[var(--en-vu-500-disable)] hover:outline-[var(--Xanh-Base)] hover:text-black  pr-4 pl-3 py-1 rounded-xl font-semibold"
          onClick={() => nav("create-order")}
        >
          + Create Order
        </button> */}
      </div>
      <div className="flex justify-left gap-4 mt-6 ">
        <div className="w-full">
          {loading ? (
            <SpinnerLoading loading={loading} />
          ) : (
            <LotList
              lots={lots}
              onDeleteOrder={handleDeleteOrder}
              handleSelectOrder={handleSelectOrder}
              selectedLot={selectedLot}
              filterField={filterField}
              setFilterField={setFilterField}
              handleShowDetailOrder={handleShowDetailOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
}
