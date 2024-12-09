import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { EnvelopeSimple } from "@phosphor-icons/react";
import AxiosPartner from "../../services/Partner";
import AxiosUser from "../../services/User";
import { useNavigate } from "react-router-dom";
import useAxiosBearer from "../../services/CustomizeAxios";
import { toast } from "react-toastify";

export default function ProfileEdit() {
  const nav = useNavigate();
  const { userInfor, handleLogout, ocopCategoriesList } = useAuth();
  const { updateProfile } = AxiosPartner();
  const { sendRequestResetPassword } = AxiosUser();

  const [form, setForm] = useState({
    firstName: userInfor?.firstName || "",
    lastName: userInfor?.lastName || "",
    email: userInfor?.email || "",
    phone: userInfor?.phone || "",
    pictureLink: userInfor?.pictureLink || "",

    citizenIdentificationNumber: userInfor?.citizenIdentificationNumber || "",
    taxIdentificationNumber: userInfor?.taxIdentificationNumber || "",
    businessName: userInfor?.businessName || "",
    bankName: userInfor?.bankName || "",
    bankAccountNumber: userInfor?.bankAccountNumber || "",
    ocopCategoryName: userInfor?.ocopCategoryName || null,
    provinceName: userInfor?.provinceName || null,
    categoryName: userInfor?.categoryName || null,
  });
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [ocopCategory, setOcopCategory] = useState();
  const [loading, setLoading] = useState(false);
  const { fetchDataBearer } = useAxiosBearer();

  useEffect(() => {
    const setOcop = () => {
      const data = ocopCategoriesList?.data?.items?.find(
        (item) => item.type == userInfor?.ocopCategoryName
      );
      setOcopCategory(data);
    };
    setOcop();
  }, [form.ocopCategoryId, userInfor]);

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const result = await sendRequestResetPassword(userInfor?.email);
      console.log(result);
      if (result.status === 200) {
        handleLogout();
        nav("/authorize/signin");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors({});
    if (name === "pictureLink") {
      setFile(null); // Reset the file if a link is provided
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setErrors({});

    const formData = new FormData();

    // Append required fields
    formData.append("image", selectedFile); // Binary file data
    formData.append("ContentType", selectedFile.type || "image/jpeg"); // Content type
    formData.append("ContentDisposition", ""); // Empty if optional
    formData.append("Length", selectedFile.size); // File size in bytes
    formData.append("Name", selectedFile.name); // File name
    formData.append("FileName", selectedFile.name); // File name again

    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]); // Logs the key-value pairs in FormData
    }

    // Append optional headers
    if (selectedFile.Headers) {
      formData.append("Headers", JSON.stringify(selectedFile.Headers));
    }

    const response = await fetchDataBearer({
      url: `/picture/upload-profile-image/${userInfor.id}`,
      method: "POST",
      data: {
        formData,
      },
    });
    console.log(response);

    if (response) {
      setFile(selectedFile);

      setForm((prev) => ({
        ...prev,
        pictureLink: response.data,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      console.log("Upload this file:", file);
    }
    console.log("Form data to save:", form);
    try {
      const response = await fetchDataBearer({
        url: `/user/update-employee`,
        method: "PUT",
        data: {
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          pictureLink: form.pictureLink,
          confirmPassword: "1",
        },
      });
      console.log(response);
      if (response.status === 200) {
        toast.success("Update profile successfully");
      }
    } catch (error) {
      toast.error("Update profile failed");
    }
  };

  return (
    <div className="grid grid-cols-1 grid-rows-1 gap-4 mx-auto max-w-2xl">
      {/* Profile Picture Section */}
      <div className="flex flex-col col-span-1 row-span-2 items-center p-4 bg-white rounded-lg border-2 shadow-lg">
        <img
          src={form.pictureLink ? form.pictureLink : userInfor?.pictureLink}
          alt="Profile"
          className="object-cover w-[200px] h-full rounded"
          onError={(e) => {
            setErrors((prev) => ({ ...prev, pictureLink: "Invalid link." }));
            e.target.src =
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/man-732872_960_720.jpg"; // Fallback to default avatar
          }}
        />
        {errors?.pictureLink !== "" && (
          <div className="font-medium text-red-500 text-md">
            {errors?.pictureLink}
          </div>
        )}
        <div className="flex justify-between items-center w-full">
          <input
            type="text"
            name="pictureLink"
            value={form.pictureLink}
            onChange={handleInputChange}
            placeholder="Image URL"
            className="border rounded-lg px-2 w-[65%] text-sm py-3 flex-1 mr-2"
          />
          <label
            htmlFor="uploadFileImg"
            className={`${
              file ? "bg-gray-600" : "bg-gray-400"
            } text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition duration-200`}
          >
            Upload Image
          </label>
          <input
            id="uploadFileImg"
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="mt-10 w-full">
          {errors?.firstName === "firstName" && (
            <p className="font-medium text-red-500 text-md">
              {errors?.firstName}
            </p>
          )}
          <label
            className={`block mb-1 ml-2 text-lg font-medium text-gray-500`}
          >
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleInputChange}
            className={`px-2 py-1 w-full text-lg rounded-lg border`}
          />
        </div>
        <div className="mt-4 w-full">
          {errors?.lastName === "lastName" && (
            <p className="font-medium text-red-500 text-md">
              {errors?.lastName}
            </p>
          )}
          <label
            className={`block mb-1 ml-2 text-lg font-medium text-gray-500`}
          >
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleInputChange}
            className={`px-2 py-1 w-full text-lg rounded-lg border`}
          />
        </div>
        <div className="mt-4 w-full">
          {errors?.email === "email" && (
            <p className="font-medium text-red-500 text-md">{errors?.email}</p>
          )}
          <label
            className={`block mb-1 ml-2 text-lg font-medium text-gray-500`}
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            className={`px-2 py-1 w-full text-lg rounded-lg border`}
          />
        </div>
        <div className="mt-4 w-full">
          {errors?.phone === "phone" && (
            <p className="font-medium text-red-500 text-md">{errors?.phone}</p>
          )}
          <label
            className={`block mb-1 ml-2 text-lg font-medium text-gray-500`}
          >
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            className={`px-2 py-1 w-full text-lg rounded-lg border`}
          />
        </div>
        <button
          className={`relative p-4 mt-10 w-full text-xl font-semibold text-white rounded-2xl transition duration-200 bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)]`}
          onClick={handleSubmit}
        >
          Save Changes
        </button>
      </div>
      {/* <div className="col-span-2 row-span-1 p-4 bg-white rounded-lg border-2 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Secure Data</h2>
        <div className="mt-4 w-full">
          {errors?.citizenIdentificationNumber ===
            "citizenIdentificationNumber" && (
            <p className="font-medium text-red-500 text-md">
              {errors?.citizenIdentificationNumber}
            </p>
          )}
          <label
            className={`block mb-1 ml-2 text-lg font-medium text-gray-500`}
          >
            citizenIdentificationNumber
          </label>
          <input
            type="text"
            name="citizenIdentificationNumber"
            value={form.citizenIdentificationNumber}
            onChange={handleInputChange}
            className={`px-2 py-1 w-full text-lg rounded-lg border`}
          />
        </div>
        <div className="mt-4 w-full">
          {errors?.taxIdentificationNumber === "taxIdentificationNumber" && (
            <p className="font-medium text-red-500 text-md">
              {errors?.taxIdentificationNumber}
            </p>
          )}
          <label
            className={`block mb-1 ml-2 text-lg font-medium text-gray-500`}
          >
            taxIdentificationNumber
          </label>
          <input
            type="text"
            name="taxIdentificationNumber"
            value={form.taxIdentificationNumber}
            onChange={handleInputChange}
            className={`px-2 py-1 w-full text-lg rounded-lg border`}
          />
        </div>
        <div className="flex gap-4 items-center w-full">
          <div className="mt-4 w-full">
            {errors?.bankName === "bankName" && (
              <p className="font-medium text-red-500 text-md">
                {errors?.bankName}
              </p>
            )}
            <label
              className={`block mb-1 ml-2 text-lg font-medium text-gray-500`}
            >
              bankName
            </label>
            <input
              type="text"
              name="bankName"
              value={form.bankName}
              onChange={handleInputChange}
              className={`px-2 py-1 w-full text-lg rounded-lg border`}
            />
          </div>
          <div className="mt-4 w-full">
            {errors?.bankAccountNumber === "bankAccountNumber" && (
              <p className="font-medium text-red-500 text-md">
                {errors?.bankAccountNumber}
              </p>
            )}
            <label
              className={`block mb-1 ml-2 text-lg font-medium text-gray-500`}
            >
              bankAccountNumber
            </label>
            <input
              type="text"
              name="bankAccountNumber"
              value={form.bankAccountNumber}
              onChange={handleInputChange}
              className={`px-2 py-1 w-full text-lg rounded-lg border`}
            />
          </div>
        </div>
        <div className="flex gap-4 items-end mt-4 w-full">
          <div className="w-full">
            {errors?.confirmPassword === "confirmPassword" && (
              <p className="font-medium text-red-500 text-md">
                {errors?.confirmPassword}
              </p>
            )}
            <label
              className={`block mb-1 ml-2 text-lg font-medium text-gray-500`}
            >
              confirmPassword
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleInputChange}
              className={`px-2 py-1 w-full text-lg rounded-lg border`}
            />
          </div>
          <button
            className={`px-4 py-2 text-white bg-gray-400 rounded-lg transition duration-200 cursor-pointer hover:bg-gray-700 text-nowrap`}
            onClick={handleResetPassword}
          >
            Reset Password
          </button>
        </div>
      </div> */}
      {/* Edit Profile Form Section */}
      {/* <div className="col-span-2 row-span-1 p-4 bg-white rounded-lg border-2 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Edit Others</h2>
        <div className="mt-4 w-full">
          {errors?.businessName === "businessName" && (
            <p className="font-medium text-red-500 text-md">
              {errors?.businessName}
            </p>
          )}
          <label
            className={`block mb-1 ml-2 text-lg font-medium text-gray-500`}
          >
            Business Name
          </label>
          <input
            type="text"
            name="businessName"
            value={form.businessName}
            onChange={handleInputChange}
            className={`px-2 py-1 w-full text-lg rounded-lg border`}
          />
        </div>
        <div className="mt-4 w-full">
          {errors?.ocopCategoryId === "ocopCategoryId" && (
            <p className="font-medium text-red-500 text-md">
              {errors?.ocopCategoryId}
            </p>
          )}
          <label
            className={`block mb-1 ml-2 text-lg font-medium text-gray-500`}
          >
            Ocop Category Name
          </label>
          <select
            type="text"
            name="ocopCategoryId"
            value={form.ocopCategoryId}
            onChange={handleInputChange}
            className={`px-2 py-1 w-full text-lg rounded-lg border`}
          >
            {ocopCategoriesList?.data?.items?.map((ocopCate) => (
              <option value={ocopCate.id}>{ocopCate.type}</option>
            ))}
          </select>
        </div>
        <div className="mt-4 w-full">
          {errors?.categoryId === "categoryId" && (
            <p className="font-medium text-red-500 text-md">
              {errors?.categoryId}
            </p>
          )}
          <label
            className={`block mb-1 ml-2 text-lg font-medium text-gray-500`}
          >
            Category Name
          </label>
          <select
            type="text"
            name="categoryId"
            value={form.categoryId}
            onChange={handleInputChange}
            className={`px-2 py-1 w-full text-lg rounded-lg border`}
          ></select>
        </div>

        <div className="mt-4 w-full">
          {errors?.provinceId === "provinceId" && (
            <p className="font-medium text-red-500 text-md">
              {errors?.provinceId}
            </p>
          )}
          <label
            className={`block mb-1 ml-2 text-lg font-medium text-gray-500`}
          >
            provinceId
          </label>
          <input
            type="text"
            name="provinceId"
            value={form.provinceId}
            onChange={handleInputChange}
            className={`px-2 py-1 w-full text-lg rounded-lg border`}
          />
        </div>
      </div> */}
    </div>
  );
}
