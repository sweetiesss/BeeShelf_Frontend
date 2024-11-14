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
} from "@phosphor-icons/react";

export default function ProductList({
  products,
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
            <th className="border-b-2 py-4 w-10 text-center px-2">
              {selectedProducts.length > 0 ? (
                <input
                  type="checkbox"
                  checked={overall?.checked}
                  onChange={handleClickOverall}
                  ref={(input) =>
                    input && (input.indeterminate = overall?.indeterminate)
                  }
                />
              ) : (
                "#"
              )}
            </th>
            <th className="border-b-2 text-left py-4 w-[7vw]">{t("Image")}</th>
            <th className="border-b-2 text-left py-4 w-[10vw]">
              {t("Barcode")}
            </th>

            <th
              className={`border-b-2 text-left py-4 w-[14vw] cursor-pointer ${
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
              className={`border-b-2 text-left py-4 w-[10vw] cursor-pointer ${
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
              className={`border-b-2 text-left py-4 w-[7vw] cursor-pointer ${
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
              className={`border-b-2 text-left py-4 cursor-pointer w-[8vw] ${
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
              className={`border-b-2 text-left py-4 cursor-pointer ${
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

            <th className="border-b-2  py-4 w-[6vw] text-center">
              {t("InInventory")}
            </th>
            <th className="border-b-2 text-left py-4 "></th>
          </tr>
        </thead>
        <tbody className="overflow-y-auto max-h-[60vh] pb-[4rem] h-fit pl-4">
          {products &&
            products?.items?.map((product) => {
              let chooice = selectedProducts.includes(product);
              return (
                <tr
                  key={product.id}
                  className={`
                    hover:bg-[var(--Xanh-100)] border-t-2 
                  ${chooice ? "bg-[var(--Xanh-100)]" : ""} font-medium`}
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
                  <td className="w-[10vw]">{product.barcode}</td>
                  <td className="w-[14vw]">{product.name}</td>
                  <td className="w-[10vw]">{product.productCategoryName}</td>
                  <td className="w-[10vw]">{product.origin}</td>
                  <td className="w-[7vw]">{product.price}</td>
                  <td className="w-[8vw]">
                    {new Date(product.createDate).toLocaleDateString("en-GB", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                    })}
                  </td>
                    <td className="">{product.weight}</td>
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
                </tr>
              );
            })}
        </tbody>
      </table>

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
            {products?.totalItemsCount} {t("items")}
          </p>
          <Pagination
            totalPagesCount={products?.totalPagesCount}
            currentPage={page + 1}
            handleLeft={() => setPage(page - 1)}
            handleRight={() => setPage(page + 1)}
            handleChoose={setPage}
          />
        </div>
      </div>
    </div>
  );
}
