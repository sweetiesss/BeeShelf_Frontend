import useAxiosBearer from "./CustomizeAxios";

export default function AxiosImg() {
  const { fetchDataBearer } = useAxiosBearer();
  const uploadImage = async (file) => {
    if (!file || !(file instanceof File)) {
      throw new Error("Invalid file. Please select a valid image.");
    }

    const formData = new FormData();

    formData.append("image", file);
    formData.append("ContentType", file.type || "image/jpeg");
    formData.append("ContentDisposition", ""); 
    formData.append("Length", file.size); 
    formData.append("Name", file.name); 
    formData.append("FileName", file.name); 

    if (file.Headers) {
      formData.append("Headers", JSON.stringify(file.Headers));
    }

    try {
      const response = await fetchDataBearer({
        url: "/picture/upload-image",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Error uploading image:", error.response || error);
      throw error;
    }
  };
  const verrifyAccount = async (id, file1, file2) => {
    try {
      if (!file1 || !(file1 instanceof File)) {
        throw new Error("Invalid first file. Please select a valid image.");
      }
      if (!file2 || !(file2 instanceof File)) {
        throw new Error("Invalid second file. Please select a valid image.");
      }
      const formData = new FormData();
      formData.append("file", file1, file1.name); 
      formData.append("file", file2, file2.name); 
      formData.append("id", id);
      const response = await fetchDataBearer({
        url: "/partner/create-verification-paper?ocop_partner_id=" + id, 
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      });
      return response.data; 
    } catch (error) {
      console.error("Error uploading images:", error.response || error);
      throw error;
    }
  };

  return { uploadImage, verrifyAccount };
}
