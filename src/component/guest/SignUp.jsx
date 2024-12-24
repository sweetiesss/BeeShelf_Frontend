import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AxiosUser from "../../services/User";
import {
  Bank,
  Buildings,
  Check,
  CheckCircle,
  CheckFat,
  Coins,
  CreditCard,
  DownloadSimple,
  EnvelopeSimple,
  IdentificationCard,
  Phone,
  User,
} from "@phosphor-icons/react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { ConfigProvider, Spin } from "antd";
import axios from "axios";

export default function SignUp({ setAction, baseForm }) {
  const defaulform = {
    email: baseForm?.email || "",
    // firstName: baseForm?.firstName || "",
    // lastName: baseForm?.lastName || "",
    fullName: baseForm?.fullName || "",
    phone: "",
    citizenIdentificationNumber: "",
    taxIdentificationNumber: "",
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
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [ocopCategory, setOcopCategory] = useState();
  const { banksList, ocopCategoriesList, provinces } = useAuth();
  const baseIdData = {
    address: "80 ĐƯỜNG CỘNG HN, PHƯỜNG 4, TÂN BÌNH, TP HỒ CHÍ MINH",
    address_entities: {
      province: "HỒ CHÍ MINH",
      district: "TÂN BÌNH",
      ward: "PHƯỜNG 04",
      street: "80 ĐƯỜNG CỘNG HN",
    },
    address_prob: "99.06",
    dob: "06/05/2006",
    dob_prob: "99.56",
    doe: "06/05/2031",
    doe_prob: "98.17",
    home: "PHƯỜNG 4, TÂN BÌNH, TP HỒ CHÍ MINH",
    home_prob: "99.01",
    id: "079306031544",
    id_prob: "98.02",
    name: "VI NGỌC NHI",
    name_prob: "98.58",
    nationality: "VIỆT NAM",
    nationality_prob: "99.27",
    number_of_name_lines: "1",
    overall_score: "99.18",
    sex: "NỮ",
    sex_prob: "99.15",
    type: "chip_front",
    type_new: "cccd_chip_front",
  };

  const [checkIdCard, setCheckIdCard] = useState(false);
  const [idCardHolder, setIdCardHolder] = useState();
  const [checkIdCardLoading, setCheckIdCardLoading] = useState(false);
  const [checkIdCardError, setCheckIdCardError] = useState(false);

  const [imageLink, setImageLink] = useState();
  const [imagePreview, setImagePreview] = useState("");

  const [checkBussiness, setCheckBussiness] = useState(false);
  const [checkBussinessLoading, setCheckBussinessLoading] = useState(false);
  const [checkBussinessError, setCheckBussinessError] = useState(false);

  const [step, setStep] = useState(3);
  const nav = useNavigate();
  const { requestSignUp } = AxiosUser();
  const { t } = useTranslation();
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
      // if (!form?.firstName) {
      //   formErrors.firstName = "First name is required.";
      // }
      // if (!form?.lastName) {
      //   formErrors.lastName = "Last name is required.";
      // }
    } else if (step === 2) {
      if (!form?.email || !/\S+@\S+\.\S+/.test(form.email)) {
        formErrors.email = "Please enter a valid email address.";
      }
      if (!form?.phone || !/^\d{10,12}$/.test(form.phone)) {
        formErrors.phone = "Please enter a valid phone number.";
      }

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
        console.log("????", result);
        if (result?.status === 400 || result?.status === 404) {
          const resultError = result?.response?.data?.message;
          const resultErrors = result?.response?.data?.errors;
          console.log(resultError);

          console.log("check", resultErrors);

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
                  field === "citizenIdentificationNumber" ||
                  field === "taxIdentificationNumber" ||
                  field === "bankAccountNumber" ||
                  field === "bankName"
                ) {
                  setStep(2);
                } else if (
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
              //  setErrors((prev)=>({...prev,[field]:value}));
              const errorMessage = Array.isArray(value) ? value[0] : value;
              console.log(errorMessage);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCheckIdCard(false);
    setImageLink(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const checkIdCardImage = async () => {
    try {
      if (imageLink) {
        setCheckIdCardLoading(true);
        const formData = new FormData();

        formData.append("image", imageLink);
        formData.append("ContentType", imageLink.type || "image/jpeg");
        formData.append("ContentDisposition", "");
        formData.append("Length", imageLink.size);
        formData.append("Name", imageLink.name);
        formData.append("FileName", imageLink.name);

        if (imageLink.Headers) {
          formData.append("Headers", JSON.stringify(imageLink.Headers));
        }
        const response = await axios.post(
          "https://api.fpt.ai/vision/idr/vnm",
          formData,
          {
            headers: {
              "api-key": "hbeFAZkSFCDrvjmIFtwFr5FcutgTq52S", // Your API key
              "Content-Type": "multipart/form-data", // Specify the content type
            },
          }
        );
        console.log(response);
        if (response?.status == 200) {
          setCheckIdCard(true);
          const data = response?.data?.data[0];
          console.log("data", data);
          setIdCardHolder(data);
          setForm((prev) => ({ ...prev, fullName: data?.name }));
          setForm((prev) => ({
            ...prev,
            citizenIdentificationNumber: data?.id,
          }));
        } else {
          setCheckIdCardError(response?.response?.data?.errorMessage);
        }
      }
    } catch (e) {
      console.log(e);
      setCheckIdCardError(e?.response?.data?.errorMessage);
    } finally {
      setCheckIdCardLoading(false);
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
          setForm((prev) => ({
            ...prev,
            businessName: result?.data?.data?.internationalName,
          }));
          setCheckBussinessError();
        } else {
          setCheckBussinessError(result?.data?.desc);
        }
        console.log(result);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setCheckBussinessLoading(false);
    }
  };

  return (
    <div className="w-full p-4  overflow-hidden relative bg-white h-full">
      {loading && <div className="loading"></div>}
      <header className="mb-4">
        <h1 className="text-4xl font-semibold">Welcome to BeeShelf</h1>
        <p className="text-[var(--en-vu-600)] text-lg">
          Come on and create an account
        </p>
      </header>
      {!isSuccess && (
        <div className="grid grid-cols-3 gap-1 mt-[2rem]">
          <div
            className={`${
              step === 1 ? "bg-[var(--Xanh-Base)]" : "bg-slate-200"
            } ${
              step > 1 && "cursor-pointer bg-[var(--Xanh-200)]"
            } w-full  h-[0.5rem]`}
            onClick={() => step > 1 && setStep(1)}
          ></div>
          <div
            className={`${
              step === 2 ? "bg-[var(--Xanh-Base)]" : "bg-slate-200"
            } ${
              step > 2 && "cursor-pointer bg-[var(--Xanh-200)]"
            } w-full  h-[0.5rem]`}
            onClick={() => step > 2 && setStep(2)}
          ></div>
          <div
            className={`${
              step === 3 ? "bg-[var(--Xanh-Base)]" : "bg-slate-200"
            } w-full  h-[0.5rem]`}
          ></div>
        </div>
      )}
      {!isSuccess ? (
        <div className="flex flex-col space-y-5 mt-[2rem]">
          {step === 1 ? (
            <>
              <div>
                <div className="h-full ml-auto">
                  <label
                    htmlFor="file-upload"
                    className="block text-lg font-medium leading-6 "
                  >
                    <span className="text-red-500 text-xl">*</span>
                    {t("ID Recognition Image")}
                  </label>
                  <label htmlFor="file-upload" className="cursor-pointer ">
                    <div
                      className={`${
                        imagePreview
                          ? "background-setting-input justify-start  pl-2 gap-10"
                          : " justify-center"
                      } mt-2 relative flex  items-center rounded-xl border  border-dashed border-gray-400 min-h-[20vh] max-h-[25vh] border-hover py-5`}
                    >
                      <div
                        className={`text-center ${imagePreview && "hidden"} `}
                      >
                        <div className="mt-4 flex text-sm leading-6 ">
                          <p className="relative cursor-pointer rounded-md font-semibold  focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 ">
                            <div className="flex gap-4 items-center">
                              <span className="text-3xl">
                                <DownloadSimple />
                              </span>
                              <span className="span-hover">
                                {t("UploadAFilePNGJPGGIFUpTo10MB")}
                              </span>
                            </div>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only "
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </p>
                        </div>
                      </div>
                      {imagePreview && (
                        <>
                          <img
                            src={imagePreview}
                            className="rounded-xl relative  object-cover object-center max-h-[15rem] w-auto"
                          />
                          <button
                            className={` bottom-0 right-0 ${
                              checkIdCard
                                ? "bg-[#dedede] text-[#7d7d7d]"
                                : "bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white"
                            }  px-5 py-2 rounded-xl `}
                            disabled={checkIdCard}
                            onClick={checkIdCardImage}
                          >
                            {checkIdCardLoading ? (
                              <div className="h-[20px] w-[20px]">
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
                            ) : checkIdCard ? (
                              <CheckFat weight="fill" className="text-xl" />
                            ) : (
                              "Check"
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </label>
                </div>
                {checkIdCardError && (
                  <p className="text-red-500 text-md font-medium">
                    {checkIdCardError}
                  </p>
                )}
              </div>
              <div>
                <div
                  className={`flex items-center border cursor-not-allowed border-gray-300 rounded-2xl focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
                    errors.citizenIdentificationNumber
                      ? "ring-[var(--Do-Base)] ring-2 text-[var(--Do-Base)] "
                      : form?.citizenIdentificationNumber
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  } "border-gray-300"
                }`}
                >
                  <label className="text-3xl p-4 pr-0  rounded-s-lg ">
                    <IdentificationCard />
                  </label>
                  <input
                    className="p-4 w-full rounded-lg outline-none cursor-not-allowed"
                    type="text"
                    disabled={true}
                    name="citizenIdentificationNumber"
                    placeholder="Citizen Identification Number"
                    value={form?.citizenIdentificationNumber || ""}
                  />
                </div>
                {errors.citizenIdentificationNumber && (
                  <p className="text-red-500 text-md font-medium mt-2">
                    {errors.citizenIdentificationNumber}
                  </p>
                )}
              </div>
              <div>
                <div
                  className={`flex items-center cursor-not-allowed border border-gray-300 rounded-2xl mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
                    errors.fullName
                      ? "ring-[var(--Do-Base)] ring-2 text-[var(--Do-Base)] "
                      : form?.fullName
                      ? "text-black ring-[var(--Xanh-Base)] ring-2"
                      : "text-[var(--en-vu-300)]"
                  } "border-gray-300"
                }`}
                >
                  <label className="text-3xl p-4 pr-0  rounded-s-lg ">
                    <User />
                  </label>
                  <input
                    className="p-4 w-full rounded-lg outline-none cursor-not-allowed"
                    type="text"
                    disabled={true}
                    name="fullName"
                    placeholder="Full Name"
                    value={form?.fullName || ""}
                  />
                </div>
              </div>
              {/* <div>
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
                    placeholder="Last Name"
                    value={form?.lastName || ""}
                  />
                </div>
              </div> */}

              <button
                className={`w-full ${
                  checkIdCard
                    ? "bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white"
                    : "bg-[#dedede] text-[#7d7d7d]"
                } border-2 font-semibold text-xl rounded-2xl p-4 transition duration-200 relative`}
                onClick={handleNext}
                disabled={!checkIdCard}
              >
                Next
              </button>
            </>
          ) : step === 2 ? (
            <>
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
                    placeholder="Email"
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
                    placeholder="Phone Number"
                    value={form?.phone || ""}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-md font-medium mt-2">
                    {errors.phone}
                  </p>
                )}
              </div>
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
                    placeholder="Bank Name"
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
                    placeholder="Bank Account Number"
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
                className={`w-full bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white font-semibold text-xl rounded-2xl p-4 transition duration-200 relative`}
                onClick={handleNext}
              >
                Next
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
                      placeholder="Tax Identification Number"
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
                        checkIdCard
                          ? "bg-[#dedede] text-[#7d7d7d]"
                          : "bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white"
                      }  px-5 py-2 rounded-xl `}
                      disabled={checkBussiness}
                      onClick={checkBussinessClick}
                    >
                      {checkBussiness ? (
                        <CheckFat weight="fill" className="text-xl" />
                      ) : (
                        "Check"
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
                    onChange={handleInput}
                    name="businessName"
                    placeholder="Business Name"
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
                    errors.ocopCategoryId
                      ? "ring-[var(--Do-Base)] ring-2 text-[var(--Do-Base)] "
                      : form?.ocopCategoryId
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
                    onChange={handleInput}
                    name="ocopCategoryId"
                    placeholder="Business Name"
                    value={form?.ocopCategoryId || 0}
                  >
                    <option value={0}>Choose Ocop Category</option>
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
                    <Buildings />
                  </label>
                  <select
                    className="p-4 w-full rounded-lg outline-none"
                    type="text"
                    onChange={handleInput}
                    name="categoryId"
                    placeholder="Business Name"
                    value={form?.categoryId || 0}
                    disabled={!ocopCategory}
                  >
                    <option value={0}>Choose category</option>
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
                    onChange={handleInput}
                    name="provinceId"
                    placeholder="Province"
                    value={form?.provinceId || 0}
                  >
                    <option value={0}>Choose provinces code</option>
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
                  I agree to the terms and conditions
                </label>
              </div>

              <button
                className={`${
                  loading || (!checkBussiness && "bg-[#dedede] text-[#7d7d7d]")
                } w-full bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white font-semibold text-xl rounded-2xl p-4 transition duration-200 relative `}
                onClick={handleSubmit}
                disabled={loading || !checkBussiness}
              >
                {loading ? (
                  <div className="loading-container h-[2rem]">
                    <div className="dot" /> <div className="dot" />
                    <div className="dot" />
                  </div>
                ) : (
                  "Sign Up"
                )}
              </button>
            </>
          )}
          <div className="h-[23px] justify-start items-center gap-4 inline-flex">
            <div className="grow shrink basis-0 h-[0px] border border-[#c6c9d8]"></div>
            <div className="text-[#848a9f] text-lg font-normal font-['Lexend']">
              or
            </div>
            <div className="grow shrink basis-0 h-[0px] border border-[#c6c9d8]"></div>
          </div>
          {/* <div id="buttonDiv" className="bg-black w-full h-fit"></div> */}
          {/* <GoogleLogin
          onSuccess={(token) => {
            const decode=jwtDecode(token?.credential)
            console.log(decode);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
          useOneTap
          size="large"
          text="continue_with"
          auto_select={false}
        /> */}

          <div className="flex justify-center">
            <p className="text-[#848a9f] mr-2">Already have an account?</p>{" "}
            <button
              onClick={() => {
                nav("/authorize/signin");
                setAction("Login");
              }}
              className="text-[var(--Xanh-Base)] font-semibold hover:text-[var(--Xanh-700)]"
            >
              Login
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
              <p className="mt-2">Your account has been create successfully.</p>
            </p>
          </div>
          <div className="flex flex-col items-center mt-10">
            <p className="font-medium text-lg text-[var(--en-vu-base)]">
              We have already{" "}
              <span className="text-[var(--Xanh-Base)] font-semibold">
                sent an email
              </span>{" "}
              for your password.
            </p>
            <p className="font-medium text-lg text-[var(--en-vu-base)]">
              Login and change the password again.
            </p>
          </div>

          <button
            className={`mt-10 w-full bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white font-semibold text-xl rounded-2xl p-4 transition duration-200 relative `}
            onClick={handleToLogin}
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
}
