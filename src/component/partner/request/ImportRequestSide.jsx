import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../context/AuthContext";
import {
  ArrowCounterClockwise,
  CaretDown,
  CaretUp,
  X,
} from "@phosphor-icons/react";
import AxiosRequest from "../../../services/Request";
import Select from "react-select";
import { differenceInDays, format } from "date-fns";

export default function ImportRequestSide({ inventories, products }) {
  const { userInfor } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [selectedProductImported, setSelectedProductImported] = useState();
  const [inventory, setInventory] = useState();

  const baseForm = {
    ocopPartnerId: userInfor?.id,
    name: "",
    description: "",
    exportFromLotId: 0,
    sendToInventoryId: 0,
    lot: {
      lotNumber: "",
      name: "",
      lotAmount: null,
      productId: 0,
      productPerLot: null,
    },
  };
  const exportBaseForm = {
    ocopPartnerId: userInfor?.id,
    name: "",
    description: "",
    exportFromLotId: 0,
    sendToInventoryId: 0,
    lot: {
      lotAmount: null,
    },
  };

  const [form, setForm] = useState(baseForm);
  const [loading, setLoading] = useState(false);
  const { createRequest } = AxiosRequest();
  const { t } = useTranslation();

  // Handle input changes
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const keys = name.split(".");
      if (keys.length > 1) {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value,
          },
        };
      }
      return { ...prev, [name]: value };
    });
  };

  // Handle confirm
  const handleConfirm = async (send) => {
    const currentDateTime = new Date().toISOString().replace(/[-:.T]/g, ""); // Generate unique timestamp
    const updatedForm = {
      ...form,
      sendToInventoryId: parseInt(inventory?.id),
      lot: {
        ...form.lot,
        productId: parseInt(selectedProduct?.id),
        lotNumber: `${form.lot.productId}-${currentDateTime}`, // Lot number format
        name: `${product?.name || "Unnamed"}-${userInfor?.name || "User"}`, // Lot name format
      },
    };
    try {
      const result = await createRequest(updatedForm, "Import", send);
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  const handleShowDetailProduct = (pro) => {
    if (pro === product) {
      setProduct();
      return;
    }
    setProduct(pro);
  };
  const handleSelectProduct = (pro) => {
    setSelectedProduct(pro);
    if (inventory?.isCold === pro?.isCold) {
      return;
    }
    setInventory();
  };
  const handleSlectImportedProduct = (pro) => {
    const selectedImportProduct = products.find((item) => item?.id === pro?.id);
    setSelectedProduct(selectedImportProduct);
    setSelectedProductImported(pro);
  };

  const handleReset = () => {
    setForm(baseForm);
    setSelectedProduct();
    setInventory();
    setSelectedProductImported();
  };

  console.log("products", selectedProductImported);
  return (
    <div className="flex gap-10 justify-start items-start">
      <div className="w-1/2 flex-col flex gap-8  rounded-xl shadow-xl p-10 border-2 h-[48rem]">
        <div className="flex justify-between items-center ">
          <p className="font-medium text-2xl ">{t("CreateForm")}</p>
          <button
            className="text-2xl  rounded-full p-2  cursor-pointer text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
          >
            <ArrowCounterClockwise weight="bold" />
          </button>
        </div>
        <div className="form-group gap-2">
          <label className="text-[var(--en-vu-600)] font-normal">
            {t("RequestName")}
          </label>
          <input
            className="outline-none border-2 py-2 px-4 focus-within:border-black"
            name="name"
            value={form.name}
            onChange={handleInput}
          />
        </div>
        <div className="form-group gap-2">
          <label className="text-[var(--en-vu-600)] font-normal">
            {t("RequestDescription")}
          </label>
          <input
            className="outline-none border-2 py-2 px-4 focus-within:border-black"
            name="description"
            value={form.description}
            onChange={handleInput}
          />
        </div>
        {selectedProduct ? (
          <div className="grid grid-cols-7  relative h-[6rem] items-center border-2   p-4 shadow-lg  ">
            <div className="col-span-1 h-[4rem] w-[4rem] overflow-hidden">
              <img
                className="w-full h-full object-cover object-center border-2 "
                src={selectedProduct?.pictureLink}
              />
            </div>
            <div className="grid-rows-2 col-span-6">
              <div>{selectedProduct?.name}</div>
              <div className="text-gray-400">
                {selectedProduct?.productCategoryName}
              </div>
            </div>
            <div
              className="absolute top-[1rem] right-[1.5rem] text-2xl  w-[4rem] h-[4rem] flex items-center justify-center text-gray-400 hover:text-black cursor-pointer"
              onClick={() => setSelectedProduct()}
            >
              <X weight="bold" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-7  relative h-[6rem] items-center border-2 border-dashed  p-4 cursor-pointer ">
            <div className="col-start-2 col-span-5 text-center text-gray-400">
              {t("YourProductSelection")}
            </div>
          </div>
        )}

        <div className="flex w-full gap-10">
          <div className="form-group gap-2 w-full">
            <label>{t("AmountofLot")}</label>
            <input
              className="outline-none border-2 py-2 px-4 focus-within:border-black"
              type="number"
              name="lot.lotAmount"
              value={form?.lot?.lotAmount || ""}
              onChange={handleInput}
            />
          </div>
          <div className="form-group gap-2 w-full">
            <label className="text-[var(--en-vu-600)] font-normal">
              {t("AmountofProductPerLot")}
            </label>
            <input
              className="outline-none border-2 py-2 px-4 focus-within:border-black"
              type="number"
              name="lot.productPerLot"
              value={form?.lot?.productPerLot || ""}
              onChange={handleInput}
            />
          </div>
        </div>
        <div className="form-group gap-2">
          <label className="text-[var(--en-vu-600)] font-normal">
            {t("Inventory")}
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
                maxHeight: "11.5rem",
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
                  ? "var(--Xanh-Base)"
                  : isFocused
                  ? "var(--Xanh-100)"
                  : "white",
                color: isSelected ? "white !important" : "black",
                cursor: "pointer",
                padding: "0.5rem 1rem", // Option padding
                textAlign: "left", // Center-align text
              }),
            }}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            value={
              inventories.find((item) => item.id === inventory?.id) || null
            }
            onChange={(selectedOption) => setInventory(selectedOption)}
            options={inventories.filter(
              (item) => item?.isCold === selectedProduct?.isCold
            )}
            formatOptionLabel={(selectedOption) => (
              <div className="">
                <div className="flex gap-4 ">
                  <p>{selectedOption?.name}</p>
                  <p className="text-sm text-gray-500">{"(" + selectedOption?.warehouseName + ")"}</p>
                </div>
                <div
                  className={`flex items-center justify-between text-sm text-gray-500`}
                >
                  {selectedOption?.maxWeight && (
                    <div className="flex items-center gap-4">
                      <p>{t("Weight")}</p>
                      <p>
                        {new Intl.NumberFormat().format(
                          selectedOption?.weight
                        ) +
                          "/" +
                          new Intl.NumberFormat().format(
                            selectedOption?.maxWeight
                          )}{" "}
                        kg
                      </p>
                    </div>
                  )}
                  {selectedOption?.expirationDate && (
                    <div className="flex gap-4 items-center">
                      <p>{t("Expiredon")}:</p>
                      <p className="">
                        {selectedOption?.expirationDate
                          ? `${differenceInDays(
                              new Date(selectedOption?.expirationDate),
                              new Date()
                            )} ${t("days")} ( ${format(
                              selectedOption?.expirationDate,
                              "dd/MM/yyyy"
                            )} )`
                          : "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            placeholder={"ChooseProductFirst..."}
          />
        </div>
        <div className="flex justify-between py-2 pb-4">
          <div className="space-x-10">
            <button className="bg-red-300 text-black hover:text-white px-4 py-2 rounded-md hover:bg-red-500">
              {t("Cancel")}
            </button>
          </div>
          <div className="gap-4 flex">
            <button
              className="bg-gray-300 text-black hover:text-white px-4 py-2 rounded-md hover:bg-gray-500"
              onClick={() => handleConfirm(false)}
            >
              {t("SaveAsDraft")}
            </button>
            <button
              className=" bg-green-300 text-black hover:text-white px-4 py-2 rounded-md hover:bg-green-500"
              onClick={() => handleConfirm(true)}
            >
              {t("Confirm")}
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/2 flex-col flex gap-8  rounded-xl shadow-xl p-10 border-2 h-[48rem]">
        <div>
          <p className="font-medium text-2xl ">{t("SelectProduct")}</p>
          <p className="text-gray-500  ">
            {t("ChooseOrDragProductToCreateForm")}
          </p>
        </div>
        <div className="flex-col h-[38rem] max-h-[38rem] overflow-auto">
          {products?.map((pro) => {
            if (product?.id === pro?.id) {
              return (
                <div
                  className={`border-2 rounded-3xl my-4 overflow-hidden shadow-lg ${
                    selectedProduct?.id === pro?.id && "bg-[var(--Xanh-100)]"
                  }`}
                >
                  <div
                    className="grid grid-cols-5  relative h-[8rem] items-center  p-6 cursor-pointer"
                    onClick={() => handleShowDetailProduct(pro)}
                  >
                    <div className="col-span-1 h-[6rem] w-[6rem] overflow-hidden">
                      <img
                        className="w-full h-full object-cover object-center rounded-lg border-2 "
                        src={pro?.pictureLink}
                      />
                    </div>
                    <div className="grid-rows-2 col-span-4">
                      <div>{pro?.name}</div>
                      <div>{pro?.productCategoryName}</div>
                    </div>
                    <div className="absolute top-[2rem] right-[1.5rem] text-2xl  w-[4rem] h-[4rem] flex items-center justify-center text-black ">
                      <CaretUp weight="bold" />
                    </div>
                  </div>
                  <div className="flex flex-col w-full  p-6 pt-0 gap-6">
                    <div
                      className={`h-[0.1rem]  w-full ${
                        selectedProduct?.id === pro?.id
                          ? "bg-white"
                          : "bg-gray-300"
                      }`}
                    />
                    {[
                      { label: t("DisplayName"), value: product?.name },
                      { label: t("Origin"), value: product?.origin },
                      {
                        label: t("ProductCategoryName"),
                        value: product?.productCategoryName,
                      },
                      {
                        label: t("Weight"),
                        value: product?.weight + " kg",
                      },
                      {
                        label: t("Price"),
                        value:
                          new Intl.NumberFormat().format(product?.price) +
                          " vnd" +
                          " / " +
                          product?.unit,
                      },
                      {
                        label: t("DisplayName"),
                        value: format(product?.createDate, "dd/MM/yyyy"),
                      },
                      {
                        label: t("Frozen"),
                        value: product?.isCold === 1 ? "True" : "False",
                      },
                    ].map((item) => {
                      return (
                        <div className="flex justify-between">
                          <div className="text-gray-500 font-medium">
                            {item.label}:
                          </div>
                          <div>{item.value}</div>
                        </div>
                      );
                    })}
                    <button
                      className={`w-full h-[3rem] border-2 text-center rounded-2xl  hover:font-medium hover:border-gray-300 
                            ${
                              selectedProduct?.id === pro?.id
                                ? "bg-white hover:bg-gray-100"
                                : "bg-[var(--Xanh-100)] hover:bg-[var(--Xanh-200)]"
                            }
                            `}
                      onClick={() => handleSelectProduct(pro)}
                    >
                      Choose
                    </button>
                  </div>
                </div>
              );
            }
            return (
              <div
                className={`grid grid-cols-5  relative h-[8rem] items-center border-2 rounded-3xl my-4 p-4 shadow-lg cursor-pointer hover:bg-gray-100  ${
                  selectedProduct?.id === pro?.id
                    ? "bg-[var(--Xanh-100)] hover:bg-[var(--Xanh-200)]"
                    : "hover:bg-gray-100 "
                }`}
                onClick={() => handleShowDetailProduct(pro)}
              >
                <div className="col-span-1 h-[6rem] w-[6rem] overflow-hidden">
                  <img
                    className="w-full h-full object-cover object-center rounded-lg border-2 "
                    src={pro?.pictureLink}
                  />
                </div>
                <div className="grid-rows-2 col-span-4">
                  <div>{pro?.name}</div>
                  <div>{pro?.productCategoryName}</div>
                </div>
                <div className="absolute top-[2rem] right-[1.5rem] text-2xl  w-[4rem] h-[4rem] flex items-center justify-center text-black ">
                  <CaretDown weight="bold" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
