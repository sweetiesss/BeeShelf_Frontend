import { toast } from "react-toastify";

import useAxiosBearer from "./CustomizeAxios";

export default function AxiosRequest() {
  const { fetchDataBearer } = useAxiosBearer();
  const createRequest = async (data, type, send) => {
    try {
      const fetching = fetchDataBearer({
        url: `request/create-request?${type && "type=" + type + "&"}${
          send && "send=" + send
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
      console.error(e);
      return {
        error: true,
        message: e.response?.data?.message || "Something went wrong!",
      };
    }
  };
  const updateRequest = async (data, id) => {
    try {
      const fetching = fetchDataBearer({
        url: `request/update-request/${id && id} `,
        method: "PUT",
        data: data,
      });
      const result = await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render() {
            return `Request updated`;
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
      console.error(e);
      return {
        error: true,
        message: e.response?.data?.message || "Something went wrong!",
      };
    }
  };
  const getRequestByUserId = async (
    userId,
    status,
    isImported,
    descending,
    pageIndex,
    pageSize
  ) => {
    try {
      const queryParams = new URLSearchParams();
      status !== "" && queryParams.append("status", status);

      if (isImported === "import") {
        queryParams.append("import", true);
      }
      if (isImported === "export") {
        queryParams.append("import", false);
      }

      queryParams.append("descending", descending);
      queryParams.append("pageIndex", pageIndex);
      queryParams.append("pageSize", pageSize);

      const fetching = await fetchDataBearer({
        url: `request/get-requests/${userId}?${queryParams.toString()}`,
        method: "GET",
      });
      return fetching;
    } catch (e) {
      console.error(e);
      return e;
    }
  };
  const sendRequestById = async (id) => {
    try {
      const fetching = fetchDataBearer({
        url: `request/send-request?id=` + id,
        method: "POST",
      });
      await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render() {
            return `Send request successfully`;
          },
        },
        error: {
          render({ data }) {
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });
      return await fetching;
    } catch (e) {
      return e;
    }
  };
  const updateRequestStatus = async (id, status) => {
    try {
      const fetching = fetchDataBearer({
        url: `request/update-request-status/` + id + "?status=" + status,
        method: "PUT",
      });
      await toast.promise(fetching, {
        pending: "Request in progressing...",
        success: {
          render() {
            return `${status} request successfully`;
          },
        },
        error: {
          render({ data }) {
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });
      return await fetching;
    } catch (e) {
      return e;
    }
  };
  const cancelRequest = async (id, reason) => {
    try {
      const fetching = fetchDataBearer({
        url:
          `request/cancel-request?id=` + id + "&cancellationReason=" + reason,
        method: "POST",
        body: JSON.stringify({ data: "Cancelled" }),
      });
      await toast.promise(fetching, {
        pending: "Request in progressing...",
        success: {
          render() {
            return `Request cancel successfully`;
          },
        },
        error: {
          render({ data }) {
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });
      return await fetching;
    } catch (e) {
      return e;
    }
  };
  const deleteRequestById = async (id) => {
    try {
      const fetching = fetchDataBearer({
        url: `request/delete-request/` + id,
        method: "DELETE",
      });
      await toast.promise(fetching, {
        pending: "Request in progress...",
        success: {
          render() {
            return `Delete request successfully`;
          },
        },
        error: {
          render({ data }) {
            return `${data.response.data.message || "Something went wrong!"}`;
          },
        },
      });
      return await fetching;
    } catch (e) {
      return e;
    }
  };

  return {
    createRequest,
    getRequestByUserId,
    sendRequestById,
    deleteRequestById,
    updateRequestStatus,
    updateRequest,
    cancelRequest,
  };
}
