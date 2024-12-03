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
      if (productCategoriesResult?.status === 200) {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadImg = await uploadImage(imageLink);
      const submitForm = { ...product, pictureLink: uploadImg };

      const result = await createProductWithUserId(submitForm);
      if (result?.status === 200) {
        setProduct(defaultForm);
        toast.success("Product added successfully!");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("Failed to add product.");
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
    <div className="p-6">
      <div className="flex space-x-4 font-semibold text-xl mb-10">
        <NavLink to="../product" className="opacity-50 hover:underline">
          {t("Product")}
        </NavLink>
        <span>/</span>
        <NavLink to="../product" className="font-bold hover:underline">
          {t("AddProduct")}
        </NavLink>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-semibold mb-6">{t("Add New Product")}</h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
        >
          <div>
            {/* Product Name */}
            <div className="form-group">
              <label className="font-medium text-lg" htmlFor="name">
                {t("Product Name")}
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
            </div>

            {/* Price */}
            <div className="form-group mt-4">
              <label className="font-medium text-lg" htmlFor="price">
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
            </div>

            {/* Unit */}
            <div className="form-group mt-4">
              <label className="font-medium text-lg" htmlFor="unit">
                {t("Unit")}
              </label>
              <select
                id="unit"
                name="unit"
                value={product.unit}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">{t("Choose Unit")}</option>
                <option value="package">{t("Package")}</option>
                <option value="box">{t("Box")}</option>
                <option value="lit">{t("Liter")}</option>
              </select>
            </div>

            {/* Is Cold */}
            <div className="form-group mt-4">
              <label className="font-medium text-lg" htmlFor="isCold">
                {t("Cold Storage")}
              </label>
              <input
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
              />
            </div>

            {/* Weight */}
            <div className="form-group mt-4">
              <label className="font-medium text-lg" htmlFor="weight">
                {t("Weight")}
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={product.weight}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter weight"
              />
            </div>
            {/* Product Category */}
            <div className="form-group mt-4">
              <label
                className="font-medium text-lg"
                htmlFor="productCategoryId"
              >
                {t("Category")}
              </label>
              <Select
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    border: "1px solid #ccc",
                    borderRadius: "4px",
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
            </div>

            {/* Barcode */}
            <div className="form-group mt-4">
              <label className="font-medium text-lg" htmlFor="barcode">
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
            </div>
          </div>

          <div>
            {/* Image Upload */}
            {/* <div className="form-group mt-4">
              <label className="font-medium text-lg" htmlFor="image">
                {t("Image")}
              </label>
              <input
                type="file"
                id="image"
                name="pictureLink"
                accept="image/*"
                onChange={handleImageChange}
                className="input-field"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Product Preview"
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
              )}
            </div> */}

            <div className="h-full ml-auto mr-10">
              <label
                htmlFor="file-upload"
                className="block text-lg font-medium leading-6 "
              >
                {t("Image")}
              </label>
              <label htmlFor="file-upload" className="cursor-pointer ">
                <div
                  className={`${
                    imagePreview && "background-setting-input"
                  } mt-2 flex justify-center items-center rounded-lg border  border-dashed border-gray-400 min-h-[50vh] border-hover py-5`}
                >
                  <div className={`text-center ${imagePreview && "hidden"} `}>
                    {/* <PiFileArrowDownLight
                      className="mx-auto h-12 w-12  span-hover"
                      aria-hidden="true"
                    /> */}
                    <div className="mt-4 flex text-sm leading-6 ">
                      <p className="relative cursor-pointer rounded-md font-semibold  focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 ">
                        <span className="span-hover">
                          Upload a file PNG, JPG, GIF up to 10MB
                        </span>
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

          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {t("Add Product")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
