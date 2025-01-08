import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosUser from "../../services/User";
import {
  Bank,
  Buildings,
  CheckCircle,
  CheckFat,
  Cherries,
  Coins,
  CreditCard,
  EnvelopeSimple,
  MapPin,
  Phone,
  Plant,
  User,
} from "@phosphor-icons/react";
import { useAuth } from "../../context/AuthContext";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { ConfigProvider, Spin } from "antd";
import axios from "axios";

export default function SignUp({ setAction, baseForm }) {
  const nav = useNavigate();
  const { requestSignUp } = AxiosUser();
  const { t } = useTranslation();
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [ocopCategory, setOcopCategory] = useState();
  const { banksList, ocopCategoriesList, provinces } = useAuth();
  const [checkBussiness, setCheckBussiness] = useState(false);
  const [checkBussinessLoading, setCheckBussinessLoading] = useState(false);
  const [checkBussinessError, setCheckBussinessError] = useState(false);
  const [step, setStep] = useState(1);
  const defaulform = {
    email: baseForm?.email || "",
    firstName: baseForm?.firstName || "",
    lastName: baseForm?.lastName || "",
    phone: "",
    taxIdentificationNumber: "",
    businessNameInternational: "",
    businessShortName: "",
    businessAddress: "",
    businessName: "",
    bankName: "",
    bankAccountNumber: "",
    categoryId: 0,
    ocopCategoryId: 0,
    provinceId: 0,
    pictureLink:
      baseForm?.pictureLink ||
      "https://th.bing.com/th/id/R.8e2c571ff125b3531705198a15d3103c?rik=muXZvm3dsoQqwg&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpng-user-icon-person-icon-png-people-person-user-icon-2240.png&ehk=MfHYkGonqy7I%2fGTKUAzUFpbYm9DhfXA9Q70oeFxWmH8%3d&risl=&pid=ImgRaw&r=0",
  };
  const [form, setForm] = useState(defaulform);

  const contentStyle = {
    padding: 10,
    color: "var(--Xanh-Base)",
    primaryColor: "var(--Xanh-Base)",

    borderRadius: 4,
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(() => ({ ...form, [name]: value }));
    if (name === "ocopCategoryId" && value != null) {
      const ocopCategoryFind = ocopCategoriesList?.data?.items?.find(
        (item) => item.id == value
      );
      setOcopCategory(ocopCategoryFind);
    }
    if (name === "taxIdentificationNumber") {
      setCheckBussiness(false);
      setForm((prev) => ({ ...prev, businessName: "" }));
      setCheckBussinessError();
    }
  };

  const validateForm = () => {
    let formErrors = {};
    if (step === 1) {
      if (!form?.firstName) {
        formErrors.firstName = "First name is required.";
      }
      if (!form?.lastName) {
        formErrors.lastName = "Last name is required.";
      }
      if (!form?.email || !/\S+@\S+\.\S+/.test(form.email)) {
        formErrors.email = "Please enter a valid email address.";
      }
      if (!form?.phone || !/^\d{10,12}$/.test(form.phone)) {
        formErrors.phone = "Please enter a valid phone number.";
      }
    } else if (step === 2) {
      if (!form?.bankName) {
        formErrors.bankName = "Bank Name is required.";
      }

      if (!form?.bankAccountNumber) {
        formErrors.bankAccountNumber = "Bank Account Number is required.";
      } else if (!/^\d{9,18}$/.test(form.bankAccountNumber)) {
        formErrors.bankAccountNumber =
          "Invalid format. It must be 9-18 digits.";
      }
    } else if (step === 3) {
      if (!form?.taxIdentificationNumber) {
        formErrors.taxIdentificationNumber =
          "Tax Identification Number is required.";
      } else if (!/^\d{10}$/.test(form.taxIdentificationNumber)) {
        formErrors.taxIdentificationNumber =
          "Invalid format. It must be 10 digits.";
      }
      if (!form?.businessName) {
        formErrors.businessName = "Business Name is required.";
      }
      if (!form?.categoryId) {
        formErrors.categoryId = "Your Product Category is required.";
      }
      if (!form?.ocopCategoryId) {
        formErrors.ocopCategoryId = "Your Ocop Category is required.";
      }
      if (!form?.provinceId) {
        formErrors.provinceId = "Your Province Location is required.";
      }
      if (!agree) {
        formErrors.agree = "You must agree to the terms and conditions.";
      }
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };
  const handleToLogin = () => {
    nav("/authorize/signin");
    setAction("Login");
    setSuccess(false);
    setForm(defaulform);
    setStep(1);
    setErrors({});
    setAgree(false);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const submitFrom = {
          ...form,
        };
        setLoading(true);
        const result = await requestSignUp(submitFrom);
        if (result?.status === 400 || result?.status === 404) {
          const resultError = result?.response?.data?.message;
          const resultErrors = result?.response?.data?.errors;
          if (resultError) {
            Object.keys(defaulform).forEach((field) => {
              if (
                resultError
                  .replace(/\s+/g, "")
                  .toLowerCase()
                  .includes(field.toLowerCase())
              ) {
                setErrors((prev) => ({ ...prev, [field]: resultError }));
                if (
                  field === "email" ||
                  field === "firstName" ||
                  field === "lastName" ||
                  field === "phone"
                ) {
                  setStep(1);
                } else if (
                  field === "bankAccountNumber" ||
                  field === "bankName"
                ) {
                  setStep(2);
                } else if (
                  field === "taxIdentificationNumber" ||
                  field === "businessName" ||
                  field === "categoryid" ||
                  field === "ocopCategoryid" ||
                  field === "provinceid"
                ) {
                  setStep(3);
                }
              }
            });
          }

          if (Object.keys(resultErrors).length > 0) {
            Object.entries(resultErrors).forEach(([field, value]) => {
              const errorMessage = Array.isArray(value) ? value[0] : value;
              const fieldError = field.toLowerCase();
              setErrors((prev) => ({
                ...prev,
                [fieldError]: errorMessage,
              }));
              if (
                fieldError === "email" ||
                fieldError === "firstName" ||
                fieldError === "lastName" ||
                fieldError === "phone"
              ) {
                setStep(1);
              } else if (
                fieldError === "citizenIdentificationNumber" ||
                fieldError === "taxIdentificationNumber" ||
                fieldError === "bankAccountNumber" ||
                fieldError === "bankName"
              ) {
                setStep(2);
              } else if (
                fieldError === "businessName" ||
                field === "categoryid" ||
                field === "ocopCategoryid" ||
                field === "provinceid"
              ) {
                setStep(3);
              }
            });
          }
        }
        if (result?.status === 200) {
          setSuccess(true);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
  };
  const handleNext = () => {
    if (validateForm()) {
      setStep((step) => step + 1);
    }
  };

  const checkBussinessClick = async () => {
    try {
      setCheckBussinessLoading(true);
      if (form?.taxIdentificationNumber) {
        const result = await axios.get(
          "https://api.vietqr.io/v2/business/" + form?.taxIdentificationNumber
        );
        if (result?.status == 200 && result?.data?.code === "00") {
          setCheckBussiness(true);
          const businessAddress = result?.data?.data?.address.split(",");
          const provinceSubName = removePrefix(
            businessAddress[businessAddress?.length - 2]
          );
          const provincedFoundId = provinces?.data?.find(
            (item) => item.subDivisionName === provinceSubName
          );
          setForm((prev) => ({
            ...prev,
            businessName: result?.data?.data?.name,
            businessNameInternational: result?.data?.data?.internationalName,
            businessShortName: result?.data?.data?.shortName,
            businessAddress: result?.data?.data?.address,
            provinceId: provincedFoundId?.id,
          }));
          setCheckBussinessError();
        } else {
          setCheckBussinessError(result?.data?.desc);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setCheckBussinessLoading(false);
    }
  };
  function removePrefix(location) {
    return location.trim().replace(/^(Tỉnh|Thành phố)\s+/i, "");
  }

  return (
    <div className="w-full p-4  overflow-hidden relative bg-white h-full">
      {loading && <div className="loading"></div>}
      <header className="mb-4">
        <h1 className="text-4xl font-semibold">{t("WelcometoBeeShelf")}</h1>
        <p className="text-[var(--en-vu-600)] text-lg">
          {t("Comeonandcreateanaccount")}
        </p>
      </header>
      {!isSuccess && (
        <div className="grid grid-cols-3 gap-1 mt-[2rem]">
          <div
            className={`${
              step === 1
                ? "bg-[var(--Xanh-Base)]"
                : step > 1
                ? "cursor-pointer bg-[var(--Xanh-200)]"
                : "bg-slate-200"
            }  w-full  h-[0.5rem]`}
            onClick={() => step > 1 && setStep(1)}
          />
          <div
            className={`${
              step === 2
                ? "bg-[var(--Xanh-Base)]"
                : step > 2
                ? "cursor-pointer bg-[var(--Xanh-200)]"
                : "bg-slate-200"
            }  w-full  h-[0.5rem]`}
            onClick={() => step > 2 && setStep(2)}
          />
          <div
            className={`${
              step === 3
                ? "bg-[var(--Xanh-Base)]"
                : step > 3
                ? "cursor-pointer bg-[var(--Xanh-200)]"
                : "bg-slate-200"
            }  w-full  h-[0.5rem]`}
            onClick={() => step > 3 && setStep(3)}
          />
        </div>
      )}
      {!isSuccess ? (
        <div className="flex flex-col space-y-5 mt-[2rem]">
          {step === 1 ? (
            <>
              <div>
                {errors.firstName && (
                  <p className="text-red-500 text-md font-medium">
                    {errors.firstName}
                  </p>
                )}
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
                    errors.firstName
                      ? "ring-[var(--Do-Base)] ring-2 text-[var(--Do-Base)] "
                      : form?.firstName
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  } "border-gray-300"
                }`}
                >
                  <label className="text-3xl p-4 pr-0  rounded-s-lg ">
                    <User />
                  </label>
                  <input
                    className="p-4 w-full rounded-lg outline-none"
                    type="text"
                    onChange={handleInput}
                    name="firstName"
                    placeholder={t("FirstName")}
                    value={form?.firstName || ""}
                  />
                </div>
              </div>
              <div>
                {errors.lastName && (
                  <p className="text-red-500 text-md font-medium">
                    {errors.lastName}
                  </p>
                )}
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
                    errors.lastName
                      ? "ring-[var(--Do-Base)] ring-2 text-[var(--Do-Base)] "
                      : form?.lastName
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  } "border-gray-300"
                }`}
                >
                  <label className="text-3xl p-4 pr-0  rounded-s-lg ">
                    <User />
                  </label>
                  <input
                    className="p-4 w-full rounded-lg outline-none"
                    type="text"
                    onChange={handleInput}
                    name="lastName"
                    placeholder={t("LastName")}
                    value={form?.lastName || ""}
                  />
                </div>
              </div>
              <div>
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
                    errors.email
                      ? "ring-[var(--Do-Base)] ring-2 text-[var(--Do-Base)] "
                      : form?.email
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  } "border-gray-300"
                }`}
                >
                  <label className="text-3xl p-4 pr-0  rounded-s-lg ">
                    <EnvelopeSimple />
                  </label>
                  <input
                    className="p-4 w-full rounded-lg outline-none"
                    type="email"
                    onChange={handleInput}
                    name="email"
                    placeholder={t("Email")}
                    value={form?.email || ""}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-md font-medium mt-2">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
                    errors.phone
                      ? "ring-[var(--Do-Base)] ring-2 text-[var(--Do-Base)] "
                      : form?.phone
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  } "border-gray-300"
                }`}
                >
                  <label className="text-3xl p-4 pr-0  rounded-s-lg ">
                    <Phone />
                  </label>
                  <input
                    className="p-4 w-full rounded-lg outline-none"
                    type="text"
                    onChange={handleInput}
                    name="phone"
                    placeholder={t("PhoneNumber")}
                    value={form?.phone || ""}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-md font-medium mt-2">
                    {errors.phone}
                  </p>
                )}
              </div>

              <button
                className={`w-full bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white border-2 font-semibold text-xl rounded-2xl p-4 transition duration-200 relative`}
                onClick={handleNext}
              >
                {t("Next")}
              </button>
            </>
          ) : step === 2 ? (
            <>
              <div>
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
                    errors.bankName
                      ? "ring-[var(--Do-Base)] ring-2 text-[var(--Do-Base)] "
                      : form?.bankName
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  } "border-gray-300"
                }`}
                >
                  <label className="text-3xl p-4 pr-0  rounded-s-lg ">
                    <Bank />
                  </label>
                  <Select
                    className="w-full"
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        border: "none",
                        boxShadow: "none",
                        width: "100%",
                      }),
                      dropdownIndicator: (baseStyles) => ({
                        ...baseStyles,
                        color: "inherit", // Optional: matches text color
                        width: "100%",
                      }),
                      menu: (baseStyles) => ({
                        ...baseStyles,
                        border: "none",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        width: "100%",
                      }),
                    }}
                    onChange={(selectedOption) =>
                      setForm((prev) => ({
                        ...prev,
                        bankName: selectedOption.value,
                      }))
                    }
                    options={banksList?.data?.data.map((bank) => ({
                      value: bank.shortName,
                      label: bank.shortName,
                      image: bank.logo,
                    }))}
                    name="bankName"
                    placeholder={t("BankName")}
                    value={banksList?.data?.data
                      ?.map((bank) => ({
                        value: bank.shortName,
                        label: bank.shortName,
                        image: bank.logo,
                      }))
                      .find((bank) => bank.value === form.bankName)}
                    formatOptionLabel={({ label, image }) => (
                      <div className="flex items-center gap-2 ">
                        <img
                          src={image}
                          alt={label}
                          className="w-32 h-full object-contain"
                        />
                        <span>{label}</span>
                      </div>
                    )}
                  ></Select>
                </div>
                {errors.bankName && (
                  <p className="text-red-500 text-md font-medium mt-2">
                    {errors.bankName}
                  </p>
                )}
              </div>
              <div>
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
                    errors.bankAccountNumber
                      ? "ring-[var(--Do-Base)] ring-2 text-[var(--Do-Base)] "
                      : form?.bankAccountNumber
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  } "border-gray-300"
                }`}
                >
                  <label className="text-3xl p-4 pr-0  rounded-s-lg ">
                    <CreditCard />
                  </label>
                  <input
                    className="p-4 w-full rounded-lg outline-none"
                    type="text"
                    onChange={handleInput}
                    name="bankAccountNumber"
                    placeholder={t("BankAccountNumber")}
                    value={form?.bankAccountNumber || ""}
                  />
                </div>
                {errors.bankAccountNumber && (
                  <p className="text-red-500 text-md font-medium mt-2">
                    {errors.bankAccountNumber}
                  </p>
                )}
              </div>

              <button
                className={`w-full bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white border-2 font-semibold text-xl rounded-2xl p-4 transition duration-200 relative`}
                onClick={handleNext}
              >
                {t("Next")}
              </button>
            </>
          ) : (
            <>
              <div>
                <div className="flex gap-4 items-center ">
                  <div
                    className={`flex items-center border w-full overflow-hidden border-gray-300 rounded-2xl focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
                      errors.taxIdentificationNumber
                        ? "ring-[var(--Do-Base)] ring-2 text-[var(--Do-Base)] "
                        : form?.taxIdentificationNumber
                        ? "text-black ring-[var(--Xanh-Base)] ring-2"
                        : "text-[var(--en-vu-300)]"
                    } "border-gray-300"
                }`}
                  >
                    <label className="text-3xl p-4 pr-0  rounded-s-lg ">
                      <Coins />
                    </label>
                    <input
                      className="p-4 w-full outline-none"
                      type="text"
                      onChange={handleInput}
                      name="taxIdentificationNumber"
                      placeholder={t("TaxIdentificationNumber")}
                      value={form?.taxIdentificationNumber || ""}
                    />
                  </div>
                  {checkBussinessLoading ? (
                    <div className="h-[20px] w-[88px]">
                      <ConfigProvider
                        theme={{
                          token: {
                            colorPrimary: "green", // Set the primary color to green
                          },
                        }}
                      >
                        <Spin size="medium">
                          <div style={contentStyle} />
                        </Spin>
                      </ConfigProvider>
                    </div>
                  ) : (
                    <button
                      className={`${
                        checkBussiness
                          ? "bg-[#dedede] text-[#7d7d7d]"
                          : "bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white"
                      }  px-5 py-2 rounded-xl `}
                      disabled={checkBussiness}
                      onClick={checkBussinessClick}
                    >
                      {checkBussiness ? (
                        <CheckFat weight="fill" className="text-xl" />
                      ) : (
                        t("Check")
                      )}
                    </button>
                  )}
                </div>
                {checkBussinessError && (
                  <p className="text-red-500 text-md font-medium mt-2 ">
                    {checkBussinessError}
                  </p>
                )}
              </div>
              <div>
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
                    errors.businessName
                      ? "ring-[var(--Do-Base)] ring-2 text-[var(--Do-Base)] "
                      : form?.businessName
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  } "border-gray-300"
                }`}
                >
                  <label className="text-3xl p-4 pr-0  rounded-s-lg ">
                    <Buildings />
                  </label>
                  <input
                    className="p-4 w-full rounded-lg outline-none"
                    type="text"
                    disabled={true}
                    name="businessName"
                    placeholder={t("BusinessName")}
                    value={form?.businessName || ""}
                  />
                </div>
                {errors.businessName && (
                  <p className="text-red-500 text-md font-medium mt-2">
                    {errors.businessName}
                  </p>
                )}
              </div>
              <div>
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
                    errors.businessAddress
                      ? "ring-[var(--Do-Base)] ring-2 text-[var(--Do-Base)] "
                      : form?.businessAddress
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  } "border-gray-300"
                }`}
                >
                  <label className="text-3xl p-4 pr-0  rounded-s-lg ">
                    <MapPin />
                  </label>
                  <input
                    className="p-4 w-full rounded-lg outline-none"
                    type="text"
                    disabled={true}
                    name="businessAddress"
                    placeholder={t("BusinessAddress")}
                    value={form?.businessAddress || ""}
                  />
                </div>
                {errors.businessAddress && (
                  <p className="text-red-500 text-md font-medium mt-2">
                    {errors.businessAddress}
                  </p>
                )}
              </div>
              <div>
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
                    errors.provinceId
                      ? "ring-[var(--Do-Base)] ring-2 text-[var(--Do-Base)] "
                      : form?.provinceId
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  } "border-gray-300"
                }`}
                >
                  <label className="text-3xl p-4 pr-0  rounded-s-lg ">
                    <Buildings />
                  </label>
                  <select
                    className="p-4 w-full rounded-lg outline-none"
                    type="text"
                    disabled={true}
                    name="provinceId"
                    placeholder="Province"
                    value={form?.provinceId || 0}
                  >
                    <option value={0}>{t("ChooseProvincesCode")}</option>
                    {provinces?.data?.map((province) => (
                      <option
                        value={province?.id}
                        className="flex justify-between"
                      >
                        <span>{province?.subDivisionName}</span>
                      </option>
                    ))}
                  </select>
                </div>
                {errors.provinceId && (
                  <p className="text-red-500 text-md font-medium mt-2">
                    {errors.provinceId}
                  </p>
                )}
              </div>

              <div>
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
                    errors.ocopCategoryId
                      ? "ring-[var(--Do-Base)] ring-2 text-[var(--Do-Base)] "
                      : form?.ocopCategoryId
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  } "border-gray-300"
                }`}
                >
                  <label className="text-3xl p-4 pr-0  rounded-s-lg ">
                    <Plant />
                  </label>
                  <select
                    className="p-4 w-full rounded-lg outline-none"
                    type="text"
                    onChange={handleInput}
                    name="ocopCategoryId"
                    placeholder="Business Name"
                    value={form?.ocopCategoryId || 0}
                  >
                    <option value={0}>{t("ChooseOcopCategory")}</option>
                    {ocopCategoriesList?.data?.items?.map((ocopCategory) => (
                      <option value={ocopCategory.id}>
                        {ocopCategory.type}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.ocopCategoryId && (
                  <p className="text-red-500 text-md font-medium mt-2">
                    {errors.ocopCategoryId}
                  </p>
                )}
              </div>
              <div>
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
                    errors.categoryId
                      ? "ring-[var(--Do-Base)] ring-2 text-[var(--Do-Base)] "
                      : form?.categoryId
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  } "border-gray-300"
                }`}
                >
                  <label className="text-3xl p-4 pr-0  rounded-s-lg ">
                    <Cherries />
                  </label>
                  <select
                    className="p-4 w-full rounded-lg outline-none"
                    type="text"
                    onChange={handleInput}
                    name="categoryId"
                    value={form?.categoryId || 0}
                    disabled={!ocopCategory}
                  >
                    <option value={0}>{t("ChooseProductCategory")}</option>
                    {ocopCategory?.categories?.map((category) => (
                      <option value={category?.id}>{category?.type}</option>
                    ))}
                  </select>
                </div>
                {errors.categoryId && (
                  <p className="text-red-500 text-md font-medium mt-2">
                    {errors.categoryId}
                  </p>
                )}
              </div>

              <div
                className={`flex items-center ${
                  errors.agree ? "text-red-500 " : "text-black"
                }`}
                onClick={() => {
                  setAgree(!agree);
                  if (agree === false) {
                    setErrors((prev) => ({ ...prev, agree: "" }));
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      agree: "You must agree to the terms and conditions.",
                    }));
                  }
                }}
              >
                <input
                  type="checkbox"
                  className="mr-2 cursor-pointer w-4 h-4"
                  checked={agree}
                  readOnly
                />
                <label className=" cursor-pointer">
                  {t("Iagreetothetermsandconditions")}
                </label>
              </div>

              <button
                className={`${
                  loading ||
                  (!checkBussiness
                    ? "bg-[#dedede] text-[#7d7d7d]"
                    : "bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)]")
                } w-full  text-white font-semibold text-xl rounded-2xl p-4 transition duration-200 relative `}
                onClick={handleSubmit}
                disabled={loading || !checkBussiness}
              >
                {loading ? (
                  <div className="loading-container h-[2rem]">
                    <div className="dot" /> <div className="dot" />
                    <div className="dot" />
                  </div>
                ) : (
                  t("SignUp")
                )}
              </button>
            </>
          )}
          <div className="h-[23px] justify-start items-center gap-4 inline-flex">
            <div className="grow shrink basis-0 h-[0px] border border-[#c6c9d8]"></div>
            <div className="text-[#848a9f] text-lg font-normal font-['Lexend']">
              {t("or")}
            </div>
            <div className="grow shrink basis-0 h-[0px] border border-[#c6c9d8]"></div>
          </div>
          <div className="flex justify-center">
            <p className="text-[#848a9f] mr-2">{t("Alreadyhaveanaccount")}?</p>{" "}
            <button
              onClick={() => {
                nav("/authorize/signin");
                setAction("Login");
              }}
              className="text-[var(--Xanh-Base)] font-semibold hover:text-[var(--Xanh-700)]"
            >
              {t("Login")}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-10 text-xl">
          <div>
            <p className="font-semibold text-xl text-[var(--Xanh-Base)] flex flex-col items-center">
              <div>
                <CheckCircle
                  size={136}
                  color="var(--Xanh-Base)"
                  weight="fill"
                />
              </div>
              <p className="mt-2">
                {t("Youraccounthasbeencreatesuccessfully")}.
              </p>
            </p>
          </div>
          <div className="flex flex-col items-center mt-10">
            <p className="font-medium text-lg text-[var(--en-vu-base)]">
              {t("Wehavealready")}{" "}
              <span className="text-[var(--Xanh-Base)] font-semibold">
                {t("sentanemail")}
              </span>{" "}
              {t("foryourpassword")}.
            </p>
            <p className="font-medium text-lg text-[var(--en-vu-base)]">
              {t("Loginandchangethepasswordagain")}.
            </p>
          </div>

          <button
            className={`mt-10 w-full bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white font-semibold text-xl rounded-2xl p-4 transition duration-200 relative `}
            onClick={handleToLogin}
          >
            {t("SignIn")}
          </button>
        </div>
      )}
    </div>
  );
}
