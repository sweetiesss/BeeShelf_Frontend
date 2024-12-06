import { useTranslation } from "react-i18next";
import Pagination from "../../shared/Paggination";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowsDownUp,
  ArrowUp,
  CaretDown,
  CaretUp,
  DotsThreeVertical,
  ExclamationMark,
  X,
} from "@phosphor-icons/react";
import Select from "react-select";
import { useDetail } from "../../../context/DetailContext";

export default function ProductList({
  products,
  response,
  selectedProducts,
  toggleProductSelection,
  handleShowDetailProduct,
  isProductSelected,
  overall,
  handleClickOverall,
  index,
  setIndex,
  page,
  setPage,
  handleDeleteClick,
  handleSortChange,
  sortBy,
  descending,
  notInDataBase,
  editProduct,
  editForm,
  hanldeEditChange,
  handleUpdateEdit,
  errorList,
  productCategories,
}) {
  const { t } = useTranslation();
  const [openAction, setOpenAction] = useState();
  const [thisIsTheLastItem, IsThisIsTheLastItem] = useState(false);
  const { setCreateRequest, updateDataDetail } = useDetail();
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

  const handleOpenActionTab = async (e, product) => {
    e.stopPropagation();
    if (openAction === product) {
      setOpenAction(null);
    } else {
      setOpenAction(product);
    }
    IsThisIsTheLastItem(false);
    const buttonRect = e.target.getBoundingClientRect();
    if (buttonRect.y > 800) {
      IsThisIsTheLastItem(true);
    }
  };
  const actionComponent = useRef();
  const handleCloseAction = () => {
    setOpenAction();
  };

  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (
        actionComponent.current &&
        !actionComponent.current.contains(event.target)
      ) {
        handleCloseAction();
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [openAction]);
  return (
    <div className="mb-3 h-full">
      <table className=" w-full ">
        <thead className="text-[var(--en-vu-500-disable)] px-4">
          <tr>
            <th className="border-b-2 py-4 w-10 text-center px-2 ">
              {selectedProducts?.length > 0 ? (
                <input
                  type="checkbox"
                  checked={overall?.checked}
                  onChange={handleClickOverall}
                  ref={(input) =>
                    input && (input.indeterminate = overall?.indeterminate)
                  }
                />
              ) : notInDataBase ? (
                <span
                  className={`hover:text-[var(--en-vu-600)] cursor-pointer flex items-center ${
                    sortBy === "Id" && "text-black"
                  } `}
                  onClick={() => handleSortChange("Id")}
                >
                  #
                  {!descending ? (
                    <ArrowUp weight="bold" />
                  ) : (
                    <ArrowDown weight="bold" />
                  )}
                </span>
              ) : (
                <span>#</span>
              )}
            </th>
            <th className="border-b-2 text-left py-4 ">{t("Image")}</th>
            {notInDataBase && (
              <th className="border-b-2 text-left py-4">{t("Barcode")}</th>
            )}

            <th
              className={`border-b-2 text-left py-4  cursor-pointer hover:text-[var(--en-vu-600)] ${
                sortBy === "Name" && "text-black"
              }`}
              onClick={() => {
                handleSortChange("Name");
              }}
            >
              <span className="flex items-center gap-1">
                {t("Name")}
                {!descending ? (
                  <ArrowUp weight="bold" />
                ) : (
                  <ArrowDown weight="bold" />
                )}
              </span>
            </th>

            <th className="border-b-2 text-left py-4 ">{t("Category")}</th>
            <th className="border-b-2 text-left py-4">{t("isCold")}</th>

            <th
              className={`border-b-2 text-left py-4 cursor-pointer hover:text-[var(--en-vu-600)] ${
                sortBy === "Origin" && "text-black"
              }`}
              onClick={() => {
                handleSortChange("Origin");
              }}
            >
              <span className="flex items-center gap-1">
                {t("Origin")}
                {!descending ? (
                  <ArrowUp weight="bold" />
                ) : (
                  <ArrowDown weight="bold" />
                )}
              </span>
            </th>

            <th
              className={`border-b-2 text-left py-4 cursor-pointer hover:text-[var(--en-vu-600)] ${
                sortBy === "Price" && "text-black"
              }`}
              onClick={() => {
                handleSortChange("Price");
              }}
            >
              <span className="flex items-center gap-1">
                {t("Price")} (vnd)
                {!descending ? (
                  <ArrowUp weight="bold" />
                ) : (
                  <ArrowDown weight="bold" />
                )}
              </span>
            </th>
            <th
              className={`border-b-2 text-left py-4 cursor-pointer hover:text-[var(--en-vu-600)] `}
            >
              <span className="flex items-center gap-1">{t("Unit")}</span>
            </th>
            {!notInDataBase && (
              <th
                className={`border-b-2 text-left py-4 cursor-pointer hover:text-[var(--en-vu-600)] ${
                  sortBy === "CreateDate" && "text-black"
                }`}
                onClick={() => {
                  handleSortChange("CreateDate");
                }}
              >
                <span className="flex items-center gap-1">
                  {t("CreateDate")}
                  {!descending ? (
                    <ArrowUp weight="bold" />
                  ) : (
                    <ArrowDown weight="bold" />
                  )}
                </span>
              </th>
            )}
            <th
              className={`border-b-2 text-left py-4 cursor-pointer hover:text-[var(--en-vu-600)] ${
                sortBy === "Weight" && "text-black"
              }`}
              onClick={() => {
                handleSortChange("Weight");
              }}
            >
              <span className="flex items-center gap-1">
                {t("Weight")} (kg)
                {!descending ? (
                  <ArrowUp weight="bold" />
                ) : (
                  <ArrowDown weight="bold" />
                )}
              </span>
            </th>
            {!notInDataBase && (
              <th className="border-b-2  py-4  text-center">
                {t("InInventory")}
              </th>
            )}
            <th className="border-b-2 text-left py-4 "></th>
          </tr>
        </thead>
        <tbody className="overflow-y-auto max-h-[60vh] pb-[4rem] h-fit pl-4">
          {products &&
            products?.map((product) => {
              let chooice = selectedProducts?.some((p) => p.id === product.id);
              let checkError = errorList?.find((p) => p.item.id === product.id);
              console.log(checkError);
              let editAble = editProduct === product;
              // let category=cate
              return (
                <tr
                  key={product.id}
                  className={`
                border-t-2 ${editAble ? "bg-gray-100" : ""}
                  ${chooice ? "bg-[var(--Xanh-100)]" : ""}  ${
                    checkError
                      ? "bg-red-200 hover:bg-red-100"
                      : "     hover:bg-[var(--Xanh-100)]"
                  }`}
                  onClick={() => toggleProductSelection(product)}
                >
                  <td className="px-2">
                    <div
                      className={`w-4 h-4 rounded-sm ${
                        isProductSelected(product)
                          ? "bg-[var(--Xanh-Base)]"
                          : "bg-[var(--en-vu-300)]"
                      }`}
                      // checked={isProductSelected(product)}
                      onChange={() => toggleProductSelection(product)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className=" h-[6rem]">
                    <img
                      src={product.pictureLink}
                      alt={product.name}
                      className=" h-[4rem] rounded-xl"
                    />
                  </td>
                  {notInDataBase && (
                    <td
                      className={`  ${
                        checkError?.error?.includes("barcode") &&
                        "text-red-500 font-bold"
                      }`}
                    >
                      {editAble ? (
                        <input
                          placeholder="Input barcode"
                          value={editForm?.barcode}
                          name="barcode"
                          className="w-[80%] px-2 py-1"
                          onChange={hanldeEditChange}
                        />
                      ) : (
                        <>
                          <div
                            className={`overflow-hidden text-nowrap  flex items-center `}
                          >
                            {product.barcode}
                            {checkError?.error?.includes("barcode") &&
                              !product.barcode && (
                                <span className="bg-red-500 text-white text-lg rounded-md">
                                  <ExclamationMark weight="bold" />
                                </span>
                              )}
                          </div>
                        </>
                      )}
                    </td>
                  )}
                  <td
                    className={` ${
                      checkError?.error?.includes("name") &&
                      "text-red-500 font-bold"
                    }`}
                  >
                    {editAble ? (
                      <input
                        placeholder="Input name"
                        value={editForm?.name}
                        name="name"
                        className="w-[80%] px-2 py-1"
                        onChange={hanldeEditChange}
                      />
                    ) : (
                      <div
                        className={`overflow-hidden text-wrap  flex items-center `}
                      >
                        {product.name}
                        {checkError?.error?.includes("name") &&
                          !product.name && (
                            <span className="bg-red-500 text-white text-lg rounded-md">
                              <ExclamationMark weight="bold" />
                            </span>
                          )}
                      </div>
                    )}
                  </td>
                  <td
                    className={` ${
                      checkError?.error?.includes("productCategoryId") &&
                      "text-red-500 font-bold"
                    }`}
                  >
                    {editAble ? (
                      // <select
                      //   value={editForm?.productCategoryId}
                      //   name="productCategoryId"
                      //   className="w-[80%] px-2 py-1"
                      //   onChange={hanldeEditChange}
                      // >
                      //   <option value={0}>Select Category</option>
                      //   {productCategories?.map((item) => (
                      //     <option value={item?.id}>{item?.typeName}</option>
                      //   ))}
                      // </select>
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
                          hanldeEditChange({
                            target: {
                              name: "productCategoryId",
                              value: selectedOption.value,
                            },
                          })
                        }
                        options={productCategories?.map((category) => ({
                          value: category.id,
                          label: category.typeName,
                        }))}
                        placeholder="Select category"
                      />
                    ) : (
                      <div
                        className={`overflow-hidden text-wrap  flex items-center `}
                      >
                        {product?.productCategoryName}
                        {checkError?.error?.includes("productCategoryId") &&
                          !product.productCategoryId && (
                            <span className="bg-red-500 text-white text-lg rounded-md">
                              <ExclamationMark weight="bold" />
                            </span>
                          )}
                      </div>
                    )}
                  </td>
                  <td className="">
                    {editAble ? (
                      <>
                        <label
                          htmlFor="isCold"
                          className="cursor-pointer underline font-semibold"
                        >
                          {editForm.isCold === 1 ? "Yes" : "No"}
                        </label>
                        <input
                          type="checkbox"
                          checked={editForm.isCold === 1}
                          name="isCold"
                          id="isCold"
                          className="w-[80%] px-2 py-1 hidden"
                          onChange={hanldeEditChange}
                        />
                      </>
                    ) : (
                      <div
                        className={`overflow-hidden text-nowrap  flex items-center${
                          checkError?.error?.includes("isCold") &&
                          "text-red-500"
                        }`}
                      >
                        {product.isCold === 1 ? "Yes" : "No"}
                        {checkError?.error?.includes("isCold") && (
                          <span className="bg-red-500 text-white text-lg rounded-md">
                            <ExclamationMark weight="bold" />
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td
                    className={` ${
                      checkError?.error?.includes("origin") &&
                      "text-red-500 font-bold w-[8rem]"
                    }`}
                  >
                    {editAble ? (
                      <input
                        placeholder="Input origin"
                        value={editForm?.origin}
                        name="origin"
                        className="w-[80%] px-2 py-1"
                        onChange={hanldeEditChange}
                      />
                    ) : (
                      <div className="overflow-hidden text-nowrap  flex items-center">
                        {product.origin}
                        {checkError?.error?.includes("origin") &&
                          !product.origin && (
                            <span className="bg-red-500 text-white text-lg rounded-md">
                              <ExclamationMark weight="bold" />
                            </span>
                          )}
                      </div>
                    )}
                  </td>
                  <td
                    className={` ${
                      checkError?.error?.includes("price") &&
                      "text-red-500 font-bold w-[8rem]"
                    }`}
                  >
                    {editAble ? (
                      <input
                        placeholder="Price"
                        type="number"
                        value={editForm?.price}
                        name="price"
                        className="w-[80%] px-2 py-1"
                        onChange={hanldeEditChange}
                      />
                    ) : (
                      <div
                        className={`overflow-hidden text-nowrap  flex items-center `}
                      >
                        {new Intl.NumberFormat().format(product.price)}
                        {checkError?.error?.includes("price") &&
                          !product.price && (
                            <span className="bg-red-500 text-white text-lg rounded-md">
                              <ExclamationMark weight="bold" />
                            </span>
                          )}
                      </div>
                    )}
                  </td>
                  <td
                    className={` ${
                      checkError?.error?.includes("unit") &&
                      "text-red-500 font-bold"
                    }`}
                  >
                    {editAble ? (
                      // <Select
                      //   value={unitOptions.find(
                      //     (option) => option.value === editForm?.unit
                      //   )}
                      //   onChange={(selectedOption) =>
                      //     hanldeEditChange({
                      //       target: {
                      //         name: "unit",
                      //         value: selectedOption.value,
                      //       },
                      //     })
                      //   }
                      //   name="unit"
                      //   className="react-select-container"
                      //   classNamePrefix="react-select"
                      //   options={unitOptions}
                      //   styles={{
                      //     menu: (provided) => ({
                      //       ...provided,
                      //       width: "fit",
                      //     }),
                      //     control: (provided) => ({
                      //       ...provided,
                      //       borderColor: "#ccc", // Custom border color
                      //       boxShadow: "none", // Remove default focus outline
                      //       "&:hover": { borderColor: "#aaa" }, // Border on hover
                      //     }),
                      //     option: (provided, state) => ({
                      //       ...provided,
                      //       backgroundColor: state.isSelected
                      //         ? "#0056b3"
                      //         : state.isFocused
                      //         ? "#e6f7ff"
                      //         : "white",
                      //       color: state.isSelected ? "white" : "black",
                      //     }),
                      //   }}
                      // />
                      <Select
                        value={unitOptions.find(
                          (option) => option.value === editForm?.unit
                        )}
                        onChange={(selectedOption) =>
                          hanldeEditChange({
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
                    ) : (
                      <div
                        className={`overflow-hidden text-nowrap  flex items-center `}
                      >
                        {t(product.unit)}
                        {checkError?.error?.includes("unit") &&
                          !product.unit && (
                            <span className="bg-red-500 text-white text-lg rounded-md">
                              <ExclamationMark weight="bold" />
                            </span>
                          )}
                      </div>
                    )}
                  </td>
                  {!notInDataBase && (
                    <td className="">
                      {new Date(product.createDate).toLocaleDateString(
                        "en-GB",
                        {
                          month: "2-digit",
                          day: "2-digit",
                          year: "2-digit",
                        }
                      )}
                    </td>
                  )}

                  <td
                    className={`overflow-hidden  ${
                      checkError?.error?.includes("weight") &&
                      "text-red-500 font-bold"
                    }`}
                  >
                    {editAble ? (
                      <input
                        placeholder="Weight"
                        type="number"
                        value={editForm?.weight}
                        name="weight"
                        className="w-[5rem] px-2 py-1"
                        onChange={hanldeEditChange}
                      />
                    ) : (
                      <div
                        className={`overflow-hidden text-nowrap  flex items-center`}
                      >
                        {product.weight}
                        {checkError?.error?.includes("weight") &&
                          !product.weight && (
                            <span className="bg-red-500 text-white text-lg rounded-md">
                              <ExclamationMark weight="bold" />
                            </span>
                          )}
                      </div>
                    )}
                  </td>
                  {!notInDataBase ? (
                    <td className="text-center">
                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateDataDetail(product);
                          setCreateRequest(true);
                        }}
                      >
                        Send request
                      </button> */}
                      {product?.isInInv ? (
                        <span className="bg-green-200 px-2 py-1 rounded-lg text-sm ">
                          {t("Imported")}
                        </span>
                      ) : (
                        <span className="bg-gray-200 px-2 py-1 rounded-lg text-sm ">
                          {t("NotImported")}
                        </span>
                      )}
                    </td>
                  ) : editAble ? (
                    <td className="text-center">
                      <button
                        className="px-5 py-1 rounded-xl bg-green-300 "
                        onClick={handleUpdateEdit}
                      >
                        {t("Save")}
                      </button>
                    </td>
                  ) : (
                    <td className=" text-center">
                      <button
                        className="px-5 py-1 rounded-xl bg-green-300 "
                        onClick={(e) => handleShowDetailProduct(e, product)}
                      >
                        {t("Edit")}
                      </button>
                    </td>
                  )}
                  {!notInDataBase ? (
                    <td className="text-end">
                      <button
                        className="text-center align-middle relative "
                        onClick={(e) => handleOpenActionTab(e, product)}
                      >
                        <DotsThreeVertical weight="bold" className="text-2xl" />
                        {openAction === product && (
                          <>
                            <div className="absolute w-full h-full top-0"></div>
                            <div
                              className={`action-tab-container translate-x-1 border ${
                                thisIsTheLastItem ? "-top-[200%]" : "top-[50%]"
                              }`}
                              ref={actionComponent}
                            >
                              <div
                                className="cursor-pointer"
                                onClick={(e) =>
                                  handleShowDetailProduct(e, product)
                                }
                              >
                                Show detail
                              </div>
                              {!product?.isInInv && (
                                <div
                                  className="cursor-pointer"
                                  onClick={(e) => handleDeleteClick(e, product)}
                                >
                                  Delete
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </button>
                    </td>
                  ) : editAble ? (
                    <td className="text-center">
                      <button
                        className="px-5 py-1 rounded-xl bg-red-500 text-white overflow-hidden text-nowrap "
                        onClick={(e) => handleShowDetailProduct(e)}
                      >
                        {t("Cancel")}
                      </button>
                    </td>
                  ) : (
                    <td className="text-center">
                      <button
                        className="text-center align-middle text-2xl relative bg-red-500 text-white p-2 rounded-2xl"
                        onClick={(e) => handleDeleteClick(e, product)}
                      >
                        <X weight="bold" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>
      {!notInDataBase && (
        <div className="grid grid-cols-3">
          <div className="flex items-center space-x-5 mt-5">
            <p>{t("ItemsPerPage")}:</p>
            <select
              className="outline outline-1 px-1 py-1 rounded-xl"
              onChange={(e) => setIndex(e.target.value)}
              value={index}
            >
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
            </select>
          </div>
          <div className="flex space-x-5 items-center w-full justify-center">
            <Pagination
              response={response}
              currentPage={page + 1}
              handleLeft={() => setPage(page - 1)}
              handleRight={() => setPage(page + 1)}
              handleChoose={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
