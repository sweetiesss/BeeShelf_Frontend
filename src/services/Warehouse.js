import { toast } from "react-toastify";

import useAxiosBearer from "./CustomizeAxios";

export default function AxiosWarehouse() {
  const { fetchDataBearer } = useAxiosBearer();
  //   const createProductWithUserId = async (data) => {
  //     try {
  //       const fetching = fetchDataBearer({
  //         url: `product/create-product  `,
  //         method: "POST",
  //         data: data,
  //       });
  //       await toast.promise(fetching, {
  //         pending: "Request in progress...",
  //         success: {
  //           render() {
  //             return `Product created`;
  //           },
  //         },
  //         error: {
  //           render({ data }) {
  //             console.log("data Error", data.response.data.message);
  //             return `${data.response.data.message || "Something went wrong!"}`;
  //           },
  //         },
  //       });
  //       return await fetching;
  //     } catch (e) {
  //       console.log(e);
  //       return e;
  //     }
  //   };
  //   const createProductsWithUserId = async (data) => {
  //     try {
  //       const fetching = fetchDataBearer({
  //         url: `product/create-products`,
  //         method: "POST",
  //         data: data,
  //       });
  //       await toast.promise(fetching, {
  //         pending: "Request in progress...",
  //         success: {
  //           render() {
  //             return `Product created`;
  //           },
  //         },
  //         error: {
  //           render({ data }) {
  //             console.log("data Error", data.response.data.message);
  //             return `${data.response.data.message || "Something went wrong!"}`;
  //           },
  //         },
  //       });
  //       return await fetching;
  //     } catch (e) {
  //       console.log(e);
  //       return e;
  //     }
  //   };

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
  const getWarehouseById = async (userId) => {
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
            console.log("data Error", data.response.data.message);
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
            console.log("data Error", data.response.data.message);
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
    getWarehouseByUserId,
    getWarehouses,
  };
}
