import { toast } from "react-toastify";

import useAxiosBearer from "./CustomizeAxios";

export default function AxiosWarehouse() {
  const { fetchDataBearer } = useAxiosBearer();

  const createWarehouse = async (data) => {
    try {
      const { id, ...submitData } = data;
      const fetching = fetchDataBearer({
        url: `store/create-store`,
        method: "POST",
        data: submitData,
      });
      await toast.promise(fetching, {
        pending: "Store creating...",
        success: {
          render() {
            return `Store created`;
          },
        },
        error: {
          render({ data }) {
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });
      return fetching;
    } catch (e) {
      console.error(e);
      return e;
    }
  };
  const updateWarehouse = async (id, data) => {
    try {
      const fetching = fetchDataBearer({
        url: `store/update-store/` + id,
        method: "PUT",
        data: data,
      });
      await toast.promise(fetching, {
        pending: "Store updating...",
        success: {
          render() {
            return `Store updated`;
          },
        },
        error: {
          render({ data }) {
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });
      return fetching;
    } catch (e) {
      console.error(e);
      return e;
    }
  };

  const getWarehouses = async (
    search,
    sortCriteria,
    descending,
    pageIndex,
    pageSize
  ) => {
    try {
      const queryParam = new URLSearchParams();
      search && queryParam.append("search", search);
      sortCriteria && queryParam.append("sortCriteria", sortCriteria);
      descending && queryParam.append("descending", descending);
      const fetching = await fetchDataBearer({
        url: `store/get-stores`,
        method: "GET",
        params: {
          search,
          sortCriteria,
          descending,
          pageIndex,
          pageSize,
        },
      });
      return fetching;
    } catch (e) {
      console.error("Error fetching stores:", e);
      return e;
    }
  };

  const getWarehouseByUserId = async (userId) => {
    try {
      const fetching = await fetchDataBearer({
        url: `store/get-store-by-user/${userId}`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.error(e);
      return e;
    }
  };
  const deleteWarehouseById = async (warehouseId) => {
    try {
      const fetching = await fetchDataBearer({
        url: `store/delete-store/${warehouseId}`,
        method: "DELETE",
      });
      return fetching;
    } catch (e) {
      console.error(e);
      return e;
    }
  };
  const getWarehouseById = async (warehouseId) => {
    try {
      const fetching = await fetchDataBearer({
        url: `store/get-store/${warehouseId}`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.error(e);
      return e;
    }
  };
  const assignStaff = async (data) => {
    try {
      const fetching = fetchDataBearer({
        url: `store/add-staffs-to-store`,
        method: "POST",
        data: data, 
      });
      await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render() {
            return `Assign data successfully `;
          },
        },
        error: {
          render({ data }) {
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });
      return fetching;
    } catch (e) {
      console.error("Error assigning staff:", e);
      return e;
    }
  };
  const assignShipper = async (shipperIds) => {
    try {
      const fetching = fetchDataBearer({
        url: `store/add-shippers-to-store`,
        method: "POST",
        data: shipperIds, 
      });
      await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render() {
            return `Assign data successfully `;
          },
        },
        error: {
          render({ data }) {
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });
      return fetching;
    } catch (e) {
      console.error("Error assigning staff:", e);
      return e;
    }
  };

  return {
    createWarehouse,
    getWarehouseByUserId,
    getWarehouses,
    getWarehouseById,
    assignStaff,
    assignShipper,
    updateWarehouse,
    deleteWarehouseById,
  };
}
