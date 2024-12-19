import { useTranslation } from "react-i18next";

import defaultImg from "../../../assets/img/defaultImg.jpg";
import Pagination from "../../shared/Paggination";
import { useEffect, useRef, useState } from "react";
import { DotsThreeVertical } from "@phosphor-icons/react";
import {format} from "date-fns"
export default function LotList({
  lots,
  onDeleteOrder,
  handleSelectOrder,
  selectedOrder,
  filterField,
  setFilterField,
  handleShowDetailOrder,
}) {
  const { t } = useTranslation();
  const [openAction, setOpenAction] = useState();
  const actionComponent = useRef();

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
  const handleDeleteClick = (e, order) => {
    // setOpenAction();
  };

  return (
    <div className="shadow-lg bg-white rounded-lg p-4  mb-3 overflow-y-scroll max-h-[70vh] w-full relative">
      <table className="w-full">
        <thead>
          <tr>
            <td className="text-center pb-2">#</td>
            <td className="text-left pb-2  px-3">{t("Picture")}</td>
            <td className="text-left pb-2">{t("Lot")}</td>
            <td className="text-left pb-2 ">{t("Lot Code")}</td>
            <td className="text-left pb-2 ">{t("Warehouse")}</td>
            <td className="text-left pb-2 ">{t("Product Name")}</td>
            <td className="text-left pb-2 ">{t("Lot Amount")}</td>
            <td className="text-left pb-2 ">{t("Total Product")}</td>
            <td className="text-left pb-2 ">{t("Import Date")}</td>
            <td className="text-left pb-2 ">{t("ExpirationDate")}</td>
            <td className="text-left pb-2 ">{t("")}</td>
          </tr>
        </thead>
        <tbody>
          {lots &&
            lots?.items?.map((order, index) => {
              let check = selectedOrder === order;
              // console.log(selectedOrder);

              return (
                <tr
                  key={order?.id}
                  className={`hover:bg-gray-100 border-t-2 cursor-pointer `}
                >
                  <td className=" px-1 py-2 text-center ">{index + 1}</td>

                  <td className=" px-3 py-2  flex justify-left items-center ">
                    <img
                      src={order?.productPictureLink ? order?.productPictureLink : defaultImg}
                      alt={order?.name}
                      className="h-20 w-20 rounded-xl object-cover object-center"
                    />
                  </td>
                  <td className=" px-1 py-2 ">{order?.name}</td>
                  <td className=" px-1 py-2 ">{order?.lotNumber}</td>
                  <td className=" px-1 py-2 ">{order?.warehouseName}</td>
                  <td className=" px-1 py-2 ">{order?.productName}</td>

                  <td className=" px-1 py-2 ">{order?.lotAmount}</td>
                  <td className=" px-1 py-2 ">{order?.totalProductAmount}</td>
                  <td className=" px-1 py-2 ">
                    {format(order?.importDate, "dd/MM/yyyy")}
                  </td>
                  <td className=" px-1 py-2 ">
                    {format(order?.expirationDate, "dd/MM/yyyy")}
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
                            Show detail
                          </div>
                          {order?.status === "Draft" && (
                            <div
                              onClick={(e) => {
                                handleDeleteClick(e, order);
                                handleCloseAction();
                              }}
                            >
                              Delete
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
            response={lots}
            totalPagesCount={lots?.totalPagesCount}
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
