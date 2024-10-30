import { useTranslation } from "react-i18next";
import defaultImg from "../../../assets/img/defaultImg.jpg";
import Pagination from "../../shared/Paggination";

export default function RequestList({
  requests,
  onDeleteOrder,
  handleSelectOrder,
  selectedRequest,
  filterField,
  setFilterField,
}) {
  const { t } = useTranslation();
  console.log(requests);
  console.log("selecttedOorder", selectedRequest);
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
            <td className="text-left pb-2 ">{t("Customer")}</td>
            <td className="text-center pb-2">{t("Status")}</td>
            <td className="text-center pb-2 ">{t("Quantity")}</td>
            <td className="text-left pb-2 ">{t("Location")}</td>
            <td className="text-left pb-2 ">{t("Date")}</td>
            <td className="text-left pb-2 ">{t("Total")}</td>
            <td className="text-left pb-2 ">{t("Action")}</td>
          </tr>
        </thead>
        <tbody>
          {requests &&
            requests?.items?.map((order) => {
              let check = selectedRequest === order;
              // console.log(selectedRequest);

              return (
                <tr
                  key={order.id}
                  className={`${
                    check
                      ? " border-2 rounded-xl  bg-[var(--second-color)] "
                      : "hover:bg-gray-100 border-t-2 "
                  } cursor-pointer `}
                  onClick={() => handleSelectOrder(order)}
                >
                  <td className=" px-1 py-2 text-center ">
                    <input
                      type="checkbox"
                      checked={check}
                      onChange={() => handleSelectOrder(order)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>

                  <td className=" px-3 py-2  flex justify-left items-center ">
                    <img
                      src={order?.image ? order?.image : defaultImg}
                      alt={order?.name}
                      className="h-20 w-20 rounded-xl"
                    />
                    <p className="ml-2">#{order?.id}</p>
                  </td>
                  <td className=" px-1 py-2 ">{order?.name}ReceiverName</td>
                  <td className=" px-1 py-2 text-center align-middle">
                    <p
                      className={`px-2 py-1 inline-block rounded-full text-sm font-semibold h-fit w-fit ${
                        order.orderStatus === "Delivered"
                          ? "bg-green-200 text-green-800"
                          : order.orderStatus === "Shipped"
                          ? "bg-yellow-200 text-yellow-800"
                          : order.orderStatus === "Processing"
                          ? "bg-blue-200 text-blue-800"
                          : order.orderStatus === "Pending"
                          ? "bg-gray-200 text-gray-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {order.orderStatus}
                    </p>
                  </td>
                  <td className=" px-1 py-2 text-center">
                    {order?.productCategoryName}31
                  </td>
                  <td className=" px-1 py-2 ">{order?.receiverAddress}</td>
                  <td className=" px-1 py-2 ">
                    {new Date(order?.createDate).toLocaleDateString()}
                  </td>
                  <td className=" px-1 py-2 ">{order?.totalPrice}</td>
                  <td>...</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-5 mt-5">
          <p>{t("RowsPerPage")}:</p>
          <select
            className="outline outline-1 px-1"
            onChange={(e) => {
              const value = e.target.value;
              setFilterField((prev) => ({ ...prev, size: parseInt(value) }));
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
        <div className="flex space-x-5 items-center">
          <p>
            {(filterField.pageIndex + 1) * filterField.size - (filterField.size - 1)} - {(filterField.pageIndex + 1) * filterField.size}{" "}
            of {requests?.totalItemsCount} {t("items")}
          </p>
          <Pagination
            totalPagesCount={requests?.totalPagesCount}
            currentPage={filterField.pageIndex+1}
            handleLeft={() =>
              setFilterField((prev) => ({ ...prev, pageIndex: prev.pageIndex-1 }))
            }
            handleRight={() =>  setFilterField((prev) => ({ ...prev, pageIndex: prev.pageIndex+1 }))}
          />
        </div>
      </div>
    </div>
  );
}
