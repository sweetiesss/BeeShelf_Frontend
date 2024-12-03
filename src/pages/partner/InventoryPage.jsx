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
  ArrowCounterClockwise,
  CaretLeft,
  CaretRight,
  LockKeyOpen,
  MagnifyingGlass,
  XCircle,
} from "@phosphor-icons/react";
import InventoryProduct from "../../component/partner/inventory/InventoryProduct";
import AxiosWarehouse from "../../services/Warehouse";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import Mapping from "../../component/shared/Mapping";
import AxiosInventory from "../../services/Inventory";
import AxiosPartner from "../../services/Partner";
import { useDetail } from "../../context/DetailContext";
import AxiosProduct from "../../services/Product";
import AxiosOthers from "../../services/Others";
import { WarehouseListSkeleton } from "../shared/SkeletonLoader";
import { addMonths, format } from "date-fns";

export default function InventoryPage() {
  const [warehouses, setWareHouses] = useState();
  const [warehousesOwned, setWareHousesOwned] = useState();
  const [warehousesShowList, setWareHouseShowList] = useState();
  const [warehousesBased, setWareHouseBased] = useState();
  const [warehouse, setWareHouse] = useState();

  const [inventories, setInventories] = useState();
  const [inventoriesOwned, setInventoriesOwned] = useState();
  const [inventoriesShowList, setInventoriesShowList] = useState();
  const [inventory, setInventory] = useState();

  const [allProductsInWarehouse, setAllProductsInWarehouse] = useState();

  const [checkBuyInventory, setCheckBuyInventory] = useState(false);

  const [loading, setLoading] = useState(false);

  const [refetchingInventory, setRefetchingInventory] = useState(false);

  const [sortCriteria, setSortCriteria] = useState(null);

  const { userInfor, setRefrestAuthWallet } = useAuth();
  const { getWarehouseByUserId, getWarehouses } = AxiosWarehouse();
  const { getAllProduct } = AxiosPartner();
  const { getProductByUserId } = AxiosProduct();
  const { updateDataDetail, updateTypeDetail, refresh, setRefresh } =
    useDetail();
  const { getProvinces } = AxiosOthers();

  const [provinceList, setProvinencesList] = useState([]);
  const [provinceAvailableList, setProvinencesAvailableList] = useState([]);

  const [monthBuyInvrentory, setMonthToBuyInventory] = useState(1);

  const [warehouseOnId, setWareHouseOnId] = useState(0);

  const [filters, setFilters] = useState({
    name: "",
    provinceId: 0,
    isCold: -1,
    capacityFrom: 1,
    status: -1,
    capacityTo: 9999999999,
  });

  const defaultFilter = {
    name: "",
    provinceId: 0,
    isCold: -1,
    capacityFrom: 1,
    status: -1,
    capacityTo: 9999999999,
  };

  const {
    getInventory1000ByWarehouseId,
    getInventory1000ByUserIdAndWareHouseId,
    buyInventory,
  } = AxiosInventory();
  const { t } = useTranslation();

  useEffect(() => {
    fetchingDataWarehouses();
    fetchingDataWarehousesByUserId();
    getProvincesAPI();
  }, []);

  useEffect(() => {
    getWareHouseList();
  }, [warehousesOwned, warehouses]);

  useEffect(() => {
    getBackWarehouseOn();
  }, [warehousesBased]);

  const getBackWarehouseOn = () => {
    if (warehousesBased) {
      if (warehouseOnId > 0) {
        const warehouse = warehousesBased.find(
          (item) => parseInt(item.id) === parseInt(warehouseOnId)
        );
        setWareHouse(warehouse);
        setWareHouseOnId(0);
      }
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  useEffect(() => {
    const fetching = async () => {
      if (warehouse) {
        fetchingDataInventories();
        fetchingDataInventoriesByUserId();
        fetchingDataProductByUserIdAndWareHouseId();
      }
    };
    fetching();
  }, [warehouse, refetchingInventory]);

  useEffect(() => {
    const fetching = async () => {
      if (refresh > -1) {
        if (warehouse) {
          fetchingDataInventories();
          fetchingDataInventoriesByUserId();
          fetchingDataProductByUserIdAndWareHouseId();
        }
      }
    };
    fetching();
  }, [refresh]);

  useEffect(() => {
    const fetching = () => {
      getInventoriesList();
      if (refresh >= -1) {
        getDetailInventory();
      }
    };
    fetching();
  }, [inventoriesOwned, inventories]);

  const getProvincesAPI = async () => {
    try {
      const result = await getProvinces();
      console.log("provinces", result);
      setProvinencesList(result?.data);
    } catch (e) {
      console.log(e);
    }
  };

  const applyFilters = () => {
    console.log("???", warehousesBased);
    console.log("?????", filters);

    if (warehousesBased) {
      let filtered = [...warehousesBased];

      if (filters.name) {
        filtered = filtered.filter((warehouse) => {
          return warehouse.name
            .toLowerCase()
            .includes(filters.name.toLowerCase());
        });
      }

      if (filters.provinceId > 0) {
        console.log("here");

        filtered = filtered.filter(
          (warehouse) => warehouse.provinceId === parseInt(filters.provinceId)
        );
      }

      if (filters.isCold > -1) {
        console.log("here");

        filtered = filtered.filter(
          (warehouse) =>
            (filters.isCold == 1 && warehouse.isCold == 1) ||
            (filters.isCold == 0 && warehouse.isCold == 0)
        );
      }
      if (filters.status > -1) {
        console.log("here");

        filtered = filtered.filter(
          (warehouse) =>
            (filters.status == 1 && warehouse.owned) ||
            (filters.status == 0 && !warehouse?.owned)
        );
      }

      if (filters.capacityFrom || filters.capacityTo) {
        filtered = filtered.filter(
          (warehouse) =>
            warehouse.capacity >= filters.capacityFrom &&
            warehouse.capacity <= filters.capacityTo
        );
      }
      console.log("filterResult", filtered);

      setWareHouseShowList(filtered);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "capacityFrom" || name === "capacityTo") {
      if (value < 0 || value === "" || !value) {
        setFilters((prev) => ({ ...prev, [name]: 1 }));
      } else {
        setFilters((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
      }
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchingDataWarehouses = async () => {
    try {
      setLoading(true);
      const res = await getWarehouses(null, null, null, null, 1000);
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
    console.log("owned", warehousesOwned);

    const warehousesOwnedList = warehousesOwned?.data || [];
    const result =
      warehouses?.data?.items?.filter(
        (warehouse) =>
          !warehousesOwnedList.some((owned) => owned.id === warehouse.id)
      ) || [];

    const filteredWarehousesOwned =
      warehouses?.data?.items
        ?.filter((warehouse) =>
          warehousesOwnedList.some((owned) => owned.id === warehouse.id)
        )
        ?.map((ware) => ({ ...ware, owned: true })) || [];

    const filterProvinces = provinceList.map((province) => ({
      ...province,
      haveWarehouse: warehouses?.data?.items.some(
        (data) => parseInt(data.provinceId) === parseInt(province.id) // Match provinceId with province.id
      ),
    }));

    const combinedProvincesList = [...filterProvinces];

    console.log(combinedProvincesList); // Debug log to verify the output

    const combinedList = [...filteredWarehousesOwned, ...result];

    setProvinencesAvailableList(combinedProvincesList);
    setWareHouseBased(combinedList);
    setWareHouseShowList(combinedList);
  };

  const fetchingDataInventories = async () => {
    try {
      setLoading(true);
      const res = await getInventory1000ByWarehouseId(warehouse?.id);
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
      const res = await getInventory1000ByUserIdAndWareHouseId(
        userInfor?.id,
        warehouse?.id
      );
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
    console.log("inventory list", combinedList);

    setInventoriesShowList(combinedList);
  };
  const fetchingDataProductByUserIdAndWareHouseId = async () => {
    try {
      setLoading(true);
      const res = await getAllProduct(userInfor?.id, warehouse?.id);
      console.log("owned", res);
      if (res?.status == 200) {
        setAllProductsInWarehouse(res);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = (inventory) => {
    setCheckBuyInventory(true);
    setInventory(inventory);
  };
  const handleConfirmBuyInventory = async () => {
    try {
      const result = await buyInventory(
        inventory.id,
        userInfor.id,
        monthBuyInvrentory
      );
      if (result?.status == 200) {
        handleCancelBuyInventory();
        setRefetchingInventory((prev) => !prev);
        setLoading(true);
        getBackWareHouseIsInding();
        setWareHouseOnId(warehouse?.id);
        setRefrestAuthWallet((prev) => !prev);
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
    setMonthToBuyInventory(0);
  };

  const handleShowProductDetail = async (e, productName) => {
    try {
      e.stopPropagation();
      const productResult = await getProductByUserId(
        userInfor?.id,
        0,
        1,
        productName
      );
      console.log(productResult);
      if (productResult?.status === 200) {
        updateDataDetail(productResult?.data?.items[0]);
        updateTypeDetail("product");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleShowInventoryDetail = async (e, inventory) => {
    try {
      e.stopPropagation();
      // const result = await getInventoryById(inventoryId);
      // console.log(result);
      // if (result?.status === 200) {
      //   updateDataDetail(result?.data);
      //   updateTypeDetail("inventory");
      // }
      updateDataDetail(inventory);
      updateTypeDetail("inventory");
    } catch (e) {
      console.log(e);
    }
  };
  const getDetailInventory = () => {
    console.log("ownedInventory", inventoriesOwned);
    console.log("refresh", refresh);

    if (refresh > -1) {
      const result = inventoriesOwned?.data?.items.find(
        (item) => item.id === parseInt(refresh)
      );
      console.log("result refreshing", result);

      if (result) {
        updateDataDetail(result);
        updateTypeDetail("inventory");
      }
    }
    setRefresh(-1);
  };
  const clearDataInventoryOfWarehosue = () => {
    setWareHouse();
    setInventories();
    setInventoriesOwned();
    setInventoriesShowList();
  };
  const getBackWareHouseIsInding = async () => {
    await fetchingDataWarehouses();
    await fetchingDataWarehousesByUserId();
  };

  return (
    <div>
      <div className="text-left">
        {/* Responsive grid for the inventory cards */}
        <div>
          <p className="text-3xl font-bold">
            <span
              className={`${
                warehouse
                  ? "text-[var(--en-vu-500-disable)]   cursor-pointer"
                  : "text-[var(--en-vu)]"
              }`}
              onClick={() => warehouse && clearDataInventoryOfWarehosue()}
            >
              {warehouse ? warehouse.name : t("Warehouses")}
            </span>
            <span
              className={`${
                !warehouse ? "text-[var(--en-vu)]" : "text-[var(--en-vu)]"
              }`}
            >
              {!warehouse ? "" : " > " + t("DetailInformation")}
            </span>
          </p>
        </div>
        <div className="my-10 ">
          <p className="text-2xl font-semibold">{t("Filters")}</p>
          {!warehouse ? (
            <div className="flex items-center gap-10 mt-6">
              <div className="flex items-center">
                <p className="text-lg font-medium mr-4">{t("Name")}</p>
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl overflow-hidden w-[12rem] px-4 py-1  focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black ${
                    filters.name !== ""
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  }`}
                >
                  <label className="text-xl pr-0 mr-2  rounded-s-lg ">
                    <LockKeyOpen weight="fill" />
                  </label>
                  <input
                    className=" w-[8rem] rounded-lg outline-none "
                    name="name"
                    onChange={handleFilterChange}
                    value={filters.name}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-lg font-medium mr-4">{t("Province")}</p>
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl px-4 py-1 overflow-hidden w-fit  focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black ${
                    sortCriteria === "Location"
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  }`}
                >
                  <label className="text-xl pr-0  rounded-s-lg ">
                    <LockKeyOpen weight="fill" />
                  </label>
                  <select
                    className=" w-[7rem] rounded-lg outline-none "
                    name="provinceId"
                    value={filters?.provinceId}
                    onChange={handleFilterChange}
                    disabled={loading}
                  >
                    <option value={0}>All</option>
                    {provinceAvailableList.map(
                      (item) =>
                        item?.haveWarehouse && (
                          <option value={item.id}>
                            {item?.subDivisionName}
                          </option>
                        )
                    )}
                  </select>
                </div>
              </div>
              <div className="flex items-center w-fit">
                <p className="text-lg font-medium mr-4">{t("Is Cold")}</p>
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl px-4 py-1 overflow-hidden w-fit  focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black ${
                    filters.isCold > -1
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  }`}
                >
                  <select
                    className="w-[7rem] outline-none"
                    type="checkbox"
                    name="isCold"
                    value={filters.isCold}
                    onChange={handleFilterChange}
                    disabled={loading}
                  >
                    <option value={-1}>All</option>
                    <option value={0}>Normal Warehouse</option>
                    <option value={1}>Cold Warehouse</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-lg font-medium mr-4">{t("Status")}</p>
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl overflow-hidden w-fit  px-4 py-1  focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black ${
                    filters.status > -1
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  }`}
                >
                  <label className="text-xl  pr-0  rounded-s-lg ">
                    <LockKeyOpen weight="fill" />
                  </label>
                  <select
                    className=" rounded-lg outline-none w-[7rem]"
                    onChange={handleFilterChange}
                    name="status"
                    value={filters?.status}
                    disabled={loading}
                  >
                    <option value={-1}>All</option>
                    <option value={0}>Not Bought</option>
                    <option value={1}>Bought</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-lg font-medium mr-4">{t("Capacity")}:</p>
                <div className={`flex items-center`}>
                  <label className="text-xl  pr-0  rounded-s-lg mr-2 ">
                    from:
                  </label>
                  <input
                    className=" w-[7rem]  border-b-2 outline-none focus-within:rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black "
                    type="number"
                    name="capacityFrom"
                    min={1}
                    onChange={handleFilterChange}
                    value={parseInt(filters?.capacityFrom, 10)}
                    disabled={loading}
                  ></input>
                  <label className="text-xl  pr-0  rounded-s-lg mr-2 ">
                    - to:
                  </label>
                  <input
                    className=" w-[7rem]  border-b-2 outline-none focus-within:rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black "
                    type="number"
                    min={10000}
                    name="capacityTo"
                    onChange={handleFilterChange}
                    value={parseInt(filters?.capacityTo, 10)}
                    disabled={loading}
                  ></input>
                </div>
              </div>
              <div
                className="text-xl bg-gray-100 p-1 rounded-full border-2 border-gray-400 hover:bg-gray-200 hover:border-gray-500 cursor-pointer"
                onClick={() => setFilters(defaultFilter)}
              >
                <ArrowCounterClockwise />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-10 mt-6">
              <div className="flex items-center">
                <p className="text-lg font-medium mr-4">{t("Status")}</p>
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl overflow-hidden w-[10rem]  px-4 py-1  focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black ${
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
                    <option></option>
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-lg font-medium mr-4">{t("Max Weight")}:</p>
                <div className={`flex items-center`}>
                  <label className="text-xl  pr-0  rounded-s-lg mr-2 ">
                    from:
                  </label>
                  <input
                    className=" w-[7rem]  border-b-2 outline-none focus-within:rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black "
                    type="number"
                  ></input>
                  <label className="text-xl  pr-0  rounded-s-lg mr-2 ">
                    - to:
                  </label>
                  <input
                    className=" w-[7rem]  border-b-2 outline-none focus-within:rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black "
                    type="number"
                    min={10000}
                    value={10000}
                  ></input>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-lg font-medium mr-4">{t("Weight")}:</p>
                <div className={`flex items-center`}>
                  <label className="text-xl  pr-0  rounded-s-lg mr-2 ">
                    from:
                  </label>
                  <input
                    className=" w-[7rem]  border-b-2 outline-none focus-within:rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black "
                    type="number"
                  ></input>
                  <label className="text-xl  pr-0  rounded-s-lg mr-2 ">
                    - to:
                  </label>
                  <input
                    className=" w-[7rem]  border-b-2 outline-none focus-within:rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black "
                    type="number"
                    min={10000}
                    value={10000}
                  ></input>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-lg font-medium mr-4">{t("Price")}:</p>
                <div className={`flex items-center`}>
                  <label className="text-xl  pr-0  rounded-s-lg mr-2 ">
                    from:
                  </label>
                  <input
                    className=" w-[7rem]  border-b-2 outline-none focus-within:rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black "
                    type="number"
                  ></input>
                  <label className="text-xl  pr-0  rounded-s-lg mr-2 ">
                    - to:
                  </label>
                  <input
                    className=" w-[7rem]  border-b-2 outline-none focus-within:rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black "
                    type="number"
                    min={10000}
                  ></input>
                </div>
              </div>
            </div>
          )}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[37rem] items-start">
            {Array(100)
              .fill(0)
              .map((_, index) => (
                <WarehouseListSkeleton key={index} />
              ))}
          </div>
        ) : !warehouse ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[37rem] items-start">
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
          <div className="h-[65vh] grid grid-cols-4 grid-rows-12 mt-10 gap-y-4 gap-x-10">
            <p className="text-2xl font-semibold row-span-1">
              {t("ProductsInWarehouse")}
            </p>
            <p className="text-2xl font-semibold col-span-3 row-span-1">
              {t("InventoriesInWareHouse")}
            </p>
            <div className="flex flex-col row-span-11">
              <div className="w-full h-fit max-h-1/3">
                {[
                  { label: "Name:", value: warehouse?.name },
                  { label: "Location:", value: warehouse?.location },
                  {
                    label: "Invetories:",
                    value:
                      warehouse?.isCold === 0
                        ? "Only normal inventories"
                        : "Only cold inventories",
                  },
                  {
                    label: "Capacity:",
                    value: `${Math.max(
                      warehouse?.capacity - warehouse?.availableCapacity
                    )}/${warehouse?.capacity || "N/A"}`,
                  },
                ].map((item) => (
                  <div className="grid-cols-4 grid gap-4 mb-4">
                    <p className="col-span-1 font-medium  text-gray-500">
                      {item.label}
                    </p>
                    <p className="col-span-3">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className=" w-full h-1/2 flex items-center justify-start z-[10] ">
                <Mapping showLocation={warehouse?.location} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 col-span-3 overflow-auto row-span-11  items-start ">
              {inventoriesShowList?.map((inventenry) => (
                <InventoryCard
                  inventory={inventenry}
                  handleBuyClick={handleBuyClick}
                  handleShowInventoryDetail={handleShowInventoryDetail}
                />
              ))}
            </div>
          </div>
        )}

        {checkBuyInventory && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[20]"></div>
            <div
              className="absolute bg-white border border-gray-300 shadow-md rounded-lg px-4 py-8 w-[35rem] h-fit z-[30]"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className="absolute top-2 right-2 text-white text-3xl hover:scale-105 cursor-pointer"
                onClick={handleCancelBuyInventory}
              >
                <XCircle fill="#ef4444" weight="fill" />
              </div>
              <p className="text-2xl">{`Buying inventory: ${inventory.name}?`}</p>
              <div className="flex items-center justify-between my-7">
                <div
                  className={`flex items-center overflow-auto py-2 px-4 w-fit border border-gray-300 rounded-2xl  mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black ${
                    monthBuyInvrentory > 0
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  }`}
                >
                  <input
                    type="number"
                    className="outline-none w-[5rem]"
                    value={monthBuyInvrentory}
                    onChange={(e) => setMonthToBuyInventory(e.target.value)}
                  ></input>

                  <p>Months</p>
                </div>
                <button
                  className="bg-gray-300 px-3 py-2 h-fit rounded-lg hover:bg-gray-400"
                  onClick={() => setMonthToBuyInventory(6)}
                >
                  6 Months
                </button>
                <button
                  className="bg-gray-300 px-3 py-2 h-fit rounded-lg hover:bg-gray-400"
                  onClick={() => setMonthToBuyInventory(12)}
                >
                  1 Year
                </button>
                <button
                  className="bg-gray-300 px-3 py-2 h-fit rounded-lg hover:bg-gray-400"
                  onClick={() => setMonthToBuyInventory(24)}
                >
                  2 Years
                </button>
              </div>

              <div className="mb-7 grid-cols-8 grid gap-4">
                <div className="col-span-2 text-gray-500">Weight</div>
                <div className="col-span-2 text-gray-500">Price</div>
                <div className="col-span-2 text-gray-500 text-center">
                  Amount
                </div>

                <div className="col-span-2 text-gray-500">Total</div>
                <div className="col-span-2">{inventory?.maxWeight}kg</div>
                <div className="col-span-2">{inventory?.price + "VND"}</div>
                <div className="col-span-2 text-center">
                  {monthBuyInvrentory} Month
                </div>

                <div className="col-span-2">
                  {/* {parseInt(cal( inventory?.price*monthBuyInvrentory)) + "VND"} */}
                  {`${Math.round(
                    parseFloat(inventory?.price) *
                      parseFloat(monthBuyInvrentory)
                  )} VND`}
                </div>
                <div className="col-span-8 flex gap-x-4">
                  <div className="">Expect expiration date:</div>
                  <p>
                    {format(
                      addMonths(new Date(), parseInt(monthBuyInvrentory || 0)),
                      "dd/MM/yyyy"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => handleCancelBuyInventory()}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-red-500 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBuyInventory}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
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
