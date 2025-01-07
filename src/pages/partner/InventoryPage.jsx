import { useEffect, useMemo, useRef, useState } from "react";
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
import SpinnerLoading from "../../component/shared/Loading";
import { useLocation } from "react-router-dom";
import RoomMapping from "./RoomMapping";

export default function InventoryPage() {
  const location = useLocation();
  const [warehouses, setWareHouses] = useState();
  const [warehousesOwned, setWareHousesOwned] = useState();
  const [warehousesShowList, setWareHouseShowList] = useState();
  const [warehousesBased, setWareHouseBased] = useState();
  const [warehouse, setWareHouse] = useState();

  const [inventories, setInventories] = useState();
  const [inventoriesOwned, setInventoriesOwned] = useState();
  const [inventoriesShowList, setInventoriesShowList] = useState();
  const [inventoriesBased, setInventoriesBased] = useState();
  const [inventory, setInventory] = useState();

  const [checkBuyInventory, setCheckBuyInventory] = useState(false);

  const [loading, setLoading] = useState(false);

  const [refetchingInventory, setRefetchingInventory] = useState(false);

  const [sortCriteria, setSortCriteria] = useState(null);

  const { userInfor, setRefrestAuthWallet, authWallet } = useAuth();
  const { getWarehouseByUserId, getWarehouses } = AxiosWarehouse();
  const { updateDataDetail, updateTypeDetail, refresh, setRefresh } =
    useDetail();
  const { getProvinces } = AxiosOthers();

  const [provinceList, setProvinencesList] = useState([]);
  const [provinceAvailableList, setProvinencesAvailableList] = useState([]);

  const [monthBuyInvrentory, setMonthToBuyInventory] = useState(1);

  const [warehouseOnId, setWareHouseOnId] = useState(0);
  const [errors, setErrors] = useState();

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
  const [inventoryFilters, setInventoryFilters] = useState({
    status: -1,
    weightFrom: 0,
    weightTo: 9999999999,
    maxWeightFrom: 0,
    maxWeightTo: 9999999999,
    priceFrom: 0,
    priceTo: 9999999999,
  });

  const defaultInventoryFilter = {
    status: -1,
    weightFrom: 0,
    weightTo: 9999999999,
    maxWeightFrom: 0,
    maxWeightTo: 9999999999,
    priceFrom: 0,
    priceTo: 9999999999,
  };
  useEffect(() => {
    const getBackFromLot = () => {
      const thisLocation = location?.state;
      if (thisLocation?.warehouseId && warehousesShowList) {
        const result = warehousesShowList?.find(
          (item) => item?.id === thisLocation?.warehouseId
        );
        if (result) {
          setWareHouse(result);
        }
      }
    };
    getBackFromLot();
  }, [location, warehousesShowList]);

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
    applyInventoryFilters();
  }, [inventoryFilters]);

  useEffect(() => {
    const fetching = async () => {
      if (warehouse) {
        fetchingDataInventories();
        fetchingDataInventoriesByUserId();
      }
    };
    fetching();
  }, [warehouse, refetchingInventory]);

  useEffect(() => {
    const fetching = async () => {
      if (refresh > -1) {
        if (warehouse) {
          setRefetchingInventory((prev) => !prev);
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
        setRefresh(-1);
      }
    };
    fetching();
  }, [inventoriesOwned, inventories]);

  const getProvincesAPI = async () => {
    try {
      const result = await getProvinces();

      setProvinencesList(result?.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSetMonthToBuy = (price, data) => {
    console.log("data", data);

    const dataPrice = Math.round(parseFloat(price) * parseFloat(data));
    setErrors("");
    if (data < 0 || data === null || data === undefined || data === "") {
      console.log("here");

      setErrors("YouNeedAtLeast1MonthToBuyInventory");
      setMonthToBuyInventory("");
      return;
    }
    setMonthToBuyInventory(Math.floor(data));
    console.log(dataPrice > authWallet?.totalAmount);

    if (dataPrice > authWallet?.totalAmount) {
      setErrors("NotEnoughtMoneyToDoThis");
      return;
    }
  };

  const applyFilters = () => {
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
        filtered = filtered.filter(
          (warehouse) => warehouse.provinceId === parseInt(filters.provinceId)
        );
      }

      if (filters.isCold > -1) {
        filtered = filtered.filter(
          (warehouse) =>
            (filters.isCold == 1 && warehouse.isCold == 1) ||
            (filters.isCold == 0 && warehouse.isCold == 0)
        );
      }
      if (filters.status > -1) {
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
      setWareHouseShowList(filtered);
    }
  };
  const applyInventoryFilters = () => {
    if (inventoriesBased) {
      let filtered = [...inventoriesBased];

      if (parseInt(inventoryFilters.status) > -1) {
        filtered = filtered.filter(
          (warehouse) =>
            (parseInt(inventoryFilters.status) == 1 &&
              warehouse.ocopPartnerId) ||
            (parseInt(inventoryFilters.status) == 0 &&
              !warehouse?.ocopPartnerId)
        );
      }

      if (
        parseInt(inventoryFilters.status) != 0 &&
        (inventoryFilters.weightFrom || inventoryFilters.weightTo)
      ) {
        filtered = filtered.filter(
          (warehouse) =>
            warehouse.weight >= inventoryFilters.weightFrom &&
            warehouse.weight <= inventoryFilters.weightTo
        );
      }
      if (inventoryFilters.maxWeightFrom || inventoryFilters.maxWeightTo) {
        filtered = filtered.filter(
          (warehouse) =>
            warehouse.maxWeight >= inventoryFilters.maxWeightFrom &&
            warehouse.maxWeight <= inventoryFilters.maxWeightTo
        );
      }
      if (inventoryFilters.priceFrom || inventoryFilters.priceTo) {
        filtered = filtered.filter(
          (warehouse) =>
            warehouse.price >= inventoryFilters.priceFrom &&
            warehouse.price <= inventoryFilters.priceTo
        );
      }
      setInventoriesShowList(filtered);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "capacityFrom") {
      if (value < 0 || value === "" || !value) {
        setFilters((prev) => ({ ...prev, [name]: 1 }));
      } else if (value > 9999999999) {
        setFilters((prev) => ({ ...prev, [name]: 9999999999 }));
      } else {
        setFilters((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
      }
    }
    if (name === "capacityTo") {
      if (value < 0 || value === "" || !value || value < 1000) {
        setInventoryFilters((prev) => ({ ...prev, [name]: 1000 }));
      } else if (value > 9999999999) {
        setFilters((prev) => ({ ...prev, [name]: 9999999999 }));
      } else {
        setInventoryFilters((prev) => ({
          ...prev,
          [name]: parseInt(value, 10),
        }));
      }
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleInventoryFilterChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "weightFrom" ||
      name === "maxWeightFrom" ||
      name === "priceFrom"
    ) {
      if (value < 0 || value === "" || !value) {
        setInventoryFilters((prev) => ({ ...prev, [name]: 0 }));
      } else if (value > 9999999999) {
        setFilters((prev) => ({ ...prev, [name]: 9999999999 }));
      } else {
        setInventoryFilters((prev) => ({
          ...prev,
          [name]: parseInt(value, 10),
        }));
      }
    }
    if (name === "weightTo" || name === "maxWeightTo" || name === "priceTo") {
      if (value < 0 || value === "" || !value || value < 1000) {
        setInventoryFilters((prev) => ({ ...prev, [name]: 1000 }));
      } else if (value > 9999999999) {
        setFilters((prev) => ({ ...prev, [name]: 9999999999 }));
      } else {
        setInventoryFilters((prev) => ({
          ...prev,
          [name]: parseInt(value, 10),
        }));
      }
    } else {
      setInventoryFilters((prev) => ({ ...prev, [name]: value }));
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
    const combinedList = [...filteredWarehousesOwned, ...result];

    setProvinencesAvailableList(combinedProvincesList);
    setWareHouseBased(combinedList);
    setWareHouseShowList(combinedList);
  };

  const mappingProps = useMemo(() => {
    return {
      showLocation: {
        name: "Your Location",
        location: warehouse?.location + ", " + warehouse?.provinceName,
      },
      setLatLng: () => {},
    };
  }, [warehouse?.location + ", " + warehouse?.provinceName]);

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
    console.log("inventoriesOwnedList", inventoriesOwnedList);
    console.log("inventories", inventories);

    const result =
      inventories?.data?.items?.map(
        (inventory) => {
          if (inventory.ocopPartnerId === null) {
            return inventory; // Retain null values
          }
          if (inventory.ocopPartnerId !== userInfor?.id)
            return { ...inventory, ocopPartnerId: -1 };
          return inventory;
        }
        // &&
        //   (inventory.ocopPartnerId === userInfor.id ||
        //     inventory.ocopPartnerId === null)
      ) || [];
    console.log("result",result);

    const combinedList = [...inventoriesOwnedList, ...result];
    setInventoriesBased(combinedList);
    setInventoriesShowList(combinedList);
  };

  const handleBuyClick = (inventory) => {
    setCheckBuyInventory(true);
    setInventory(inventory);
  };
  const handleConfirmBuyInventory = async () => {
    try {
      setLoading(true);

      if (errors?.length > 0) {
        return;
      }
      const result = await buyInventory(
        inventory.id,
        userInfor.id,
        monthBuyInvrentory
      );
      if (result?.status == 200) {
        handleCancelBuyInventory();
        setRefetchingInventory((prev) => !prev);
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

  const handleOpenGoogleMaps = (location) => {
    const encodedLocation = encodeURIComponent(location);
    const googleMapsUrl = `https://www.google.com/maps?q=${encodedLocation}`;
    window.open(googleMapsUrl, "_blank"); // Opens in a new tab
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
    if (refresh > -1) {
      const result = inventoriesOwned?.data?.items.find(
        (item) => item.id === parseInt(refresh)
      );
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

  console.log("warehouse", warehouse);

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
              {t("Warehouses")}
            </span>
            <span
              className={`${
                !warehouse ? "text-[var(--en-vu)]" : "text-[var(--en-vu)]"
              }`}
            >
              {!warehouse ? "" : " > " + warehouse?.name}
            </span>
          </p>
        </div>
        <div className="my-10 ">
          {/* <p className="text-2xl font-semibold">{t("Filters")}</p> */}
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
                    <option value={0}>{t("All")}</option>
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
                <p className="text-lg font-medium mr-4">{t("Frozen")}</p>
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
                    <option value={-1}>{t("All")}</option>
                    <option value={0}>{t("NormalStore")}</option>
                    <option value={1}>{t("ColdStore")}</option>
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
                    <option value={-1}>{t("All")}</option>
                    <option value={0}>{t("NotHired")}</option>
                    <option value={1}>{t("Hired")}</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-lg font-medium mr-4">{t("Capacity")}:</p>
                <div
                  className={`flex items-center border border-gray-300  rounded-2xl px-4 py-1 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)] ${
                    parseInt(filters?.capacityFrom) > 1 ||
                    parseInt(filters?.capacityTo) < 9999999999
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  }`}
                >
                  <input
                    className=" w-[7rem] outline-none focus-within:rounded-lg focus-within:outline-none  focus-within:text-black "
                    type="number"
                    name="capacityFrom"
                    min={1}
                    onChange={handleFilterChange}
                    value={parseInt(filters?.capacityFrom, 10)}
                    disabled={loading}
                  ></input>
                  <label className="mx-2">-</label>
                  <input
                    className=" w-[7rem] outline-none focus-within:rounded-lg focus-within:outline-none  focus-within:text-black "
                    type="number"
                    min={10000}
                    name="capacityTo"
                    onChange={handleFilterChange}
                    value={parseInt(filters?.capacityTo, 10)}
                    disabled={loading}
                  ></input>
                  <label className="ml-2">kg</label>
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
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center">
                <p className="text-lg font-medium mr-4">{t("Status")}</p>
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl overflow-hidden w-[10rem]  px-4 py-1  focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black ${
                    parseInt(inventoryFilters.status) > -1
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  }`}
                >
                  <label className="text-xl  pr-0  rounded-s-lg ">
                    <LockKeyOpen weight="fill" />
                  </label>
                  <select
                    className="w-[5rem] outline-none"
                    name="status"
                    value={inventoryFilters.status}
                    onChange={handleInventoryFilterChange}
                    disabled={loading}
                  >
                    <option value={-1}>{t("All")}</option>
                    <option value={0}>{t("NotHired")}</option>
                    <option value={1}>{t("Hired")}</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-lg font-medium mr-4">{t("Weight")}:</p>
                <div
                  className={`flex items-center border border-gray-300  rounded-2xl px-4 py-1 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)] ${
                    parseInt(inventoryFilters?.weightFrom) > 0 ||
                    parseInt(inventoryFilters?.weightTo) < 9999999999
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  }`}
                >
                  <input
                    className=" w-[5rem] outline-none focus-within:rounded-lg focus-within:outline-none  focus-within:text-black "
                    type="number"
                    name="weightFrom"
                    min={1}
                    onChange={handleInventoryFilterChange}
                    value={parseInt(inventoryFilters?.weightFrom, 10)}
                    disabled={loading}
                  ></input>
                  <label className="mx-2">-</label>
                  <input
                    className=" w-[5rem] outline-none focus-within:rounded-lg focus-within:outline-none  focus-within:text-black "
                    type="number"
                    min={10000}
                    name="weightTo"
                    onChange={handleInventoryFilterChange}
                    value={parseInt(inventoryFilters?.weightTo, 10)}
                    disabled={loading}
                  ></input>
                  <label className="ml-2">kg</label>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-lg font-medium mr-4">{t("MaxWeight")}:</p>
                <div
                  className={`flex items-center border border-gray-300  rounded-2xl px-4 py-1 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)] ${
                    parseInt(inventoryFilters?.maxWeightFrom) > 0 ||
                    parseInt(inventoryFilters?.maxWeightTo) < 9999999999
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  }`}
                >
                  <input
                    className=" w-[5rem] outline-none focus-within:rounded-lg focus-within:outline-none  focus-within:text-black "
                    type="number"
                    name="maxWeightFrom"
                    min={0}
                    onChange={handleInventoryFilterChange}
                    value={parseInt(inventoryFilters?.maxWeightFrom, 10)}
                    disabled={loading}
                  ></input>
                  <label className="mx-2">-</label>
                  <input
                    className=" w-[5rem] outline-none focus-within:rounded-lg focus-within:outline-none  focus-within:text-black "
                    type="number"
                    min={10000}
                    name="maxWeightTo"
                    onChange={handleInventoryFilterChange}
                    value={parseInt(inventoryFilters?.maxWeightTo, 10)}
                    disabled={loading}
                  ></input>
                  <label className="ml-2">kg</label>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-lg font-medium mr-4">{t("Price")}:</p>
                <div
                  className={`flex items-center border border-gray-300  rounded-2xl px-4 py-1 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)] ${
                    parseInt(inventoryFilters?.priceFrom) > 0 ||
                    parseInt(inventoryFilters?.priceTo) < 9999999999
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  }`}
                >
                  <input
                    className=" w-[5rem] outline-none focus-within:rounded-lg focus-within:outline-none  focus-within:text-black "
                    type="number"
                    name="priceFrom"
                    min={1}
                    onChange={handleInventoryFilterChange}
                    value={parseInt(inventoryFilters?.priceFrom, 10)}
                    disabled={loading}
                  ></input>
                  <label className="mx-2">-</label>
                  <input
                    className=" w-[5rem] outline-none focus-within:rounded-lg focus-within:outline-none  focus-within:text-black "
                    type="number"
                    min={10000}
                    name="priceTo"
                    onChange={handleInventoryFilterChange}
                    value={parseInt(inventoryFilters?.priceTo, 10)}
                    disabled={loading}
                  ></input>
                  <label className="ml-2">vnd</label>
                </div>
              </div>
              <div
                className="text-xl bg-gray-100 p-1 rounded-full border-2 border-gray-400 hover:bg-gray-200 hover:border-gray-500 cursor-pointer"
                onClick={() => setInventoryFilters(defaultInventoryFilter)}
              >
                <ArrowCounterClockwise />
              </div>
            </div>
          )}
        </div>
        {loading ? (
          // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[37rem] items-start">
          //   {Array(100)
          //     .fill(0)
          //     .map((_, index) => (
          //       <WarehouseListSkeleton key={index} />
          //     ))}
          // </div>
          <SpinnerLoading />
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
          <div className=" grid grid-cols-5 grid-rows-12 mt-10 gap-y-4 gap-x-10 py-10">
            <p className="text-2xl font-semibold col-span-2 row-span-1">
              {t("WarehouseInformation")}
            </p>
            <p className="text-2xl font-semibold col-span-3 row-span-1">
              {t("InventoriesInTheWarehouse")}
            </p>
            <div className="flex flex-col col-span-2 row-span-11">
              <div className="w-full h-fit max-h-1/3">
                {[
                  { label: t("Name") + ":", value: warehouse?.name },
                  {
                    label: t("Location") + ":",
                    value: warehouse?.location,
                    onClick: () => handleOpenGoogleMaps(warehouse?.location),
                  },
                  {
                    label: t("Capacity") + ":",
                    value:
                      `${new Intl.NumberFormat().format(
                        Math.max(
                          warehouse?.capacity - warehouse?.availableCapacity
                        )
                      )}/${
                        new Intl.NumberFormat().format(warehouse?.capacity) ||
                        "N/A"
                      }` + " kg",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`grid-cols-4 grid gap-4 mb-4 ${
                      item.onClick ? "cursor-pointer hover:text-blue-600" : ""
                    }`}
                    onClick={item.onClick ? item.onClick : undefined}
                  >
                    <p className="col-span-1 font-medium text-gray-500">
                      {item.label}
                    </p>
                    <p className="col-span-3">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className=" w-full h-1/2 flex items-center justify-start z-[10] ">
                <Mapping {...mappingProps} />
              </div>
            </div>

            <div className=" col-span-3 row-span-11  ">
              <RoomMapping
                data={inventoriesShowList}
                storeInfor={warehouse}
                handleBuyClick={handleBuyClick}
                handleShowInventoryDetail={handleShowInventoryDetail}
              />
              {/* {inventoriesShowList?.map((inventenry) => (
                <InventoryCard
                  inventory={inventenry}
                  handleBuyClick={handleBuyClick}
                  handleShowInventoryDetail={handleShowInventoryDetail}
                />
              ))} */}
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
              <p className="text-2xl">
                {`${t("BuyingRoom")}: ${inventory.roomCode}?`}{" "}
                <span className="text-gray-400 font-normal">
                  {inventory.isCold === 0 ? "(Normal room)" : "(Frozen room)"}
                </span>
              </p>

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
                    step={1}
                    onChange={(e) =>
                      handleSetMonthToBuy(inventory?.price, e.target.value)
                    }
                  ></input>

                  <p>{t("Months")}</p>
                </div>
                <button
                  className="bg-gray-300 px-3 py-2 h-fit rounded-lg hover:bg-gray-400"
                  onClick={() => handleSetMonthToBuy(inventory?.price, 6)}
                >
                  6 {t("Months")}
                </button>
                <button
                  className="bg-gray-300 px-3 py-2 h-fit rounded-lg hover:bg-gray-400"
                  onClick={() => handleSetMonthToBuy(inventory?.price, 12)}
                >
                  1 {t("Year")}
                </button>
                <button
                  className="bg-gray-300 px-3 py-2 h-fit rounded-lg hover:bg-gray-400"
                  onClick={() => handleSetMonthToBuy(inventory?.price, 24)}
                >
                  2 {t("Years")}
                </button>
              </div>

              <div className="mb-7 grid-cols-8 grid gap-4">
                <div className="col-span-2 text-gray-500">{t("Weight")}</div>
                <div className="col-span-2 text-gray-500">{t("Price")}</div>
                <div className="col-span-2 text-gray-500 text-center">
                  {t("Amount")}
                </div>

                <div className="col-span-2 text-gray-500">{t("Total")}</div>
                <div className="col-span-2">
                  {new Intl.NumberFormat().format(inventory?.maxWeight)} kg
                </div>
                <div className="col-span-2">
                  {new Intl.NumberFormat().format(inventory?.price) + " vnd"}
                </div>
                <div className="col-span-2 text-center">
                  {monthBuyInvrentory} {t("Month")}
                </div>

                <div className="col-span-2">
                  {/* {parseInt(cal( inventory?.price*monthBuyInvrentory)) + "VND"} */}
                  {`${new Intl.NumberFormat().format(
                    Math.round(
                      parseFloat(inventory?.price) *
                        parseFloat(monthBuyInvrentory)
                    )
                  )} vnd`}
                </div>
                <div className="col-span-8 flex gap-x-4">
                  <div className="">{t("ExpectExpirationDate")}:</div>
                  <p>
                    {format(
                      addMonths(new Date(), parseInt(monthBuyInvrentory || 0)),
                      "dd/MM/yyyy"
                    )}
                  </p>
                </div>
                <div className="col-span-8 text-red-500">
                  <div className="">{t(errors)}</div>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => handleCancelBuyInventory()}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-red-500 hover:text-white"
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={handleConfirmBuyInventory}
                  disabled={errors?.length > 0 || loading}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  {t("Confirm")}
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
