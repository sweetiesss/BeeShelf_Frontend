import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AxiosUser from "../../services/User";
import useAxios from "../../services/customizeAxios";

export default function SignUp() {
  const [form, setForm] = useState({});
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const { loading } = useAxios();
  const nav = useNavigate();
  const { requestSignUp } = AxiosUser();
  const handleInput = (e) => {
    const value = e.target;
    setForm(() => ({ ...form, [value.name]: value.value }));
  };

  const validateForm = () => {
    let formErrors = {};

    // Email validation
    if (!form?.email || !/\S+@\S+\.\S+/.test(form.email)) {
      formErrors.email = "Please enter a valid email address.";
    }

    // First name validation
    if (!form?.firstName) {
      formErrors.firstName = "First name is required.";
    }

    // Last name validation
    if (!form?.lastName) {
      formErrors.lastName = "Last name is required.";
    }

    // Phone validation (simple number validation)
    if (!form?.phone || !/^\d{10,12}$/.test(form.phone)) {
      formErrors.phone = "Please enter a valid phone number.";
    }

    // Password validation
    if (!form?.password || form.password.length < 6) {
      formErrors.password = "Password must be at least 6 characters.";
    }

    // Confirm password validation
    if (form?.password !== form?.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match.";
    }

    // Agreement validation
    if (!agree) {
      formErrors.agree = "You must agree to the terms and conditions.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const todayDate = new Date().toISOString();
      const submitFrom = {
        ...form,
        createDate: todayDate,
        pictureId: 1,
        roleName: "Partner",
      };
 

      const result = await requestSignUp(submitFrom);
      
      console.log(result);
    }
  };

  return (
    <div className="w-full max-w-lg p-4 mx-auto bg-white rounded-2xl shadow-md sm:p-6 lg:p-8 relative">
      <button
        className="absolute left-5 top-2 text-2xl font-bold text-gray-500 hover:text-gray-800"
        onClick={() => nav("/")}
      >
        {"<"}
      </button>
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-center">Sign Up</h1>
      </header>
      <div className="flex flex-col space-y-4">
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
        <div>
          <label>Password*</label>
          <input
            className={`border rounded-lg p-2 w-full mt-2 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            type="password"
            onChange={handleInput}
            name="password"
            placeholder="Password"
            value={form?.password || ""}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        <div>
          <label>Confirm Password*</label>
          <input
            className={`border rounded-lg p-2 w-full mt-2 ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            type="password"
            onChange={handleInput}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form?.confirmPassword || ""}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
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
        {errors.agree && <p className="text-red-500 text-sm">{errors.agree}</p>}
        <button
          className="w-full bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition duration-200"
          onClick={handleSubmit}
        >
          Sign Up
        </button>
        <div className="flex justify-center items-center flex-col">
          <div>Already have an account?</div>
          <Link to="/signin">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
