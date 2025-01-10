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

export default function ExportRequestSide({
  productsImported,
  inventories,
  products,
}) {
  const { userInfor } = useContext(AuthContext);
  const { createRequest } = AxiosRequest();
  const { t } = useTranslation();
  const [typeRequest, setTypeRequest] = useState("Import");
  const [product, setProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductImported, setSelectedProductImported] = useState();
  const [inventory, setInventory] = useState();

  const baseForm = {
    ocopPartnerId: userInfor?.id,
    name: "",
    description: "",
    exportFromLotId: 0,
    sendToRoomId: 0,
    lot: {
      lotNumber: "",
      name: "",
      lotAmount: null,
      productId: 0,
      productPerLot: null,
    },
  };
  const [form, setForm] = useState(baseForm);
  const [loading, setLoading] = useState(false);
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
  const handleConfirm = async (send) => {
    const updatedForm = {
      ...form,
      exportFromLotId: parseInt(selectedProduct?.id),
      sendToRoomId: parseInt(inventory?.id),
      lot: {
        ...form.lot,
      },
    };
    try {
      const result = await createRequest(updatedForm, "Export", send);
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

  const handleReset = () => {
    setForm(baseForm);
    setSelectedProduct();
    setInventory();
    setSelectedProductImported();
  };
  return (
    <div className="flex gap-10 justify-start items-start">
      <div className="w-1/2 flex-col flex gap-8  rounded-xl shadow-xl p-10 border-2 h-[48rem]">
        <div className="flex justify-between items-center ">
          <p className="font-medium text-2xl ">{t("Create Form")}</p>
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
          <div
            className={`  relative text-base h-fit gap-4 grid grid-cols-6 items-end  border-2 p-4 px-6 shadow-lg `}
          >
            <div className="col-span-1 h-[6rem] w-[6rem] overflow-hidden">
              <img
                className="w-full h-full object-cover object-center rounded-lg border-2 "
                src={selectedProduct?.productPictureLink}
              />
            </div>
            <div className="col-span-3 h-full  flex flex-col items-start py-2  justify-between">
              <p className="text-lg">
                <span className="font-medium">{t("Lot")}: </span>
                {selectedProduct?.lotNumber}
              </p>
              <p className="text-gray-400">
                <span className="font-medium">{t("Product")}: </span>
                {selectedProduct?.productName}
              </p>
              <p className="text-gray-400">
                <span className="font-medium">{t("Warehouse") + ": "}</span>
                {selectedProduct?.warehouseName}
              </p>
            </div>
            <div className=" text-gray-400 col-span-2 text-end">
              <p>
                {selectedProduct?.expirationDate
                  ? `${differenceInDays(
                      new Date(selectedProduct.expirationDate),
                      new Date()
                    )} ${t("days")} ( ${format(
                      selectedProduct?.expirationDate,
                      "dd/MM/yyyy"
                    )} )`
                  : "N/A"}
              </p>
            </div>
            <div
              className="absolute top-[0rem] right-[0.1rem] text-2xl  w-[4rem] h-[4rem] flex items-center justify-center text-gray-400 hover:text-black cursor-pointer"
              onClick={() => setSelectedProduct()}
            >
              <X weight="bold" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-7  relative h-[6rem] items-center border-2 border-dashed  p-4 cursor-pointer ">
            <div className="col-start-2 col-span-5 text-center text-gray-400">
              {t("Your Product Selection")}
            </div>
          </div>
        )}

        <div className="flex w-full gap-10">
          <div className="form-group gap-2 w-full">
            <label className="text-[var(--en-vu-600)] font-normal">
              {t("Room")}
            </label>
            <Select
              styles={{
                menu: (provided) => ({
                  ...provided,
                  overflowY: "hidden",
                }),
                menuList: (provided) => ({
                  ...provided,
                  padding: 0,
                  maxHeight: "11.5rem",
                  overflow: "auto",
                }),
                control: (baseStyles) => ({
                  ...baseStyles,
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "0.25rem",
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
                  padding: "0.5rem 1rem",
                  textAlign: "left",
                }),
              }}
              getOptionLabel={(option) => option.storeName}
              getOptionValue={(option) => option.id}
              value={
                inventories.find((item) => item.id === inventory?.id) || null
              }
              onChange={(selectedOption) => setInventory(selectedOption)}
              options={inventories.filter(
                (item) =>
                  (item?.isCold === 0 ? false : true) ===
                    selectedProduct?.isCold &&
                  item?.storeName !== selectedProduct?.storeName
              )}
              formatOptionLabel={(selectedOption) => (
                <div className="">
                  <p>
                    {"Room: " + selectedOption?.roomCode}{" "}
                    {"(" + selectedOption?.storeName + ")"}
                  </p>
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
              isDisabled={typeRequest === "Export"}
              placeholder={
                typeRequest === "Export"
                  ? selectedProductImported?.storeName
                  : t("Choose Product First...")
              }
            />
          </div>
          <div className="form-group gap-2">
            <label>{t("AmountofLot")}</label>
            <input
              className="outline-none border-2 py-2 px-4 focus-within:border-black"
              type="number"
              name="lot.lotAmount"
              value={form?.lot?.lotAmount || ""}
              onChange={handleInput}
            />
          </div>
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
          <p className="font-medium text-2xl ">{t("Select Product")}</p>
          <p className="text-gray-500  ">{t("Choose Product")}</p>
        </div>
        <div className="flex-col h-[42rem] max-h-[38rem] overflow-auto">
          {productsImported?.items?.map((pro) => {
            if (product?.id === pro?.id) {
              return (
                <div
                  className={`border-2 rounded-3xl my-4 overflow-hidden shadow-lg ${
                    selectedProduct?.id === pro?.id && "bg-[var(--Xanh-100)]"
                  }`}
                >
                  <div
                    className={`  relative text-base h-fit gap-4 flex flex-col  p-4 px-6  `}
                    onClick={() => handleShowDetailProduct(pro)}
                  >
                    <div className="flex justify-between">
                      <p>
                        <span className="font-medium">{t("Lot")}: </span>
                        {pro?.lotNumber}
                      </p>
                      <p>
                        <span className="font-medium">{t("Product")}: </span>
                        {pro?.productName}
                      </p>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <p>
                        <span className="font-medium">
                          {t("Store Name") + ": "}
                        </span>
                        {pro?.storeName}
                      </p>
                      <p>
                        {"Expiration" + ": "}
                        {pro?.expirationDate
                          ? `${differenceInDays(
                              new Date(pro.expirationDate),
                              new Date()
                            )} ${t("days")} ( ${format(
                              pro?.expirationDate,
                              "dd/MM/yyyy"
                            )} )`
                          : "N/A"}
                      </p>
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
                      { label: t("Lot Number"), value: product?.lotNumber },
                      { label: t("Product Name"), value: product?.productName },
                      {
                        label: t("Store Name"),
                        value: product?.storeName,
                      },
                      {
                        label: t("Expiration"),
                        value: pro?.expirationDate
                          ? `${differenceInDays(
                              new Date(pro.expirationDate),
                              new Date()
                            )} ${t("days")} ( ${format(
                              pro?.expirationDate,
                              "dd/MM/yyyy"
                            )} )`
                          : "N/A",
                      },
                      {
                        label: t("Import Date"),
                        value: format(product?.importDate, "dd/MM/yyyy"),
                      },
                      {
                        label: t("Lot Amount"),
                        value:
                          product?.lotAmount +
                          " lots (" +
                          product?.totalProductAmount +
                          " " +
                          t("TotalProducts") +
                          ")",
                      },
                      {
                        label: t("Product Per Lot"),
                        value: product?.productPerLot,
                      },
                      {
                        label: t("Frozen"),
                        value: product?.isCold === 1 ? "Yes" : "No",
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
                className={`  relative text-base h-fit gap-4 flex flex-col border-2 rounded-3xl my-4 p-4 px-6 shadow-lg cursor-pointer 
                      ${
                        selectedProduct === pro
                          ? "bg-[var(--Xanh-100)] hover:bg-[var(--Xanh-200)]"
                          : "hover:bg-gray-100 "
                      }
                      `}
                onClick={() => handleShowDetailProduct(pro)}
              >
                <div className="flex justify-between">
                  <p>
                    <span className="font-medium">{t("Lot")}: </span>
                    {pro?.lotNumber}
                  </p>
                  <p>
                    <span className="font-medium">{t("Product")}: </span>
                    {pro?.productName}
                  </p>
                </div>
                <div className="flex justify-between text-gray-400">
                  <p>
                    <span className="font-medium">
                      {t("Store Name") + ": "}
                    </span>
                    {pro?.storeName}
                  </p>
                  <p>
                    {"Expiration" + ": "}
                    {pro?.expirationDate
                      ? `${differenceInDays(
                          new Date(pro.expirationDate),
                          new Date()
                        )} ${t("days")} ( ${format(
                          pro?.expirationDate,
                          "dd/MM/yyyy"
                        )} )`
                      : "N/A"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
