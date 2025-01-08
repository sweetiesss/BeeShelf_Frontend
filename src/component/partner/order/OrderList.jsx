import { useTranslation } from "react-i18next";
import OrderCard from "./OrderCard";
import defaultImg from "../../../assets/img/defaultImg.jpg";
import Pagination from "../../shared/Paggination";
import { useEffect, useRef, useState } from "react";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { add, format } from "date-fns";
export default function OrderList({
  orders,
  selectedOrder,
  filterField,
  setFilterField,
  handleShowDetailOrder,
  handleDeleteClick,
}) {
  const { t } = useTranslation();
  const actionComponent = useRef();
  const [openAction, setOpenAction] = useState();

  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (
        actionComponent.current &&
        !actionComponent.current.contains(event.target)
      ) {
        handleCloseAction();
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  const handleOpenActionTab = (e, order) => {
    e.stopPropagation();
    if (order === openAction) {
      setOpenAction();
    } else {
      setOpenAction(order);
    }
  };
  const handleCloseAction = () => {
    setOpenAction();
  };

  return (
    <div className="shadow-lg bg-white rounded-lg p-4  mb-3 overflow-y-scroll max-h-[70vh] w-full relative">
      <table className="w-full">
        <thead>
          <tr>
            <td className="text-center pb-2">#</td>
            <td className="text-left pb-2  px-3">{t("Order")}</td>
            <td className="text-left pb-2 ">{t("Order Code")}</td>
            <td className="text-left pb-2 ">{t("Warehouse")}</td>
            <td className="text-left pb-2 ">{t("Receiver Address")}</td>
            <td className="text-left pb-2 ">{t("Receiver Phone")}</td>
            <td className="text-left pb-2 ">{t("CreateDate")}</td>
            <td className="text-left pb-2 ">
              {t("Total")}
              {" (vnd)"}
            </td>
            <td className="text-center pb-2">{t("Status")}</td>
            <td className="text-left pb-2 ">{t("")}</td>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders?.items?.map((order, index) => {
              console.log("here", order);

              return (
                <tr
                  key={order?.id}
                  className={`hover:bg-gray-100 border-t-2 cursor-pointer `}
                >
                  <td className=" px-1 py-2 text-center ">{index + 1}</td>

                  <td className=" px-3 py-2  flex justify-left items-center ">
                    <img
                      src={order?.pictureLink ? order?.pictureLink : defaultImg}
                      alt={order?.name}
                      className="h-20 w-20 rounded-xl"
                    />
                  </td>
                  <td className=" px-1 py-2 ">{order?.orderCode}</td>
                  <td className=" px-1 py-2 ">{order?.warehouseName}</td>
                  <td className=" px-1 py-2 ">
                    {order?.receiverAddress} {order?.deliveryZoneName}
                  </td>

                  <td className=" px-1 py-2 ">{order?.receiverPhone}</td>
                  <td className=" px-1 py-2 ">
                    {format(
                      add(new Date(order?.createDate), { hours: 7 }),
                      "HH:mm - dd/MM/yyyy"
                    )}
                  </td>
                  <td className=" px-1 py-2 ">
                    {new Intl.NumberFormat().format(order?.totalPriceAfterFee)}
                  </td>
                  <td className=" px-1 py-2 text-center align-middle">
                    <p
                      className={`px-2 py-1 inline-block rounded-full text-sm font-semibold h-fit w-fit ${
                        order?.status === "Delivered"
                          ? "bg-lime-200 text-lime-800"
                          : order?.status === "Shipped"
                          ? "bg-cyan-200 text-cyan-800"
                          : order?.status === "Processing"
                          ? "bg-blue-200 text-blue-800"
                          : order?.status === "Draft"
                          ? "bg-gray-200 text-gray-800"
                          : order?.status === "Pending"
                          ? "bg-orange-200 text-orange-800"
                          : order?.status === "Canceled"
                          ? "bg-red-200 text-red-800"
                          : order?.status === "Returned"
                          ? "bg-purple-200 text-purple-800"
                          : order?.status === "Refunded"
                          ? "bg-teal-200 text-teal-800"
                          : order?.status === "Completed"
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {t(order?.status)}
                    </p>
                  </td>
                  <td className=" text-end">
                    <button
                      className="text-center align-middle relative"
                      onClick={(e) => handleOpenActionTab(e, order)}
                    >
                      <DotsThreeVertical weight="bold" className="text-2xl" />
                      {openAction === order && (
                        <div
                          className="action-tab-container top-0"
                          ref={actionComponent}
                        >
                          <div onClick={(e) => handleShowDetailOrder(e, order)}>
                            {t("ShowDetail")}
                          </div>
                          {order?.status === "Draft" && (
                            <div
                              onClick={(e) => {
                                handleDeleteClick(order);
                                handleCloseAction();
                              }}
                            >
                              {t("Delete")}
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="grid grid-cols-3">
        <div className="flex items-center space-x-5 mt-5">
          <p>{t("ItemsPerPage")}:</p>
          <select
            className="outline outline-1 px-1"
            onChange={(e) => {
              const value = e.target.value;
              setFilterField((prev) => ({
                ...prev,
                size: parseInt(value),
              }));
            }}
            value={filterField.size}
          >
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
          </select>
        </div>
        <div className="flex space-x-5 items-center w-full justify-center">
          <Pagination
            response={orders}
            totalPagesCount={orders?.totalPagesCount}
            currentPage={filterField.pageIndex + 1}
            handleLeft={() =>
              setFilterField((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex - 1,
              }))
            }
            handleRight={() =>
              setFilterField((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex + 1,
              }))
            }
            handleChoose={(newPage) =>
              setFilterField((prev) => ({
                ...prev,
                pageIndex: newPage,
              }))
            }
          />
        </div>
      </div>
    </div>
  );
}
