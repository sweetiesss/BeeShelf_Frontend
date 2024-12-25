import { Route, Routes } from "react-router-dom";
import { LayoutLogined } from "../component/shared/Layout";
import DetailSlide from "../pages/shared/DetailSlide";
import { useDetail } from "../context/DetailContext";

import EmployeePage from "../pages/manager/EmployeePage";
import WarehousesPage from "../pages/manager/WarehousePage";
import VehiclePage from "../pages/manager/VehiclePage";
import CategoryPage from "../pages/manager/CategoryPage";
import { ConfigProvider } from "antd";
import WarehouseDashboard from "../component/partner/dashboard/WarehouseDashboard";
import PartnerPage from "../pages/manager/PartnerPage";

export default function ManagerRoutes() {
  const { dataDetail, typeDetail } = useDetail();
  return (
    <div className="relative">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#0db977", // Set the primary color to green
          },
        }}
      >
        {typeDetail && <DetailSlide />}
        <Routes>
          <Route path="/*" element={<LayoutLogined />}>
            <Route index element={<WarehouseDashboard />} />
            <Route path="dashboard" element={<WarehouseDashboard />} />
            <Route path="employee" element={<EmployeePage />} />
            <Route path="warehouse" element={<WarehousesPage />} />
            <Route path="vehicle" element={<VehiclePage />} />
            <Route path="category" element={<CategoryPage />} />
            <Route path="partner" element={<PartnerPage />} />
            {/* <Route path="payment/result" element={<PaymentResult />} /> */}
          </Route>
        </Routes>
      </ConfigProvider>
    </div>
  );
}
