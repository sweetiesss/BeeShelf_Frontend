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
import { DownloadSimple } from "@phosphor-icons/react";
import SpinnerLoading from "../../component/shared/Loading";

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
  const unitOptions = [
    { value: "", label: "ChooseUnit" },
    { value: "Liter", label: "Liter" },
    { value: "Milliliter", label: "Milliliter" },
    { value: "Pieces", label: "Pieces" },
    { value: "Box", label: "Box" },
    { value: "Bottle", label: "Bottle" },
    { value: "Package", label: "Package" },
    { value: "Carton", label: "Carton" },
    { value: "Meter", label: "Meter" },
    { value: "Centimeter", label: "Centimeter" },
    { value: "Square Meter", label: "SquareMeter" },
    { value: "Kilometer", label: "Kilometer" },
    { value: "Bag", label: "Bag" },
    { value: "Sheet", label: "Sheet" },
    { value: "Roll", label: "Roll" },
    { value: "Jar", label: "Jar" },
    { value: "Pot", label: "Pot" },
    { value: "Tablet", label: "Tablet" },
    { value: "Can", label: "Can" },
  ];

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { getProductCategoryBy1000 } = AxiosCategory();

  useEffect(() => {
    fetchingBeginData();
  }, []);

  const fetchingBeginData = async () => {
    try {
      setLoading(true);
      const productCategoriesResult = await getProductCategoryBy1000();
      if (productCategoriesResult?.status === 200) {
        setProductCategories(productCategoriesResult?.data?.items);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name === "weight") {
      if (value > 99999999) {
        setProduct((prevProduct) => ({
          ...prevProduct,
          [name]: 99999999,
        }));
        return;
      } else if (value < 0) {
        setProduct((prevProduct) => ({
          ...prevProduct,
          [name]: 1,
        }));
        return;
      }
    }
    if (name === "price") {
      if (value > 99999999999) {
        setProduct((prevProduct) => ({
          ...prevProduct,
          [name]: 99999999999,
        }));
        return;
      } else if (value < 0) {
        setProduct((prevProduct) => ({
          ...prevProduct,
          [name]: 1,
        }));
        return;
      }
    }
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error on input change
    }
  };
  const validateForm = () => {
    const newErrors = {};

    if (!product.name) newErrors.name = t("Product name is required.");
    if (!product.barcode) newErrors.barcode = t("Product barcode is required.");
    if (!product.price || product.price <= 0)
      newErrors.price = t("Price must be greater than 0.");
    if (!product.weight || product.weight <= 0)
      newErrors.weight = t("Weight must be greater than 0.");
    if (!product.unit) newErrors.unit = t("Unit is required.");
    if (!product.origin) newErrors.origin = t("Origin is required.");
    if (!product.productCategoryId)
      newErrors.productCategoryId = t("Category is required.");
    if (!imageLink) newErrors.pictureLink = t("Product image is required.");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!validateForm()) return;
      const uploadImg = await uploadImage(imageLink);
      const submitForm = { ...product, pictureLink: uploadImg };

      const result = await createProductWithUserId(submitForm);
      if (result?.status === 200) {
        setProduct(defaultForm);
        setImageLink();
        setImagePreview();
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageLink(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="px-6 relative">
      {loading ? (
        <SpinnerLoading />
      ) : (
        <>
          <div className="flex space-x-4 font-semibold text-xl mb-6">
            <NavLink to="../product" className="opacity-50 hover:underline">
              {t("Product")}
            </NavLink>
            <span>/</span>
            <NavLink to="../product" className="font-bold hover:underline">
              {t("AddProduct")}
            </NavLink>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* <h1 className="text-2xl font-semibold mb-6">{t("Add New Product")}</h1> */}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10"
            >
              <div className="space-y-[14px]">
                {/* Product Name */}
                <div className="form-group relative">
                  <label className="font-medium text-lg" htmlFor="name">
                    <span className="text-red-500 text-xl">*</span> {t("Name")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm absolute -bottom-[22px]">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="flex justify-between items-center gap-10">
                  <div className="form-group mt-4 relative w-1/2 ">
                    <label className="font-medium text-lg" htmlFor="price">
                      <span className="text-red-500 text-xl">*</span>{" "}
                      {t("Price")}
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={product.price}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter product price"
                    />
                    <label className="absolute bottom-[0.625rem] right-10">
                      vnd
                    </label>
                    {errors.price && (
                      <p className="text-red-500 text-sm absolute -bottom-[22px]">
                        {errors.price}
                      </p>
                    )}
                  </div>
                  <div className="form-group mt-4 w-1/2 relative">
                    <label className="font-medium text-lg" htmlFor="unit">
                      <span className="text-red-500 text-xl">*</span>{" "}
                      {t("Unit")}
                    </label>
                    <Select
                      value={unitOptions.find(
                        (option) => option.value === product?.unit
                      )}
                      onChange={(selectedOption) =>
                        handleChange({
                          target: {
                            name: "unit",
                            value: selectedOption.value,
                          },
                        })
                      }
                      name="unit"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      options={unitOptions}
                      getOptionLabel={(option) => `${t(option.label)}`}
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          width: "100%",
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: "7.5rem",
                          overflow: "auto",
                        }),
                        control: (provided) => ({
                          ...provided,
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          // width:"100%",
                          borderColor: "#ccc", // Custom border color
                          boxShadow: "none", // Remove default focus outline
                          "&:hover": { borderColor: "#aaa" }, // Border on hover
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? "#0056b3"
                            : state.isFocused
                            ? "#e6f7ff"
                            : "white",
                          color: state.isSelected ? "white" : "black",
                        }),
                      }}
                    />
                    {errors.unit && (
                      <p className="text-red-500 text-sm absolute -bottom-[22px]">
                        {errors.unit}
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-group relative">
                  <label className="font-medium text-lg mt-4" htmlFor="origin">
                    <span className="text-red-500 text-xl">*</span>{" "}
                    {t("Origin")}
                  </label>
                  <input
                    type="text"
                    id="origin"
                    name="origin"
                    value={product.origin}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter product origin"
                  />
                  {errors.origin && (
                    <p className="text-red-500 text-sm absolute -bottom-[22px]">
                      {errors.origin}
                    </p>
                  )}
                </div>

                <div className="flex justify-between gap-10 items-center">
                  <div className="form-group mt-4 relative w-full">
                    <label className="font-medium text-lg" htmlFor="weight">
                      <span className="text-red-500 text-xl">*</span>{" "}
                      {t("Weight")}
                    </label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={product.weight}
                      onChange={handleChange}
                      className="input-field relative"
                      placeholder="Enter weight"
                      max={999999}
                    />
                    <label className="absolute bottom-[0.625rem] right-10">
                      kg
                    </label>
                    {errors.weight && (
                      <p className="text-red-500 text-sm absolute -bottom-[22px]">
                        {errors.weight}
                      </p>
                    )}
                  </div>
                  <div className="form-group mt-4 w-full">
                    <label className="font-medium text-lg" htmlFor="isCold">
                      {t("Cold Storage")}
                    </label>
                    <Select
                      value={
                        product.isCold !== null
                          ? {
                              value: product.isCold,
                              label:
                                product.isCold === 1
                                  ? "Frozen Product"
                                  : "Normal Product",
                            }
                          : null
                      }
                      onChange={(selectedOption) =>
                        setProduct((prev) => ({
                          ...prev,
                          isCold: selectedOption.value,
                        }))
                      }
                      name="unit"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      options={[
                        { value: 0, label: "NormalProduct" },
                        { value: 1, label: "FrozenProduct" },
                      ]}
                      getOptionLabel={(option) => `${t(option.label)}`}
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          width: "100%",
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: "7.5rem",
                          overflow: "auto",
                        }),
                        control: (provided) => ({
                          ...provided,
                          paddingTop: "4px",
                          paddingBottom: "4px",
                          // width:"100%",
                          borderColor: "#ccc", // Custom border color
                          boxShadow: "none", // Remove default focus outline
                          "&:hover": { borderColor: "#aaa" }, // Border on hover
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? "#0056b3"
                            : state.isFocused
                            ? "#e6f7ff"
                            : "white",
                          color: state.isSelected ? "white" : "black",
                        }),
                      }}
                    />

                    {/* <input
                  type="checkbox"
                  id="isCold"
                  name="isCold"
                  checked={product.isCold === 1}
                  onChange={(e) =>
                    setProduct((prevProduct) => ({
                      ...prevProduct,
                      isCold: e.target.checked ? 1 : 0,
                    }))
                  }
                  className="ml-2"
                /> */}
                  </div>
                </div>
                {/* Is Cold */}

                {/* Weight */}

                {/* Product Category */}
                <div className="form-group relative">
                  <label
                    className="font-medium text-lg mt-4"
                    htmlFor="productCategoryId"
                  >
                    <span className="text-red-500 text-xl">*</span>{" "}
                    {t("Category")}
                  </label>
                  <Select
                    styles={{
                      menu: (provided) => ({
                        ...provided,

                        // Restrict the dropdown height
                        overflowY: "hidden", // Enable scrolling for content
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        padding: 0, // Ensure no extra padding
                        maxHeight: "7.5rem",
                        overflow: "auto",
                      }),
                      control: (baseStyles) => ({
                        ...baseStyles,
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "0.5rem",
                        boxShadow: "none",
                        "&:hover": {
                          border: "1px solid #888",
                        },
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
                        padding: "0.5rem 1rem", // Option padding
                        textAlign: "left", // Center-align text
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
                      label: category.typeName,
                    }))}
                    placeholder="Select category"
                  />
                  {errors.productCategoryId && (
                    <p className="text-red-500 text-sm absolute -bottom-[22px]">
                      {errors.productCategoryId}
                    </p>
                  )}
                </div>

                {/* Barcode */}
                <div className="form-group relative">
                  <label className="font-medium text-lg mt-4" htmlFor="barcode">
                    <span className="text-red-500 text-xl">*</span>{" "}
                    {t("Barcode")}
                  </label>
                  <input
                    type="text"
                    id="barcode"
                    name="barcode"
                    value={product.barcode}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter barcode"
                  />
                  {errors.barcode && (
                    <p className="text-red-500 text-sm absolute -bottom-[22px]">
                      {errors.barcode}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="h-full ml-auto mr-10">
                  <label
                    htmlFor="file-upload"
                    className="block text-lg font-medium leading-6 "
                  >
                    <span className="text-red-500 text-xl">*</span>
                    {t("Image")}
                  </label>
                  <label htmlFor="file-upload" className="cursor-pointer ">
                    <div
                      className={`${
                        imagePreview && "background-setting-input"
                      } mt-2 flex justify-center items-center rounded-lg border  border-dashed border-gray-400 min-h-[57vh] border-hover py-5`}
                    >
                      <div
                        className={`text-center ${imagePreview && "hidden"} `}
                      >
                        {/* <PiFileArrowDownLight
                      className="mx-auto h-12 w-12  span-hover"
                      aria-hidden="true"
                    /> */}
                        <div className="mt-4 flex text-sm leading-6 ">
                          <p className="relative cursor-pointer rounded-md font-semibold  focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 ">
                            <div className="flex gap-4 items-center">
                              <span className="text-3xl">
                                <DownloadSimple />
                              </span>
                              <span className="span-hover">
                                {t("UploadAFilePNGJPGGIFUpTo10MB")}
                              </span>
                            </div>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only "
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </p>
                        </div>
                      </div>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          className="rounded-xl"
                          style={{ maxWidth: "90%" }}
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="lg:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[var(--Xanh-Base)] text-white py-4 rounded-lg hover:bg-[var(--Xanh-700)] font-semibold text-lg transition"
                >
                  {t("Add Product")}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
