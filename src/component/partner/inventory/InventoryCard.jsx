import React from "react";
import defaultImg from "../../../assets/img/defaultImg.jpg";
import { differenceInDays, format } from "date-fns";
import { Buildings, Package } from "@phosphor-icons/react";
import { t } from "i18next";
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
      <div className="absolute bottom-2 right-2 text-5xl text-gray-300">
        <Buildings weight="fill" />
      </div>
      {warehouse?.owned && (
        <div className="absolute flex justify-center items-center bg-green-500 w-32 text-white h-10 top-2 -right-8 rotate-45">
          <p>{t("Hired")}</p>
        </div>
      )}
      <div className="flex items-start gap-10">
        <div className="h-full ">
          <div className="font-bold text-xl text-left mb-4  overflow-hidden text-nowrap text-ellipsis whitespace-normal">
            {warehouse?.name}
          </div>
          {[
            { label: t("Location"), value: warehouse?.location },
            {
              label: t("Capacity"),
              value:
                `${new Intl.NumberFormat().format(
                  Math.max(warehouse?.capacity - warehouse?.availableCapacity)
                )}/${
                  new Intl.NumberFormat().format(warehouse?.capacity) || "N/A"
                }` + " kg",
            },
          ].map((item) => (
            <div className="flex-1 text-left flex items-start gap-4 ">
              <span className="text-gray-500">{item.label}:</span>
              <div className="  text-nowrap hover:text-wrap text-clip w-[20rem] max-w-[20rem]">
                {item.value}
              </div>
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
      <div className="absolute bottom-2 right-2 text-5xl text-gray-300">
        <Package weight="fill" />
      </div>

      {inventory.ocopPartnerId && (
        <div className="absolute flex justify-center items-center bg-green-500 w-32 text-white h-10 top-2 -right-8 rotate-45">
          <p>{t("Hired")}</p>
        </div>
      )}
      <div className="font-bold mb-4 text-xl">{inventory?.name}</div>

      <div className=" justify-start">
        <div className="text-gray-700 mb-1 flex gap-x-4">
          <p className="font-medium">{t("MaxWeight")}:</p>
          {/* <p>{new Intl.NumberFormat().format(inventory?.maxWeight)} kg</p> */}
          {inventory.ocopPartnerId
            ? new Intl.NumberFormat().format(inventory?.weight) +
                "/" +
                new Intl.NumberFormat().format(inventory?.maxWeight) || "N/A"
            : new Intl.NumberFormat().format(inventory?.maxWeight)}
          kg
        </div>
        <div className="text-gray-700 mb-1 flex gap-x-4">
          <p className="font-semibold">{t("Price")}:</p>
          <p>{new Intl.NumberFormat().format(inventory?.price)} vnd</p>
        </div>
        {inventory.ocopPartnerId && (
          <div className="text-gray-700 mb-1 flex gap-x-4">
            <p className="font-semibold">{t("Expiredon")}:</p>
            <p>
              {/* {format(inventory?.boughtDate, "dd/MM/yyyy")} -{" "}
              {format(inventory?.expirationDate, "dd/MM/yyyy")} */}
              {inventory?.expirationDate
                ? `${differenceInDays(
                    new Date(inventory.expirationDate),
                    new Date()
                  )} ${t("days")} ( ${format(
                    inventory?.expirationDate,
                    "dd/MM/yyyy"
                  )} )`
                : "N/A"}
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
