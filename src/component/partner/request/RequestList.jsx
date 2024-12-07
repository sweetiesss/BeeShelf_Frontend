import { useTranslation } from "react-i18next";
import defaultImg from "../../../assets/img/defaultImg.jpg";
import Pagination from "../../shared/Paggination";
import { useEffect, useRef, useState } from "react";
import { DotsThreeVertical } from "@phosphor-icons/react";

export default function RequestList({
  requests,
  handleDeleteClick,
  handleSelectOrder,
  selectedRequest,
  filterField,
  setFilterField,
  handleShowDetail,
}) {
  const [openAction, setOpenAction] = useState();
  const { t } = useTranslation();

  const handleOpenActionTab = (request) => {
    if (request === openAction) {
      setOpenAction();
    } else {
      setOpenAction(request);
    }
  };
  const actionComponent = useRef();
  const handleCloseAction = () => {
    setOpenAction();
  };

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
  console.log(requests);

  return (
    <div className="shadow-lg bg-white rounded-lg p-4  mb-3 overflow-y-scroll max-h-[70vh] w-full relative">
      <table className="w-full">
        <thead>
          <tr>
            <td className="text-center pb-2  ">
              {requests?.length > 0 ? (
                <input
                  type="checkbox"
                  // checked={overall?.checked}
                  // onChange={handleClickOverall}
                  // ref={(input) =>
                  //   input && (input.indeterminate = overall?.indeterminate)
                  // }
                />
              ) : (
                "#"
              )}
            </td>
            <td className="text-left pb-2  px-3">{t("Order")}</td>
            <td className="text-left pb-2 ">{t("RequestName")}</td>
            <td className="text-left pb-2 ">{t("Description")}</td>
            <td className="text-left pb-2 ">{t("Type")}</td>
            <td className="text-center pb-2">{t("Status")}</td>
            <td className="text-center pb-2 ">{t("Product")}</td>
            <td className="text-left pb-2 ">{t("Warehouse")}</td>
            <td className="text-left pb-2 ">{t("CreateDate")}</td>
            <td className="text-left pb-2 ">{t("Action")}</td>
          </tr>
        </thead>
        <tbody>
          {requests &&
            requests?.items?.map((request, index) => {
              let check = selectedRequest === request;
              return (
                <>
                  <tr
                    key={index}
                    className={`hover:bg-gray-100 border-t-2 relative`}
                  >
                    <td className=" px-1 py-2 text-center ">{index + 1}</td>

                    <td className=" px-3 py-2  flex justify-left items-center ">
                      <img
                        src={request?.image ? request?.image : defaultImg}
                        alt={request?.name}
                        className="h-20 w-20 rounded-xl"
                      />
                    </td>
                    <td className=" px-1 py-2 ">{request?.name}</td>
                    <td className=" px-1 py-2 ">{request?.description}</td>
                    <td className=" px-1 py-2 ">{request?.requestType}</td>
                    <td className=" px-1 py-2 text-center align-middle">
                      <p
                        className={`px-2 py-1 inline-block rounded-full text-sm font-semibold h-fit w-fit ${
                          request.status === "Completed"
                            ? "bg-green-200 text-green-800"
                            : request.status === "Shipped"
                            ? "bg-yellow-200 text-yellow-800"
                            : request.status === "Pending"
                            ? "bg-blue-200 text-blue-800"
                            : request.status === "Draft"
                            ? "bg-gray-200 text-gray-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {request.status}
                      </p>
                    </td>
                    <td className=" px-1 py-2 text-center">
                      {request?.productName}
                    </td>
                    <td className=" px-1 py-2 max-w-[15rem] w-fit overflow-clip text-ellipsis">
                      {request?.warehouseName}
                    </td>
                    <td className=" px-1 py-2 ">
                      {new Date(request?.createDate).toLocaleDateString()}
                    </td>
                    <td className=" text-end">
                      <button
                        className="text-center align-middle relative"
                        onClick={() => handleOpenActionTab(request)}
                      >
                        <DotsThreeVertical weight="bold" className="text-2xl" />
                        {openAction === request && (
                          <div
                            className="action-tab-container top-0"
                            ref={actionComponent}
                          >
                            <div onClick={() => handleShowDetail(request)}>
                              Show detail
                            </div>
                            {(request?.status === "Draft") && (
                              <div
                                onClick={(e) => {
                                  handleDeleteClick(e, request);
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
                </>
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
                pageSize: parseInt(value),
              }));
            }}
            value={filterField.pageSize}
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
            response={requests}
            totalPagesCount={requests?.totalPagesCount}
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
