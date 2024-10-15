import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../context/AuthContext";
import AxiosUser from "../../services/User";
export default function SignIn() {
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const buttonDivRef = useRef(null);
  const { setIsAuthenticated, setUserInfor,userInfor } =
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
      console.log(findData);
      if (findData===true) {
        nav("/" + userInfor?.roleName);
      } else {
        console.log(rememberMe);
        console.log("sign in",findData);
        
        // setError(findData);
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
    <div className="w-full max-w-lg p-4 mx-auto bg-white rounded-2xl overflow-hidden shadow-md sm:p-6 lg:p-8 relative">
      {loading && <div className="loading"></div>}
      <button
        className="absolute left-5 top-2 text-2xl font-bold text-gray-500 hover:text-gray-800"
        onClick={() => nav("/")}
      >
        {"<"}
      </button>
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-center">Sign In</h1>
      </header>
      {error !== "" && <div>{error}</div>}
      <div className="flex flex-col space-y-4">
        <div>
          <label>Email</label>
          <input
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            type="text"
            onChange={handleInput}
            name="email"
            placeholder="Email"
            value={form?.email || ""}
          />
        </div>
        <div>
          <div className="flex justify-between">
            <label>Password</label>
            <Link to="/forgotpassword">Forgot password?</Link>
          </div>
          <input
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            type="password"
            onChange={handleInput}
            name="password"
            placeholder="Password"
            value={form?.password || ""}
          />
        </div>
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
        </div>
        <button
          className={`${
            loading && "loading-button"
          } w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 transition duration-200 relative `}
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
          <Link to="/signup">Create account</Link>
        </div>
      </div>
    </div>
  );
}
