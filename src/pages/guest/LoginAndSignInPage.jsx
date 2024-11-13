import { useEffect, useState } from "react";
import SignIn from "../../component/guest/SignIn";
import SignUp from "../../component/guest/SignUp";
import ForgotPassword from "../../component/guest/ForgotPassword";

export default function LoginAndSignInPage() {
  const [action, setAction] = useState("Login");


  return (
    <div className="flex h-screen w-screen justify-between items-center  bg-gray-100">
      {/* Sidebar or background */}
      <div className="bg-blue-500 w-[60%] h-full flex items-center justify-center text-white">
        <h1 className="text-4xl font-bold">Brand</h1>
      </div>

      {/* Animated Content */}
      <div className="relative w-[40%] h-full overflow-hidden bg-white">
        {/* ForgotPassword */}
        <div
          className={`p-20 absolute w-full h-full transform transition-transform duration-500 flex flex-col items-center justify-center ${
            action === "Forgotpassword"
              ? "translate-y-0"
              : action === "Login"
              ? "-translate-y-full"
              : "-translate-y-[200%]"
          }`}
        >
          <ForgotPassword setAction={setAction} />
        </div>

        {/* SignIn */}
        <div
          className={`p-20 absolute w-full h-full transform transition-transform duration-500 flex flex-col items-center justify-center ${
            action === "Login"
              ? "translate-y-0"
              : action === "Forgotpassword"
              ? "translate-y-full"
              : "-translate-y-full"
          }`}
        >
          <SignIn setAction={setAction} action={action} />
        </div>

        {/* SignUp */}
        <div
          className={`p-20 absolute w-full h-full transform transition-transform duration-500 flex flex-col items-center justify-center ${
            action === "SignUp"
              ? "translate-y-0"
              : action === "Login"
              ? "translate-y-full"
              : "translate-y-[200%]"
          }`}
        >
          <SignUp setAction={setAction} />
        </div>
      </div>
    </div>
  );
}
