import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AxiosUser from "../../services/User";

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
    categoryId: null,
    ocopCategoryId: null,
    provinceId: 1,
    pictureLink:
      "https://th.bing.com/th/id/R.8e2c571ff125b3531705198a15d3103c?rik=muXZvm3dsoQqwg&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpng-user-icon-person-icon-png-people-person-user-icon-2240.png&ehk=MfHYkGonqy7I%2fGTKUAzUFpbYm9DhfXA9Q70oeFxWmH8%3d&risl=&pid=ImgRaw&r=0",
  };
  const [form, setForm] = useState(defaulform);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [ocopCategory, setOcopCategory] = useState();
  const { banksList, ocopCategoriesList } = useAuth();

  const [step, setStep] = useState(1);
  const nav = useNavigate();
  const { requestSignUp } = AxiosUser();
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(() => ({ ...form, [name]: value }));
    if (name === "ocopCategoryId" && value != null) {
      const ocopCategoryFind = ocopCategoriesList?.data?.items?.find(
        (item) => item.id == value
      );
      setOcopCategory(ocopCategoryFind);
    }
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
  const loginByGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });
  console.log(ocopCategory);

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
                    type="email"
                    onChange={handleInput}
                    name="email"
                    placeholder="Email"
                    value={form?.email || ""}
                  />
                </div>
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
              <div>
                {errors.ocopCategoryId && (
                  <p className="text-red-500 text-md font-medium">
                    {errors.ocopCategoryId}
                  </p>
                )}
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
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
                    value={form?.ocopCategoryId || ""}
                  >
                    <option value={null}>Choose Ocop Category</option>
                    {ocopCategoriesList?.data?.items?.map((ocopCategory) => (
                      <option value={ocopCategory.id}>
                        {ocopCategory.type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                {errors.categoryId && (
                  <p className="text-red-500 text-md font-medium">
                    {errors.categoryId}
                  </p>
                )}
                <div
                  className={`flex items-center border border-gray-300 rounded-2xl mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
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
                    value={form?.categoryId || ""}
                    disabled={!ocopCategory}
                  >
                    <option>Choose category</option>
                    {ocopCategory?.categories?.map((category) => (
                      <option value={category?.id}>{category?.type}</option>
                    ))}
                  </select>
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
