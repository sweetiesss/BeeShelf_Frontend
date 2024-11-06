// components/partner/product/ProductList.js

import {
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
} from "@phosphor-icons/react";
import DetailProduct from "./DetailProduct"; // Import DetailProduct
import { useTranslation } from "react-i18next";
import Pagination from "../../shared/Paggination";
import { useEffect, useRef, useState } from "react";

export default function ProductList({
  products,
  selectedProducts,
  toggleProductSelection,
  handleShowDetailProductProduct,
  isShowDetailProduct,
  isProductSelected,
  overall,
  handleClickOverall,
  index,
  setIndex,
  page,
  setPage,
  handleDeleteClick,
  handleCreateRequest,
  handleInputDetail,
  setShowUpdateConfirmation,
}) {
  const { t } = useTranslation();
  const [openAction, setOpenAction] = useState();
  const handleOpenActionTab = (e,product) => {
    e.stopPropagation()
    if (product === openAction) {
      setOpenAction();
    } else {
      setOpenAction(product);
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
  return (
    <div className="shadow-lg bg-white rounded-lg p-4 mb-3 overflow-y-scroll max-h-[70vh]">
      <table className=" w-full">
        <thead>
          <td className="">
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
          </td>
          <td className=""></td>
          <td className="">{t("SKU")}</td>
          <td className="">{t("Name")}</td>
          <td className="">{t("Group")}</td>
          <td className="">{t("Category")}</td>
          <td className="">{t("Price")}</td>
          <td className="">{t("Weight")}</td>
          <td className=""></td>
        </thead>
        <tbody>
          {products &&
            products?.items?.map((product) => {
              let chooice = selectedProducts.includes(product);
              return (
                <tr
                  key={product.id}
                  className={`
                    hover:bg-gray-100 border-t-2 
                  cursor-pointer ${chooice ? "bg-[var(--second-color)]" : ""}`}
                  onClick={() => toggleProductSelection(product)}
                >
                  <td className="">
                    <input
                      type="checkbox"
                      checked={isProductSelected(product)}
                      onChange={() => toggleProductSelection(product)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className=" flex justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-20 w-20 rounded-xl"
                    />
                  </td>
                  <td className="">{product.sku}</td>
                  <td className="">{product.name}</td>
                  <td className="">
                    <select
                      defaultValue={product.group}
                      className="border p-1 rounded-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </td>
                  <td className="">
                    {product.productCategoryName}
                  </td>
                  <td className="">{product.price}</td>
                  <td className="">{product.weight}</td>
                  <td
                    className=" relative"
                    // onClick={(e) => handleShowDetailProductProduct(e, product)}
                  >
                    <button
                      className="text-center align-middle bg-red-500"
                      onClick={(e) => handleOpenActionTab(e,product)}
                    >
                      ...
                    </button>
                    {openAction === product && (
                      <div
                        className="action-tab-container translate-x-1"
                        ref={actionComponent}
                      >
                        <button
                          onClick={(e) =>
                            handleShowDetailProductProduct(e, product)
                          }
                        >
                          Show detail
                        </button>
                        <div>Delete</div>
                      </div>
                    )}
                    {/* <button
                      className={`border-2 px-2 rounded-xl shadow-lg text-2xl ${
                        check
                          ? "border-[var(--line-oposite-color)] text-[var(--text-main-color)]"
                          : "text-[var(--text-second-color)]"
                      } `}
                      onClick={(e) =>
                        handleShowDetailProductProduct(e, product)
                      }
                    >
                      {check ? (
                        <CaretUp weight="fill" />
                      ) : (
                        <CaretDown weight="fill" />
                      )}
                    </button> */}
                  </td>
                  {/* {check && (
                    <DetailProduct
                      product={isShowDetailProduct}
                      handleDeleteClick={handleDeleteClick}
                      handleCreateRequest={handleCreateRequest}
                      handleInputDetail={handleInputDetail}
                      setShowUpdateConfirmation={setShowUpdateConfirmation}
                    />
                  )} */}
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
