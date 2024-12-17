import { toast } from "react-toastify";

import useAxiosBearer from "./CustomizeAxios";

export default function AxiosPartner() {
  const { fetchDataBearer } = useAxiosBearer();

  const updateProfile = async (data) => {
    try {
      const fetching = fetchDataBearer({
        url: "partner/update-partner",
        method: "POST",
        data,
      });
      console.log(fetching);

      await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render() {
            return `Your profile updated.`;
          },
        },
        error: {
          render({ data }) {
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });
      const resultFetching = await fetching;

      return resultFetching;
    } catch (error) {
      return error;
    }
  };
  const getAllProduct = async (userId, warehouseId) => {
    try {
      const url = warehouseId
        ? `partner/get-partner-total-products/${userId}?warehouseId=${warehouseId}`
        : `partner/get-partner-total-products/${userId}`;

      const fetching = await fetchDataBearer({
        url,
        method: "GET",
      });

      console.log(fetching);

      return fetching;
    } catch (error) {
      console.error("Error fetching products:", error);
      return error;
    }
  };
  const getOrderRevunue = async (userId) => {
    try {
      const url = `partner/get-partner-revenue/${userId}`;

      const fetching = await fetchDataBearer({
        url,
        method: "GET",
      });

      console.log(fetching);

      return fetching;
    } catch (error) {
      console.error("Error fetching products:", error);
      return error;
    }
  };

  return { updateProfile, getAllProduct,getOrderRevunue };
}
