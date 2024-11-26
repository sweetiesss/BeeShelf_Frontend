import { toast } from "react-toastify";
import useAxiosBearer from "./CustomizeAxios";

export default function AxiosInventory() {
  const { fetchDataBearer } = useAxiosBearer();

  const getInventory1000ByWarehouseId = async (warehouseId) => {
    try {
      const fetching = await fetchDataBearer({
        url: `inventory/get-inventories?filterBy=WarehouseId&filterQuery=${warehouseId}&descending=false&pageIndex=0&pageSize=1000`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e; 
    }
  };
  const getInventory1000ByUserIdAndWareHouseId = async (userId, warehouseId) => {
    try {
      const fetching = await fetchDataBearer({
        url: `inventory/get-inventories/${userId}?filterBy=WarehouseId&filterQuery=${warehouseId}&descending=false&pageIndex=0&pageSize=1000`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const getInventory1000ByUserId = async (userId) => {
    try {
      const fetching = await fetchDataBearer({
        url: `inventory/get-inventories/${userId}?descending=false&pageIndex=0&pageSize=1000`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const getInventoryById = async (id) => {
    try {
      const fetching = await fetchDataBearer({
        url: `inventory/get-inventory/` + id,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const buyInventory = async (id, userId) => {
    try {
      const fetching = await fetchDataBearer({
        url: `/inventory/buy-inventory/${id}/${userId}`,
        method: "POST",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const createInventory=async(data)=>{
    try {
      const fetching = fetchDataBearer({
        url: `inventory/create-inventory`,
        method: "POST",
        data: data,
      });
      await toast.promise(fetching, {
        pending: "Inventory creating...",
        success: {
          render() {
            return `Inventory created`;
          },
        },
        error: {
          render({ data }) {
            console.log("data Error", data.response.data.message);
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  return { getInventory1000ByWarehouseId, getInventory1000ByUserIdAndWareHouseId,getInventory1000ByUserId, getInventoryById ,buyInventory,createInventory};
}
