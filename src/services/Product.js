import { toast } from "react-toastify";
import useAxios from "./CustomizeAxios";

export default function AxiosProduct() {
  const { fetchDataBearer } = useAxios();

  const getProductByUserId = async (userId, pageIndex, Size) => {
    try {
      const fetching = await fetchDataBearer({
        url: `product/get-products/${userId}?pageIndex=${
          pageIndex ? pageIndex : 0
        }&pageSize=${Size ? Size : 10}`,
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
  return { getProductByUserId, deleteProductById };
}
