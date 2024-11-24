import { useTranslation } from "react-i18next";
import Pagination from "../../shared/Paggination";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowsDownUp,
  ArrowUp,
  CaretDown,
  CaretUp,
  DotsThreeVertical,
  ExclamationMark,
  X,
} from "@phosphor-icons/react";

export default function ProductList({
  products,
  response,
  selectedProducts,
  toggleProductSelection,
  handleShowDetailProduct,
  isProductSelected,
  overall,
  handleClickOverall,
  index,
  setIndex,
  page,
  setPage,
  handleDeleteClick,
  handleSortChange,
  sortBy,
  descending,
  notInDataBase,
  editProduct,
  editForm,
  hanldeEditChange,
  handleUpdateEdit,
  errorList,
}) {
  const { t } = useTranslation();
  const [openAction, setOpenAction] = useState();
  const [thisIsTheLastItem, IsThisIsTheLastItem] = useState(false);
  const handleOpenActionTab = async (e, product) => {
    e.stopPropagation();
    if (openAction === product) {
      setOpenAction(null);
    } else {
      setOpenAction(product);
    }
    IsThisIsTheLastItem(false);
    const buttonRect = e.target.getBoundingClientRect();
    if (buttonRect.y > 800) {
      IsThisIsTheLastItem(true);
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
  }, [openAction]);
  return (
    <div className="mb-3 h-full">
      <table className=" w-full ">
        <thead className="text-[var(--en-vu-500-disable)] px-4">
          <tr>
            <th className="border-b-2 py-4 w-10 text-center px-2 ">
              {selectedProducts?.length > 0 ? (
                <input

                  type="checkbox"
                  checked={overall?.checked}
                  onChange={handleClickOverall}
                  ref={(input) =>
                    input && (input.indeterminate = overall?.indeterminate)
                  }
                />
              ) : notInDataBase ? (
                <span
                  className={`hover:text-[var(--en-vu-600)] cursor-pointer flex items-center ${
                    sortBy === "Id" && "text-black"
                  } `}
                  onClick={() => handleSortChange("Id")}
                >
                  #
                  {!descending ? (
                    <ArrowUp weight="bold" />
                  ) : (
                    <ArrowDown weight="bold" />
                  )}
                </span>
              ) : (
                <span>#</span>
              )}
            </th>
            <th className="border-b-2 text-left py-4 w-[7vw]">{t("Image")}</th>
            <th className="border-b-2 text-left py-4 w-[10vw]">
              {t("Barcode")}
            </th>

            <th
              className={`border-b-2 text-left py-4 w-[14vw] cursor-pointer hover:text-[var(--en-vu-600)] ${
                sortBy === "Name" && "text-black"
              }`}
              onClick={() => {
                handleSortChange("Name");
              }}
            >
              <span className="flex items-center gap-1">
                {t("Name")}
                {!descending ? (
                  <ArrowUp weight="bold" />
                ) : (
                  <ArrowDown weight="bold" />
                )}
              </span>
            </th>

            <th className="border-b-2 text-left py-4 w-[10vw]">
              {t("Category")}
            </th>

            <th
              className={`border-b-2 text-left py-4 w-[10vw] cursor-pointer hover:text-[var(--en-vu-600)] ${
                sortBy === "Origin" && "text-black"
              }`}
              onClick={() => {
                handleSortChange("Origin");
              }}
            >
              <span className="flex items-center gap-1">
                {t("Origin")}
                {!descending ? (
                  <ArrowUp weight="bold" />
                ) : (
                  <ArrowDown weight="bold" />
                )}
              </span>
            </th>

            <th
              className={`border-b-2 text-left py-4 w-[7vw] cursor-pointer hover:text-[var(--en-vu-600)] ${
                sortBy === "Price" && "text-black"
              }`}
              onClick={() => {
                handleSortChange("Price");
              }}
            >
              <span className="flex items-center gap-1">
                {t("Price")}
                {!descending ? (
                  <ArrowUp weight="bold" />
                ) : (
                  <ArrowDown weight="bold" />
                )}
              </span>
            </th>
            <th
              className={`border-b-2 text-left py-4 cursor-pointer w-[8vw] hover:text-[var(--en-vu-600)] ${
                sortBy === "CreateDate" && "text-black"
              }`}
              onClick={() => {
                handleSortChange("CreateDate");
              }}
            >
              <span className="flex items-center gap-1">
                {t("CreateDate")}
                {!descending ? (
                  <ArrowUp weight="bold" />
                ) : (
                  <ArrowDown weight="bold" />
                )}
              </span>
            </th>
            <th
              className={`border-b-2 text-left py-4 cursor-pointer hover:text-[var(--en-vu-600)] ${
                sortBy === "Weight" && "text-black"
              }`}
              onClick={() => {
                handleSortChange("Weight");
              }}
            >
              <span className="flex items-center gap-1">
                {t("Weight")}
                {!descending ? (
                  <ArrowUp weight="bold" />
                ) : (
                  <ArrowDown weight="bold" />
                )}
              </span>
            </th>
            {!notInDataBase && (
              <th className="border-b-2  py-4 w-[6vw] text-center">
                {t("InInventory")}
              </th>
            )}
            <th className="border-b-2 text-left py-4 "></th>
          </tr>
        </thead>
        <tbody className="overflow-y-auto max-h-[60vh] pb-[4rem] h-fit pl-4">
          {products &&
            products?.map((product) => {
              let chooice = selectedProducts?.some((p) => p.id === product.id);
              let checkError = errorList?.find((p) => p.item.id === product.id);
              console.log(checkError);
              let editAble = editProduct === product;
              return (
                <tr
                  key={product.id}
                  className={`
                border-t-2 
                  ${chooice ? "bg-[var(--Xanh-100)]" : ""} font-medium ${
                    checkError
                      ? "bg-red-200 hover:bg-red-100"
                      : "     hover:bg-[var(--Xanh-100)]"
                  }`}
                  onClick={() => toggleProductSelection(product)}
                >
                  <td className="w-10 px-2">
                    <div
                      className={`w-4 h-4 rounded-sm ${
                        isProductSelected(product)
                          ? "bg-[var(--Xanh-Base)]"
                          : "bg-[var(--en-vu-300)]"
                      }`}
                      // checked={isProductSelected(product)}
                      onChange={() => toggleProductSelection(product)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="w-[7vw] h-[6rem]">
                    <img
                      src={product.pictureLink}
                      alt={product.name}
                      className="w-[4vw] h-[4rem] rounded-xl"
                    />
                  </td>
                  <td
                    className={`w-[10vw]  ${
                      checkError?.error?.includes("barcode") &&
                      "text-red-500 font-bold"
                    }`}
                  >
                    {editAble ? (
                      <input
                        placeholder="Input barcode"
                        value={editForm?.barcode}
                        name="barcode"
                        className="w-[80%] px-2 py-1"
                        onChange={hanldeEditChange}
                      />
                    ) : (
                      <>
                        <div
                          className={`overflow-hidden text-nowrap max-w-[9vw] flex items-center `}
                        >
                          {product.barcode}
                          {checkError?.error?.includes("barcode") &&
                            !product.barcode && (
                              <span className="bg-red-500 text-white text-lg rounded-md">
                                <ExclamationMark weight="bold" />
                              </span>
                            )}
                        </div>
                      </>
                    )}
                  </td>
                  <td
                    className={`w-[14vw] ${
                      checkError?.error?.includes("name") &&
                      "text-red-500 font-bold"
                    }`}
                  >
                    {editAble ? (
                      <input
                      placeholder="Input name"
                        value={editForm?.name}
                        name="name"
                        className="w-[80%] px-2 py-1"
                        onChange={hanldeEditChange}
                      />
                    ) : (
                      <div
                        className={`overflow-hidden text-nowrap max-w-[13vw] flex items-center `}
                      >
                        {product.name}
                        {checkError?.error?.includes("name") &&
                          !product.name && (
                            <span className="bg-red-500 text-white text-lg rounded-md">
                              <ExclamationMark weight="bold" />
                            </span>
                          )}
                      </div>
                    )}
                  </td>
                  <td className="w-[10vw]">
                    <div
                      className={`overflow-hidden text-nowrap max-w-[9vw] flex items-center${
                        checkError?.error?.includes("name") && "text-red-500"
                      }`}
                    >
                      {product.productCategoryName}
                      {checkError?.error?.includes("productCategoryId") && (
                        <span className="bg-red-500 text-white text-lg rounded-md">
                          <ExclamationMark weight="bold" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td
                    className={`w-[10vw] ${
                      checkError?.error?.includes("origin") &&
                      "text-red-500 font-bold"
                    }`}
                  >
                    {editAble ? (
                      <input
                      placeholder="Input origin"
                        value={editForm?.origin}
                        name="origin"
                        className="w-[80%] px-2 py-1"
                        onChange={hanldeEditChange}
                      />
                    ) : (
                      <div className="overflow-hidden text-nowrap max-w-[9vw] flex items-center">
                        {product.origin}
                        {checkError?.error?.includes("origin") &&
                          !product.origin && (
                            <span className="bg-red-500 text-white text-lg rounded-md">
                              <ExclamationMark weight="bold" />
                            </span>
                          )}
                      </div>
                    )}
                  </td>
                  <td
                    className={`w-[7vw] ${
                      checkError?.error?.includes("price") &&
                      "text-red-500 font-bold"
                    }`}
                  >
                    {editAble ? (
                      <input
                      placeholder="Price"
                        type="number"
                        value={editForm?.price}
                        name="price"
                        className="w-[80%] px-2 py-1"
                        onChange={hanldeEditChange}
                      />
                    ) : (
                      <div
                        className={`overflow-hidden text-nowrap max-w-[6vw] flex items-center `}
                      >
                        {product.price}
                        {checkError?.error?.includes("price") &&
                          !product.price && (
                            <span className="bg-red-500 text-white text-lg rounded-md">
                              <ExclamationMark weight="bold" />
                            </span>
                          )}
                      </div>
                    )}
                  </td>
                  <td className="w-[8vw]">
                    {notInDataBase
                      ? new Date().toLocaleDateString("en-GB", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "2-digit",
                        })
                      : new Date(product.createDate).toLocaleDateString(
                          "en-GB",
                          {
                            month: "2-digit",
                            day: "2-digit",
                            year: "2-digit",
                          }
                        )}
                  </td>

                  <td
                    className={`overflow-hidden  ${
                      checkError?.error?.includes("weight") &&
                      "text-red-500 font-bold"
                    }`}
                  >
                    {editAble ? (
                      <input
                      placeholder="Weight"
                        type="number"
                        value={editForm?.weight}
                        name="weight"
                        className="w-[80%] px-2 py-1"
                        onChange={hanldeEditChange}
                      />
                    ) : (
                      <div
                        className={`overflow-hidden text-nowrap max-w-[6vw] flex items-center`}
                      >
                        {product.weight}
                        {checkError?.error?.includes("weight") &&
                          !product.weight && (
                            <span className="bg-red-500 text-white text-lg rounded-md">
                              <ExclamationMark weight="bold" />
                            </span>
                          )}
                      </div>
                    )}
                  </td>
                  {!notInDataBase ? (
                    <td className="w-[6vw] text-center">
                      {product.isInInv ? (
                        <span className="px-5 py-1 rounded-xl bg-green-300 ">
                          Yes
                        </span>
                      ) : (
                        <span className="px-5 py-1 rounded-xl bg-gray-300 ">
                          Not Yet
                        </span>
                      )}
                    </td>
                  ) : editAble ? (
                    <td className="w-[6vw] text-center">
                      <button
                        className="px-5 py-1 rounded-xl bg-green-300 "
                        onClick={handleUpdateEdit}
                      >
                        Save
                      </button>
                    </td>
                  ) : (
                    <td className="w-[6vw] text-center">
                      <button
                        className="px-5 py-1 rounded-xl bg-green-300 "
                        onClick={(e) => handleShowDetailProduct(e, product)}
                      >
                        Edit
                      </button>
                    </td>
                  )}
                  {!notInDataBase ? (
                    <td className="text-end">
                      <button
                        className="text-center align-middle relative "
                        onClick={(e) => handleOpenActionTab(e, product)}
                      >
                        <DotsThreeVertical weight="bold" className="text-2xl" />
                        {openAction === product && (
                          <>
                            <div className="absolute w-full h-full top-0"></div>
                            <div
                              className={`action-tab-container translate-x-1 border ${
                                thisIsTheLastItem ? "-top-[200%]" : "top-[50%]"
                              }`}
                              ref={actionComponent}
                            >
                              <div
                                className="cursor-pointer"
                                onClick={(e) =>
                                  handleShowDetailProduct(e, product)
                                }
                              >
                                Show detail
                              </div>
                              {!product?.isInInv && (
                                <div
                                  className="cursor-pointer"
                                  onClick={(e) => handleDeleteClick(e, product)}
                                >
                                  Delete
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </button>
                    </td>
                  ) : editAble ? (
                    <td className="text-center">
                      <button
                        className="px-5 py-1 rounded-xl bg-red-500 text-white"
                        onClick={(e) => handleShowDetailProduct(e)}
                      >
                        Cancel
                      </button>
                    </td>
                  ) : (
                    <td className="text-center">
                      <button
                        className="text-center align-middle text-2xl relative bg-red-500 text-white p-2 rounded-2xl"
                        onClick={(e) => handleDeleteClick(e, product)}
                      >
                        <X weight="bold" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>
      {!notInDataBase && (
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-5 mt-5">
            <p>{t("RowsPerPage")}:</p>
            <select
              className="outline outline-1 px-1 py-1 rounded-xl"
              onChange={(e) => setIndex(e.target.value)}
              value={index}
            >
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
            </select>
          </div>
          <div className="flex space-x-5 items-center">
            <p>
              {(page + 1) * index - (index - 1)} - {(page + 1) * index} of{" "}
              {response?.totalItemsCount} {t("items")}
            </p>
            <Pagination
              totalPagesCount={response?.totalPagesCount}
              currentPage={page + 1}
              handleLeft={() => setPage(page - 1)}
              handleRight={() => setPage(page + 1)}
              handleChoose={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
