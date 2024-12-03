import React, { useContext, useEffect, useState } from "react";
import "../../style/AddProductPage.scss"; // Import CSS file for styling
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AxiosProduct from "../../services/Product";
import { toast } from "react-toastify";
import AxiosImg from "../../services/Img";
import AxiosCategory from "../../services/Category";
import Select from "react-select";

export default function AddProductPage() {
  const { userInfor } = useContext(AuthContext);
  const { createProductWithUserId } = AxiosProduct();
  const [productCategories, setProductCategories] = useState();
  const { uploadImage } = AxiosImg();
  const defaultForm = {
    ocopPartnerId: userInfor.id,
    barcode: "",
    name: "",
    unit: "",
    isCold: 0,
    price: null,
    weight: null,
    productCategoryId: null,
    pictureLink: "",
    origin: "",
  };
  const [product, setProduct] = useState(defaultForm);

  const [imageLink, setImageLink] = useState();
  const [imagePreview, setImagePreview] = useState("");

  const [errors, setErrors] = useState({});

  const { t } = useTranslation();
  const { getProductCategoryBy1000 } = AxiosCategory();

  useEffect(() => {
    fetchingBeginData();
  }, []);

  const fetchingBeginData = async () => {
    try {
      const productCategoriesResult = await getProductCategoryBy1000();
      console.log(productCategoriesResult);
      if (productCategoriesResult?.status == 200) {
        setProductCategories(productCategoriesResult?.data?.items);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (
      name
      // case "image":
      //   if (!value || !isValidURL(value)) {
      //     errorMessage = "Please enter a valid image URL.";
      //   }
      //   break;
      // case "sku":
      //   if (!value) {
      //     errorMessage = "SKU is required.";
      //   }
      //   break;
      // case "group":
      //   if (!value) {
      //     errorMessage = "Group is required.";
      //   }
      //   break;
      // case "tags":
      //   if (!value) {
      //     errorMessage = "Tags are required.";
      //   }
      //   break;
      // case "name":
      //   if (!value) {
      //     errorMessage = "";
      //   } else if (!/^[A-Z]/.test(value)) {
      //     errorMessage = "Product name must start with a capital letter.";
      //   }
      //   break;
      // case "price":
      //   if (!value || isNaN(value) || value <= 0) {
      //     errorMessage = "Please enter a valid price.";
      //   }
      //   break;
      // case "category":
      //   if (!value) {
      //     errorMessage = "Category is required.";
      //   }
      //   break;
      // case "stock":
      //   if (!value || isNaN(value) || value < 0) {
      //     errorMessage = "Please enter a valid stock number.";
      //   }
      //   break;
      // default:
      //   break;
    ) {
    }

    // Update the errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const isValidURL = (url) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // Protocol
        "((([a-zA-Z0-9$_.+!*'(),-]+)(:[a-zA-Z0-9$_.+!*'(),-]+)?@)?)" + // Authentication
        "([a-zA-Z0-9.-]+)(:[0-9]{2,5})?" + // Host and port
        "(\\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?" // Path
    );
    return urlPattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    try {
      console.log(product);
      const result = await createProductWithUserId(product);
      console.log(result);
      if (result?.status == 200) {
        setProduct(defaultForm);
      }
    } catch (error) {
      console.error("Error in handleConfirm:", error);
    }

    setErrors({});
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setImagePreview(reader.result); // Set the preview to the file data
      };

      reader.readAsDataURL(file);
      setImageLink(file);

      setProduct((prevProduct) => ({
        ...prevProduct,
        pictureLink: file, // Store the file for upload
      }));
    }
  };
  return (
    <>
      <div className="flex space-x-4 font-semibold text-xl mb-10 ">
        <NavLink to="../product" className="opacity-50">
          {t("Product")}
        </NavLink>
        <p>/</p>
        <NavLink to="../product" className="font-bold">
          {t("AddProduct")}
        </NavLink>
      </div>
      <div className="container">
        <h1 className="title">Add New Product</h1>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="image">Product Image URL</label>

            {/*             
            <input
              type="file"
              id="image"
              name="pictureLink"
              accept="image/*"
              onChange={handleImageChange}
              className={`input-field ${
                errors.pictureLink ? "input-error" : ""
              }`}
            />
            {errors.pictureLink && (
              <p className="error-text">{errors.pictureLink}</p>
            )}
            {imagePreview && !errors.pictureLink && (
              <div className="image-preview">
                <img src={imagePreview} alt="Product Preview" width="100" />
              </div>
            )} */}

            <input
              type="text"
              id="image"
              name="pictureLink"
              value={product.pictureLink}
              onChange={handleChange}
              className={`input-field ${
                errors.pictureLink ? "input-error" : ""
              }`}
              placeholder="Enter image URL"
            />
            {errors.pictureLink && (
              <p className="error-text">{errors.pictureLink}</p>
            )}
            {product.pictureLink && !errors.pictureLink && (
              <div className="image-preview">
                <img
                  src={product.pictureLink}
                  alt="Product Preview"
                  width="100"
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? "input-error" : ""}`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* Price */}
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              className={`input-field ${errors.price ? "input-error" : ""}`}
              placeholder="Enter product price"
            />
            {errors.price && <p className="error-text">{errors.price}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="unit">Unit</label>
            <select
              id="unit"
              name="unit"
              value={product.unit}
              onChange={handleChange}
              className={`input-field ${errors.unit ? "input-error" : ""}`}
              placeholder="Enter product unit"
            >
              <option value={""}>Choose Units</option>
              <option value={"package"}>Package</option>
              <option value={"box"}>Box</option>
              <option value={"lit"}>lit</option>
              {/* <option value={"kg"}>""</option>
              <option value={""}>""</option>
              <option value={""}>""</option>
              <option value={""}>""</option>
              <option value={""}>""</option> */}
            </select>
         
          </div>

          <div className="form-group">
            <label htmlFor="isCold">IsCold</label>
            <input
              type="checkbox"
              id="isCold"
              name="isCold"
              checked={product.isCold === 1} // Determines if the checkbox is checked
              onChange={(e) =>
                setProduct((prevProduct) => ({
                  ...prevProduct,
                  isCold: e.target.checked ? 1 : 0, // Update isCold based on checkbox state
                }))
              }
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="productCategoryId">productCategoryId</label>
            <Select
              className="w-full"
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  border: "none",
                  boxShadow: "none",
                  width: "100%",
                }),
                dropdownIndicator: (baseStyles) => ({
                  ...baseStyles,
                  color: "inherit", // Optional: matches text color
                  width: "100%",
                }),
                menu: (baseStyles) => ({
                  ...baseStyles,
                  border: "none",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  width: "100%",
                }),
                option: (baseStyles, { isFocused, isSelected }) => ({
                  ...baseStyles,
                  backgroundColor: isSelected
                    ? "var(--Xanh-Base)" // Selected background color
                    : isFocused
                    ? "var(--Xanh-100)" // Hover background color
                    : "transparent", // Default background color
                  color: isSelected ? "white" : isFocused && "black", // Text color for selected/hovered options
                  cursor: "pointer",
                }),
              }}
              onChange={(selectedOption) =>
                setProduct((prev) => ({
                  ...prev,
                  productCategoryId: selectedOption.value,
                }))
              }
              options={productCategories?.map((category) => ({
                value: category.id,
                name: category.typeName,
                expire: category.expireIn,
                description: category.typeDescription,
              }))}
              name="productCategoryId"
              placeholder="Product Category"
              value={productCategories
                ?.map((category) => ({
                  value: category.id,
                  name: category.typeName,
                  expire: category.expireIn,
                  description: category.typeDescription,
                }))
                .find((category) => category.id === product.productCategoryId)}
              formatOptionLabel={(
                { name, expire, description },
                { context }
              ) => (
                <div className="flex flex-col">
                  <div className="flex justify-between font-medium">
                    <div>{name}</div>
                    <div>{expire ? expire + " days" : ""}</div>
                  </div>
                  {context === "menu" && (
                    <div className={`text-sm`}>{description}</div>
                  )}
                </div>
              )}
            ></Select>
          </div>
          <div className="form-group">
            <label htmlFor="weight">weight</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={product.weight}
              onChange={handleChange}
              className={`input-field ${errors.weight ? "input-error" : ""}`}
              placeholder="Enter weight quantity"
            />
            {errors.weight && <p className="error-text">{errors.weight}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="barcode">barcode</label>
            <input
              type="text"
              id="barcode"
              name="barcode"
              value={product.barcode}
              onChange={handleChange}
              className={`input-field ${errors.barcode ? "input-error" : ""}`}
              placeholder="Enter barcode quantity"
            />
            {errors.barcode && <p className="error-text">{errors.barcode}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="origin">origin</label>
            <input
              type="text"
              id="origin"
              name="origin"
              value={product.origin}
              onChange={handleChange}
              className={`input-field ${errors.origin ? "input-error" : ""}`}
              placeholder="Enter origin quantity"
            />
            {errors.origin && <p className="error-text">{errors.origin}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            onClick={handleSubmit}
          >
            Add Product
          </button>
        </form>
      </div>
    </>
  );
}
