

import { toast } from "react-toastify";

import useAxiosBearer from "./CustomizeAxios";

export default function AxiosOrder() {
  const { fetchDataBearer } = useAxiosBearer();

  const uploadImage = async (id) => {
    try {
      const fetching = fetchDataBearer({
        url: `order/send-order/` + id,
        method: "PUT",
      });
      await toast.promise(fetching, {
        pending: "Order in progress...",
        success: {
          render() {
            return `Send order successfully`;
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
      return e;
    }
  };
  


  return { uploadImage};
}
