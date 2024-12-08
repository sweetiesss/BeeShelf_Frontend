import React, { useState, useEffect, useContext, useCallback } from "react";

import { AuthContext } from "../../context/AuthContext";
// import { OrderDetailCard } from "../../component/partner/order/OrderCard";
import RequestList from "../../component/partner/request/RequestList";
import AxiosRequest from "../../services/Request";
import { useDetail } from "../../context/DetailContext";

import { NavLink } from "react-router-dom";
import SpinnerLoading from "../../component/shared/Loading";
import { t } from "i18next";
import { ArrowCounterClockwise } from "@phosphor-icons/react";

export default function RequestPage() {
  const { userInfor } = useContext(AuthContext);
  const { getRequestByUserId, deleteRequestById } = AxiosRequest();
  const [fetchAgain, setFetchingAgain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
  const { updateDataDetail, updateTypeDetail, refresh } = useDetail();

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
            filterField.isImport,
            filterField.descending,
            filterField.pageIndex,
            filterField.pageSize
          );
          console.log(response);
          setRequests(response?.data);
        }
      } catch (e) {
        console.log(e);
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
      console.log(e);
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
        console.log(e);
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
    console.log(request);
  };
  console.log(filterField);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Request Management</h1>
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
              <option value={""}>Select Request Status</option>
              <option value={"Draft"}>Draft</option>
              <option value={"Pending"}>Pending</option>
              <option value={"Canceled"}>Canceled</option>
              <option value={"Processing"}>Processing</option>
              <option value={"Delivered"}>Delivered</option>
              <option value={"Failed"}>Failed</option>
              <option value={"Completed"}>Completed</option>
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
              <option value={""}>All</option>
              <option value={"import"}>Import</option>
              <option value={"export"}>Export</option>
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
          + {"CreateRequest"}
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
    </div>
  );
}
