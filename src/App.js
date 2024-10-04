import "./App.scss";
import { Route, Router, Routes } from "react-router-dom";
import GuestRoutes from "./routes/GuestRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { AuthProvider } from "./context/AuthContext";
import { RoleProvider } from "./context/RoleContext";
import PartnerRoutes from "./routes/PartnerRoutes";
import { useContext, useEffect, useState } from "react";
import { SettingContext } from "./context/SettingContext";
import { ToastContainer,Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const { settingInfor, setSettingInfor } = useContext(SettingContext);
  const [theme, setTheme] = useState(settingInfor.theme);
  useEffect(() => {
    setTheme(settingInfor.theme);
  }, [settingInfor]);
  return (
    <div
      className="App text-[var(--text-main-color)] max-w-[100vw]"
      data-theme={theme}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        transition={Zoom}
      />
      <AuthProvider>
        <RoleProvider>
          <Routes>
            <Route path="/*" element={<GuestRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/partner/*" element={<PartnerRoutes />} />
          </Routes>
        </RoleProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
