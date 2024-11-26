import { Route, Routes } from "react-router-dom";
import { LayoutLogined } from "../component/shared/Layout";
import DetailSlide from "../pages/shared/DetailSlide";
import { useDetail } from "../context/DetailContext";

import EmployeePage from "../pages/manager/EmployeePage";
import WarehousesPage from "../pages/manager/WarehousePage";

export default function ManagerRoutes() {
  const { dataDetail, typeDetail } = useDetail();

  return (
    <div className="relative">
      {typeDetail && <DetailSlide />}
      <Routes>
        <Route path="/*" element={<LayoutLogined />}>
          <Route path="employee" element={<EmployeePage />} />
          <Route path="warehouse" element={<WarehousesPage />} />
          {/* <Route path="payment/result" element={<PaymentResult />} /> */}
        </Route>
      </Routes>
    </div>
  );
}
