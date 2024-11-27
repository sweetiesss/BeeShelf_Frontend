import { useContext, useEffect, useRef, useState } from "react";
import defaultImg from "../../../assets/img/defaultImg.jpg";
import DetailProduct from "./DetailProduct";
import AxiosLot from "../../../services/Lot";
import { toast } from "react-toastify";
import AxiosRequest from "../../../services/Request";
import { AuthContext } from "../../../context/AuthContext";
import { useDetail } from "../../../context/DetailContext";
import { useTranslation } from "react-i18next";

export default function CreateRequestImport({
  product,
  setProduct,
  products,
  inventories,
  handleCancel,
  type,
  setType,
  enableSelect,
  handleClose,
}) {
  const { userInfor } = useContext(AuthContext);
  const { setCreateRequest } = useDetail();
  const baseForm = {
    ocopPartnerId: userInfor?.id,
    name: "",
    description: "",
    sendToInventoryId: null,
    lot: {
      lotNumber: "",
      name: "",
      amount: null,
      productId: product?.id,
      productAmount: null,
    },
  };
  const [form, setForm] = useState(baseForm);
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
      lot: {
        ...form.lot,
        lotNumber: `${form.lot.productId}-${currentDateTime}`, // Product ID + Date-Time
        name: `${product.name}-${userInfor?.name || "User"}`, // Product Name + User's Name
      },
    };
    const fetching = await createRequest(submitForm, type, true);
    handleClose();
  };
  const handleSaveDraft = async () => {
    console.log(form);
    const fetching = await createRequest(form, type, false);
    handleClose();
  };
  const handleProductSelect = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = products.find(
      (item) => item.id == selectedProductId
    );

    if (selectedProduct) {
      setProduct(selectedProduct); // Update selected product in parent
    }
  };

  const handleReset = () => {};
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
        {enableSelect && (
          <select
            className=""
            placeholder=""
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value={null}>Select Type of Request</option>
            <option value={"Import"}>Import products to warehouse</option>
            <option value={null}>Export products</option>
            <option value={null}>Withdrawn money</option>
            <option value={null}>Others</option>
          </select>
        )}
        {type === "Import" && (
          <>
            <div className="flex flex-col gap-4">
              {/* <input
                placeholder="Request Name"
                name="name"
                onChange={handleInput}
              />
              <input
                placeholder="Request Description"
                name="description"
                onChange={handleInput}
              />
              <input
                placeholder="Lot number"
                name="lot.lotNumber"
                onChange={handleInput}
              />
              <input
                placeholder="Name"
                name="lot.name"
                onChange={handleInput}
              />
              <input
                placeholder="Amount of Lot"
                type="Number"
                name="lot.amount"
                onChange={handleInput}
                min="1"
              />
              <input
                placeholder="Amount of Product"
                type="Number"
                name="lot.productAmount"
                onChange={handleInput}
              /> */}
              <div className="flex flex-col gap-3">
                <label className="text-[var(--en-vu-600)] font-normal">
                  {t("ChooseInventory")}
                </label>
                <select onChange={handleInput} name="sendToInventoryId">
                  <option>Select Inventory</option>
                  {inventories &&
                    inventories.status === 200 &&
                    inventories.data.items.map((inv) => (
                      <option value={inv.id}>
                        {inv.name}-{inv.warehouseName}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[var(--en-vu-600)] font-normal">
                  {t("RequestName")}
                </label>
                <input
                  className="outline-none border-b-2 focus-within:border-black"
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
                  className="outline-none border-b-2 focus-within:border-black"
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
                    className="outline-none border-b-2 focus-within:border-black"
                    type="number"
                    name="lot.amount"
                    value={form?.lot?.amount}
                    onChange={handleInput}
                    min="1"
                  />
                </div>
                {/* <div className="flex flex-col w-full gap-2">
                  <label className="text-[var(--en-vu-600)] font-normal">
                    {t("AmountofProductPerLot")}
                  </label>
                  <input
                    className="outline-none border-b-2 focus-within:border-black"
                    type="number"
                    name="lot.productAmount"
                    value={form?.lot?.productAmount / form?.lot?.amount}
                    onChange={handleInput}
                    disabled={true}
                  />
                </div> */}
                <div className="flex flex-col w-full gap-2">
                  <label className="text-[var(--en-vu-600)] font-normal">
                    {t("TotalAmountofProduct")}
                  </label>
                  <input
                    className="outline-none border-b-2 focus-within:border-black"
                    type="number"
                    name="lot.productAmount"
                    value={form?.lot?.productAmount}
                    onChange={handleInput}
                  />
                </div>
              </div>

              {products?.length > 0 && (
                <select
                  className="border p-2 rounded w-full request-container"
                  onChange={handleProductSelect}
                  value={form.lot.productId}
                >
                  <option value="">Choose Product</option>
                  {products.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {product && (
              <div className="flex justify-between py-2 pb-4">
                <div className="space-x-10">
                  <button
                    className="px-4 py-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                  >
                    Reset
                  </button>
                </div>
                <div>
                  <button className="px-4 py-2" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className="px-4 py-2" onClick={handleSaveDraft}>
                    Save As Draft
                  </button>
                  <button className="px-4 py-2" onClick={handleConfirm}>
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        <></>
      </div>
    </>
  );
}
