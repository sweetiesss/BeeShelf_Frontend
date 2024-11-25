import { useEffect, useRef, useState } from "react";
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
import Mapping from "../../component/shared/Mapping";
import AxiosInventory from "../../services/Inventory";

export default function InventoryPage() {
  const [warehouses, setWareHouses] = useState();
  const [warehousesOwned, setWareHousesOwned] = useState();
  const [warehousesShowList, setWareHouseShowList] = useState();
  const [warehouse, setWareHouse] = useState();

  const [inventories, setInventories] = useState();
  const [inventoriesOwned, setInventoriesOwned] = useState();
  const [inventoriesShowList, setInventoriesShowList] = useState();
  const [inventory, setInventory] = useState();

  const [checkBuyInventory, setCheckBuyInventory] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const [refetchingInventory, setRefetchingInventory] = useState(false);
  const [setFiltersVisible, filtersVisible] = useState(true);

  const [search, setSearch] = useState(null);
  const [sortCriteria, setSortCriteria] = useState(null);
  const [descending, setDescending] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { userInfor } = useAuth();
  const { getWarehouseByUserId, getWarehouses } = AxiosWarehouse();
  const {getInventory1000ByWarehouseId, getInventory1000ByUserIdAndWareHouseId, buyInventory } =
    AxiosInventory();
  const { t } = useTranslation();

  useEffect(() => {
    fetchingDataWarehouses();
    fetchingDataWarehousesByUserId();
  }, []);

  useEffect(() => {
    getWareHouseList();
  }, [warehousesOwned]);

  useEffect(() => {
    const fetching = async () => {
      if (warehouse) {
        await fetchingDataInventories();
        await fetchingDataInventoriesByUserId();
      }
    };
    fetching();
  }, [warehouse, refetchingInventory]);

  useEffect(() => {
    getInventoriesList();
  }, [inventoriesOwned]);

  const fetchingDataWarehouses = async () => {
    try {
      setLoading(true);
      const res = await getWarehouses(
        search,
        sortCriteria,
        descending,
        pageIndex,
        1000
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
  const fetchingDataWarehousesByUserId = async () => {
    try {
      setLoading(true);
      const res = await getWarehouseByUserId(userInfor?.id);
      console.log("owned", res);
      if (res?.status == 200) {
        setWareHousesOwned(res);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const getWareHouseList = () => {
    const warehousesOwnedList = warehousesOwned?.data || [];
    const result =
      warehouses?.data?.items?.filter(
        (warehouse) =>
          !warehousesOwnedList.some((owned) => owned.id === warehouse.id)
      ) || [];

    const combinedList = [...warehousesOwnedList, ...result];
    console.log(combinedList);

    setWareHouseShowList(combinedList);
  };

  const fetchingDataInventories = async () => {
    try {
      setLoading(true);
      console.log(warehouse);
      const res = await getInventory1000ByWarehouseId(warehouse?.id);
      console.log("Inv", res);
      if (res?.status == 200) {
        setInventories(res);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const fetchingDataInventoriesByUserId = async () => {
    try {
      setLoading(true);
      const res = await getInventory1000ByUserIdAndWareHouseId(userInfor?.id, warehouse?.id);
      console.log("ownedInv", res);
      if (res?.status == 200) {
        setInventoriesOwned(res);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const getInventoriesList = () => {
    const inventoriesOwnedList = inventoriesOwned?.data?.items || [];
    const result =
      inventories?.data?.items?.filter(
        (inventory) =>
          !inventoriesOwnedList.some((owned) => owned.id === inventory.id) &&
          (inventory.ocopPartnerId === userInfor.id ||
            inventory.ocopPartnerId === null)
      ) || [];

    const combinedList = [...inventoriesOwnedList, ...result];
    console.log(combinedList);

    setInventoriesShowList(combinedList);
  };

  const handleBuyClick = (inventory) => {
    setCheckBuyInventory(true);
    setInventory(inventory);
  };
  const handleConfirmBuyInventory = async () => {
    try {
      setLoading(true);
      const result = await buyInventory(inventory.id, userInfor.id);
      console.log("buy Inv", result);
      if (result?.status == 200) {
        handleCancelBuyInventory();
        setRefetchingInventory((prev) => !prev);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const handleCancelBuyInventory = () => {
    setCheckBuyInventory(false);
    setInventory();
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
          <p className="text-2xl font-medium">
            <span
              className={`${
                warehouse
                  ? "text-[var(--en-vu-500-disable)]   cursor-pointer"
                  : "text-[var(--en-vu)]"
              }`}
              onClick={() => warehouse && setWareHouse()}
            >
              {warehouse ? warehouse.name : t("Warehouses")}
            </span>
            <span
              className={`${
                !warehouse ? "text-[var(--en-vu)]" : "text-[var(--en-vu)]"
              }`}
            >
              {!warehouse ? "" : " > " + t("Inventories")}
            </span>
          </p>
        </div>
        {/* <div className="flex items-center justify-between">
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
        </div> */}
        {!warehouse ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {warehousesShowList &&
                warehousesShowList?.map((warehouse) => (
                  <WarehouseCard
                    warehouse={warehouse}
                    setWareHouse={setWareHouse}
                  />
                ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
            {inventoriesShowList?.map((inventenry) => (
              <InventoryCard
                inventory={inventenry}
                handleBuyClick={handleBuyClick}
              />
            ))}
          </div>
        )}
        {checkBuyInventory && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50"></div>
            <div
              className="absolute bg-white border border-gray-300 shadow-md rounded-lg p-4 w-fit h-fit"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <p>{`Are you sure you want to buy ${inventory.name}?`}</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => handleCancelBuyInventory()}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBuyInventory}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md"
                >
                  Confirm
                </button>
              </div>
            </div>
          </>
        )}

        {/* <Mapping showLocation="Hồ Chí Minh"></Mapping> */}
      </div>
    </div>
  );
}
