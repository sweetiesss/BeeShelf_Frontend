import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useLocation,use, NavLink } from "react-router-dom";
import * as XLSX from "xlsx";

export default function ImportProductExcel({ result, setResult }) {

  
  const [excelData, setExcelData] = useState([]);
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

  const handleDownload = (event) => {
    const data = [
      {
        id: 1,
        image: "https://via.placeholder.com/50",
        sku: "101-elz",
        name: "Example Creamy A",
        group: "A",
        category: "Cosmetics",
        price: "$10.00",
        stock: 23,
        reserved: 3,
        tags: ["example", "A", "creams"],
      },
      {
        id: 2,
        image: "https://via.placeholder.com/50",
        sku: "233-elz",
        name: "Example Creamy B",
        group: "B",
        category: "Cosmetics",
        price: "$10.00",
        stock: 23,
        reserved: 3,
        tags: ["serum", "example"],
      },
    ];

    const formattedData = data.map((item) => ({
      ...item,
      tags: item.tags.join(", "), // Converting array to comma-separated string
    }));

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
    link.download = `${t("ProductTemplateName")}.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return; // Exit if no file selected

    // Create a file reader
    const reader = new FileReader();

    // When the file is loaded, process it
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming the first sheet is the one we want
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert sheet to JSON format
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Update state with the JSON data
      setExcelData(jsonData);

      // Optionally set the result if needed
      setResult && setResult(jsonData);
    };

    // Read the file as an array buffer
    reader.readAsArrayBuffer(file);
  };
  console.log(excelData);
  

  return (
    <div>
      <div className="flex space-x-4 font-semibold text-xl mb-10 ">
        <NavLink to="../product" className="opacity-50">{t("Product")}</NavLink>
        <p>/</p>
        <NavLink to="../product" className="font-bold">{t("ImportExcel")}</NavLink>
      </div>
      <button onClick={handleDownload} className="bg-black text-white p-2 mb-4">
        {t("DownloadExcelTemplate")}
      </button>
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileUpload}
        className="mb-4"
      />

      <p className="text-2xl font-semibold">{t("DatafromExcelfile")}</p>
      {excelData.length > 0 && (
        <div>
          <div className="flex items-center justify-end">
            <p>
              {selectedProducts.length}/{excelData.length} {t("Totalproducts")}
            </p>
            <button
              className={` bg-black text-white p-2 mx-4  ${
                selectedProducts.length === 0 && "opacity-70"
              }`}
              disabled={selectedProducts.length === 0}
            >
              {t("ImportSelectedProducts")}
            </button>
            <button className="bg-black text-white p-2 mx-4">
              {t("ImportAllProducts")}
            </button>
          </div>
          <div className="p-4">
            <div className="shadow-lg bg-white rounded-lg p-4 custome-import-table mb-3">
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

              {excelData.map((product) => {
                let chooice =
                  selectedProducts.filter((pro) => pro == product).length > 0
                    ? true
                    : false;
                return (
                  <div
                    className={` hover:bg-gray-100 border-t-2 cursor-pointer ${
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
                      <div className=" px-1 py-2 column-9"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
