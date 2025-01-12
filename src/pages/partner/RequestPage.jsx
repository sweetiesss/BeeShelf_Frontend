import React, { useState, useEffect, useContext, useCallback } from "react";

import { AuthContext } from "../../context/AuthContext";
// import { OrderDetailCard } from "../../component/partner/order/OrderCard";
import RequestList from "../../component/partner/request/RequestList";
import AxiosRequest from "../../services/Request";
import { useDetail } from "../../context/DetailContext";

import { NavLink } from "react-router-dom";
import SpinnerLoading from "../../component/shared/Loading";

import { ArrowCounterClockwise, Warning } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export default function RequestPage() {
  const { userInfor } = useContext(AuthContext);
  const { getRequestByUserId, deleteRequestById } = AxiosRequest();
  const { updateDataDetail, updateTypeDetail, refresh } = useDetail();
  const [fetchAgain, setFetchingAgain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
  const [filterField, setFilterField] = useState({
    userId: userInfor?.id,
    isImport: "",
    status: "",
    descending: true,
    pageIndex: 0,
    pageSize: 10,
  });
  const defaultFilter = {
    userId: userInfor?.id,
    isImport: "",
    status: "",
    descending: true,
    pageIndex: 0,
    pageSize: 10,
  };
  const { t } = useTranslation();
  useEffect(() => {
    fetchingData();
  }, []);
  useEffect(() => {
    fetchingData();
  }, [fetchAgain]);
  useEffect(() => {
    const fetching = async () => {
      try {
        setLoading(true);
        if (refresh && refresh > 0) {
          const response = await getRequestByUserId(
            filterField.userId,
            filterField.status,
            filterField.isImport,
            filterField.descending,
            filterField.pageIndex,
            filterField.pageSize
          );
          setRequests(response?.data);
          updateDataDetail(
            response?.data?.items.find((item) => item.id === refresh)
          );
        }
        if (refresh && refresh < 0) {
          const response = await getRequestByUserId(
            filterField.userId,
            filterField.status,
            filterField.isImport,
            filterField.descending,
            filterField.pageIndex,
            filterField.pageSize
          );
          setRequests(response?.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetching();
  }, [refresh]);
  useEffect(() => {
    debouncedFetchRequests(filterField);
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
    try {
      setLoading(true);

      const response = await getRequestByUserId(
        filterField.userId,
        filterField.status,
        filterField.isImport,
        filterField.descending,
        filterField.pageIndex,
        filterField.pageSize
      );
      setRequests(response?.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchRequests = useCallback(
    debounce(async (filterField) => {
      try {
        setLoading(true);

        const response = await getRequestByUserId(
          filterField.userId,
          filterField.status,
          filterField.isImport,
          filterField.descending,
          filterField.pageIndex,
          filterField.pageSize
        );
        setRequests(response?.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleFiltered = (e) => {
    const { name, value } = e.target;
    setFilterField((prev) => ({ ...prev, [name]: value }));
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

  const handleShowDetail = (request) => {
    updateDataDetail(request);
    updateTypeDetail("request");
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">{t("RequestManagement")}</h1>
      <div className="flex justify-between">
        <div className="flex gap-10">
          <div
            className={`flex items-center border border-gray-300 rounded-2xl overflow-hidden w-fit  px-4 py-1  focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black ${
              filterField.status != ""
                ? "text-black ring-[var(--Xanh-Base)] ring-2"
                : "text-[var(--en-vu-300)]"
            }`}
          >
            <label>{t("Status")}: </label>
            <select
              className="outline-none"
              name="status"
              value={filterField.status}
              onChange={handleFiltered}
            >
              <option value={""}>{t("All")}</option>
              <option value={"Draft"}>{t("Draft")}</option>
              <option value={"Pending"}>{t("Pending")}</option>
              <option value={"Canceled"}>{t("Canceled")}</option>
              <option value={"Processing"}>{t("Processing")}</option>
              <option value={"Delivered"}>{t("Delivered")}</option>
              <option value={"Failed"}>{t("Failed")}</option>
              <option value={"Completed"}>{t("Completed")}</option>
            </select>
          </div>

          <div
            className={`flex items-center border border-gray-300 rounded-2xl overflow-hidden w-fit  px-4 py-1  focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black ${
              filterField.isImport != ""
                ? "text-black ring-[var(--Xanh-Base)] ring-2"
                : "text-[var(--en-vu-300)]"
            }`}
          >
            <label>{t("RequestType")}: </label>
            <select
              className="outline-none"
              name="isImport"
              value={filterField.isImport}
              onChange={handleFiltered}
            >
              <option value={""}>{t("All")}</option>
              <option value={"import"}>{t("Import")}</option>
              <option value={"export"}>{t("Export")}</option>
            </select>
          </div>
          <div
            className="text-xl bg-gray-100 p-1 rounded-full border-2 border-gray-400 hover:bg-gray-200 hover:border-gray-500 cursor-pointer"
            onClick={() => setFilterField(defaultFilter)}
          >
            <ArrowCounterClockwise />
          </div>
        </div>
        <NavLink
          to="create-request"
          className="outline-2 outline flex items-center gap-2 outline-[var(--line-main-color)] text-[var(--en-vu-500-disable)] hover:outline-[var(--Xanh-Base)] hover:text-black  pr-4 pl-3 py-1 rounded-xl font-semibold"
        >
          + {t("CreateRequest")}
        </NavLink>
      </div>
      <div className="flex justify-left gap-4 mt-6 ">
        <div className="w-full">
          {loading ? (
            <SpinnerLoading loading={loading} />
          ) : (
            <RequestList
              requests={requests}
              handleDeleteClick={handleDeleteClick}
              handleSelectOrder={handleSelectOrder}
              selectedOrder={selectedOrder}
              filterField={filterField}
              setFilterField={setFilterField}
              handleShowDetail={handleShowDetail}
            />
          )}
        </div>
        {showDeleteConfirmation && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div
              className="absolute bg-white border border-gray-300 shadow-md rounded-2xl p-8 w-[30rem] h-fit text-black"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="flex items-center justify-center">
                <div className="text-5xl bg-fit h-fit p-4 bg-[#fff5f6] rounded-full mb-6">
                  <Warning weight="fill" color="#fe3f56" />
                </div>
              </div>
              <p className="w-full text-2xl font-semibold text-center  mb-6">
                {t("DeleteRequest")}
              </p>
              <p className="text-center w-full text-wrap  mb-6">{`${t(
                "Youaregoingtodeletethe"
              )} "${showDeleteConfirmation?.name}" ${t("Request")}?`}</p>
              <div className="flex justify-between gap-4">
                <button
                  onClick={cancelDelete}
                  className="bg-[#f5f5f7] text-black px-4 py-2 rounded-3xl w-full"
                >
                  {t("NoKeepIt")},
                </button>
                <button
                  onClick={() => confirmDelete(showDeleteConfirmation)}
                  className="bg-[#fe3f56] text-white px-4 py-2 rounded-3xl w-full"
                >
                  {t("YesDelete")}!
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
