import { useEffect, useState } from "react";
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
import AxiosWarehouse from "../../services/Warehouse";
import { useAuth } from "../../context/AuthContext";



export default function InventoryPage() {
  const [warehouse, setWareHouse] = useState("");
  const [warehouses, setWareHouses] = useState();
  const [inventory, setInventory] = useState("");
  const [loading, setLoading] = useState(false);
  const [refetching, setRefetching] = useState(false);

  const {userInfor}=useAuth();
  const { getWarehouseByUserId } = AxiosWarehouse();

  useEffect(() => {
    fetchingData();
  }, [refetching]);

  const fetchingData = async () => {
    try {
      setLoading(true);
      const res = await getWarehouseByUserId(userInfor?.id);
      console.log(res);
      if (res?.status == 200) {
        setWareHouses(res?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  console.log(warehouse);
  
  return (
    <div>
      <div className="text-left">
        {/* Responsive grid for the inventory cards */}
        {warehouse === "" ? (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="col-span-4">
                <WarehouseHeader />
              </div>
              {warehouses&&warehouses.map((warehouse) => (
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
          <InventoryProduct setInventory={setInventory} />
        )}
      </div>
    </div>
  );
}
