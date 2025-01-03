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
import ProductPage from "./pages/partner/ProductPage";
import OrderPage from "./pages/partner/OrderPage";
import { HomePage, Dashboard } from "./pages/partner/HomePage";
import OrderDashboard from "./component/partner/dashboard/OrderDashboard";
import { DetailProvider } from "./context/DetailContext";
import StaffRoutes from "./routes/StaffRoutes";
import ManagerRoutes from "./routes/ManagerRoutes";
import RoomMapping from "./pages/partner/RoomMapping";
import SquareWithBoxes from "./pages/partner/SquareDrawing";
import SquareWithResizableBoxes from "./pages/partner/SquareDrawing";
import RectangleWithResizableBoxes from "./pages/partner/SquareDrawing";
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
        <DetailProvider>
          <Routes>
            <Route path="/*" element={<GuestRoutes />} />
            <Route
              path="/admin/*"
              element={
                <RoleProvider allowedRoles={["Admin"]}>
                  <ManagerRoutes />
                </RoleProvider>
              }
            />
            <Route
              path="/partner/*"
              element={
                <RoleProvider allowedRoles={["Partner", "User"]}>
                  <PartnerRoutes />
                </RoleProvider>
              }
            />
            <Route
              path="/staff/*"
              element={
                <RoleProvider allowedRoles={["Staff", "User"]}>
                  <StaffRoutes />
                </RoleProvider>
              }
            />
            <Route
              path="/manager/*"
              element={
                <RoleProvider allowedRoles={["Manager"]}>
                  <ManagerRoutes />
                </RoleProvider>
              }
            />
            <Route path="/*" element={<LayoutLogined />}>
              <Route
                path="working"
                element={
                  <RoomMapping
                    storeData={{
                      name: "storeA",
                      width: 500,
                      length: 900,
                      rooms: [
                        {
                          name: "room1",
                          width: "11.00",
                          length: "3.00",
                          x: "0.00",
                          y: "0.00",
                        },
                        {
                          name: "room2",
                          width: "2.00",
                          length: "2.00",
                          x: "0.00",
                          y: "3.00",
                        },
                        {
                          name: "room3",
                          width: "2.00",
                          length: "4.00",
                          x: "5.00",
                          y: "3.00",
                        },
                        {
                          name: "room4",
                          width: "3.00",
                          length: "2.00",
                          x: "2.00",
                          y: "3.00",
                        },
                        {
                          name: "room5",
                          width: "2.00",
                          length: "2.00",
                          x: "0.00",
                          y: "5.00",
                        },
                        {
                          name: "room6",
                          width: "3.00",
                          length: "2.00",
                          x: "7.00",
                          y: "3.00",
                        },
                        {
                          name: "room7",
                          width: "2.00",
                          length: "2.00",
                          x: "10.00",
                          y: "3.00",
                        },
                      ],
                    }}
                  />
                }
              />
              <Route path="working2" element={<SquareWithResizableBoxes />} />
              <Route path="working3" element={<HomePage />} />
              <Route path="working4" element={<OrderDashboard />} />
              <Route path="working5" element={<Dashboard />} />
              <Route path="working6" element={<ProductPage />} />
            </Route>
          </Routes>
        </DetailProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
