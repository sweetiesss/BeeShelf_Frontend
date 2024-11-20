import { useEffect, useState } from "react";
import {
  InventoryCard,
  WarehouseCard,
} from "../../component/partner/inventory/InventoryCard";
import {
  InventoryHeader,
  WarehouseHeader,
} from "../../component/partner/inventory/Header";
import {
  CaretLeft,
  CaretRight,
  LockKeyOpen,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import InventoryProduct from "../../component/partner/inventory/InventoryProduct";
import AxiosWarehouse from "../../services/Warehouse";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function InventoryPage() {
  const [warehouse, setWareHouse] = useState("");
  const [warehouses, setWareHouses] = useState();
  const [inventory, setInventory] = useState("");
  const [loading, setLoading] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const [setFiltersVisible, filtersVisible] = useState(true);

  const [search, setSearch] = useState(null);
  const [sortCriteria, setSortCriteria] = useState(null);
  const [descending, setDescending] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { userInfor } = useAuth();
  const { getWarehouseByUserId, getWarehouses } = AxiosWarehouse();
  const { t } = useTranslation();

  useEffect(() => {
    fetchingDataWarehouses();
  }, []);

  const fetchingDataWarehouses = async () => {
    try {
      setLoading(true);
      const res = await getWarehouses(
        search,
        sortCriteria,
        descending,
        pageIndex,
        pageSize
      );
      console.log(res);
      if (res?.status == 200) {
        setWareHouses(res);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // Filter state
  const [filters, setFilters] = useState({
    location: "",
    sizeRange: [0, 5000],
    status: "INSTOCK",
  });

  // Update filters
  const updateFilter = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  // Handle filter submission
  const handleFilterSubmit = () => {
    // applyFilters(filters); // This function should filter the warehouses based on the filters
  };

  // Toggle filter visibility
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  return (
    <div>
      <div className="text-left">
        {/* Responsive grid for the inventory cards */}
        <div>
          <p className="text-3xl font-bold">{t("Warehouses")}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p>{t("Filters")}</p>
            <div
              className={`flex items-center border border-gray-300 rounded-2xl  focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black ${
                sortCriteria === "Location"
                  ? "text-black ring-[var(--Xanh-Base)] ring-2"
                  : "text-[var(--en-vu-300)]"
              }`}
            >
              <label className="text-xl  pr-0  rounded-s-lg ">
                <LockKeyOpen weight="fill" />
              </label>
              <select
                className=" w-full rounded-lg outline-none"
                type="password"
                // onChange={handleInput}
                name="password"
                placeholder="Password"
                value={sortCriteria || ""}
              >
                <option>Location</option>
              </select>
            </div>
          </div>
          <div></div>
        </div>
        {warehouse === "" ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {warehouses &&
                warehouses?.data?.items.map((warehouse) => (
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