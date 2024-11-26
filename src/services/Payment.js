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
      const fetching = await fetchData({
        url: `payment/create-qrcode?${queryParams.toString()}`,
        method: "POST",
        data: data,
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  return { createQrCode };
}
