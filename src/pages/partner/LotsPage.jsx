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
  const { t } = useTranslation();
  const [lots, setLots] = useState();
  const nav = useNavigate();
  const location = useLocation();
  const {
    dataDetail,
    updateDataDetail,
    updateTypeDetail,
    refresh,
    setRefresh,
    createOrder,
    setCreateOrder,
  } = useDetail();

  const [selectedLot, setSelectedLot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isShowDetailLot, setShowDetailLot] = useState(null);
  const [inventory, setInventory] = useState(location?.state);

  const [filterField, setFilterField] = useState({
    userId: userInfor?.id,
    search: "",
    productId: null,
    roomId: inventory ? inventory?.id : null,
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
        const response = await getLotByUserId(
          filterField.userId,
          filterField.search,
          filterField.productId,
          filterField.roomId,
          filterField.sortBy,
          filterField.descending,
          filterField.pageIndex,
          filterField.size
        );
        setLots(response?.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 500),
    [filterField]
  );

  const handleAddOrder = async (order) => {};

  const handleUpdateOrder = async (order) => {};

  const handleDeleteOrder = async (orderId) => {};

  const handleSelectOrder = (order) => {
    selectedLot === order ? setSelectedLot(null) : setSelectedLot(order);
  };

  const handleSearch = (event) => {};

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
  console.log(inventory);

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
            {inventory?.roomCode} {">"}
          </h1>
        )}
        <h1 className="text-3xl font-bold mb-6">{t("Lots Management")}</h1>
      </div>
      {/* <div className="flex gap-10">
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
      </div> */}
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
