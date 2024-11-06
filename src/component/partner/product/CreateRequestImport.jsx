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
  inventories,
  handleCancel,
}) {
  const { userInfor } = useContext(AuthContext);
  const { setProductCreateRequest } = useDetail();
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

  const handleCloseImport =async (e) => {
    e.stopPropagation();
    e.preventDefault();
    await setProductCreateRequest(false);
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
    const fetching = await createRequest(form, "Import", true);
    console.log(fetching);
  };
  const handleSaveDraft = async () => {
    console.log(form);
    const fetching = await createRequest(form, "Import", false);
    console.log(fetching);
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
        <div>
          <input
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
          <input placeholder="Name" name="lot.name" onChange={handleInput} />
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
        </div>
        <div>
          <DetailProduct
            product={product}
            handleCancel={handleCloseImport}
            handleConfirm={handleConfirm}
            handleSaveDraft={handleSaveDraft}
          />
        </div>
      </div>
    </>
  );
}
