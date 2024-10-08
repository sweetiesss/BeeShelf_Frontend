import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  CaretDown,
  CaretUp,
  FilePlus,
  MagnifyingGlass,
  Plus,
} from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";

export default function ProductHeader({ handleDownload,selectedProducts,products }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-stretch space-x-10 ">
        <p className="text-3xl font-bold">{t("Products")}</p>
        <div className="focus-within:outline-black flex bg-white px-2 pl-4 py-1 rounded-xl outline-2 outline outline-[var(--line-main-color)]">
          <label className="opacity-70">{t("Category")}:</label>
          <select name="category" className="pr-2 outline-none">
            <option>Cosemetic</option>
          </select>
        </div>
        <div className="focus-within:outline-black flex bg-white px-2 pl-4 py-1 rounded-xl outline-2 outline outline-[var(--line-main-color)]">
          <label className="opacity-70">{t("Brand")}:</label>
          <select name="category" className="pr-2 outline-none">
            <option>Ladygaga</option>
          </select>
        </div>
        <div className="flex items-center outline-[var(--line-main-color)] focus-within:outline-black text-[var(--text-second-color)] focus-within:text-[var(--text-main-color)] bg-white px-2 pl-4 py-1 rounded-xl outline-2 outline">
          <MagnifyingGlass size={18} weight="bold" />
          <input
            className="outline-none pl-1 ml-1 border-0 border-l-2 border-[var(--line-main-color)] focus-within:border-black "
            placeholder={t("QuickSearch")}
          />
        </div>
        <NavLink
          to="import_product"
          className="bg-[var(--main-project-color)] px-4 py-1 rounded-xl font-semibold"
        >
          {t("ImportExcel")}
        </NavLink>
        <button
          className="bg-[var(--main-project-color)] px-4 py-1 rounded-xl font-semibold"
          onClick={()=>handleDownload(products)}
        >
          {t("ExportExcel")}
        </button>
      </div>
      <div className="mt-5 flex space-x-10 items-center">
        <select className="pr-1 bg-inherit text-[var(--text-main-color)] font-bold text-xl rounded-xl outline-none">
          <option> {t("INSTOCK")}</option>
          <option>{t("OUTSTOCK")}</option>
        </select>
        <div className="font-semibold ">
          {selectedProducts?.length}/{products?.length} {t("Totalproducts")}
        </div>
        <div
          className={`bg-blue-500 px-3 py-1 rounded-xl ${
            selectedProducts?.length === 0 && "opacity-70"
          }`}
        >
          <select
            className="bg-inherit pr-1"
            disabled={selectedProducts?.length === 0}
          >
            <option> {t("AddtoInventory")}</option>
            <option>{t("Inventory")} A</option>
            <option>{t("Inventory")} B</option>
          </select>
        </div>
        <button
          className={`bg-blue-500 px-3 py-1 rounded-xl ${
            selectedProducts?.length === 0 && "opacity-70"
          }`}
          disabled={selectedProducts?.length === 0}
        >
          {t("Delete")}
        </button>
        <button
          className={`bg-blue-500 px-3 py-1 rounded-xl ${
            selectedProducts?.length === 0 && "opacity-70"
          }`}
          disabled={selectedProducts?.length === 0}
          onClick={() => handleDownload(selectedProducts)}
        >
          {t("ExportExcelSelectedProducts")}
        </button>

        <NavLink
          className="bg-[var(--main-project-color)] px-4 py-1 rounded-xl font-semibold"
          to="add_product"
        >
          + {t("AddProduct")}
        </NavLink>
      </div>
    </div>
  );
}
