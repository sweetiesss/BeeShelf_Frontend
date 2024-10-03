import "./App.scss";
import { Route, Router, Routes } from "react-router-dom";
import GuestRoutes from "./routes/GuestRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { AuthProvider } from "./context/AuthContext";
import { RoleProvider } from "./context/RoleContext";
import PartnerRoutes from "./routes/PartnerRoutes";
import { useContext, useEffect, useState } from "react";
import { SettingContext } from "./context/SettingContext";
import useAxios from "./services/customizeAxios";

function App() {
  const { settingInfor, setSettingInfor } = useContext(SettingContext);
  const [theme, setTheme] = useState(settingInfor.theme);
  return (
    <AuthProvider>
      <RoleProvider>
        <Routes>
          <Route path="/*" element={<GuestRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/partner/*" element={<PartnerRoutes />} />
        </Routes>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;
