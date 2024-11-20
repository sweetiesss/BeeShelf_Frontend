import { useState } from "react";
import {
  InventoryCard,
  WarehouseCard,
} from "../../component/partner/inventory/InventoryCard";
import {
  InventoryHeader,
  WarehouseHeader,
} from "../../component/partner/inventory/Header";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import InventoryProduct from "../../component/partner/inventory/InventoryProduct";

const warehouses = [
  {
    warehouse_id: 1,
    name: "Warehouse A",
    size: 1000,
    location: "Hanoi",
    inventories: [
      {
        inventory_id: 1,
        max_weight: 500,
        weight: 500,
        bought_date: "2023-09-15",
        expiration_date: "2024-09-15",
      },
      {
        inventory_id: 3,
        max_weight: 1200,
        bought_date: "2023-07-20",
        expiration_date: "2024-07-20",
      },
    ],
  },
  {
    warehouse_id: 2,
    name: "Warehouse B",
    size: 1500,
    location: "Ho Chi Minh City",
    inventories: [
      {
        inventory_id: 2,
        max_weight: 750,
        bought_date: "2023-08-10",
        expiration_date: "2024-08-10",
      },
      {
        inventory_id: 5,
        max_weight: 1000,
        bought_date: "2023-06-05",
        expiration_date: "2024-06-05",
      },
    ],
  },
  {
    warehouse_id: 3,
    name: "Warehouse C",
    size: 800,
    location: "Da Nang",
    inventories: [
      {
        inventory_id: 4,
        max_weight: 300,
        bought_date: "2023-10-01",
        expiration_date: "2024-10-01",
      },
    ],
  },
];

export default function InventoryPage() {
  const [warehouse, setWareHouse] = useState("");
  const [inventory, setInventory] = useState("");
  return (
    <div>
      <div className="text-left">
        {/* Responsive grid for the inventory cards */}
        {warehouse === "" ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-3">
                <WarehouseHeader />
              </div>
              {warehouses.map((warehouse) => (
                <WarehouseCard
                  warehouse={warehouse}
                  setWareHouse={setWareHouse}
                />
              ))}
            </div>
          </div>
        ) : inventory === "" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
            <div className="col-span-3 flex items-center space-x-3">
              <div
                className="font-bold text-2xl cursor-pointer"
                onClick={() => setWareHouse("")}
              >
                <CaretLeft weight="bold" />
              </div>
              <InventoryHeader />
            </div>
            <div className="flex flex-col ml-5 col-span-3 text-left">
              <span className="font-bold text-2xl">{warehouse.name}</span>
              <span className="text-gray-500">{warehouse.location}</span>
            </div>
            {warehouse?.inventories.map((inventory) => (
              <InventoryCard
                key={inventory.inventory_id}
                inventory={inventory}
                setInventory={setInventory}
              />
            ))}
          </div>
        ) : (
          <InventoryProduct setInventory={setInventory}/>
        )}
      </div>
    </div>
  );
}
