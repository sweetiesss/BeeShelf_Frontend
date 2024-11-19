import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AxiosUser from "../../services/User";
import {
  Bank,
  Buildings,
  CheckCircle,
  Coins,
  CreditCard,
  EnvelopeSimple,
  IdentificationCard,
  Phone,
  User,
} from "@phosphor-icons/react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import Select from "react-select";

export default function SignUp({ setAction }) {
  const defaulform = {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    citizenIdentificationNumber: "",
    taxIdentificationNumber: "",
    businessName: "",
    bankName: "",
    bankAccountNumber: "",
    pictureLink:
      "https://th.bing.com/th/id/R.8e2c571ff125b3531705198a15d3103c?rik=muXZvm3dsoQqwg&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpng-user-icon-person-icon-png-people-person-user-icon-2240.png&ehk=MfHYkGonqy7I%2fGTKUAzUFpbYm9DhfXA9Q70oeFxWmH8%3d&risl=&pid=ImgRaw&r=0",
  };
  const [form, setForm] = useState(defaulform);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const { banksList } = useAuth();

  const [step, setStep] = useState(1);
  const nav = useNavigate();
  const { requestSignUp } = AxiosUser();
  const handleInput = (e) => {
    const value = e.target;
    setForm(() => ({ ...form, [value.name]: value.value }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (step === 1) {
      if (!form?.email || !/\S+@\S+\.\S+/.test(form.email)) {
        formErrors.email = "Please enter a valid email address.";
      }
      if (!form?.firstName) {
        formErrors.firstName = "First name is required.";
      }
      if (!form?.lastName) {
        formErrors.lastName = "Last name is required.";
      }
      if (!form?.phone || !/^\d{10,12}$/.test(form.phone)) {
        formErrors.phone = "Please enter a valid phone number.";
      }
    } else if (step === 2) {
      if (!form?.citizenIdentificationNumber) {
        formErrors.citizenIdentificationNumber =
          "Citizen Identification Number is required.";
      } else if (!/^\d{12,14}$/.test(form.citizenIdentificationNumber)) {
        formErrors.citizenIdentificationNumber =
          "Invalid format. It must be 12-14 digits.";
      }

      if (!form?.taxIdentificationNumber) {
        formErrors.taxIdentificationNumber =
          "Tax Identification Number is required.";
      } else if (!/^\d{10}$/.test(form.taxIdentificationNumber)) {
        formErrors.taxIdentificationNumber =
          "Invalid format. It must be 10 digits.";
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
      if (!form?.businessName) {
        formErrors.businessName = "Business Name is required.";
      }
      if (!agree) {
        formErrors.agree = "You must agree to the terms and conditions.";
      }
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };
  const handleToLogin = () => {
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
          password: "123456789",
        };
        setLoading(true);
        const result = await requestSignUp(submitFrom);
        console.log("????", result);
        if (result?.status === 400) {
          const resultError = result?.response?.data?.message;
          const resultErrors = result?.response?.data?.errors;
          console.log("check", resultErrors);
          console.log(Object.keys(resultErrors).length > 0);

          if (resultError) {
            Object.keys(defaulform).forEach((field) => {
              if (resultError.toLowerCase().includes(field.toLowerCase())) {
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
                } else if (field === "businessName") {
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
              } else if (fieldError === "businessName") {
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
  const loginByGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });
  console.log(banksList?.data?.data);

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
                    placeholder="First Name"
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
                    placeholder="Last Name"
                    value={form?.lastName || ""}
                  />
                </div>
              </div>
              <div>
                {errors.email && (
                  <p className="text-red-500 text-md font-medium">
                    {errors.email}
                  </p>
                )}
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
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
                    type="text"
                    onChange={handleInput}
                    name="email"
                    placeholder="Email"
                    value={form?.email || ""}
                  />
                </div>
              </div>
              <div>
                {errors.phone && (
                  <p className="text-red-500 text-md font-medium">
                    {errors.phone}
                  </p>
                )}
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
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
              </div>
              <button
                className={`w-full bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white font-semibold text-xl rounded-2xl p-4 transition duration-200 relative`}
                onClick={handleNext}
              >
                Next
              </button>
            </>
          ) : step === 2 ? (
            <>
              <div>
                {errors.citizenIdentificationNumber && (
                  <p className="text-red-500 text-md font-medium">
                    {errors.citizenIdentificationNumber}
                  </p>
                )}
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
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
                    className="p-4 w-full rounded-lg outline-none"
                    type="text"
                    onChange={handleInput}
                    name="citizenIdentificationNumber"
                    placeholder="Citizen Identification Number"
                    value={form?.citizenIdentificationNumber || ""}
                  />
                </div>
              </div>
              <div>
                {errors.taxIdentificationNumber && (
                  <p className="text-red-500 text-md font-medium">
                    {errors.taxIdentificationNumber}
                  </p>
                )}
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
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
                    className="p-4 w-full rounded-lg outline-none"
                    type="text"
                    onChange={handleInput}
                    name="taxIdentificationNumber"
                    placeholder="Tax Identification Number"
                    value={form?.taxIdentificationNumber || ""}
                  />
                </div>
              </div>
              <div>
                {errors.bankName && (
                  <p className="text-red-500 text-md font-medium">
                    {errors.bankName}
                  </p>
                )}
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
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
              </div>
              <div>
                {errors.bankAccountNumber && (
                  <p className="text-red-500 text-md font-medium">
                    {errors.bankAccountNumber}
                  </p>
                )}
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
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
                {errors.businessName && (
                  <p className="text-red-500 text-md font-medium">
                    {errors.businessName}
                  </p>
                )}
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
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
                  loading && "loading-button"
                } w-full bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white font-semibold text-xl rounded-2xl p-4 transition duration-200 relative `}
                onClick={handleSubmit}
                disabled={loading}
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
          <div
            className="h-16 px-[15px] py-5 rounded-[15px] border border-[#848a9f] justify-center items-center gap-4 inline-flex cursor-pointer hover:border-blue-500 hover:bg-blue-100 transition-all duration-200"
            onClick={loginByGoogle}
          >
            <div className="justify-start items-center gap-4 flex">
              <div className="w-8 h-8 relative">
                <img
                  src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                  className="w-full h-full object-contain"
                  alt="Google Icon"
                />
              </div>
              <div className="text-[#091540] text-lg font-normal font-['Lexend'] hover:text-blue-500 transition-colors duration-200">
                Continue with Google
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <p className="text-[#848a9f] mr-2">Already have an account?</p>{" "}
            <button
              onClick={() => setAction("Login")}
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
