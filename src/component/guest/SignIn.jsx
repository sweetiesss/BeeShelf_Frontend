import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import AxiosUser from "../../services/User";
import { EnvelopeSimple, LockKeyOpen } from "@phosphor-icons/react";
import { useGoogleLogin } from "@react-oauth/google";
import ggIcon from "../../assets/img/googleIcon.png";
import axios from "axios";
import SpinnerLoading from "../shared/Loading";
export default function SignIn({ action, setAction }) {
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const { handleLogin, setIsAuthenticated } = useContext(AuthContext);
  const { loginByEmailPassword } = AxiosUser();

  const handleInput = (e) => {
    const value = e.target;
    setForm(() => ({ ...form, [value.name]: value.value }));
  };

  const checkLogin = async () => {
    try {
      setLoading(true);
      const checkValidate = validateForm();
      if (checkValidate) {
        const findData = await loginByEmailPassword(form);
        console.log("here", findData);
        if (findData) {
          if (findData?.status === 200) {
            console.log("userInfor", findData?.data);
            handleLogin(findData?.data, rememberMe);
            nav("/" + findData?.data?.roleName);
            // } else {
            //   console.log(rememberMe);
            //   console.log("sign in", findData);
            //   setErrors((prev) => ({ ...prev, others: "not found" }));
            // }
          } else {
            console.log("here2");

            console.log(findData?.response?.data?.message);

            const resultError = findData?.response?.data?.message;
            console.log(resultError);
            if (
              resultError.replace(/\s+/g, "").toLowerCase().includes("password")
            ) {
              setErrors((prev) => ({ ...prev, password: resultError }));
            }
            if (
              resultError.replace(/\s+/g, "").toLowerCase().includes("email")
            ) {
              setErrors((prev) => ({ ...prev, email: resultError }));
            }
          }
        }
      }
    } catch (ex) {
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let formErrors = {};

    if (!form?.email || !/\S+@\S+\.\S+/.test(form.email)) {
      formErrors.email = "Please enter a valid email address.";
    }
    if (!form?.password) {
      formErrors.password = "Please enter password.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const loginByGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const accessToken = tokenResponse.access_token;

        // Fetch user info from Google's OAuth2 API
        const userInfoResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (userInfoResponse?.status === 200) {
          const userInfo = userInfoResponse.data;
          console.log("User response:", userInfoResponse);
          console.log("User Info:", userInfo);
          console.log("User Email:", userInfo.email);
          try {
            const checkLogin = await axios.post(
              "https://beeshelfgateway.azurewebsites.net/gateway/auth/login",
              {
                email: userInfo.email,
                password:
                  "p7$G3@L9k#2N1%yZxT!m8&jQ4bV6*rW$H2eD^fK9@xYzP3$cR&1b*",
              }
            );
            console.log(checkLogin);

            if (checkLogin && checkLogin?.status === 200) {
              if (checkLogin?.data && checkLogin?.data.length > 0) {
                const successDataToken = checkLogin?.data;
                const objectCheck = jwtDecode(successDataToken);
                console.log("check", successDataToken);

                setIsAuthenticated(successDataToken);
                if (
                  objectCheck &&
                  objectCheck?.[
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                  ] === "Partner"
                ) {
                  const getAccount = await axios.get(
                    "https://beeshelfgateway.azurewebsites.net/gateway/partner/get-partner/" +
                      userInfo.email,
                    {
                      headers: { Authorization: `Bearer ${successDataToken}` },
                    }
                  );
                  console.log(getAccount);
                  if (
                    getAccount &&
                    getAccount?.status === 200 &&
                    getAccount?.data
                  ) {
                    handleLogin(getAccount?.data);
                    nav("/" + getAccount?.data?.roleName);
                  }
                }
              }
            }
          } catch (loginError) {
            if (
              loginError?.status === 404 &&
              loginError?.response?.data?.message === "User email not found."
            ) {
              const submitForm = {
                email: userInfo?.email,
                firstName: userInfo?.given_name,
                lastName: userInfo?.family_name,
                phone: "0000000000",
                citizenIdentificationNumber: "000000000000",
                taxIdentificationNumber: "000000000000",
                businessName: "000000000000",
                bankName: "000000000000",
                bankAccountNumber: "000000000000",
                categoryId: 1,
                ocopCategoryId: 1,
                provinceId: 1,
                pictureLink: userInfo?.picture,
              };
              const createAccount = await axios.post(
                "https://beeshelfgateway.azurewebsites.net/gateway/auth/sign-up",

                submitForm
              );
              console.log("createAccount", createAccount);
              try {
                const checkLogin = await axios.post(
                  "https://beeshelfgateway.azurewebsites.net/gateway/auth/login",
                  {
                    email: userInfo.email,
                    password:
                      "p7$G3@L9k#2N1%yZxT!m8&jQ4bV6*rW$H2eD^fK9@xYzP3$cR&1b*",
                  }
                );
                console.log(checkLogin);

                if (checkLogin && checkLogin?.status === 200) {
                  if (checkLogin?.data && checkLogin?.data.length > 0) {
                    const successDataToken = checkLogin?.data;
                    const objectCheck = jwtDecode(successDataToken);
                    console.log("check", successDataToken);

                    setIsAuthenticated(successDataToken);
                    if (
                      objectCheck &&
                      objectCheck?.[
                        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                      ] === "Partner"
                    ) {
                      const getAccount = await axios.get(
                        "https://beeshelfgateway.azurewebsites.net/gateway/partner/get-partner/" +
                          userInfo.email,
                        {
                          headers: {
                            Authorization: `Bearer ${successDataToken}`,
                          },
                        }
                      );
                      console.log(getAccount);
                      if (
                        getAccount &&
                        getAccount?.status === 200 &&
                        getAccount?.data
                      ) {
                        handleLogin(getAccount?.data);
                        nav("/" + getAccount?.data?.roleName);
                      }
                    }
                  }
                }
              } catch (e) {
                console.log(e);
              }
            }
            console.log("checkLogin", checkLogin);
          }
        }

        // Perform additional actions here, like saving to state or backend
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      console.log("Google Login Failed");
    },
  });
  return (
    <div className="w-full p-4  overflow-hidden relative bg-white h-full">
      {loading ? (
        <div className="mt-[40%]">
          <SpinnerLoading />
        </div>
      ) : (
        <>
          <header className="mb-4">
            <h1 className="text-4xl font-semibold">Welcome back</h1>
            <p className="text-[var(--en-vu-600)] text-lg">
              Enter your email and password to login
            </p>
          </header>
          <div className="flex flex-col space-y-5 mt-[4rem]">
            <div>
              {errors?.email && (
                <p className="text-red-500 text-lg font-medium">
                  {errors?.email}
                </p>
              )}
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
                  type="email"
                  onChange={handleInput}
                  name="email"
                  placeholder="Email"
                  value={form?.email || ""}
                />
              </div>
            </div>
            <div>
              {errors?.password && (
                <p className="text-red-500 text-lg font-medium">
                  {errors?.password}
                </p>
              )}
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
                <label className=" cursor-pointer text-black">
                  Remember me
                </label>
              </div>
              <button
                onClick={() => {
                  nav("/authorize/forgot-password");
                  setAction("Forgotpassword");
                }}
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
                onClick={() => {
                  nav("/authorize/signup");
                  setAction("SignUp");
                }}
                className="text-[var(--Xanh-Base)] font-semibold hover:text-[var(--Xanh-700)]"
              >
                Create account
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
