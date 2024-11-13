import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AxiosUser from "../../services/User";

export default function SignUp({ setAction }) {
  const [form, setForm] = useState({});
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
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
        console.log(result);
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

  return (
    <div className="w-full max-w-lg p-4 mx-auto bg-white rounded-2xl shadow-md sm:p-6 lg:p-8 relative">
      {loading && <div className="loading"></div>}
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-center">Sign Up</h1>
      </header>

      <div className="grid grid-cols-3 gap-1">
        <div className={`${step===1?"bg-green-400":"bg-slate-200"} w-full  h-[0.5rem]`} onClick={()=>step>1&&setStep(1)}></div>
        <div className={`${step===2?"bg-green-400":"bg-slate-200"} w-full  h-[0.5rem]`} onClick={()=>step>2&&setStep(2)}></div>
        <div className={`${step===3?"bg-green-400":"bg-slate-200"} w-full  h-[0.5rem]`} ></div>
      </div>
      {!isSuccess ? (
        <div className="flex flex-col space-y-4">
          {step === 1 ? (
            <>
              <div>
                <label>Email*</label>
                <input
                  className={`border rounded-lg p-2 w-full mt-2 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  onChange={handleInput}
                  name="email"
                  placeholder="Email"
                  value={form?.email || ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div>
                <label>First Name*</label>
                <input
                  className={`border rounded-lg p-2 w-full mt-2 ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  onChange={handleInput}
                  name="firstName"
                  placeholder="First Name"
                  value={form?.firstName || ""}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label>Last Name*</label>
                <input
                  className={`border rounded-lg p-2 w-full mt-2 ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  onChange={handleInput}
                  name="lastName"
                  placeholder="Last Name"
                  value={form?.lastName || ""}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
              <div>
                <label>Phone Number*</label>
                <input
                  className={`border rounded-lg p-2 w-full mt-2 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  onChange={handleInput}
                  name="phone"
                  placeholder="Phone Number"
                  value={form?.phone || ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>
              <button
                className={` w-full bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition duration-200`}
                onClick={handleNext}
              >
                Next
              </button>
            </>
          ) : step === 2 ? (
            <>
              <div>
                <label>Citizen Identification Number*</label>
                <input
                  className={`border rounded-lg p-2 w-full mt-2 ${
                    errors.citizenIdentificationNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  onChange={handleInput}
                  name="citizenIdentificationNumber"
                  placeholder="Citizen Identification Number"
                  value={form?.citizenIdentificationNumber || ""}
                />
                {errors.citizenIdentificationNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.citizenIdentificationNumber}
                  </p>
                )}
              </div>
              <div>
                <label>Tax Identification Number*</label>
                <input
                  className={`border rounded-lg p-2 w-full mt-2 ${
                    errors.taxIdentificationNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  onChange={handleInput}
                  name="taxIdentificationNumber"
                  placeholder="Tax Identification Number"
                  value={form?.taxIdentificationNumber || ""}
                />
                {errors.taxIdentificationNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.taxIdentificationNumber}
                  </p>
                )}
              </div>
              <div>
                <label>Bank Name*</label>
                <input
                  className={`border rounded-lg p-2 w-full mt-2 ${
                    errors.bankName ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  onChange={handleInput}
                  name="bankName"
                  placeholder="Bank Name"
                  value={form?.bankName || ""}
                />
                {errors.bankName && (
                  <p className="text-red-500 text-sm">{errors.bankName}</p>
                )}
              </div>
              <div>
                <label>Bank Account Number*</label>
                <input
                  className={`border rounded-lg p-2 w-full mt-2 ${
                    errors.bankAccountNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  type="text"
                  onChange={handleInput}
                  name="bankAccountNumber"
                  placeholder="Bank Account Number"
                  value={form?.bankAccountNumber || ""}
                />
                {errors.bankAccountNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.bankAccountNumber}
                  </p>
                )}
              </div>
              <button
                className={` w-full bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition duration-200`}
                onClick={handleNext}
              >
                Next
              </button>
            </>
          ) : (
            <>
              <div>
                <label>Business Name*</label>
                <input
                  className={`border rounded-lg p-2 w-full mt-2 ${
                    errors.businessName ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  onChange={handleInput}
                  name="businessName"
                  placeholder="Business Name"
                  value={form?.businessName || ""}
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm">{errors.businessName}</p>
                )}
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                />
                <label
                  className="text-sm text-gray-600 cursor-pointer"
                  onClick={() => setAgree(!agree)}
                >
                  I agree to the terms and conditions
                </label>
              </div>
              {errors.agree && (
                <p className="text-red-500 text-sm">{errors.agree}</p>
              )}
              <button
                className={`${
                  loading && "loading-button"
                }  w-full bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition duration-200`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-container">
                    <div className="dot" /> <div className="dot" />{" "}
                    <div className="dot" />
                  </div>
                ) : (
                  "Sign Up"
                )}
              </button>
            </>
          )}

          <div className="flex justify-center items-center flex-col">
            <div>Already have an account?</div>
            <button onClick={handleToLogin}>Sign In</button>
          </div>
        </div>
      ) : (
        <div>
          <p>Your account has been create successfully.</p>
          <p>We have already sent an email for your password.</p>
          <p>Login and change the password again.</p>
          <button onClick={handleToLogin}>Sign In</button>
        </div>
      )}
    </div>
  );
}
