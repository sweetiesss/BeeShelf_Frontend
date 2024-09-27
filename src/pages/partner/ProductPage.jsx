import {
  ArrowLeft,
  ArrowRight,
  CaretDown,
  CaretUp,
  FilePlus,
  MagnifyingGlass,
  Plus,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import "../../style/Partner.scss";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import * as XLSX from "xlsx";

const products = [
  {
    id: 1,
    image: "https://via.placeholder.com/50", // Replace with real image
    sku: "101-elz",
    name: "Silky Creamy Donkey Steam Moisture",
    group: "A",
    category: "Cosmetics",
    price: "$10.00",
    stock: 23,
    reserved: 3,
    tags: ["egf", "retinol", "creams"],
  },
  {
    id: 2,
    image: "https://via.placeholder.com/50",
    sku: "233-elz",
    name: "Elizavecca Gold CF-Nest 97% B-Jo Serum",
    group: "A",
    category: "Cosmetics",
    price: "$10.00",
    stock: 23,
    reserved: 3,
    tags: ["serum", "whitening"],
  },
  {
    id: 3,
    image: "https://via.placeholder.com/50",
    sku: "233-elz",
    name: "Elizavecca Gold CF-Nest 97% B-Jo Serum",
    group: "A",
    category: "Cosmetics",
    price: "$10.00",
    stock: 23,
    reserved: 3,
    tags: ["serum", "whitening"],
  },
  {
    id: 4,
    image: "https://via.placeholder.com/50",
    sku: "233-elz",
    name: "Elizavecca Gold CF-Nest 97% B-Jo Serum",
    group: "A",
    category: "Cosmetics",
    price: "$10.00",
    stock: 23,
    reserved: 3,
    tags: ["serum", "whitening"],
  },
  {
    id: 5,
    image: "https://via.placeholder.com/50",
    sku: "233-elz",
    name: "Elizavecca Gold CF-Nest 97% B-Jo Serum",
    group: "A",
    category: "Cosmetics",
    price: "$10.00",
    stock: 23,
    reserved: 3,
    tags: ["serum", "whitening"],
  },

  // Add more products as needed
];
export default function ProductPage() {
  const [isShowDetailProduct, setShowDetailProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [overall, setOverall] = useState({
    checked: false,
    indeterminate: false,
  });
  const { t } = useTranslation();
  useEffect(() => {
    const checkCount = selectedProducts.length;
    if (checkCount == 1) {
      setOverall({ checked: true, indeterminate: false });
    } else {
      setOverall({ checked: false, indeterminate: true });
    }
  }, [selectedProducts]);

  const handleShowDetailProductProduct = (e, product) => {
    e.stopPropagation();
    setShowDetailProduct(isShowDetailProduct === product ? null : product);
  };

  const toggleProductSelection = (product) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(product)
        ? prevSelected.filter((p) => p !== product)
        : [...prevSelected, product]
    );
  };

  const isProductSelected = (product) => {
    return selectedProducts.includes(product);
  };

  const handleClickOverall = (e) => {
    e.stopPropagation();
    setSelectedProducts([]);
  };
  const handleDownload = (data) => {
    const formattedData = data.map((item) => ({
      ...item,
      tags: item.tags.join(", "), // Converting array to comma-separated string
    }));
    const formatDate = () => {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${day}-${month}-${year}-${hours}h-${minutes}m-${seconds}s`;
    };

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    link.download = `${t("Products")}-${formatDate()}.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const DetailProduct = () => {
    return (
      <div className="detail-product px-8">
        <div className=" p-4 ">
          <div className="flex justify-between">
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={isShowDetailProduct.image}
                  alt={isShowDetailProduct.name}
                  className="h-56 w-56 rounded-xl"
                />
                <div
                  className="absolute top-3 right-3 w-5 h-5 flex justify-center items-center
               opacity-50 hover:opacity-100  
               bg-white rounded-full
               "
                  onClick={(e) => e.stopPropagation()}
                >
                  <Plus weight="bold" />
                </div>
              </div>
              <div className="flex items-center justify-between px-4">
                <div className="px-2 py-1 border-[var(--line-main-color)]  border-2  bg-white rounded-xl shadow-lg">
                  <ArrowLeft className="" weight="bold" />
                </div>
                <p className="">1 of 3</p>
                <div className="px-2 py-1 border-[var(--line-main-color)]  border-2 bg-white rounded-xl shadow-lg">
                  <ArrowRight className="" weight="bold" />
                </div>
              </div>
            </div>
            <div className="w-[35%]">
              <div>
                <div className="">
                  <div className="label">{t("DisplayName")}</div>
                  <input
                    onClick={(e) => e.stopPropagation()}
                    className="w-full"
                    value={isShowDetailProduct.name}
                  />
                </div>
                <div className="flex justify-between w-full">
                  <div className="w-[30%]">
                    <div className="label">{t("SKU")}</div>
                    <input
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                      value={isShowDetailProduct.sku}
                    />
                  </div>
                  <div className="w-[60%]">
                    <div className="label">{t("Barcode")}</div>
                    <input
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                      value={isShowDetailProduct.sku}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-[45%]">
                    <div className="label">{t("Brand")}</div>
                    <input
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                      value={isShowDetailProduct.sku}
                    />
                  </div>
                  <div className="w-[45%]">
                    <div className="label">{t("Vendor")}</div>
                    <input
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                      value={isShowDetailProduct.sku}
                    />
                  </div>
                </div>
                <div className="flex space-x-4 w-full justify-between">
                  <div className="w-[26%]">
                    <div className="label">{t("Stock")}: </div>
                    <input
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                      value={isShowDetailProduct.stock}
                    />
                  </div>
                  <div className="w-[26%]">
                    <div className="label">{t("Size")}: </div>
                    <input
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                      value={isShowDetailProduct.stock}
                    />
                  </div>
                  <div className="w-[26%]">
                    <div className="label">Reserved: </div>
                    <input
                      className="w-full"
                      onClick={(e) => e.stopPropagation()}
                      value={isShowDetailProduct.reserved}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[35%] bg-red-500">
              <p className="text-sm text-gray-500">{t("Tags")}:</p>
              <div className="flex gap-2">
                {isShowDetailProduct.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-200 text-sm rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="flex justify-between py-2 pb-4">
          <button className="px-4 py-2">{t("Reset")}</button>
          <div className="space-x-10">
            <button className="px-4 py-2">{t("Update")}</button>
            <button className="px-4 py-2">{t("Delete")}</button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="w-full h-full flex justify-between">
      <div className="w-fit">
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
          <button className="bg-[var(--main-project-color)] px-4 py-1 rounded-xl font-semibold" onClick={()=>handleDownload(products)}>
            {t("ExportExcel")}
          </button>
        </div>
        <div className="mt-5 flex space-x-10 items-center">
          <select className="pr-1 bg-inherit text-[var(--text-main-color)] font-bold text-xl rounded-xl outline-none">
            <option> {t("INSTOCK")}</option>
            <option>{t("OUTSTOCK")}</option>
          </select>
          <div className="font-semibold ">
            {selectedProducts.length}/{products.length} {t("Totalproducts")}
          </div>
          <div
            className={`bg-blue-500 px-3 py-1 rounded-xl ${
              selectedProducts.length === 0 && "opacity-70"
            }`}
          >
            <select
              className="bg-inherit pr-1"
              disabled={selectedProducts.length === 0}
            >
              <option> {t("AddtoInventory")}</option>
              <option>{t("Inventory")} A</option>
              <option>{t("Inventory")} B</option>
            </select>
          </div>
          <button
            className={`bg-blue-500 px-3 py-1 rounded-xl ${
              selectedProducts.length === 0 && "opacity-70"
            }`}
            disabled={selectedProducts.length === 0}
          >
            {t("Delete")}
          </button>
          <button
            className={`bg-blue-500 px-3 py-1 rounded-xl ${
              selectedProducts.length === 0 && "opacity-70"
            }`}
            disabled={selectedProducts.length === 0}
            onClick={()=>handleDownload(selectedProducts)}
          >
            {t("ExportExcelSelectedProducts")}
          </button>

          <button className="bg-[var(--main-project-color)] px-4 py-1 rounded-xl font-semibold">
            + {t("AddProduct")}
          </button>
        </div>
        <div className="p-4">
          <div className="shadow-lg bg-white rounded-lg p-4 custome-table mb-3">
            <div className="flex w-full">
              <div className="text-left pb-2  column-1">
                {selectedProducts.length > 0 ? (
                  <input
                    type="checkbox"
                    checked={overall.checked}
                    onChange={handleClickOverall}
                    ref={(input) =>
                      input && (input.indeterminate = overall.indeterminate)
                    }
                  />
                ) : (
                  "#"
                )}
              </div>
              <div className="text-left pb-2   column-2"></div>
              <div className="text-left pb-2 column-3">{t("SKU")}</div>
              <div className="text-left pb-2  column-4">{t("Name")}</div>
              <div className="text-left pb-2  column-5">{t("Group")}</div>
              <div className="text-left pb-2 column-6">{t("Category")}</div>
              <div className="text-left pb-2  column-7 ">{t("Price")}</div>
              <div className="text-left pb-2  column-8 ">{t("Tags")}</div>
              <div className="text-left pb-2  column-9 "></div>
            </div>
            {products.map((product) => {
              let check = isShowDetailProduct === product;
              let chooice =
                selectedProducts.filter((pro) => pro == product).length > 0
                  ? true
                  : false;
              return (
                <div
                  className={` ${
                    check
                      ? " bg-[var(--main-color)]  border-2 rounded-xl shadow-xl "
                      : "hover:bg-gray-100 border-t-2 "
                  } cursor-pointer ${
                    chooice ? "bg-[var(--second-color)]" : ""
                  }`}
                  onClick={() => toggleProductSelection(product)}
                  key={product.id}
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
                    <div className=" px-1 py-2 column-6">
                      {product.category}
                    </div>
                    <div className=" px-1 py-2 column-7">{product.price}</div>
                    <div className=" px-1 py-2 column-8">{product.tags}</div>
                    <div className=" px-1 py-2 column-9">
                      <button
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
                      </button>
                    </div>
                  </div>
                  {check && <DetailProduct />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="bg-[var(--main-color)] w-fit flex-grow p-10 rounded-xl shadow-xl border-2 border-[var(--line-main-color)] h-fit">
        <div className="font-semibold text-xl mb-5">{t("OVERVIEW")}</div>
        <div className="mb-3">
          <div className="text-[var(--text-second-color)]">{t("Skutotal")}</div>
          <div className="text-2xl font-semibold">12,312</div>
        </div>
        <div className="mb-3">
          <div className="text-[var(--text-second-color)]">
            {t("ProductReserved")}
          </div>
          <div className="text-2xl font-semibold">122</div>
        </div>
        <div className="mb-3">
          <div className="text-[var(--text-second-color)]">
            {t("StockIssue")}
          </div>
          <div className="text-2xl font-semibold">1</div>
        </div>
      </div>
    </div>
  );
}
