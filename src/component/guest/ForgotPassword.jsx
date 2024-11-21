import { CheckCircle, EnvelopeSimple, Password } from "@phosphor-icons/react";
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AxiosUser from "../../services/User";
import { jwtDecode } from "jwt-decode";

export default function ForgotPassword({ setAction }) {
  const [form, setForm] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState("");
  const [success, setSuccess] = useState(false);
  const nav = useNavigate();
  const location = useLocation();
  const { requestResetPassword, sendRequestResetPassword } = AxiosUser();

  // const token = new URLSearchParams(location.search).get("token");

  const params = new URLSearchParams(location.search);

  // Encode the token parameter
  const token = params.get("token");
  // params.set("token", encodeURIComponent(token));

  // Reconstruct the encoded URL
  const encodedUrl = `${params.toString().replace(/\+/g, "%2B")}`;
  const sentToken = encodedUrl.slice(6);

  const handleInput = (e) => {
    const value = e.target;
    setForm(() => ({ ...form, [value.name]: value.value }));
  };

  const handleSubmitResetPassword = async () => {
    try {
      setError({});
      setLoading(true);
      console.log({ sentToken, Password: form.newPassword });
      const submitForm = {
        token: token.replaceAll(" ", "+"),
        newPassword: form.newPassword,
      };
      const result = await requestResetPassword(submitForm);
      const errorMessage = result?.response?.data?.message;
      if (errorMessage) {
        if (errorMessage === "Invalid reset token.") {
          setError({
            field: "newPassword",
            message: "The request is expired.",
          });
        } else {
          setError({ field: "newPassword", message: errorMessage });
        }
      }
      if (result.status === 200) {
        nav("/authorize/signin");
        setError({});
        setSuccess(false);
        setForm({});
        setAction("Login");
      }
      console.log(result);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitSendRequestResetPassword = async () => {
    try {
      setLoading(true);
      const result = await sendRequestResetPassword(form.email);
      console.log(result);
      if (result.status === 200) {
        setSuccess(true);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  console.log(error);

  return (
    <div className="w-full p-4  overflow-hidden relative bg-white h-full">
      {!token ? (
        <>
          <header className="mb-4">
            <h1 className="text-4xl font-semibold">Forgot your Password?</h1>
            <p className="text-[var(--en-vu-600)] text-lg">
              Enter your email get a new password
            </p>
          </header>
          <div className="flex flex-col space-y-4">
            {/* <div>
          <input
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            type="text"
            onChange={handleInput}
            name="Email"
            placeholder="Email"
            value={form?.Email || ""}
          />
        </div> */}
            {!success ? (
              <>
                <div>
                  {error?.field === "email" && (
                    <p className="text-red-500 text-md font-medium">
                      {error?.message}
                    </p>
                  )}
                  <div
                    className={`flex items-center border border-gray-300 rounded-2xl mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
                      error?.field === "email"
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
                <button
                  className={`${
                    loading && "loading-button"
                  } w-full bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white font-semibold text-xl rounded-2xl p-4 transition duration-200 relative `}
                  onClick={handleSubmitSendRequestResetPassword}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="loading-container h-[2rem]">
                      <div className="dot" /> <div className="dot" />
                      <div className="dot" />
                    </div>
                  ) : (
                    "Get A New Password"
                  )}
                </button>
                <div
                  id="buttonDiv"
                  className="w-full rounded-lg overflow-hidden flex justify-center"
                ></div>
                <div className="flex justify-center">
                  <p className="text-[#848a9f] mr-2">
                    Already remember your password?
                  </p>
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
              </>
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
                      Your account has been create successfully.
                    </p>
                  </p>
                </div>
                <div className="flex flex-col items-center mt-8">
                  <p className="font-medium text-lg text-[var(--en-vu-base)] text-center">
                    We have already
                    <span className="text-[var(--Xanh-Base)] font-semibold mx-2">
                      sent an email
                    </span>
                    for your password.
                  </p>
                  <p>Check your email and change password again</p>
                </div>
                <button
                  className={`mt-8 w-full bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white font-semibold text-xl rounded-2xl p-4 transition duration-200 relative `}
                  onClick={() => {
                    nav("/authorize/signin");
                    setError({});
                    setSuccess(false);
                    setForm({});
                    setAction("Login");
                  }}
                >
                  To Login
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <header className="mb-4">
            <h1 className="text-4xl font-semibold">Reset Your Password</h1>
            <p className="text-[var(--en-vu-600)] text-lg">
              Enter your new password
            </p>
          </header>
          <div className="flex flex-col space-y-4">
            <div>
              {error.field === "newPassword" && (
                <p className="text-red-500 text-md font-medium">
                  {error?.message}
                </p>
              )}
              <div
                className={`flex items-center border border-gray-300 rounded-2xl mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
                  error.field === "newPassword"
                    ? "ring-[var(--Do-Base)] ring-2 text-[var(--Do-Base)] "
                    : form?.newPassword
                    ? "text-black ring-[var(--Xanh-Base)] ring-2"
                    : "text-[var(--en-vu-300)]"
                } "border-gray-300"
             }`}
              >
                <label className="text-3xl p-4 pr-0  rounded-s-lg ">
                  <Password weight="fill" />
                </label>
                <input
                  className="p-4 w-full rounded-lg outline-none"
                  type="password"
                  onChange={handleInput}
                  name="newPassword"
                  placeholder="Your New Password"
                  value={form?.newPassword || ""}
                />
              </div>
            </div>
            <button
              className={`${
                loading && "loading-button"
              } w-full bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white font-semibold text-xl rounded-2xl p-4 transition duration-200 relative `}
              onClick={handleSubmitResetPassword}
              disabled={loading}
            >
              {loading ? (
                <div className="loading-container h-[2rem]">
                  <div className="dot" /> <div className="dot" />
                  <div className="dot" />
                </div>
              ) : (
                "Get A New Password"
              )}
            </button>
            <div
              id="buttonDiv"
              className="w-full rounded-lg overflow-hidden flex justify-center"
            ></div>
            <div className="flex justify-center">
              <p className="text-[#848a9f] mr-2">
                Already remember your password?
              </p>
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
        </>
      )}
    </div>
  );
}
