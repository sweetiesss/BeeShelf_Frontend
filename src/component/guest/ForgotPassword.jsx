import { EnvelopeSimple } from "@phosphor-icons/react";
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function ForgotPassword({ setAction }) {
  const [form, setForm] = useState({});
  const nav = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const handleInput = (e) => {
    const value = e.target;
    setForm(() => ({ ...form, [value.name]: value.value }));
  };

  return (
    <div className="w-full p-4  overflow-hidden relative bg-white h-full">
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
        <div>
          {error && <p className="text-red-500 text-md font-medium">{error}</p>}
          <div
            className={`flex items-center border border-gray-300 rounded-2xl mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--Xanh-Base)]  focus-within:text-black  ${
              error
                ? "ring-[var(--Do-Base)] ring-2 text-[var(--Do-Base)] "
                : form?.Email
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
              name="Email"
              placeholder="Email"
              value={form?.Email || ""}
            />
          </div>
        </div>
        <button
                className={`${
                  loading && "loading-button"
                } w-full bg-[var(--Xanh-Base)] hover:bg-[var(--Xanh-700)] text-white font-semibold text-xl rounded-2xl p-4 transition duration-200 relative `}
                // onClick={handleSubmit}
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
            <p className="text-[#848a9f] mr-2">Already remember your password?</p>
            <button
              onClick={() => setAction("Login")}
              className="text-[var(--Xanh-Base)] font-semibold hover:text-[var(--Xanh-700)]"
            >
              Login
            </button>
          </div>
      </div>
    </div>
  );
}
