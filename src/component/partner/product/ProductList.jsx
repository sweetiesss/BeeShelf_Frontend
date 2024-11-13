import { useTranslation } from "react-i18next";
import Pagination from "../../shared/Paggination";
import { useEffect, useRef, useState } from "react";
import { DotsThreeVertical } from "@phosphor-icons/react";

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
}) {
  const { t } = useTranslation();
  const [openAction, setOpenAction] = useState();
  const handleOpenActionTab = (e, product) => {
    e.stopPropagation();
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
    <div className="mb-3 h-full">
      <table className=" w-full ">
        <thead className="text-[var(--en-vu-500-disable)]">
          <td className="border-b-2 py-4 w-10 text-center px-2">
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
          <td className="border-b-2 py-4 w-28">{t("Image")}</td>
          <td className="border-b-2 py-4 w-[10rem]">{t("Barcode")}</td>
          <td className="border-b-2 py-4 w-[20rem]">{t("Name")}</td>
          <td className="border-b-2 py-4 w-[20rem]">{t("Category")}</td>
          <td className="border-b-2 py-4 w-[20rem]">{t("Origin")}</td>
          <td className="border-b-2 py-4 w-[10rem]">{t("Price")}</td>
          <td className="border-b-2 py-4">{t("Weight")}</td>
          <td className="border-b-2 py-4 "></td>
        </thead>
        <tbody className="overflow-y-auto max-h-[50vh] h-fit ">
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
                     className={`w-4 h-4 rounded-sm ${isProductSelected(product)?"bg-[var(--Xanh-Base)]":"bg-[var(--en-vu-300)]"}`}
                      // checked={isProductSelected(product)}
                      onChange={() => toggleProductSelection(product)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="w-28 h-[6rem]">
                    <img
                      src={product.pictureLink}
                      alt={product.name}
                      className="w-[4rem] h-[4rem] rounded-xl"
                    />
                  </td>
                  <td className="w-[10rem]">{product.barcode}</td>
                  <td className="w-[20rem]">{product.name}</td>
                  <td className="w-[20rem]">{product.productCategoryName}</td>
                  <td className="w-[20rem]">{product.origin}</td>
                  <td className="w-[10rem]">{product.price}</td>
                  <td className="">{product.weight}</td>
                  <td className=" px-4 text-end">
                    <button
                      className="text-center align-middle relative"
                      onClick={(e) => handleOpenActionTab(e, product)}
                    >
                      <DotsThreeVertical weight="bold" className="text-2xl" />
                      {openAction === product && (
                        <div
                          className="action-tab-container translate-x-1"
                          ref={actionComponent}
                        >
                          <div
                            className="cursor-pointer"
                            onClick={(e) => handleShowDetailProduct(e, product)}
                          >
                            Show detail
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={(e) => handleDeleteClick(e, product)}
                          >
                            Delete
                          </div>
                        </div>
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
