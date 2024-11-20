import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import AxiosUser from "../../services/User";
import { EnvelopeSimple, LockKeyOpen } from "@phosphor-icons/react";
import { useGoogleLogin } from "@react-oauth/google";
import ggIcon from "../../assets/img/googleIcon.png";
export default function SignIn({ action, setAction }) {
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const { setIsAuthenticated, setUserInfor, handleLogin } =
    useContext(AuthContext);
  const { loginByEmailPassword } = AxiosUser();

  const handleInput = (e) => {
    const value = e.target;
    setForm(() => ({ ...form, [value.name]: value.value }));
  };

  const checkLogin = async () => {
    try {
      setLoading(true);
      const findData = await loginByEmailPassword(form);
      console.log("here", findData);
      if (findData && typeof findData === "object") {
        console.log("userInfor", findData);
        handleLogin(findData, rememberMe);
        nav("/" + findData?.roleName);
      } else {
        console.log(rememberMe);
        console.log("sign in", findData);
        setError(findData);
      }
    } catch (ex) {
    } finally {
      setLoading(false);
    }
  };

  const loginByGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });
  return (
    <div className="w-full p-4  overflow-hidden relative bg-white h-full">
      {loading && <div className="loading"></div>}
      <header className="mb-4">
        <h1 className="text-4xl font-semibold">Welcome back</h1>
        <p className="text-[var(--en-vu-600)] text-lg">
          Enter your email and password to login
        </p>
      </header>
      {error !== "" && <div>{error}</div>}
      <div className="flex flex-col space-y-5 mt-[4rem]">
        <div>
          <div
            className={`flex items-center border border-gray-300 rounded-2xl  mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black ${
              form?.email
                ? "text-black ring-[var(--Xanh-Base)] ring-2"
                : "text-[var(--en-vu-300)]"
            }`}
          >
            <label className="text-3xl p-4 pr-0  rounded-s-lg ">
              <EnvelopeSimple weight="fill" />
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
          <div className="flex justify-between"></div>
          <div
            className={`flex items-center border border-gray-300 rounded-2xl  mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black ${
              form?.password
                ? "text-black ring-[var(--Xanh-Base)] ring-2"
                : "text-[var(--en-vu-300)]"
            }`}
          >
            <label className="text-3xl p-4 pr-0  rounded-s-lg ">
              <LockKeyOpen weight="fill" />
            </label>
            <input
              className="p-4 w-full rounded-lg outline-none"
              type="password"
              onChange={handleInput}
              name="password"
              placeholder="Password"
              value={form?.password || ""}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div
            className="flex items-center"
            onClick={() => setRememberMe((prev) => !prev)}
          >
            <input
              type="checkbox"
              className="mr-2 cursor-pointer w-4 h-4"
              name="RememberMe"
              checked={rememberMe}
              readOnly
            />
            <label className=" cursor-pointer text-black">Remember me</label>
          </div>
          <button
            onClick={() => {nav("/authorize/forgot-password"); setAction("Forgotpassword")}}
            className="text-[var(--Xanh-Base)] font-semibold hover:text-[var(--Xanh-700)]"
          >
            Forgot password?
          </button>
        </div>
        <button
          className={`${
            loading && "loading-button"
          } w-full bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white font-semibold text-xl rounded-2xl p-4 transition duration-200 relative `}
          onClick={checkLogin}
          disabled={loading}
        >
          {loading ? (
            <div className="loading-container h-[2rem]">
              <div className="dot" /> <div className="dot" />
              <div className="dot" />
            </div>
          ) : (
            "Login"
          )}
        </button>
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
          <p className="text-[#848a9f] mr-2">Don’t have an account?</p>{" "}
          <button
            onClick={() => {nav("/authorize/signup"); setAction("SignUp")}}
            className="text-[var(--Xanh-Base)] font-semibold hover:text-[var(--Xanh-700)]"
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}
