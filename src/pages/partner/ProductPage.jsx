import { useCallback, useContext, useEffect, useState } from "react";
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

// const products = [
//   {
//     id: 1,
//     image: "https://via.placeholder.com/50", // Replace with real image
//     sku: "101-elz",
//     name: "Silky Creamy Donkey Steam Moisture",
//     group: "A",
//     category: "Cosmetics",
//     price: "$10.00",
//     stock: 23,
//     reserved: 3,
//     tags: ["egf", "retinol", "creams"],
//   },
//   {
//     id: 2,
//     image: "https://via.placeholder.com/50",
//     sku: "233-elz",
//     name: "Elizavecca Gold CF-Nest 97% B-Jo Serum",
//     group: "A",
//     category: "Cosmetics",
//     price: "$10.00",
//     stock: 23,
//     reserved: 3,
//     tags: ["serum", "whitening"],
//   },
//   {
//     id: 3,
//     image: "https://via.placeholder.com/50",
//     sku: "233-elz",
//     name: "Elizavecca Gold CF-Nest 97% B-Jo Serum",
//     group: "A",
//     category: "Cosmetics",
//     price: "$10.00",
//     stock: 23,
//     reserved: 3,
//     tags: ["serum", "whitening"],
//   },
//   {
//     id: 4,
//     image: "https://via.placeholder.com/50",
//     sku: "233-elz",
//     name: "Elizavecca Gold CF-Nest 97% B-Jo Serum",
//     group: "A",
//     category: "Cosmetics",
//     price: "$10.00",
//     stock: 23,
//     reserved: 3,
//     tags: ["serum", "whitening"],
//   },
//   {
//     id: 5,
//     image: "https://via.placeholder.com/50",
//     sku: "233-elz",
//     name: "Elizavecca Gold CF-Nest 97% B-Jo Serum",
//     group: "A",
//     category: "Cosmetics",
//     price: "$10.00",
//     stock: 23,
//     reserved: 3,
//     tags: ["serum", "whitening"],
//   },

//   // Add more products as needed
// ];
export default function ProductPage() {
  const [fetching, setFetching] = useState(false);
  const [products, setProducts] = useState();
  const [inventories, setInventory] = useState(null);
  const [index, setIndex] = useState(10);
  const [page, setPage] = useState(0);
  const [isShowDetailProduct, setShowDetailProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null);
  const [overall, setOverall] = useState({
    checked: false,
    indeterminate: false,
  });
  const [openCreateRequest, setOpenCreateRequest] = useState(false);
  const { userInfor } = useContext(AuthContext);
  const { getProductByUserId, deleteProductById } = AxiosProduct();
  const { updateDataDetail, updateTypeDetail, refresh, setRefresh } =
    useDetail();
  const { getInventory100 } = AxiosInventory();

  const { t } = useTranslation();
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };
  const debouncedFetchProducts = useCallback(
    debounce(async (page) => {
      const response = await getProductByUserId(userInfor?.id, page, index);
      setProducts(response?.data);
    }, 500),
    [userInfor?.id, index]
  );
  useEffect(() => {
    const fetchingData = async () => {
      const result = await getInventory100();
      console.log(result);
      setInventory(result);
    };
    fetchingData();
  }, []);
  useEffect(() => {
    if (userInfor) {
      debouncedFetchProducts(page);
    }
  }, [page, index, userInfor, debouncedFetchProducts, fetching]);

  useEffect(() => {
    const fetchData = async () => {
      if (userInfor && refresh != 0) {
        try {
          const response = await getProductByUserId(userInfor?.id, page, index);
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

  const handleShowDetailProductProduct = (e, product) => {
    e.stopPropagation();
    setShowDetailProduct(isShowDetailProduct === product ? null : product);
    updateDataDetail(product);
    updateTypeDetail("product");
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
  const handleDownload = () => {
    const formattedData =
      selectedProducts.length > 0
        ? selectedProducts.map((item) => ({
            ...item,
          }))
        : products?.items?.map((item) => ({
            ...item,
          }));
    const formatDate = () => {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
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

  const handleDeleteClick = (product) => {
    setShowDeleteConfirmation(product);
  };
  const handleCreateRequest = () => {
    setOpenCreateRequest(true);
    console.log(openCreateRequest);
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

  const handleInputDetail = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setShowDetailProduct((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full h-full gap-10">
      <div className="w-full space-y-10">
        <ProductHeader
          handleDownload={handleDownload}
          products={products}
          selectedProducts={selectedProducts}
        />
        <ProductList
          products={products}
          selectedProducts={selectedProducts}
          toggleProductSelection={toggleProductSelection}
          handleShowDetailProductProduct={handleShowDetailProductProduct}
          isShowDetailProduct={isShowDetailProduct}
          isProductSelected={isProductSelected}
          overall={overall}
          handleClickOverall={handleClickOverall}
          index={index}
          setIndex={setIndex}
          page={page}
          setPage={setPage}
          handleDeleteClick={handleDeleteClick}
          handleCreateRequest={handleCreateRequest}
          handleInputDetail={handleInputDetail}
        />
      </div>
      {/* <ProductOverview /> */}
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
            <p>{`Are you sure you want to delete ${showDeleteConfirmation.name}?`}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => confirmDelete(showDeleteConfirmation)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
      {openCreateRequest && (
        <CreateRequestImport
          product={isShowDetailProduct}
          inventories={inventories}
          handleCancel={() => setOpenCreateRequest(false)}
        />
      )}
    </div>
  );
}
