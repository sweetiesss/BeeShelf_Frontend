import React from "react";
import defaultImg from "../../../assets/img/defaultImg.jpg";
import { format } from "date-fns";
export function WarehouseCard({ warehouse, setWareHouse }) {
  const totalWeight = warehouse?.inventories?.reduce(
    (total, item) => total + (item?.maxWeight || 0),
    0
  );

  return (
    <div
      className={` shadow-xl border-2 relative rounded-lg p-6 mb-4 w-full max-w-lg mx-auto overflow-hidden text-black cursor-pointer bg-white hover:bg-[var(--en-vu-200)]`}
      onClick={() => setWareHouse(warehouse)}
    >
      {warehouse?.owned && (
        <div className="absolute flex justify-center items-center bg-green-500 w-32 text-white h-10 top-2 -right-8 rotate-45">
          <p>Bought</p>
        </div>
      )}
      <div className="flex items-start gap-10">
        <div className="h-full ">
          <div className="font-bold text-xl text-left mb-4  overflow-hidden text-nowrap text-ellipsis whitespace-normal">
            {warehouse?.name}
          </div>
          {[
            { label: "Location", value: warehouse?.location },
            ...(warehouse?.totalInventory
              ? [{ label: "Inventories", value: warehouse?.totalInventory }]
              : []),
            {
              label: "Capacity",
              value: `${Math.max(
                warehouse?.capacity - warehouse?.availableCapacity
              )}/${warehouse?.capacity || "N/A"}`,
            },
          ].map((item) => (
            <div className="flex-1 text-left flex items-start gap-4  ">
              <span className="text-gray-500">{item.label}:</span>
              <div className="font-semibold  text-wrap">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export function InventoryCard({
  inventory,
  handleBuyClick,
  handleShowInventoryDetail,
}) {
  return (
    <div
      className={` shadow-xl border-2 border-gray-200 relative overflow-hidden rounded-lg p-6 mb-4 w-full max-w-lg mx-auto text-black cursor-pointer h-[11rem] bg-white hover:bg-[var(--en-vu-100)]`}
      onClick={(e) =>
        !inventory.ocopPartnerId
          ? handleBuyClick(inventory)
          : handleShowInventoryDetail(e, inventory)
      }
    >
      {inventory.ocopPartnerId && (
        <div className="absolute flex justify-center items-center bg-green-500 w-32 text-white h-10 top-2 -right-8 rotate-45">
          <p>Bought</p>
        </div>
      )}
      <div className="font-bold mb-4 text-xl">{inventory?.name}</div>

      <div className=" justify-start">
        <div className="text-gray-700 mb-1 flex gap-x-4">
          <p className="font-semibold">Max weight:</p>
          <p>{inventory?.maxWeight}</p>
        </div>
        <div className="text-gray-700 mb-1 flex gap-x-4">
          <p className="font-semibold">Price:</p>
          <p>{inventory?.price} VND</p>
        </div>
        {inventory.ocopPartnerId && (
          <div className="text-gray-700 mb-1 flex gap-x-4">
            <p className="font-semibold">Date:</p>
            <p>
              {format(inventory?.boughtDate, "dd/MM/yyyy")} -{" "}
              {format(inventory?.expirationDate, "dd/MM/yyyy")}
            </p>
          </div>
        )}
      </div>

      {/* <div className="text-gray-500 text-left">
        Date:
        <span className="text-black">
          {inventory?.boughtDate} to {inventory?.expirationDate}
        </span>
      </div> */}
    </div>
  );
}
