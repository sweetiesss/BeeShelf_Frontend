import { useState } from "react";
import defaultImg from "../../../assets/img/defaultImg.jpg";
import DetailProduct from "./DetailProduct";
import AxiosLot from "../../../services/Lot";
import { toast } from "react-toastify";

export default function CreateRequestImport({
  product,
  inventories,
  handleCancel,
}) {
  const baseForm = {
    lotNumber: "string",
    name: "string",
    amount: 0,
    productId: product?.id,
    productAmount: 0,
    inventoryId: 0,
  };
  const [form, setForm] = useState(baseForm);
  const { createLot } = AxiosLot();
  const handleInput = (e) => {
    const value = e.target;
    setForm((prev) => ({ ...prev, [value.name]: value.value }));
  };
//   const handleConfirm = async () => {
//     console.log(form);
    
//     const fetching =async () => {
//       const data=await createLot(form);
//       return data;
//     };
//     const result = await toast.promise(fetching(), {
//       pending: "Request in progress...",
//       success: {
//         render() {
//           return `Request created`;
//         },
//       },
//       error: {
//         render({ data }) {
//           return `${data.response.data.message || "Something went wrong!"}`;
//         },
//       },
//     });
//     console.log(result);
//   };
const handleConfirm = async () => {
    console.log(form);
  
    try {
      const result = await toast.promise(
        createLot(form), // Directly pass the promise returned by `createLot`
        {
          pending: "Request in progress...",
          success: {
            render() {
              return `Request created`;
            },
          },
          error: {
            render({ data }) {
              return `${data?.response?.data?.message || "Something went wrong!"}`;
            },
          },
        }
      );
  
      console.log(result);
    } catch (error) {
      console.error("Error in handleConfirm:", error);
    }
  };
  
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>
      <div
        className="absolute bg-white border border-gray-300 shadow-md rounded-lg p-4 w-fit h-fit flex flex-col"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div>
          <input
            placeholder="Lot number"
            name="lotNumber"
            onChange={handleInput}
          />
          <input placeholder="Name" name="name" onChange={handleInput} />
          <input
            placeholder="Amount of Lot"
            type="Number"
            name="amount"
            onChange={handleInput}
            min="1"
          />
          <input
            placeholder="Amount of Product"
            type="Number"
            name="productAmount"
            onChange={handleInput}
          />
          <select onChange={handleInput} name="inventoryId">
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
            type={"OnAction"}
            handleCancel={handleCancel}
            handleConfirm={handleConfirm}
          />
        </div>
      </div>
    </>
  );
}
