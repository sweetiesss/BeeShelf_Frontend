import { toast } from "react-toastify";
import useAxiosBearer, { useAxios } from "./CustomizeAxios";

export default function AxiosPayment() {
  const { fetchData } = useAxios();
  const { fetchDataBearer } = useAxiosBearer();
  const createQrCode = async (option, customAmount, data) => {
    try {
      const queryParams = new URLSearchParams();
      if (typeof option !== "undefined") {
        queryParams.append("options", option);
      }
      if (typeof customAmount !== "undefined") {
        queryParams.append("custom_amount", customAmount);
      }
      const fetching = fetchData({
        url: `payment/create-qrcode?${queryParams.toString()}`,
        method: "POST",
        data: data,
      });
      const result = await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render() {
            return `Qr created`;
          },
        },
        error: {
          render({ data }) {
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const createWithdrawnRequest = async (id, amount) => {
    try {
      const fetching = fetchDataBearer({
        url: `payment/create-money-transfer-request/${id}?amount=${amount}`,
        method: "POST",
      });
      const result = await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render() {
            return `Request created.`;
          },
        },
        error: {
          render({ data }) {
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });
      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const confirmPayment = async (data) => {
    try {
      const fetching = await fetchData({
        url: `payment/confirm-payment`,
        method: "POST",
        data: data,
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const getPaymentTransactionByUserId = async (userId) => {
    try {
      const fetching = await fetchDataBearer({
        url: `payment/get-partner-transactions/${userId}`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const getPaymentWithDrawByUserId = async (userId) => {
    try {
      const fetching = await fetchDataBearer({
        url: `payment/get-partner-money-transfers/${userId}`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  const getOrdersSaleByUserId = async (userId) => {
    try {
      const fetching = await fetchDataBearer({
        url: `payment/get-payments/${userId}`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  return {
    createQrCode,
    confirmPayment,
    getPaymentTransactionByUserId,
    getPaymentWithDrawByUserId,
    createWithdrawnRequest,
    getOrdersSaleByUserId,
  };
}
