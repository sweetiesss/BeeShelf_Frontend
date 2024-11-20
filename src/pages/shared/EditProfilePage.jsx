import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { EnvelopeSimple } from "@phosphor-icons/react";
import AxiosPartner from "../../services/Partner";
import AxiosUser from "../../services/User";
import { useNavigate } from "react-router-dom";

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setErrors({});

    if (selectedFile) {
      setFile(selectedFile);
      setForm((prev) => ({
        ...prev,
        pictureLink: URL.createObjectURL(selectedFile), // Temporarily show the selected file as a preview
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      console.log("Upload this file:", file);
    }
    console.log("Form data to save:", form);
  };

  console.log(ocopCategory);

  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-4 w-[80vw] h-[80vh] mx-auto">
      {/* Profile Picture Section */}
      <div className="col-span-1 row-span-2 border-2 bg-white shadow-lg rounded-lg flex flex-col items-center p-4">
        <div className="w-52 h-52 rounded-full overflow-hidden border-2 border-gray-700  my-10">
          <img
            src={form.pictureLink}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              setErrors((prev) => ({ ...prev, pictureLink: "Invalid link." }));
              e.target.src = userInfor?.pictureLink; // Fallback to userInfor picture
            }}
          />
        </div>
        {errors?.pictureLink !== "" && (
          <div className="text-red-500 text-md font-medium">
            {errors?.pictureLink}
          </div>
        )}
        <div className="flex w-full items-center justify-between">
          <input
            type="text"
            name="pictureLink"
            value={form.pictureLink}
            onChange={handleInputChange}
            placeholder="Image URL"
            className="border rounded-lg px-2 w-[65%] text-sm py-3"
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

        <div className="w-full mt-10">
          {errors?.firstName === "firstName" && (
            <p className="text-red-500 text-md font-medium">
              {errors?.firstName}
            </p>
          )}
          <label
            className={` block text-lg font-medium text-gray-500 mb-1 ml-2`}
          >
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleInputChange}
            className={`border rounded-lg px-2 py-1 w-full text-lg`}
          />
        </div>
        <div className="w-full mt-4">
          {errors?.lastName === "lastName" && (
            <p className="text-red-500 text-md font-medium">
              {errors?.lastName}
            </p>
          )}
          <label
            className={` block text-lg font-medium text-gray-500 mb-1 ml-2`}
          >
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleInputChange}
            className={`border rounded-lg px-2 py-1 w-full text-lg`}
          />
        </div>
        <div className="w-full mt-4">
          {errors?.email === "email" && (
            <p className="text-red-500 text-md font-medium">{errors?.email}</p>
          )}
          <label
            className={` block text-lg font-medium text-gray-500 mb-1 ml-2`}
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            className={`border rounded-lg px-2 py-1 w-full text-lg`}
          />
        </div>
        <div className="w-full mt-4">
          {errors?.phone === "phone" && (
            <p className="text-red-500 text-md font-medium">{errors?.phone}</p>
          )}
          <label
            className={` block text-lg font-medium text-gray-500 mb-1 ml-2`}
          >
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            className={`border rounded-lg px-2 py-1 w-full text-lg`}
          />
        </div>
        <button
          className={`mt-10 w-full bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white font-semibold text-xl rounded-2xl p-4 transition duration-200 relative `}
          onClick={handleSubmit}
        >
          Save Changes
        </button>
      </div>

      <div className="col-span-2 row-span-1 border-2  bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Secure Data</h2>
        <div className="w-full mt-4">
          {errors?.citizenIdentificationNumber ===
            "citizenIdentificationNumber" && (
            <p className="text-red-500 text-md font-medium">
              {errors?.citizenIdentificationNumber}
            </p>
          )}
          <label
            className={` block text-lg font-medium text-gray-500 mb-1 ml-2`}
          >
            citizenIdentificationNumber
          </label>
          <input
            type="text"
            name="citizenIdentificationNumber"
            value={form.citizenIdentificationNumber}
            onChange={handleInputChange}
            className={`border rounded-lg px-2 py-1 w-full text-lg`}
          />
        </div>
        <div className="w-full mt-4">
          {errors?.taxIdentificationNumber === "taxIdentificationNumber" && (
            <p className="text-red-500 text-md font-medium">
              {errors?.taxIdentificationNumber}
            </p>
          )}
          <label
            className={` block text-lg font-medium text-gray-500 mb-1 ml-2`}
          >
            taxIdentificationNumber
          </label>
          <input
            type="text"
            name="taxIdentificationNumber"
            value={form.taxIdentificationNumber}
            onChange={handleInputChange}
            className={`border rounded-lg px-2 py-1 w-full text-lg`}
          />
        </div>
        <div className="flex gap-4 w-full items-center">
          <div className="w-full mt-4">
            {errors?.bankName === "bankName" && (
              <p className="text-red-500 text-md font-medium">
                {errors?.bankName}
              </p>
            )}
            <label
              className={` block text-lg font-medium text-gray-500 mb-1 ml-2`}
            >
              bankName
            </label>
            <input
              type="text"
              name="bankName"
              value={form.bankName}
              onChange={handleInputChange}
              className={`border rounded-lg px-2 py-1 w-full text-lg`}
            />
          </div>
          <div className="w-full mt-4">
            {errors?.bankAccountNumber === "bankAccountNumber" && (
              <p className="text-red-500 text-md font-medium">
                {errors?.bankAccountNumber}
              </p>
            )}
            <label
              className={` block text-lg font-medium text-gray-500 mb-1 ml-2`}
            >
              bankAccountNumber
            </label>
            <input
              type="text"
              name="bankAccountNumber"
              value={form.bankAccountNumber}
              onChange={handleInputChange}
              className={`border rounded-lg px-2 py-1 w-full text-lg`}
            />
          </div>
        </div>
        <div className="flex gap-4 w-full items-end mt-4">
          <div className="w-full">
            {errors?.confirmPassword === "confirmPassword" && (
              <p className="text-red-500 text-md font-medium">
                {errors?.confirmPassword}
              </p>
            )}
            <label
              className={` block text-lg font-medium text-gray-500 mb-1 ml-2`}
            >
              confirmPassword
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleInputChange}
              className={`border rounded-lg px-2 py-1 w-full text-lg`}
            />
          </div>
          <button
            className={`bg-gray-400
             text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition duration-200 text-nowrap`}
            onClick={handleResetPassword}
          >
            Reset Password
          </button>
        </div>
      </div>

      {/* Edit Profile Form Section */}
      <div className="col-span-2 row-span-1 border-2  bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Edit Others</h2>
        <div className="w-full mt-4">
          {errors?.businessName === "businessName" && (
            <p className="text-red-500 text-md font-medium">
              {errors?.businessName}
            </p>
          )}
          <label
            className={` block text-lg font-medium text-gray-500 mb-1 ml-2`}
          >
            Business Name
          </label>
          <input
            type="text"
            name="businessName"
            value={form.businessName}
            onChange={handleInputChange}
            className={`border rounded-lg px-2 py-1 w-full text-lg`}
          />
        </div>
        <div className="w-full mt-4">
          {errors?.ocopCategoryId === "ocopCategoryId" && (
            <p className="text-red-500 text-md font-medium">
              {errors?.ocopCategoryId}
            </p>
          )}
          <label
            className={` block text-lg font-medium text-gray-500 mb-1 ml-2`}
          >
            Ocop Category Name
          </label>
          <select
            type="text"
            name="ocopCategoryId"
            value={form.ocopCategoryId}
            onChange={handleInputChange}
            className={`border rounded-lg px-2 py-1 w-full text-lg`}
          >
            {ocopCategoriesList?.data?.items?.map((ocopCate) => (
              <option value={ocopCate.id}>{ocopCate.type}</option>
            ))}
          </select>
        </div>
        <div className="w-full mt-4">
          {errors?.categoryId === "categoryId" && (
            <p className="text-red-500 text-md font-medium">
              {errors?.categoryId}
            </p>
          )}
          <label
            className={` block text-lg font-medium text-gray-500 mb-1 ml-2`}
          >
            Category Name
          </label>
          <select
            type="text"
            name="categoryId"
            value={form.categoryId}
            onChange={handleInputChange}
            className={`border rounded-lg px-2 py-1 w-full text-lg`}
          ></select>
        </div>

        <div className="w-full mt-4">
          {errors?.provinceId === "provinceId" && (
            <p className="text-red-500 text-md font-medium">
              {errors?.provinceId}
            </p>
          )}
          <label
            className={` block text-lg font-medium text-gray-500 mb-1 ml-2`}
          >
            provinceId
          </label>
          <input
            type="text"
            name="provinceId"
            value={form.provinceId}
            onChange={handleInputChange}
            className={`border rounded-lg px-2 py-1 w-full text-lg`}
          />
        </div>
      </div>
    </div>
  );
}
