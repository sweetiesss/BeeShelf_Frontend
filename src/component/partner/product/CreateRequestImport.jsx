import { useContext, useEffect, useRef, useState } from "react";
import defaultImg from "../../../assets/img/defaultImg.jpg";
import DetailProduct from "./DetailProduct";
import AxiosLot from "../../../services/Lot";
import { toast } from "react-toastify";
import AxiosRequest from "../../../services/Request";
import { AuthContext } from "../../../context/AuthContext";
import { useDetail } from "../../../context/DetailContext";
import { useTranslation } from "react-i18next";
import { ArrowCounterClockwise } from "@phosphor-icons/react";
import Select from "react-select";
import { differenceInDays, format } from "date-fns";
export default function CreateRequestImport({
  product,

  inventories,
  handleCancel,

  handleClose,
}) {
  const { userInfor } = useContext(AuthContext);
  const { setCreateRequest } = useDetail();
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
      productId: product?.id,
      productPerLot: null,
    },
  };
  const [form, setForm] = useState(baseForm);
  const [inventory, setInventory] = useState(baseForm);
  const { createRequest } = AxiosRequest();
  const { t } = useTranslation();

  const floatingComponent = useRef();

  const handleCloseImport = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    await setCreateRequest(false);
  };

  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (
        floatingComponent.current &&
        !floatingComponent.current.contains(event.target)
      ) {
        handleCloseImport(event);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);
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
  const handleConfirm = async () => {
    console.log(form);

    const currentDateTime = new Date().toISOString().replace(/[-:.T]/g, ""); // Format date-time
    let submitForm = {
      ...form,
      sendToInventoryId: parseInt(inventory.id),
      lot: {
        ...form.lot,
        lotNumber: `${form.lot.productId}-${currentDateTime}`, // Product ID + Date-Time
        name: `${product.name}-${userInfor?.name || "User"}`, // Product Name + User's Name
      },
    };
    const fetching = await createRequest(submitForm, "Import", true);
    if (fetching?.status === 200) {
      handleClose();
    }
  };
  const handleSaveDraft = async () => {
    console.log(form);
    const currentDateTime = new Date().toISOString().replace(/[-:.T]/g, ""); // Format date-time
    let submitForm = {
      ...form,
      sendToInventoryId: parseInt(inventory.id),
      lot: {
        ...form.lot,
        lotNumber: `${form.lot.productId}-${currentDateTime}`, // Product ID + Date-Time
        name: `${product.name}-${userInfor?.name || "User"}`, // Product Name + User's Name
      },
    };
    const fetching = await createRequest(submitForm, "Import", false);
    if (fetching?.status === 200) {
      handleClose();
    }
  };

  const handleReset = () => {};
  console.log("productData", product);
  console.log("inventory", inventories);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div>
      <div
        className="absolute bg-white border border-gray-300 shadow-md rounded-lg p-4 h-fit flex flex-col over-detail-slider gap-10 w-[50vw]"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        ref={floatingComponent}
      >
        <div>
          <p className="font-semibold text-xl">{t("CreateRequest")}</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <label className="text-[var(--en-vu-600)] font-normal">
              {t("ChooseInventory")}
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
              value={inventory}
              onChange={(selectedOption) => setInventory(selectedOption)}
              options={inventories?.data?.items.filter(
                (item) => item.isCold === product.isCold
              )}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              formatOptionLabel={(selectedOption) => (
                <div className="">
                  <p>{selectedOption?.name}</p>
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
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[var(--en-vu-600)] font-normal">
              {t("RequestName")}
            </label>
            <input
              className="outline-none border-2 py-2 focus-within:border-black"
              name="name"
              value={form?.name}
              onChange={handleInput}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[var(--en-vu-600)] font-normal">
              {t("RequestDescription")}
            </label>
            <input
              className="outline-none border-2 py-2 focus-within:border-black"
              type="text"
              name="description"
              value={form?.description}
              onChange={handleInput}
            />
          </div>
          {/* <input
                placeholder="Lot Number"
                name="lot.lotNumber"
                value={form?.lot?.lotNumber}
                onChange={handleInput}
              />
              <input
                placeholder="Name"
                name="lot.name"
                value={form?.lot?.name}
                onChange={handleInput}
              /> */}

          <div className="flex justify-between gap-10">
            <div className="flex flex-col w-full gap-2">
              <label className="text-[var(--en-vu-600)] font-normal">
                {t("AmountofLot")}
              </label>
              <input
                className="outline-none border-2 py-2 focus-within:border-black"
                type="number"
                name="lot.lotAmount"
                value={form?.lot?.lotAmount}
                onChange={handleInput}
                min="1"
              />
            </div>
            {/* <div className="flex flex-col w-full gap-2">
                  <label className="text-[var(--en-vu-600)] font-normal">
                    {t("AmountofProductPerLot")}
                  </label>
                  <input
                    className="outline-none border-2 py-2 focus-within:border-black"
                    type="number"
                    name="lot.productAmount"
                    value={form?.lot?.productAmount / form?.lot?.amount}
                    onChange={handleInput}
                    disabled={true}
                  />
                </div> */}
            <div className="flex flex-col w-full gap-2">
              <label className="text-[var(--en-vu-600)] font-normal">
                {t("AmountOfProductPerLot")}
              </label>
              <input
                className="outline-none border-2 p-2 focus-within:border-black"
                type="number"
                name="lot.productPerLot"
                value={form?.lot?.productPerLot}
                onChange={handleInput}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between py-2 pb-4">
          <div className="space-x-10">
            {/* <button
                    className="text-xl bg-gray-100 p-1 rounded-full border-2 py-2 border-gray-400 hover:bg-gray-200 hover:border-gray-500 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                  >
                    <ArrowCounterClockwise />
                  </button> */}
            <button
              className="bg-red-300 text-black hover:text-white px-4 py-2 rounded-md hover:bg-red-500"
              onClick={handleCancel}
            >
              {t("Cancel")}
            </button>
          </div>
          <div className="gap-4 flex">
            <button
              className="bg-gray-300 text-black hover:text-white px-4 py-2 rounded-md hover:bg-gray-500"
              onClick={handleSaveDraft}
            >
              {t("SaveAsDraft")}
            </button>
            <button
              className=" bg-green-300 text-black hover:text-white px-4 py-2 rounded-md hover:bg-green-500"
              onClick={handleConfirm}
            >
              {t("Confirm")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
