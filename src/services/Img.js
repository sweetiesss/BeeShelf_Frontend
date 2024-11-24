import { toast } from "react-toastify";

import useAxiosBearer from "./CustomizeAxios";

export default function AxiosImg() {
  const { fetchDataBearer } = useAxiosBearer();

  //   const uploadImage = async (id) => {
  //     try {
  //       const fetching = fetchDataBearer({
  //         url: `order/send-order/` + id,
  //         method: "PUT",
  //       });
  //       await toast.promise(fetching, {
  //         pending: "Order in progress...",
  //         success: {
  //           render() {
  //             return `Send order successfully`;
  //           },
  //         },
  //         error: {
  //           render({ data }) {
  //             console.log("data Error", data.response.data.message);
  //             return `${data.response.data.message || "Something went wrong!"}`;
  //           },
  //         },
  //       });
  //       return await fetching;
  //     } catch (e) {
  //       return e;
  //     }
  //   };

  const uploadImage = async (file, additionalData) => {
    const formData = new FormData();

    // Append file data
    formData.append("ContentType", additionalData.ContentType || "image/jpeg");
    formData.append(
      "ContentDisposition",
      additionalData.ContentDisposition || "form-data"
    );
    formData.append("Length", file.size || 0); // File size in bytes
    formData.append("Name", file.name || "unknown");
    formData.append("FileName", additionalData.FileName || file.name);

    // Headers as a JSON string, if required
    const headersObject = additionalData.Headers || {};
    formData.append("Headers", JSON.stringify(headersObject));

    try {
      const response = await fetchDataBearer({
        url: "picture/upload-image",
        method: "POST",
        data: formData,
        header: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  return { uploadImage };
}
