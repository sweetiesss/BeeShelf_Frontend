import React, { useState } from "react";
import "../../style/AddProductPage.scss"; // Import CSS file for styling
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

export default function AddProductPage() {
  // State for individual product input
  const [product, setProduct] = useState({
    image: "",
    sku: "",
    group: "",
    tags: "",
    name: "",
    price: "",
    category: "",
    stock: "",
  });
  const { t } = useTranslation();

  // State for validation messages
  const [errors, setErrors] = useState({});

  // State for the list of products
  const [products, setProducts] = useState([]);

  // Handle input changes and validation
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the product state
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));

    // Validate inputs on change
    validateField(name, value);
  };

  // Validation logic for individual fields
  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      // case "image":
      //   if (!value || !isValidURL(value)) {
      //     errorMessage = "Please enter a valid image URL.";
      //   }
      //   break;
      case "sku":
        if (!value) {
          errorMessage = "SKU is required.";
        }
        break;
      case "group":
        if (!value) {
          errorMessage = "Group is required.";
        }
        break;
      case "tags":
        if (!value) {
          errorMessage = "Tags are required.";
        }
        break;
      case "name":
        if (!value) {
          errorMessage = "";
        } else if (!/^[A-Z]/.test(value)) {
          errorMessage = "Product name must start with a capital letter.";
        }
        break;
      case "price":
        if (!value || isNaN(value) || value <= 0) {
          errorMessage = "Please enter a valid price.";
        }
        break;
      case "category":
        if (!value) {
          errorMessage = "Category is required.";
        }
        break;
      case "stock":
        if (!value || isNaN(value) || value < 0) {
          errorMessage = "Please enter a valid stock number.";
        }
        break;
      default:
        break;
    }

    // Update the errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  // Helper function to validate URL format
  const isValidURL = (url) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // Protocol
        "((([a-zA-Z0-9$_.+!*'(),-]+)(:[a-zA-Z0-9$_.+!*'(),-]+)?@)?)" + // Authentication
        "([a-zA-Z0-9.-]+)(:[0-9]{2,5})?" + // Host and port
        "(\\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?" // Path
    );
    return urlPattern.test(url);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform final validation before submission
    const newErrors = {};

    Object.keys(product).forEach((field) => {
      validateField(field, product[field]);
      if (!product[field]) {
        newErrors[field] = "This field is required.";
      }
    });

    // Check if there are any validation errors
    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    // Convert tags to array
    const tagsArray = product.tags.split(",").map((tag) => tag.trim());

    // Create new product
    const newProduct = {
      ...product,
      id: products.length + 1,
      tags: tagsArray,
    };

    // Add product to the list
    setProducts([...products, newProduct]);

    // Clear form fields and errors after submission
    setProduct({
      image: "",
      sku: "",
      group: "",
      tags: "",
      name: "",
      price: "",
      category: "",
      stock: "",
    });
    setErrors({});
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
          {/* Image */}
          <div className="form-group">
            <label htmlFor="image">Product Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              value={product.image}
              onChange={handleChange}
              className={`input-field ${errors.image ? "input-error" : ""}`}
              placeholder="Enter image URL"
            />
            {errors.image && <p className="error-text">{errors.image}</p>}
            {product.image && !errors.image && (
              <div className="image-preview">
                <img src={product.image} alt="Product Preview" width="100" />
              </div>
            )}
          </div>

          {/* SKU */}
          <div className="form-group">
            <label htmlFor="sku">SKU</label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={product.sku}
              onChange={handleChange}
              className={`input-field ${errors.sku ? "input-error" : ""}`}
              placeholder="Enter product SKU"
            />
            {errors.sku && <p className="error-text">{errors.sku}</p>}
          </div>

          {/* Group */}
          <div className="form-group">
            <label htmlFor="group">Group</label>
            <input
              type="text"
              id="group"
              name="group"
              value={product.group}
              onChange={handleChange}
              className={`input-field ${errors.group ? "input-error" : ""}`}
              placeholder="Enter product group"
            />
            {errors.group && <p className="error-text">{errors.group}</p>}
          </div>

          {/* Tags */}
          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={product.tags}
              onChange={handleChange}
              className={`input-field ${errors.tags ? "input-error" : ""}`}
              placeholder="Enter tags"
            />
            {errors.tags && <p className="error-text">{errors.tags}</p>}
          </div>

          {/* Name */}
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

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              className={`input-field ${errors.category ? "input-error" : ""}`}
              placeholder="Enter product category"
            />
            {errors.category && <p className="error-text">{errors.category}</p>}
          </div>

          {/* Stock */}
          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              className={`input-field ${errors.stock ? "input-error" : ""}`}
              placeholder="Enter stock quantity"
            />
            {errors.stock && <p className="error-text">{errors.stock}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Add Product
          </button>
        </form>
      </div>
    </>
  );
}
