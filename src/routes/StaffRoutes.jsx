import { Route, Routes } from "react-router-dom";
import { LayoutLogined } from "../component/shared/Layout";

import DetailSlide from "../pages/shared/DetailSlide";
import { useDetail } from "../context/DetailContext";
// import Inventory from "../pages/staff/InventoryStaff";
import Ordermanage from "../component/staff/ordermanage/Ordermanage";
import Batch from "../component/staff/batchflow/Batch";
import RequestManagement from "../component/staff/requestmanage/RequestManage";
import Payment from "../component/staff/payment/Payment";
// import { Dashboard } from "../pages/partner/HomePage";
import Dashboard from "../component/staff/dashboard/Dashboard";
// import Inventory from "../component/staff/inventory/Inventory";
import Inventory from "../component/staff/inventory/Inventory";
import Vehicle from "../component/staff/vehicle/Vehicle";
import ProfileEdit from "../pages/shared/EditProfilePage";

export default function StaffRoutes() {
  const { dataDetail, typeDetail } = useDetail();
  return (
    <div className="relative">
      {typeDetail && <DetailSlide />}
      <Routes>
        <Route path="/*" element={<LayoutLogined />}>
          <Route index element={<Payment />} />
          <Route path="dashboardstaff" element={<Dashboard />} />
          {/* <Route path="warehouseinventory" element={<Inventory/>}/> */}
          <Route path="inventory" element={<Inventory />} />
          <Route path="ordermanage" element={<Ordermanage />} />
          <Route path="batchflow" element={<Batch />} />
          <Route path="requestmanage" element={<RequestManagement />} />
          <Route path="payment" element={<Payment />} />
          <Route path="vehicle" element={<Vehicle />} />
          <Route path="editProfile" element={<ProfileEdit />} />
        </Route>
        {/* <Route path="payment" element={<Payment/>}/> */}
      </Routes>
    </div>
  );
}
