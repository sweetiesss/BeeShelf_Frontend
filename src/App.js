import "./App.scss";
import { Route, Router, Routes } from "react-router-dom";
import GuestRoutes from "./routes/GuestRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { AuthProvider } from "./context/AuthContext";

import PartnerRoutes from "./routes/PartnerRoutes";
import { useContext, useEffect, useState } from "react";
import { SettingContext } from "./context/SettingContext";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RoleProvider from "./context/RoleProvider";
import InventoryPage from "./pages/partner/InventoryPage";
import { LayoutLogined } from "./component/shared/Layout";
import Working from "./pages/partner/Working";
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
        <Routes>
          <Route path="/*" element={<GuestRoutes />} />
          <Route
            path="/admin/*"
            element={
              <RoleProvider allowedRoles={["Admin"]}>
                <AdminRoutes />
              </RoleProvider>
            }
          />
          <Route
            path="/partner/*"
            element={
              <RoleProvider allowedRoles={["Partner,User"]}>
                <PartnerRoutes />
              </RoleProvider>
            }
          />
          <Route path="/*" element={<LayoutLogined />}>
            <Route path="working" element={<InventoryPage />} />
            <Route path="working2" element={<Working />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
