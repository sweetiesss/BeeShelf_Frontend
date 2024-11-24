import { toast } from "react-toastify";
import useAxiosBearer, { useAxios } from "./CustomizeAxios";

export default function AxiosCategory() {
  // Simulate fetching data from API
  const { fetchDataBearer } = useAxiosBearer();
  const getProductCategoryBy1000 = async (pageIndex = 0, size = 1000) => {
    try {
      const queryParams = new URLSearchParams();

      queryParams.append("pageIndex", pageIndex);
      queryParams.append("pageSize", size);

      const fetching = await fetchDataBearer({
        url: `productCategory/get-product-categories?${queryParams.toString()}`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  // // const createRequest = async (data, type, send) => {
  // //   try {
  // //     const fetching = fetchDataBearer({
  // //       url: `request/create-request?${type && "type=" + type + "&"}${
  // //         send && "send=" + send
  // //       }`,
  // //       method: "POST",
  // //       data: data,
  // //     });
  // //     const result = await toast.promise(fetching, {
  // //       pending: "Request in progress...",
  // //       success: {
  // //         render() {
  // //           return `Request created`;
  // //         },
  // //       },
  // //       error: {
  // //         render({ data }) {
  // //           return `${data.response.data.message || "Something went wrong!"}`;
  // //         },
  // //       },
  // //     });
  // //     return result;
  // //   } catch (e) {
  // //     console.log(e);
  // //     return {
  // //       error: true,
  // //       message: e.response?.data?.message || "Something went wrong!",
  // //     };
  // //   }
  // // };

  // const sendOrderById = async (id) => {
  //   try {
  //     const fetching = fetchDataBearer({
  //       url: `order/send-order/` + id,
  //       method: "PUT",
  //     });
  //     await toast.promise(fetching, {
  //       pending: "Order in progress...",
  //       success: {
  //         render() {
  //           return `Send order successfully`;
  //         },
  //       },
  //       error: {
  //         render({ data }) {
  //           console.log("data Error", data.response.data.message);
  //           return `${data.response.data.message || "Something went wrong!"}`;
  //         },
  //       },
  //     });
  //     return await fetching;
  //   } catch (e) {
  //     return e;
  //   }
  // };
  // // const updateRequestStatus = async (id,status) => {
  // //   try {
  // //     const fetching = fetchDataBearer({
  // //       url: `request/update-request-status/` + id+"?status="+status,
  // //       method: "PUT",
  // //     });
  // //     await toast.promise(fetching, {
  // //       pending: "Request in progress...",
  // //       success: {
  // //         render() {
  // //           return `${status} request successfully`;
  // //         },
  // //       },
  // //       error: {
  // //         render({ data }) {
  // //           console.log("data Error", data.response.data.message);
  // //           return `${data.response.data.message || "Something went wrong!"}`;
  // //         },
  // //       },
  // //     });
  // //     return await fetching;
  // //   } catch (e) {
  // //     return e;
  // //   }
  // // };
  // const deleteOrderById = async (id) => {
  //   try {
  //     const fetching = fetchDataBearer({
  //       url: `order/delete-order/` + id,
  //       method: "DELETE",
  //     });
  //     await toast.promise(fetching, {
  //       pending: "Order in progress...",
  //       success: {
  //         render() {
  //           return `Delete order successfully`;
  //         },
  //       },
  //       error: {
  //         render({ data }) {
  //           console.log("data Error", data.response.data.message);
  //           return `${data.response.data.message || "Something went wrong!"}`;
  //         },
  //       },
  //     });
  //     return await fetching;
  //   } catch (e) {
  //     return e;
  //   }
  // };

  return { getProductCategoryBy1000 };
}
