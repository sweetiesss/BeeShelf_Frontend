import { toast } from "react-toastify";

import useAxiosBearer from "./CustomizeAxios";

export default function AxiosWarehouse() {
  const { fetchDataBearer } = useAxiosBearer();

  const createWarehouse = async (data) => {
    try {
      const { id, ...submitData } = data;
      const fetching = fetchDataBearer({
        url: `warehouse/create-warehouse`,
        method: "POST",
        data: submitData,
      });
      await toast.promise(fetching, {
        pending: "Warehouse creating...",
        success: {
          render() {
            return `Warehouse created`;
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
      console.log(e);
      return e;
    }
  };
  const updateWarehouse = async (id, data) => {
    try {
      const fetching = fetchDataBearer({
        url: `warehouse/update-warehouse/` + id,
        method: "PUT",
        data: data,
      });
      await toast.promise(fetching, {
        pending: "Warehouse updating...",
        success: {
          render() {
            return `Warehouse updated`;
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
      console.log(e);
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
      const fetching = await fetchDataBearer({
        url: `/warehouse/get-warehouses`,
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
      console.error("Error fetching warehouses:", e);
      return e;
    }
  };

  const getWarehouseByUserId = async (userId) => {
    try {
      const fetching = await fetchDataBearer({
        url: `warehouse/get-warehouse-by-user/${userId}`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const deleteWarehouseById = async (warehouseId) => {
    try {
      const fetching = await fetchDataBearer({
        url: `warehouse/delete-warehouse/${warehouseId}`,
        method: "DELETE",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const getWarehouseById = async (warehouseId) => {
    try {
      const fetching = await fetchDataBearer({
        url: `warehouse/get-warehouse/${warehouseId}`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const assignStaff = async (data) => {
    try {
      const fetching = fetchDataBearer({
        url: `warehouse/add-staffs-to-warehouse`,
        method: "POST",
        data: data, // Array of staff IDs to assign
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
        url: `warehouse/add-shippers-to-warehouse`,
        method: "POST",
        data: shipperIds, // Array of staff IDs to assign
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

  const deleteProductById = async (productId) => {
    try {
      const fetching = fetchDataBearer({
        url: `product/delete-product/${productId}`,
        method: "DELETE",
      });
      await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render() {
            return `Delete data successfully `;
          },
        },
        error: {
          render({ data }) {
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });
      return await fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const updateProductById = async (productId, data) => {
    try {
      const fetching = fetchDataBearer({
        url: `product/update-product/${productId}`,
        method: "PUT",
        data: data,
      });
      await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render() {
            return `Uppdate data successfully`;
          },
        },
        error: {
          render({ data }) {
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });
      return await fetching;
    } catch (e) {
      console.log(e);
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
