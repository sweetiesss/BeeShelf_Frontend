import { useContext, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useLocation, use, NavLink } from "react-router-dom";
import * as XLSX from "xlsx";
import { AuthContext } from "../../context/AuthContext";
import AxiosProduct from "../../services/Product";
import {
  DownloadSimple,
  MagnifyingGlass,
  Trash,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import ProductList from "../../component/partner/product/ProductList";
import AxiosCategory from "../../services/Category";

export default function ImportProductExcel({ result, setResult }) {
  const [excelDataBase, setExcelDataBase] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductsBase, setSelectedProductsBase] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState();
  const [isDuplicated, checkIsDuplicated] = useState(false);
  const [seen, setSeen] = useState([]);
  const [editForm, setEditForm] = useState();
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState();
  const [sortBy, setSortBy] = useState("Id");
  const [descending, setDescending] = useState(false);
  const [productCategories, setProductCategories] = useState();
  const [errorList, setErrorList] = useState([]);
  const [overall, setOverall] = useState({
    checked: false,
    indeterminate: false,
  });
  const { userInfor } = useContext(AuthContext);
  const { getProductCategoryBy1000 } = AxiosCategory();
  const { createProductsWithUserId } = AxiosProduct();
  const { t } = useTranslation();

  useEffect(() => {
    fetchingBeginData();
  }, []);
  const fetchingBeginData = async () => {
    try {
      const productCategoriesResult = await getProductCategoryBy1000();
      if (productCategoriesResult?.status === 200) {
        setProductCategories(productCategoriesResult?.data?.items);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    const checkCount = selectedProducts.length;
    if (checkCount == 1) {
      setOverall({ checked: true, indeterminate: false });
    } else {
      setOverall({ checked: false, indeterminate: true });
    }
  }, [selectedProducts]);
  useEffect(() => {
    const nameCounts = {};
    let hasDuplicates = false;

    excelData.forEach((item) => {
      const name = item?.name;
      nameCounts[name] = (nameCounts[name] || 0) + 1;
      if (nameCounts[name] > 1) {
        hasDuplicates = true;
      }
    });

    checkIsDuplicated(hasDuplicates);
  }, [excelData]);

  const toggleProductSelection = (product) => {
    if (!editProduct) {
      setSelectedProducts((prevSelected) =>
        prevSelected.some((prev) => prev.id === product.id)
          ? prevSelected.filter((p) => p.id !== product.id)
          : [...prevSelected, product]
      );
      setSelectedProductsBase((prevSelected) =>
        prevSelected.some((prev) => prev.id === product.id)
          ? prevSelected.filter((p) => p.id !== product.id)
          : [...prevSelected, product]
      );
    }
  };

  const isProductSelected = (product) => {
    return selectedProducts.some((p) => p.id === product.id);
  };

  const handleClickOverall = (e) => {
    e.stopPropagation();
    setSelectedProducts([]);
    setSelectedProductsBase([]);
  };

  const handleDownload = (event) => {
    const data = [
      {
        pictureLink: "https://via.placeholder.com/50",
        barcode: "101-elz",
        name: "Example Vegetable A",
        price: 10.0,
        unit: "package",
        isCold: "yes",
        weight: 0.5,
        productCategoryId: 1,
        origin: "Made in USA",
      },
      {
        pictureLink: "https://via.placeholder.com/50",
        barcode: "233-elz",
        name: "Example Fish Can B",
        price: 10.0,
        unit: "package",
        isCold: "yes",
        weight: 0.5,
        productCategoryId: 2,
        origin: "Made in Viet Nam",
      },
    ];

    const ProductCategory = [...productCategories];

    const formattedData = data.map((item) => ({
      ...item,
    }));
    const formattedCategoryData = ProductCategory.map((item) => ({
      ...item,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const categoryWorksheet = XLSX.utils.json_to_sheet(formattedCategoryData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.utils.book_append_sheet(
      workbook,
      categoryWorksheet,
      "ProductCategories"
    );

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
    const maxFileSize = 5 * 1024 * 1024;
    const allowedExtensions = ["xlsx", "xls"];
    setExcelData([]);
    setExcelDataBase([]);
    setErrorList([]);
    setSeen([]);
    if (!file) return; // Exit if no file selected
    if (file.size > maxFileSize) {
      alert("The file is too large. Please upload a file smaller than 5 MB.");
      event.target.value = null; // Clear the file input
      return;
    }
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      alert("Invalid file type. Please upload an Excel file (.xlsx or .xls).");
      event.target.value = null; // Clear the file input
      return;
    }

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
      const updateData = jsonData.map((item, index) => {
        const category = productCategories.find(
          (cate) => cate.id === item.productCategoryId
        );
        console.log("cate", category);

        return {
          ...item,
          id: index,
          isCold:
            item?.isCold?.replace(/\s+/g, "").toLowerCase() === "yes" ? 1 : 0,
          ocopPartnerId: userInfor?.id,
          productCategoryName: category?.typeName,
        };
      });
      const result = validateExcelData(updateData);
      setErrorList(result.inValid);

      setExcelData(updateData);
      setExcelDataBase(updateData);

      console.log(updateData);

      // Optionally set the result if needed
      setResult && setResult(updateData);
      event.target.value = null;
    };

    // Read the file as an array buffer
    reader.readAsArrayBuffer(file);
  };

  const hanldeImportAll = async () => {
    try {
      console.log(excelData);
      const result = await createProductsWithUserId(excelData);
      console.log("cuuuuuuuuuuuuu", result);
      if (result.status == 200) {
        const updatedDataBase = excelDataBase.filter(
          (item) => !excelData.some((da) => da.id === item.id)
        );
        setExcelData([]);
        const result = validateExcelData(updatedDataBase);
        setErrorList(result.inValid);
        setExcelDataBase(updatedDataBase);
      }
      checkDuplicatedData(result?.response?.data?.message);
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const handleImportSelectedProduct = async () => {
    try {
      console.log(selectedProducts);
      const result = await createProductsWithUserId(selectedProducts);
      if (result.status == 200) {
        const updateData = excelData.filter(
          (item) =>
            !selectedProducts.some((selected) => selected.id === item.id)
        );
        const updateDataBase = excelDataBase.filter(
          (item) =>
            !selectedProducts.some((selected) => selected.id === item.id)
        );
        setExcelData(updateData);
        const result = validateExcelData(updateDataBase);
        setErrorList(result.inValid);
        setExcelDataBase(updateDataBase);

        const selectProductBaseUpdated = selectedProductsBase.filter(
          (item) =>
            !selectedProducts.some((selected) => selected.id === item.id)
        );
        setSelectedProducts([]);
        setSelectedProductsBase(selectProductBaseUpdated);
      }
      checkDuplicatedData(result?.response?.data?.message);

      console.log("here", result);
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const handleDeleteClick = (e, product) => {
    e.stopPropagation();
    setShowDeleteConfirmation(product);
  };
  const confirmDelete = () => {
    const updateData = [...excelData];
    const updateDataBase = [...excelDataBase];
    const indexToRemove = updateData.findIndex(
      (item) => item.name === showDeleteConfirmation.name
    );
    const indexToRemoveBase = updateDataBase.findIndex(
      (item) => item.name === showDeleteConfirmation.name
    );
    if (indexToRemove !== -1) {
      updateData.splice(indexToRemove, 1);
      setExcelData(updateData);
    }
    if (indexToRemoveBase !== -1) {
      updateDataBase.splice(indexToRemoveBase, 1);
      const result = validateExcelData(updateDataBase);
      setErrorList(result.inValid);
      setExcelDataBase(updateDataBase);
    }
    cancelDelete();
  };
  const cancelDelete = () => {
    setShowDeleteConfirmation(null);
  };
  const removeDuplicates = () => {
    let uniqueData = [];
    const seenSet = new Set(seen); // Convert the seen list to a Set for faster lookup

    selectedProducts.forEach((item) => {
      const identifier = item.name;
      if (
        !seenSet.has(identifier) &&
        !uniqueData.some((i) => i.name === identifier)
      ) {
        // Add to uniqueData if not in seen list and not already added
        uniqueData.push(item);
      }
    });
    setSelectedProducts(uniqueData);
    setSelectedProductsBase(uniqueData);
    uniqueData = [];

    excelData.forEach((item) => {
      const identifier = item.name;
      if (
        !seenSet.has(identifier) &&
        !uniqueData.some((i) => i.name === identifier)
      ) {
        // Add to uniqueData if not in seen list and not already added
        uniqueData.push(item);
      }
    });
    const uniqueDataBase = excelDataBase.filter(
      (item) => !excelData.some((unique) => unique.id === item.id)
    );

    setExcelData(uniqueData);
    const result = validateExcelData([...uniqueDataBase, ...uniqueData]);
    setErrorList(result.inValid);
    setExcelDataBase([...uniqueDataBase, ...uniqueData]);
    checkIsDuplicated(false); // Reset the duplicated flag
    setSeen([]); // Clear the seen list
  };

  const checkDuplicatedData = (errorMessage) => {
    setSeen([]);
    checkIsDuplicated(false);
    if (errorMessage.includes("Failed to add. Product name already exist.")) {
      // Extract the part after "Product name already exist."
      const extractedList = errorMessage.split(
        "Product name already exist."
      )[1];

      // Remove the trailing comma and split the string into an array
      const productList = extractedList
        .trim()
        .slice(0, -1) // Remove trailing comma
        .split(", ")
        .map((item) => item.trim()); // Trim each item

      console.log(productList);
      if (productList.length > 0) {
        setSeen(productList);
        checkIsDuplicated(true);
      }
    } else {
      console.log("The error message does not contain the specified text.");
    }
  };
  const handleEdit = (e, product) => {
    e.stopPropagation();
    setEditProduct(product);
    setEditForm(product);
  };
  const hanldeEditChange = (e) => {
    let { name, value, checked, type } = e.target;
    if (name === "price" && value <= 0) value = 1;
    if (name === "weight" && value <= 0) value = 0.1;
    if (name === "isCold" && type === "checkbox") value = checked ? 1 : 0;
    console.log("iscold", value);

    setEditForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdateEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editProduct || !editForm) return;
    const updateData = excelData.map((item) =>
      item.id === editProduct.id ? { ...item, ...editForm } : item
    );
    const updateDataBase = excelDataBase.map((item) =>
      item.id === editProduct.id ? { ...item, ...editForm } : item
    );
    const result = validateExcelData(updateDataBase);
    setErrorList(result.inValid);
    setExcelData(updateData);
    setExcelDataBase(updateDataBase);
    console.log("updateData", updateData);

    if (selectedProducts.length > 0) {
      const updatedSelectedProducts = selectedProducts.map((item) =>
        updateData.find((updated) => updated.id == item.id)
      );
      console.log("updateDataSelection", updatedSelectedProducts);

      const result2 = validateExcelData(updatedSelectedProducts);
      setErrorList(result2.inValid);

      setSelectedProducts(updatedSelectedProducts);
      setSelectedProductsBase(updatedSelectedProducts);
    }
    setEditForm(null);
    setEditProduct(null);
  };
  const deleteSelectedProducts = () => {
    if (selectedProducts?.length === 0) return;

    const updatedData = excelData.filter(
      (item) => !selectedProducts.includes(item)
    );
    const updatedDataBase = excelDataBase.filter(
      (item) => !selectedProducts.includes(item)
    );
    const result = validateExcelData(updatedDataBase);
    setErrorList(result.inValid);

    setExcelData(updatedData);
    setExcelDataBase(updatedDataBase);
    setSelectedProducts([]);
    setSelectedProductsBase([]);
    setOverall({ checked: false, indeterminate: false });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value !== "") {
      const updateData = excelDataBase.filter((item) =>
        item.name?.toLowerCase()?.includes(value.toLowerCase())
      );
      setExcelData(updateData);
      const updateSelectedData = selectedProducts.filter((item) =>
        item.name?.toLowerCase()?.includes(value.toLowerCase())
      );
      setSelectedProducts(updateSelectedData);
    } else {
      setExcelData(excelDataBase);
      setSelectedProducts(selectedProductsBase);
    }
  };

  const handleSortChange = (value) => {
    console.log("checkcheck", sortBy === value.toLowerCase());
    let sortd = sortBy;
    let desd = descending;
    if (sortBy === value) {
      setDescending((prev) => !prev);
      desd = !descending;
    } else {
      setSortBy(value);
      sortd = value;
    }
    console.log(sortd);
    console.log(desd);

    const sortedData = [...excelData].sort((a, b) => {
      if (a[sortd.toLowerCase()] < b[sortd.toLowerCase()]) return desd ? 1 : -1;
      if (a[sortd.toLowerCase()] > b[sortd.toLowerCase()]) return desd ? -1 : 1;
      return 0;
    });
    const sortedDataBase = [...excelDataBase].sort((a, b) => {
      if (a[sortd.toLowerCase()] < b[sortd.toLowerCase()]) return desd ? 1 : -1;
      if (a[sortd.toLowerCase()] > b[sortd.toLowerCase()]) return desd ? -1 : 1;
      return 0;
    });

    setExcelData(sortedData);
    setExcelDataBase(sortedDataBase);
  };
  const validateExcelData = (data) => {
    const rules = {
      name: (value) =>
        typeof value === "string" && value.trim() !== "" && value.length > 5,
      origin: (value) => typeof value === "string" && value.trim() !== "",
      price: (value) => !isNaN(Number(value)) && Number(value) > 0, // Convert to a number and check
      barcode: (value) => typeof value === "string" && value.trim() !== "",
      unit: (value) => typeof value === "string" && value.trim() !== "",
      productCategoryId: (value) => !isNaN(Number(value)) && Number(value) > 0, // Convert to a number and check
      weight: (value) => !isNaN(Number(value)) && Number(value) > 0, // Convert to a number and check
    };

    const validateResult = {
      valid: [],
      inValid: [],
    };

    data.forEach((item, index) => {
      const error = [];
      for (const field in rules) {
        if (rules[field] && !rules[field](item[field])) {
          error.push(`${field}`);
        }
      }
      if (error.length > 0) {
        validateResult.inValid.push({
          item,
          error,
        });
      } else {
        validateResult.valid.push(item);
      }
    });
    return validateResult;
  };
  console.log("errorList", errorList);

  return (
    <div>
      <div className="flex space-x-4 font-semibold text-xl mb-6 ">
        <NavLink to="../product" className="opacity-50">
          {t("Product")}
        </NavLink>
        <p>/</p>
        <NavLink to="../product" className="font-bold">
          {t("ImportExcel")}
        </NavLink>
      </div>
      <div className="text-4xl font-semibold">{t("ImportProductsByExcel")}</div>
      <div className="flex justify-between items-center my-6">
        <div className="flex items-center gap-8 ">
          <button
            onClick={handleDownload}
            className="bg-[var(--Xanh-Base)] text-white rounded-2xl p-2 px-4  font-medium hover:bg-[var(--Xanh-700)]  flex items-center gap-2"
          >
            <span className="text-xl">
              <DownloadSimple weight="bold" />
            </span>
            <span className="text-lg">{t("DownloadExcelTemplate")}</span>
          </button>

          <label
            htmlFor="inputFile"
            className="bg-white text-black border-2 border-[var(--en-vu-400)] cursor-pointer py-2 px-5 rounded-2xl flex items-center gap-2 hover:font-semibold hover:text-[var(--Xanh-Base)] hover:border-[var(--Xanh-Base)] w-fit justify-center"
          >
            <span className="text-xl">
              <UploadSimple weight="bold" />
            </span>
            <span>{t("UploadFileExcel")}</span>
          </label>
          <input
            id="inputFile"
            className="hidden"
            type="file"
            accept=".xlsx"
            onChange={handleFileUpload}
          />
        </div>
        {excelDataBase?.length > 0 && (
          <div className="flex items-center">
            <div
              className="outline-[var(--Do-Base)] mr-4 outline-2 outline text-[var(--Do-Base)] cursor-pointer py-2 px-5 rounded-2xl flex items-center gap-2 hover:bg-red-500 hover:text-white justify-center"
              onClick={() => {
                setExcelData([]);
                setExcelDataBase([]);
              }}
            >
              <span className="text-xl">
                <X weight="bold" />
              </span>
              <span>{t("ClearData")}</span>
            </div>
            {isDuplicated && (
              <div
                className="outline-[var(--Do-Base)] outline-2 outline text-[var(--Do-Base)] cursor-pointer py-2 px-5 rounded-2xl flex items-center gap-2 hover:bg-red-500 hover:text-white justify-center"
                onClick={() => {
                  removeDuplicates();
                }}
              >
                <span className="text-xl">
                  <Trash weight="bold" />
                </span>
                <span>{t("RemoveAllDuplicated")}</span>
              </div>
            )}
            <div className="flex items-center justify-end">
              <button
                className="bg-[var(--Xanh-Base)] text-white p-2 mx-4 rounded-xl px-4"
                onClick={hanldeImportAll}
              >
                {t("ImportAll")}
              </button>
            </div>
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
        )}
      </div>

      {excelDataBase?.length > 0 ? (
        excelData.length > 0 ? (
          <>
            <div
              className={`mt-5 flex space-x-10 items-center ${
                selectedProducts?.length > 0 &&
                "bg-[var(--en-vu-200)] rounded-lg"
              }  px-4 py-2 min-h-[1rem]`}
            >
              {/* <select className="pr-1 bg-inherit text-[var(--text-main-color)] font-bold text-xl rounded-xl outline-none">
          <option> {t("INSTOCK")}</option>
          <option>{t("OUTSTOCK")}</option>
        </select> */}
              {selectedProducts?.length > 0 && (
                <>
                  <div className="font-semibold flex items-center">
                    <button onClick={handleClickOverall}>
                      <X weight="bold" className="mr-4" />{" "}
                    </button>
                    {selectedProducts?.length + " "}/
                    {" " + excelData?.length + " "}
                    {t("TotalProducts")}
                  </div>
                  <>
                    <button
                      className={`text-2xl`}
                      disabled={selectedProducts?.length === 0}
                      onClick={deleteSelectedProducts}
                    >
                      <Trash weight="bold" />
                    </button>
                    <button
                      className={`text-2xl`}
                      onClick={handleImportSelectedProduct}
                    >
                      <UploadSimple weight="bold" />
                    </button>
                  </>
                </>
              )}
            </div>
            <ProductList
              products={excelData}
              selectedProducts={selectedProducts}
              toggleProductSelection={toggleProductSelection}
              isProductSelected={isProductSelected}
              overall={overall}
              notInDataBase={true}
              handleDeleteClick={handleDeleteClick}
              handleClickOverall={handleClickOverall}
              handleShowDetailProduct={handleEdit}
              editProduct={editProduct}
              editForm={editForm}
              hanldeEditChange={hanldeEditChange}
              handleUpdateEdit={handleUpdateEdit}
              handleSortChange={handleSortChange}
              sortBy={sortBy}
              descending={descending}
              errorList={errorList}
              productCategories={productCategories}
            />
          </>
        ) : (
          <p className="text-2xl font-semibold">{t("NoItemFound")}</p>
        )
      ) : (
        <p className="text-2xl font-semibold">{t("NoFileUploaded")}</p>
      )}
      {showDeleteConfirmation && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div
            className="absolute bg-white border border-gray-300 shadow-md rounded-lg p-4 w-fit h-fit"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <p>{`${t("AreYouSureWantToDelete")} ${
              showDeleteConfirmation.name
            }?`}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
              >
                {t("Cancel")}
              </button>
              <button
                onClick={() => confirmDelete(showDeleteConfirmation)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                {t("Confirm ")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
