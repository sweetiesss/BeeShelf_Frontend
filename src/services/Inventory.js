import { toast } from "react-toastify";
import useAxiosBearer from "./CustomizeAxios";

export default function AxiosInventory() {
  const { fetchDataBearer } = useAxiosBearer();

  const getInventory1000ByWarehouseId = async (warehouseId) => {
    try {
      const fetching = await fetchDataBearer({
        url: `room/get-rooms?filterBy=StoreId&filterQuery=${warehouseId}&descending=false&pageIndex=0&pageSize=1000`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const getInventory1000ByUserIdAndWareHouseId = async (
    userId,
    warehouseId
  ) => {
    try {
      const fetching = await fetchDataBearer({
        url: `room/get-rooms/${userId}?filterBy=StoreId&filterQuery=${warehouseId}&descending=false&pageIndex=0&pageSize=1000`,
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
        url: `room/get-rooms/${userId}?descending=false&pageIndex=0&pageSize=1000`,
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
        url: `room/get-room/` + id,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const buyInventory = async (id, userId, monthBuyInvrentory) => {
    try {
      const fetching = fetchDataBearer({
        url: `room/buy-room/${id}/${userId}?month=${monthBuyInvrentory}`,
        method: "POST",
      });
      await toast.promise(fetching, {
        pending: "Buying room...",
        success: {
          render() {
            return `Room bought`;
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
  };
  const extendInventory = async (id, userId, monthBuyInvrentory) => {
    try {
      const fetching = fetchDataBearer({
        url: `room/extend-room/${id}/${userId}?month=${monthBuyInvrentory}`,
        method: "POST",
      });
      await toast.promise(fetching, {
        pending: "Extending room...",
        success: {
          render() {
            return `Room extended`;
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
  };
  const createInventory = async (data) => {
    try {
      const fetching = fetchDataBearer({
        url: `room/create-room`,
        method: "POST",
        data: data,
      });
      await toast.promise(fetching, {
        pending: "Room creating...",
        success: {
          render() {
            return `Room created`;
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
  };
  return {
    getInventory1000ByWarehouseId,
    getInventory1000ByUserIdAndWareHouseId,
    getInventory1000ByUserId,
    getInventoryById,
    buyInventory,
    createInventory,
    extendInventory,
  };
}
