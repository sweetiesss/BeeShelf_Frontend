import { Route, Routes } from "react-router-dom";
import { LayoutLogined } from "../component/shared/Layout";

import DetailSlide from "../pages/shared/DetailSlide";
import { useDetail } from "../context/DetailContext";
// import Inventory from "../pages/staff/InventoryStaff";
import Ordermanage from "../component/admin/ordermanage/Ordermanage";
import Batch from "../component/admin/batchflow/Batch";
import RequestManagement from "../component/admin/requestmanage/RequestManage";
import Payment from "../component/admin/payment/Payment";
// import { Dashboard } from "../pages/partner/HomePage";
import Dashboard from "../component/admin/dashboard/Dashboard";
// import Inventory from "../component/staff/inventory/Inventory";
import Inventory from "../component/admin/inventory/Inventory";
import Vehicle from "../component/admin/vehicle/Vehicle";
import ProfileEdit from "../pages/shared/EditProfilePage";

export default function AdminRoutes() {
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
