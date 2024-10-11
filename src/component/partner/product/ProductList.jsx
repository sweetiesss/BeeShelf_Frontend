// components/partner/product/ProductList.js

import { CaretDown, CaretUp } from "@phosphor-icons/react";
import DetailProduct from "./DetailProduct"; // Import DetailProduct
import { useTranslation } from "react-i18next";

export default function ProductList({
  products,
  selectedProducts,
  toggleProductSelection,
  handleShowDetailProductProduct,
  isShowDetailProduct,
  isProductSelected,
  overall,
  handleClickOverall
}) {
  const { t } = useTranslation();
  return (
    <div className="shadow-lg bg-white rounded-lg p-4 custome-table mb-3 overflow-y-scroll max-h-[70vh]">
      <div className="flex w-full">
        <div className="text-left pb-2  column-1">
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
        </div>
        <div className="text-left pb-2 column-2"></div>
        <div className="text-left pb-2 column-3">{t("SKU")}</div>
        <div className="text-left pb-2 column-4">{t("Name")}</div>
        <div className="text-left pb-2 column-5">{t("Group")}</div>
        <div className="text-left pb-2 column-6">{t("Category")}</div>
        <div className="text-left pb-2 column-7">{t("Price")}</div>
        <div className="text-left pb-2 column-8">{t("Tags")}</div>
        <div className="text-left pb-2 column-9"></div>
      </div>
      {products.map((product) => {
        let check = isShowDetailProduct === product;
        let chooice = selectedProducts.includes(product);
        return (
          <div key={product.id}>
            <div
              className={`${
                check
                  ? " bg-[var(--main-color)]  border-2 rounded-xl shadow-xl "
                  : "hover:bg-gray-100 border-t-2 "
              } cursor-pointer ${chooice ? "bg-[var(--second-color)]" : ""}`}
              onClick={() => toggleProductSelection(product)}
            >
              <div className="flex items-center">
                <div className=" px-1 py-2 column-1">
                  <input
                    type="checkbox"
                    checked={isProductSelected(product)}
                    onChange={() => toggleProductSelection(product)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className=" px-1 py-2 column-2 flex justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-20 w-20 rounded-xl"
                  />
                </div>
                <div className=" px-1 py-2 column-3">{product.sku}</div>
                <div className=" px-1 py-2 column-4">{product.name}</div>
                <div className=" px-1 py-2 column-5">
                  <select
                    defaultValue={product.group}
                    className="border p-1 rounded-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div className=" px-1 py-2 column-6">{product.category}</div>
                <div className=" px-1 py-2 column-7">{product.price}</div>
                <div className=" px-1 py-2 column-8">{product.tags}</div>
                <div className=" px-1 py-2 column-9">
                  <button
                    className={`border-2 px-2 rounded-xl shadow-lg text-2xl ${
                      check
                        ? "border-[var(--line-oposite-color)] text-[var(--text-main-color)]"
                        : "text-[var(--text-second-color)]"
                    } `}
                    onClick={(e) => handleShowDetailProductProduct(e, product)}
                  >
                    {check ? (
                      <CaretUp weight="fill" />
                    ) : (
                      <CaretDown weight="fill" />
                    )}
                  </button>
                </div>
              </div>
              {check && <DetailProduct product={product} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
