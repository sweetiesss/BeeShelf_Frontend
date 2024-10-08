import { useEffect, useState } from "react";
import "../../style/Partner.scss";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import ProductList from "../../component/partner/product/ProductList";
import ProductHeader from "../../component/partner/product/ProductHeader";
import ProductOverview from "../../component/partner/product/ProductOverview";

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

  return (
    <div className="w-full h-full flex justify-between">
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
        />
      </div>
      <ProductOverview />
    </div>
  );
}
