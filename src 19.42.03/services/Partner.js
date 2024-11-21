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
  return {updateProfile};
}
