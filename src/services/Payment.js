import { toast } from "react-toastify";
import { useAxios } from "./CustomizeAxios";

export default function AxiosPayment() {
  const { fetchData } = useAxios();
  const createQrCode = async (option, customAmount, data) => {
    try {
      const queryParams = new URLSearchParams();
      if (typeof option !== "undefined") {
        queryParams.append("options", option);
      }
      if (typeof customAmount !== "undefined") {
        queryParams.append("custom_amount", customAmount);
      }
      const fetching =  fetchData({
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

  return { createQrCode };
}
