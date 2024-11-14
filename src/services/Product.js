import { toast } from "react-toastify";
import useAxios from "./CustomizeAxios";

export default function AxiosProduct() {
  const { fetchDataBearer } = useAxios();
  const createProductWithUserId = async (data) => {
    try {
      const fetching = fetchDataBearer({
        url: `product/create-product  `,
        method: "POST",
        data: data,
      });
      await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render() {
            return `Product created`;
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
  const createProductsWithUserId = async (data) => {
    try {
      const fetching = fetchDataBearer({
        url: `product/create-products`,
        method: "POST",
        data: data,
      });
      await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render() {
            return `Product created`;
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

  const getProductByUserId = async (
    userId,
    pageIndex,
    size,
    search,
    sortBy,
    descending
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (sortBy) queryParams.append("sortBy", sortBy);
      if (descending) queryParams.append("descending", descending);
      queryParams.append("pageIndex", pageIndex || 0);
      queryParams.append("pageSize", size || 10);
      const url = `product/get-products/${userId}?${queryParams.toString()}`;

      const fetching = await fetchDataBearer({
        url: url,
        method: "GET",
      });

      return fetching;
    } catch (e) {
      console.error(e);
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
    getProductByUserId,
    deleteProductById,
    createProductWithUserId,
    createProductsWithUserId,
    updateProductById,
  };
}
