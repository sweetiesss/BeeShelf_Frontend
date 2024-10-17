import { useCallback, useContext, useEffect, useState } from "react";
import "../../style/Partner.scss";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import ProductList from "../../component/partner/product/ProductList";
import ProductHeader from "../../component/partner/product/ProductHeader";
import ProductOverview from "../../component/partner/product/ProductOverview";
import AxiosProduct from "../../services/Product";
import { AuthContext } from "../../context/AuthContext";

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
  const [fetching,setFetching]=useState(false);
  const [products, setProducts] = useState();
  const [index, setIndex] = useState(10);
  const [page, setPage] = useState(0);
  const [isShowDetailProduct, setShowDetailProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(null); // Track which product is being confirmed for delete
  const [overall, setOverall] = useState({
    checked: false,
    indeterminate: false,
  });
  const { userInfor } = useContext(AuthContext);
  const { getProductByUserId, deleteProductById } = AxiosProduct();
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
      setProducts(response?.data); // Set the response data to products state
    }, 500),
    [userInfor?.id, index] // Memoize based on these dependencies
  );

  // Fetch data when page or index changes
  useEffect(() => {
    if (userInfor) {
      debouncedFetchProducts(page); // Fetch with the current page
    }
  }, [page, index, userInfor, debouncedFetchProducts,fetching]); // Dependencies that trigger the effect

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
    setShowDeleteConfirmation(product); // Show confirmation for the selected product
  };

  const confirmDelete = async (product) => {
    // Handle product deletion
    try {
      console.log(showDeleteConfirmation);
      const res = await deleteProductById(showDeleteConfirmation?.id);
      console.log(res);
      
    } catch (e) {
      console.log(e);
    } finally {
      setShowDeleteConfirmation(null); // Hide the confirmation after deletion
      setFetching((prev)=>!prev)
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(null); // Hide the confirmation dialog
  };

  return (
    <div className="w-full h-full flex justify-between gap-10">
      <div className="w-fit space-y-10">
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
        />
      </div>
      <ProductOverview />
      {showDeleteConfirmation && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>

          {/* Floating confirmation dialog */}
          <div
            className="absolute bg-white border border-gray-300 shadow-md rounded-lg p-4 w-fit h-fit"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)", // Center horizontally and vertically
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
    </div>
  );
}
