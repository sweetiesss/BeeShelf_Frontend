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
      return fetching;
    } catch (error) {
      console.error("Error fetching products:", error);
      return error;
    }
  };
  const getProductByUserIdProvinceIdProductId = async (
    productId,
    provinceId,
    userId
  ) => {
    try {
      const url = `partner/get-store-with-products/${productId}/${provinceId}/${userId}`;

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
  const getOrderRevunue = async (userId, showYear) => {
    try {
      const url =
        `partner/get-partner-revenue/${userId}?year=` + parseInt(showYear);

      const fetching = await fetchDataBearer({
        url,
        method: "GET",
      });
      return fetching;
    } catch (error) {
      console.error("Error fetching products:", error);
      return error;
    }
  };
  const getVerificationPaper = async (userId) => {
    try {
      const url = `partner/get-verification-paper/${userId}`;

      const fetching = await fetchDataBearer({
        url,
        method: "GET",
      });
      return fetching;
    } catch (error) {
      console.error("Error fetching products:", error);
      return error;
    }
  };
  const verifyVerificationPaper = async (paperId) => {
    try {
      const url = `partner/verify-verification-paper?verificationPaperId=${paperId}`;

      const fetching = await fetchDataBearer({
        url,
        method: "PUT",
      });
      return fetching;
    } catch (error) {
      console.error("Error fetching products:", error);
      return error;
    }
  };
  const rejectVerificationPaper = async (paperId, reason) => {
    try {
      const url = `partner/reject-verification-paper?verificationPaperId=${paperId}&reason=${reason}`;

      const fetching = await fetchDataBearer({
        url,
        method: "PUT",
      });
      return fetching;
    } catch (error) {
      console.error("Error fetching products:", error);
      return error;
    }
  };

  return {
    updateProfile,
    getAllProduct,
    getOrderRevunue,
    getVerificationPaper,
    verifyVerificationPaper,
    rejectVerificationPaper,
    getProductByUserIdProvinceIdProductId,
  };
}
