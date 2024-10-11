import React from "react";

export function WarehouseCard({ warehouse, setWareHouse }) {
  return (
    <div
      className="bg-white shadow-md rounded-lg p-6 mb-4 w-full max-w-lg mx-auto text-black"
      onClick={() => setWareHouse(warehouse)}
    >
      <div className="font-bold text-xl text-left ">{warehouse?.name}</div>
      <div className="flex items-center justify-between">
        <div className="flex-1 text-left">
          <div className="text-gray-500">{warehouse?.location}</div>
        </div>

        <div className="flex-1">
          <div className="text-gray-700 mb-1">
            <span className="font-semibold">Inventories:</span>{" "}
            {warehouse?.inventories?.length}
          </div>
        </div>
      </div>
      <div className="text-gray-500 text-left">
        Size:
        <span className="text-black">{warehouse?.size}</span>
      </div>
    </div>
  );
}
export function InventoryCard({ inventory,setInventory }) {
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
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 w-full max-w-lg mx-auto  text-black" onClick={()=>setInventory(inventory)}>
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
