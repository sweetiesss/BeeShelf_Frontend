import useAxiosBearer from "./CustomizeAxios";

export default function AxiosImg() {
  const { fetchDataBearer } = useAxiosBearer();
  const uploadImage = async (file) => {
    console.log("file", file);

    // Validate the file
    if (!file || !(file instanceof File)) {
      throw new Error("Invalid file. Please select a valid image.");
    }

    const formData = new FormData();

    // Append required fields
    formData.append("image", file); // Binary file data
    formData.append("ContentType", file.type || "image/jpeg"); // Content type
    formData.append("ContentDisposition", ""); // Empty if optional
    formData.append("Length", file.size); // File size in bytes
    formData.append("Name", file.name); // File name
    formData.append("FileName", file.name); // File name again

    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]); // Logs the key-value pairs in FormData
    }

    // Append optional headers
    if (file.Headers) {
      formData.append("Headers", JSON.stringify(file.Headers));
    }

    try {
      // Make the API call
      const response = await fetchDataBearer({
        url: "/picture/upload-image", // Adjust the endpoint URL
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data", // Required for file upload
        },
      });
      return response.data; // Return the response for further use
    } catch (error) {
      console.error("Error uploading image:", error.response || error);
      throw error;
    }
  };
  const verrifyAccount = async (id, file1, file2) => {
    try {
      // Validate the files
      if (!file1 || !(file1 instanceof File)) {
        throw new Error("Invalid first file. Please select a valid image.");
      }
      if (!file2 || !(file2 instanceof File)) {
        throw new Error("Invalid second file. Please select a valid image.");
      }

      const formData = new FormData();

      // Append both files
      formData.append("file", file1, file1.name); // First file
      formData.append("file", file2, file2.name); // Second file

      // Append other fields if required
      formData.append("id", id);

      // Log FormData content for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]); // Logs the key-value pairs in FormData
      }

      // Make the API call
      const response = await fetchDataBearer({
        url: "/partner/create-verification-paper?ocop_partner_id=" + id, // Adjust the endpoint URL if needed
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data", // Required for file upload
        },
      });
      console.log("api hrere", response);

      return response.data; // Return the response for further use
    } catch (error) {
      console.error("Error uploading images:", error.response || error);
      throw error;
    }
  };

  return { uploadImage, verrifyAccount };
}
