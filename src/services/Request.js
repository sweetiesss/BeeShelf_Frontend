import { toast } from "react-toastify";
import useAxios from "./CustomizeAxios";

export default function AxiosRequest() {
  const { fetchDataBearer } = useAxios();
  const createRequest = async (data, type, send) => {
    try {
      const fetching = fetchDataBearer({
        url: `request/create-request?${type && ("type="+ type + "&")}${
          send && ("send="+send)
        }`,
        method: "POST",
        data: data,
      });
      const result = await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render() {
            return `Request created`;
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
      return {
        error: true,
        message: e.response?.data?.message || "Something went wrong!",
      };
    }
  };
  return { createRequest };
}
