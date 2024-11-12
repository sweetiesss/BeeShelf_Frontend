import { useContext, useEffect, useRef, useState } from "react";
import defaultImg from "../../../assets/img/defaultImg.jpg";
import DetailProduct from "./DetailProduct";
import AxiosLot from "../../../services/Lot";
import { toast } from "react-toastify";
import AxiosRequest from "../../../services/Request";
import { AuthContext } from "../../../context/AuthContext";
import { useDetail } from "../../../context/DetailContext";

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
    sendToInventoryId: 0,
    lot: {
      lotNumber: "",
      name: "",
      amount: 0,
      productId: product?.id,
      productAmount: 0,
    },
  };
  const [form, setForm] = useState(baseForm);
  const { createRequest } = AxiosRequest();

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
    const fetching = await createRequest(form, type, true);
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
    console.log(selectedProductId);

    console.log(selectedProduct);

    setProduct(selectedProduct); // Update selected product in parent
    setForm((prev) => ({
      ...prev,
      lot: {
        ...prev.lot,
        productId: selectedProductId,
      },
    }));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-10"></div>
      <div
        className="absolute bg-white border border-gray-300 shadow-md rounded-lg p-4 w-fit h-fit flex flex-col z-10"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        ref={floatingComponent}
      >
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
            <div>
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
              <input
                placeholder="Request Name"
                name="name"
                value={form?.name}
                onChange={handleInput}
              />
              <input
                placeholder="Request Description"
                name="description"
                value={form?.description}
                onChange={handleInput}
              />
              <input
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
              />
              <input
                placeholder="Amount of Lot"
                type="number"
                name="lot.amount"
                value={form?.lot?.amount}
                onChange={handleInput}
                min="1"
              />
              <input
                placeholder="Amount of Product"
                type="number"
                name="lot.productAmount"
                value={form?.lot?.productAmount}
                onChange={handleInput}
              />

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
            </div>
            {product && (
              <div>
                <DetailProduct
                  product={product}
                  handleCancel={handleCloseImport}
                  handleConfirm={handleConfirm}
                  handleSaveDraft={handleSaveDraft}
                />
              </div>
            )}
          </>
        )}
        <></>
      </div>
    </>
  );
}
