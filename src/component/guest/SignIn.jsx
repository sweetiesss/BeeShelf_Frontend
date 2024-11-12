import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import AxiosUser from "../../services/User";
import { EnvelopeSimple, LockKeyOpen } from "@phosphor-icons/react";
export default function SignIn({setAction}) {
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const buttonDivRef = useRef(null);
  const { setIsAuthenticated, setUserInfor, handleLogin} =
    useContext(AuthContext);
  const { loginByEmailPassword } = AxiosUser();

  const googleClientID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const handleInput = (e) => {
    const value = e.target;
    setForm(() => ({ ...form, [value.name]: value.value }));
  };

  const checkLogin = async () => {
    try {
      setLoading(true);
      const findData = await loginByEmailPassword(form);
      console.log("here", findData);
      if (findData&&typeof findData ==="object") {
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

  useEffect(() => {
    /* global google */
    const runningGoogle = async () => {
      try {
        google.accounts.id.initialize({
          client_id: googleClientID,
          callback: handleCredentialResponse,
        });

        google.accounts.id.renderButton(document.getElementById("buttonDiv"), {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          width: "400px",
        });

        google.accounts.id.prompt(); // Display the One Tap prompt
      } catch {
        console.log("running google api.");
      }
    };
    runningGoogle();
  }, []);

  const handleCredentialResponse = (response) => {
    const userObject = jwtDecode(response.credential);
    setUserInfor(userObject);
    setIsAuthenticated(true);
    nav("/partner/dashboard");
  };

  return (
    <div className="w-full max-w-xl p-4 mx-auto rounded-2xl overflow-hidden sm:p-6 lg:p-8 relative bg-white">
      {loading && <div className="loading"></div>}
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-center">Sign In</h1>
      </header>
      {error !== "" && <div>{error}</div>}
      <div className="flex flex-col space-y-4">
        <div>
          <label>Email</label>
          <div className="flex items-center border border-gray-300 rounded-lg  mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 text-[#9ca3b2] focus-within:text-black ">
            <label className=" text-3xl p-4 border-r-2 border rounded-s-lg">
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
          <div className="flex justify-between">
            <label>Password</label>
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg  mt-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 text-[#9ca3b2] focus-within:text-black ">
          <label className="text-3xl p-4 border-r-2 border rounded-s-lg">
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
              className="mr-2 cursor-pointer"
              name="RememberMe"
              checked={rememberMe}
              readOnly
            />
            <label className="text-sm text-gray-600 cursor-pointer">
              Remember me
            </label>
          </div>{" "}
          <button onClick={()=>setAction("Forgotpassword")}>Forgot password?</button>
        </div>
        <button
          className={`${
            loading && "loading-button"
          } w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-4 transition duration-200 relative `}
          onClick={checkLogin}
          disabled={loading}
        >
          {loading ? (
            <div className="loading-container">
              <div className="dot" /> <div className="dot" />{" "}
              <div className="dot" />
            </div>
          ) : (
            "Login"
          )}
        </button>
        <div
          id="buttonDiv"
          className="w-full rounded-lg overflow-hidden flex justify-center"
          ref={buttonDivRef}
        ></div>
        <div className="flex justify-center">
          <button onClick={()=>setAction("SignUp")}>Create account</button>
        </div>
      </div>
    </div>
  );
}
