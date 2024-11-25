import React from "react";
import defaultImg from "../../../assets/img/defaultImg.jpg";
export function WarehouseCard({ warehouse, setWareHouse }) {
  const totalWeight = warehouse?.inventories?.reduce(
    (total, item) => total + (item?.maxWeight || 0),
    0
  );

  return (
    <div
      className={` shadow-lg rounded-lg p-6 mb-4 w-full max-w-lg mx-auto text-black cursor-pointer ${
        totalWeight ? "bg-[var(--Xanh-10)] hover:bg-[var(--Xanh-100)]" : "bg-white hover:bg-[var(--en-vu-100)]"
      }`}
       onClick={() => setWareHouse(warehouse)}
    >
      <div className="flex items-start gap-10">
        <div className="overflow-auto w-[8rem] h-[10rem] ">
          <img
            src={warehouse?.imgLink || defaultImg}
            className="bg-gray-300 w-[8rem] h-[8rem] rounded-xl "
          />
          <div
            className={`w-full text-center font-semibold mt-2 ${
              totalWeight ? "text-[var(--Xanh-Base)]" : "text-[var(--Do-Base)]"
            }`}
          >
            {totalWeight ? "Bought" : "Not yet"}
          </div>
        </div>
        <div className="h-full ">
          <div className="font-bold text-xl text-left mb-4 w-[18rem] overflow-hidden text-nowrap text-ellipsis whitespace-normal">
            {warehouse?.name}
          </div>
          {[
            { label: "Location", value: warehouse?.location },
            ...(warehouse?.totalInventory
              ? [{ label: "Inventories", value: warehouse?.totalInventory }]
              : []),
            {
              label: "Capacity",
              value: totalWeight
                ? `${totalWeight}/${warehouse?.capacity || "N/A"}`
                : warehouse?.capacity || "N/A",
            },
          ].map((item) => (
            <div className="flex-1 text-left flex items-center gap-4">
              <span className="text-gray-500">{item.label}:</span>
              <div className="font-semibold ">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export function InventoryCard({ inventory, setInventory }) {
  const {
    inventory_id,
    max_weight,
    current_weight,
    warehouse,
    bought_date,
    expiration_date,
    products,
    distance,
    estimated_time,
  } = inventory;

  return (
    <div
      className="bg-white shadow-md rounded-lg p-6 mb-4 w-full max-w-lg mx-auto  text-black"
      onClick={() => setInventory(inventory)}
    >
      <div className="font-bold text-xl text-left ">{warehouse?.name}</div>
      <div className="flex items-center justify-between">
        {/* Right Side: Route Info */}
        <div className="flex-1 text-left">
          <div className="text-gray-500">{warehouse?.location}</div>
        </div>
        {/* Left Side: Status, ID, and Weight Info */}
        <div className="flex-1">
          <div className="text-gray-700 mb-1">
            <span className="font-semibold">Max weight:</span> {max_weight}
          </div>
        </div>
      </div>
      <div className="text-gray-500 text-left">
        Date:
        <span className="text-black">
          {bought_date} to {expiration_date}
        </span>
      </div>
    </div>
  );
}
