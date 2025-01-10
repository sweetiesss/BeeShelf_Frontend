import { useCallback, useContext, useEffect, useRef, useState } from "react";
import "../../style/Partner.scss";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import ProductList from "../../component/partner/product/ProductList";
import ProductHeader from "../../component/partner/product/ProductHeader";
import ProductOverview from "../../component/partner/product/ProductOverview";
import AxiosProduct from "../../services/Product";
import { AuthContext } from "../../context/AuthContext";
import CreateRequestImport from "../../component/partner/product/CreateRequestImport";
import AxiosInventory from "../../services/Inventory";
import { useDetail } from "../../context/DetailContext";
import { ProductListSkeleton } from "../shared/SkeletonLoader";
import { format } from "date-fns";
import AxiosCategory from "../../services/Category";
import SpinnerLoading from "../../component/shared/Loading";
import { Warning } from "@phosphor-icons/react";

export default function ProductPage() {
  const deleteBox = useRef();
  const { userInfor } = useContext(AuthContext);
  const { getProductByUserId, deleteProductById } = AxiosProduct();
  const { getProductCategoryBy1000 } = AxiosCategory();
  const {
    dataDetail,
    updateDataDetail,
    updateTypeDetail,
    refresh,
    setRefresh,
    createRequest,
    setCreateRequest,
  } = useDetail();
  const { getInventory1000ByUserId } = AxiosInventory();

  const { t } = useTranslation();

  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState();
  const [inventories, setInventory] = useState(null);
  const [index, setIndex] = useState(6);
  const [page, setPage] = useState(0);
  const [isShowDetailProduct, setShowDetailProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductsBased, setSelectedProductsBased] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
  const [productCategories, setProductCategories] = useState(null);
  const [productCate, setProductCate] = useState(0);
  const [overall, setOverall] = useState({
    checked: false,
    indeterminate: false,
  });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("CreateDate");
  const [descending, setDescending] = useState(true);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };
  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (deleteBox.current && !deleteBox.current.contains(event.target)) {
        cancelDelete();
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  const debouncedFetchProducts = useCallback(
    debounce(async (page, index, sortBy, search, descending, productCate) => {
      let thisPage = page;
      if (search) {
        thisPage = 0;
      }
      try {
        setLoading(true);

        const response = await getProductByUserId(
          userInfor?.id,
          thisPage,
          index,
          search,
          sortBy,
          descending,
          productCate
        );
        if (response?.status == 200) {
          setProducts(response?.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300),
    [userInfor?.id]
  );
  useEffect(() => {
    fetchingBeginData();
  }, []);
  useEffect(() => {
    if (userInfor) {
      debouncedFetchProducts(
        page,
        index,
        sortBy,
        search,
        descending,
        productCate
      );
    }
  }, [
    page,
    index,
    sortBy,
    search,
    userInfor,
    fetching,
    descending,
    productCate,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (userInfor && refresh != 0) {
        try {
          setLoading(true);
          const response = await getProductByUserId(
            userInfor?.id,
            page,
            index,
            search,
            sortBy,
            descending,
            productCate
          );
          setProducts(response?.data);

          const updatedItem = response?.data?.items.find(
            (item) => item?.id === refresh
          );
          if (updatedItem) {
            updateDataDetail(updatedItem);
          }
        } catch (error) {
          console.error("Error fetching product data:", error);
        } finally {
          setRefresh(0);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [refresh]);

  useEffect(() => {
    const checkCount = selectedProducts.length;
    if (checkCount == 1) {
      setOverall({ checked: true, indeterminate: false });
    } else {
      setOverall({ checked: false, indeterminate: true });
    }
  }, [selectedProducts]);

  const fetchingBeginData = async () => {
    try {
      setLoading(true);
      const productCategoriesResult = await getProductCategoryBy1000();
      if (productCategoriesResult?.status === 200) {
        setProductCategories(productCategoriesResult?.data?.items);
      }
      const result = await getInventory1000ByUserId(userInfor?.id);
      if (result?.status === 200) {
        setInventory(result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetailProduct = (e, product) => {
    e.stopPropagation();
    setShowDetailProduct(isShowDetailProduct === product ? null : product);
    updateDataDetail(product);
    updateTypeDetail("product");
  };

  const toggleProductSelection = (product) => {
    const isAlreadySelected = selectedProducts.some((p) => p.id === product.id);
    if (isAlreadySelected) {
      setSelectedProducts((prevSelected) =>
        prevSelected.filter((p) => p.id !== product.id)
      );
      setSelectedProductsBased((prevSelectedBased) =>
        prevSelectedBased.filter((p) => p.id !== product.id)
      );
    } else {
      setSelectedProducts((prevSelected) => [...prevSelected, product]);
      setSelectedProductsBased((prevSelectedBased) => [
        ...prevSelectedBased,
        product,
      ]);
    }
  };

  const isProductSelected = (product) =>
    selectedProducts.some((p) => p.id === product.id);

  const handleClickOverall = (e) => {
    e.stopPropagation();
    setSelectedProducts([]);
    setSelectedProductsBased([]);
  };

  const handleDownload = () => {
    const formattedData =
      selectedProducts.length > 0
        ? selectedProducts.map(
            ({
              id,
              productCategoryId,
              price,
              weight,
              isCold,
              isInInv,
              createDate,
              ...item
            }) => ({
              ...item,
              "price (vnd)": price,
              "weight (kg)": weight,
              Cold: isCold === 1 ? true : false,
              createDate: format(createDate, "dd-MM-yyyy"),
            })
          )
        : products?.items?.map(
            ({
              id,
              productCategoryId,
              price,
              weight,
              isCold,
              isInInv,
              createDate,
              ...item
            }) => ({
              ...item,
              "price (vnd)": price,
              "weight (kg)": weight,
              Cold: isCold === 1 ? true : false,
              createDate: format(createDate, "dd-MM-yyyy"),
            })
          );
    const formatDate = () => {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

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

  const handleDeleteClick = (e, product) => {
    e.stopPropagation();
    setShowDeleteConfirmation(product);
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteProductById(showDeleteConfirmation?.id);
    } catch (e) {
    } finally {
      setShowDeleteConfirmation(null);
      setFetching((prev) => !prev);
    }
  };
  const cancelDelete = () => {
    setShowDeleteConfirmation(null);
  };
  const handleClose = () => {
    setCreateRequest(false);
    setFetching((prev) => !prev);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSortChange = (value) => {
    if (sortBy === value) {
      setDescending((prev) => !prev);
    } else {
      setSortBy(value);
    }
  };
  return (
    <div className="w-full h-full gap-10 pb-10">
      <div className="w-full">
        <ProductHeader
          handleDownload={handleDownload}
          products={products}
          selectedProducts={selectedProducts}
          handleClickOverall={handleClickOverall}
          handleSearchChange={handleSearchChange}
          search={search}
          setProductCate={setProductCate}
          productCategories={productCategories}
        />
        {!loading ? (
          <ProductList
            products={products?.items}
            selectedProducts={selectedProducts}
            response={products}
            toggleProductSelection={toggleProductSelection}
            isShowDetailProduct={isShowDetailProduct}
            isProductSelected={isProductSelected}
            overall={overall}
            handleClickOverall={handleClickOverall}
            index={index}
            setIndex={setIndex}
            page={page}
            setPage={setPage}
            handleDeleteClick={handleDeleteClick}
            handleShowDetailProduct={handleShowDetailProduct}
            handleSortChange={handleSortChange}
            sortBy={sortBy}
            descending={descending}
            setDescending={setDescending}
          />
        ) : (
          <div className="w-full mt-4">
            <SpinnerLoading loading={loading} />
          </div>
        )}
      </div>
      {showDeleteConfirmation && (
        // <>
        //   <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div>
        //   <div
        //     className="absolute bg-white border z-10 border-gray-300 shadow-md rounded-lg p-4 w-fit h-fit"
        //     style={{
        //       top: "50%",
        //       left: "50%",
        //       transform: "translate(-50%, -50%)",
        //     }}
        //     ref={deleteBox}
        //   >
        //     <p>{`${t("AreYouSureWantToDelete")} ${
        //       showDeleteConfirmation.name
        //     }?`}</p>
        //     <div className="flex justify-end gap-4">
        //       <button
        //         onClick={cancelDelete}
        //         className="bg-gray-300 text-black px-4 py-2 rounded-md"
        //       >
        //         {t("Cancel")}
        //       </button>
        //       <button
        //         onClick={() => confirmDelete(showDeleteConfirmation)}
        //         className="bg-red-500 text-white px-4 py-2 rounded-md"
        //       >
        //         {t("Confirm")}
        //       </button>
        //     </div>
        //   </div>
        // </>
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div>
          <div
            className="absolute bg-white border border-gray-300 z-10 shadow-md rounded-2xl p-8 w-[30rem] h-fit text-black"
            ref={deleteBox}
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="flex items-center justify-center">
              <div className="text-5xl bg-fit h-fit p-4 bg-[#fff5f6] rounded-full mb-6">
                <Warning weight="fill" color="#fe3f56" />
              </div>
            </div>
            <p className="w-full text-2xl font-semibold text-center  mb-6">
              Delete Product
            </p>
            <p className="text-center w-full text-wrap  mb-6">{`You are going to delete the "${showDeleteConfirmation.name}" product?`}</p>
            <div className="flex justify-between gap-4">
              <button
                onClick={cancelDelete}
                className="bg-[#f5f5f7] text-black px-4 py-2 rounded-3xl w-full"
              >
                {t("No, Keep It.")}
              </button>
              <button
                onClick={() => confirmDelete(showDeleteConfirmation)}
                className="bg-[#fe3f56] text-white px-4 py-2 rounded-3xl w-full"
              >
                {t("Yes, Delete!")}
              </button>
            </div>
          </div>
        </>
      )}
      {createRequest && (
        <CreateRequestImport
          product={dataDetail}
          inventories={inventories}
          type="Import"
          enableSelect={false}
          handleClose={handleClose}
        />
      )}
    </div>
  );
}
