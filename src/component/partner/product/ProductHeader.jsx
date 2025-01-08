import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  CaretDown,
  CaretLeft,
  CaretUp,
  DownloadSimple,
  FilePlus,
  MagnifyingGlass,
  Plus,
  Trash,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";
import Select from "react-select";

export default function ProductHeader({
  handleDownload,
  selectedProducts,
  handleClickOverall,
  products,
  productCategories,
  inInventory,
  setInventory,
  handleSearchChange,
  search,
  setProductCate,
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-10">
      <div className="">
        <div className="flex items-center space-x-3">
          {inInventory && (
            <div
              className="font-bold text-2xl cursor-pointer"
              onClick={() => setInventory("")}
            >
              <CaretLeft weight="bold" />
            </div>
          )}
          <p className="text-3xl font-bold">{t("Products")}</p>
        </div>
        <div className="flex items-center w-full justify-between mt-4">
          <div className="flex items-center w-fit gap-10">
            <div className="focus-within:outline-black  relative items-center flex bg-white rounded-xl outline-2 outline outline-[var(--line-main-color)]">
              <label className="opacity-70 absolute left-2 top-[0.45rem] z-20 pointer-events-none">
                {t("Category")}:
              </label>
              <Select
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    borderRadius: "0.75rem",
                    overflowY: "hidden", 
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    padding: 0,
                    borderRadius: "0.75rem",
                    maxHeight: "7.5rem",
                    overflowY: "auto",
                  }),
                  control: (baseStyles) => ({
                    ...baseStyles,
                    border: "0px",
                    boxShadow: "0px",
                    paddingLeft: "6rem",
                    borderRadius: "0.75rem",
                  }),
                  option: (baseStyles, { isFocused, isSelected }) => ({
                    ...baseStyles,

                    backgroundColor: isSelected
                      ? "#0056b3"
                      : isFocused
                      ? "#e7f3ff"
                      : "white",
                    color: isSelected ? "white" : "black",
                    cursor: "pointer",
                    padding: "0.5rem 1rem", 
                    textAlign: "left", 
                  }),
                }}
                onChange={(selectedOption) =>
                  setProductCate(selectedOption.value)
                }
                options={[
                  { value: 0, label: "Select category" },
                  ...(Array.isArray(productCategories)
                    ? productCategories.map((category) => ({
                        value: category.id,
                        label: category.typeName,
                      }))
                    : []),
                ]}
                placeholder="Select category"
                className="w-[23rem]"
              />
            </div>
          </div>
          <div className="flex items-center w-fit gap-10">
            {!inInventory && (
              <NavLink
                to="import_product"
                className="outline-2 outline flex items-center gap-2 outline-[var(--line-main-color)] text-[var(--en-vu-500-disable)] hover:outline-[var(--Xanh-Base)] hover:text-black  pr-4 pl-3 py-1 rounded-xl font-semibold"
              >
                <div>
                  <DownloadSimple className="text-xl" weight="bold" />
                </div>
                <p>{t("ImportExcel")}</p>
              </NavLink>
            )}
            <button
              className="outline-2 outline flex items-center gap-2 outline-[var(--line-main-color)] text-[var(--en-vu-500-disable)] hover:outline-[var(--Xanh-Base)] hover:text-black  pr-4 pl-3 py-1 rounded-xl font-semibold"
              onClick={() => handleDownload(products)}
            >
              <div>
                <UploadSimple className="text-xl" weight="bold" />
              </div>
              <p>{t("ExportExcel")}</p>
            </button>
            <NavLink
              className="outline-2 outline flex items-center gap-2 outline-[var(--line-main-color)] text-[var(--en-vu-500-disable)] hover:outline-[var(--Xanh-Base)] hover:text-black  pr-4 pl-3 py-1 rounded-xl font-semibold"
              to="add_product"
            >
              + {t("AddProduct")}
            </NavLink>
            <div
              className={`flex items-center focus-within:outline-black  focus-within:text-[var(--text-main-color)] bg-white px-2 pl-4 py-1 rounded-xl outline-2 outline ${
                search
                  ? "outline-black text-[var(--text-main-color)]"
                  : "outline-[var(--line-main-color)] text-[var(--text-second-color)]"
              }`}
            >
              <MagnifyingGlass size={18} weight="bold" />
              <input
                className={`outline-none pl-1 ml-1 border-0 border-l-2  focus-within:border-black ${
                  search ? "border-black" : "border-[var(--line-main-color)]"
                }`}
                placeholder={t("Search")}
                onChange={handleSearchChange}
                value={search}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mt-5 flex space-x-10 items-center ${
          selectedProducts?.length > 0 && "bg-[var(--en-vu-200)] rounded-lg"
        }  px-4 py-2 min-h-[1rem]`}
      >
        {selectedProducts?.length > 0 && (
          <>
            <div className="font-semibold flex items-center">
              <button onClick={handleClickOverall}>
                <X weight="bold" className="mr-4" />{" "}
              </button>
              {selectedProducts?.length}/{products?.totalItemsCount}{" "}
              {t("Totalselectedproducts")}
            </div>
            {inInventory ? (
              <>
                <button
                  className="bg-[var(--main-project-color)] px-4 py-1 rounded-xl font-semibold"
                  to="add_product"
                >
                  + {t("Request Import Products")}
                </button>
                <button
                  className="bg-[var(--main-project-color)] px-4 py-1 rounded-xl font-semibold"
                  to="add_product"
                >
                  - {t("Request Export Products")}
                </button>
              </>
            ) : (
              <>
               
                <button
                  className={`text-2xl`}
                  disabled={selectedProducts?.length === 0}
                  onClick={() => handleDownload(selectedProducts)}
                >
                  <UploadSimple weight="bold" />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
